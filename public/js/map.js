let user_id;
let user_telephone;
let map;
let userLocation = null; // Изначально null
let userPlacemark = null;

const balloonContent_template = document.getElementById("balloonContent_template").innerHTML;
window.balloonContent_template = Handlebars.compile(balloonContent_template);

const coverage = document.getElementById('coverage');
const reviews = document.getElementById('reviews');

// Инициализация карты
ymaps.ready(init);

function init() {
    map = new ymaps.Map("map", {
        center: [55.751574, 37.573856], // Москва по умолчанию
        zoom: 12
    });

    function addSelfpoint() {
        // Определение местоположения пользователя
        ymaps.geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            userLocation = result.geoObjects.get(0).geometry.getCoordinates();
            map.setCenter(userLocation, 15);

            // Добавляем метку пользователя
            userPlacemark = new ymaps.Placemark(userLocation, {
                hintContent: 'Ваше местоположение',
                // balloonContent: 'Это красивая метка',
            },
            {
                iconLayout: 'default#image',
                iconImageHref: '/pictures/placeholder.png',
                // iconImageSize: [30, 42],
            });
            map.geoObjects.add(userPlacemark);
        }).catch(function (error) {
            console.error("Ошибка при определении местоположения:", error);
            alert("Не удалось определить ваше местоположение. Убедитесь, что геолокация включена.");
        });
    }

    coverage.addEventListener("change", () => {
        if (coverage.checked) {
            map.geoObjects.removeAll()
            addSelfpoint()
        }
    })

    reviews.addEventListener("change", () => {
        if (reviews.checked) {
            map.geoObjects.removeAll()
            addSelfpoint()
            getReviews()
        }
    })

    function getReviews() {
        fetch("/reviews/get/all/reviews", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(reviewsResponse => reviewsResponse.json())
        .then(reviewsData => {
            reviewsData.data.forEach(review => {
                let reviewPlacemark = new ymaps.Placemark([review.coordinates.lat, review.coordinates.lng], {
                    hintContent: `Комментарий пользователя ${user_telephone}`,
                    balloonContent: window.balloonContent_template(review)
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: '/pictures/mobile-map.png',
                });
            
                map.geoObjects.add(reviewPlacemark);
            }); 
        })
    }

    document.getElementById('reviews').click()
    addSelfpoint();
    getReviews();
}



// Элементы интерфейса
const addReviewBtn = document.getElementById('addReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.getElementById('closeModal');
const submitReview = document.getElementById('submitReview');
const reviewText = document.getElementById('reviewText');

const startButton = document.getElementById("startTest");
const resultsDiv = document.getElementById('results');
const downloadEl = document.getElementById('download-speed');
const uploadEl = document.getElementById('upload-speed');
const pingEl = document.getElementById('ping');
    
function runSpeedTest() {

    startButton.disabled = true;
    startButton.textContent = 'Тестирование...';
    resultsDiv.classList.add('hidden');

    // Имитация процесса тестирования
    let download = 0;
    let upload = 0;
    let ping = 0;
    
    const downloadInterval = setInterval(() => {
        download += Math.random() * 10;
        downloadEl.textContent = download.toFixed(2);
        if (download >= 80 + Math.random() * 40) {
            clearInterval(downloadInterval);
            startUploadTest();
        }
    }, 200);

    function startUploadTest() {
        const uploadInterval = setInterval(() => {
            upload += Math.random() * 5;
            uploadEl.textContent = upload.toFixed(2);
            if (upload >= 20 + Math.random() * 20) {
                clearInterval(uploadInterval);
                finishTest();
            }
        }, 200);
    }

    function finishTest() {
        ping = 10 + Math.random() * 30;
        pingEl.textContent = ping.toFixed(2);
        resultsDiv.classList.remove('hidden');
        startButton.textContent = 'Повторить тест';
        startButton.disabled = false;
    }
}

startButton.addEventListener('click', runSpeedTest);

startTest.addEventListener("click", () => {
    
})


// Открытие модального окна
addReviewBtn.addEventListener('click', () => {
    if (user_id) {
        reviewModal.classList.remove('hidden');
        reviewModal.classList.add('flex');
    } else {
        window.location.href = "/loginPage";
    }
    
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    reviewModal.classList.add('hidden');
    reviewModal.classList.remove('flex');
});

// Отправка отзыва
submitReview.addEventListener('click', async () => {
    const review = reviewText.value.trim();

    if (!review) {
        alert('Пожалуйста, напишите ваш отзыв');
        return;
    }

    if (!userLocation) {
        alert('Не удалось определить ваше местоположение');
        return;
    }

    // Создаем метку с отзывом на карте
    const reviewPlacemark = new ymaps.Placemark(userLocation, {
        hintContent: 'Комментарий пользователя',
        balloonContent: `
            <div class="p-2 h-auto flex flex-col gap-3">
                <p class="text-base text-black font-Halvar">Телефон: ${user_telephone}</p>
                <p class="font-Rooftop text-sm text-gray-600 font-medium">${review.review_text}</p>   
            </div>
        `
    }, {
        iconLayout: 'default#image',
        iconImageHref: '/pictures/mobile-map.png',
    });

    map.geoObjects.add(reviewPlacemark);
    reviewPlacemark.balloon.open();

    // Здесь должна быть реальная отправка данных на сервер
    console.log('Отправка отзыва:', {
        phone: user_telephone,
        review: review,
        coordinates: userLocation,
        review_speed_test: {
            "download":downloadEl.innerText,
            "upload":uploadEl.innerText,
            "ping":pingEl.innerText,
        }
    });


    const Response = await fetch("/reviews/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: user_id,
            review_text: review,
            coordinates: {
                lat: userLocation[0],
                lng: userLocation[1]
            },
            review_speed_test: {
                "download":downloadEl.innerText,
                "upload":uploadEl.innerText,
                "ping":pingEl.innerText,
            }
        })
    })
    let data = await Response.json()
    alert(data.message);
    

    // Закрываем модальное окно и очищаем форму
    reviewModal.classList.add('hidden');
    reviewModal.classList.remove('flex');
    reviewText.value = '';

    // Показываем уведомление
    
});

document.addEventListener("DOMContentLoaded", async () => {
    const userResponse = await fetch("/user/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        let userData = await userResponse.json()
        console.log(userData);
        if (userData.error) {
            user_id = null
            user_telephone = null
            return;
        }
        document.getElementById("login").innerText = "Выйти"
        document.getElementById("login").onclick = () => {
            fetch("/user/logout", {
                method:"Get",
                headers:{
                    "Content-Type": "application/json",
                },
            })
            .then(res=> res.json())
            .then((userOutMessage) => {
                document.getElementById("login").innerText = "Войти"
                document.getElementById("login").onclick = () => {window.location.href = "/loginPage"}
                alert(userOutMessage.message)
            })
        }
        user_id = userData.user.user_id;
        user_telephone = userData.user.user_telephone;
        document.querySelector("#phoneNumberComment").textContent = user_telephone;

})