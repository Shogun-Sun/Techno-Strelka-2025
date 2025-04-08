let user_id;
let user_telephone;
let map;
let userLocation = null; // Изначально null
let userPlacemark = null;

// Инициализация карты
ymaps.ready(init);

function init() {
    map = new ymaps.Map("map", {
        center: [55.751574, 37.573856], // Москва по умолчанию
        zoom: 12
    });

    // Определение местоположения пользователя
    ymaps.geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        userLocation = result.geoObjects.get(0).geometry.getCoordinates();
        map.setCenter(userLocation, 15);
        console.log(userLocation);

        // Добавляем метку пользователя
        userPlacemark = new ymaps.Placemark(userLocation, {}, {
            preset: 'islands#blueDotIcon'
        });
        map.geoObjects.add(userPlacemark);
    }).catch(function (error) {
        console.error("Ошибка при определении местоположения:", error);
        alert("Не удалось определить ваше местоположение. Убедитесь, что геолокация включена.");
    });


    fetch("/reviews/get/all/reviews", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(reviewsResponse => reviewsResponse.json())
    .then(reviewsData => {
        console.log(reviewsData);
        reviewsData.data.forEach(review => {
            console.log(review)
            let reviewPlacemark = new ymaps.Placemark([review.coordinates.lat, review.coordinates.lng], {
                balloonContent: `
                    <div class="p-2 overflow-y-scroll h-auto ">
                        <h3 class="font-bold mb-1">Отзыв</h3>
                        <p class="mb-2">${review.review_text}</p>
                        <p class="text-sm text-gray-600">Телефон: ${user_telephone}</p>
                    </div>
                `
            }, {
                preset: 'islands#greenIcon'
            });
        
            map.geoObjects.add(reviewPlacemark);
            console.log(reviewPlacemark)
        }); 
    })
}

// Элементы интерфейса
const addReviewBtn = document.getElementById('addReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.getElementById('closeModal');
const submitReview = document.getElementById('submitReview');
const reviewText = document.getElementById('reviewText');

// Открытие модального окна
addReviewBtn.addEventListener('click', () => {
    reviewModal.classList.remove('hidden');
    reviewModal.classList.add('flex');
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
        balloonContent: `
            <div class="p-2 overflow-y-scroll h-auto ">
                <h3 class="font-bold mb-1">Отзыв</h3>
                <p class="mb-2">${review}</p>
                <p class="text-sm text-gray-600">Телефон: ${user_telephone}</p>
            </div>
        `
    }, {
        preset: 'islands#greenIcon'
    });

    map.geoObjects.add(reviewPlacemark);
    reviewPlacemark.balloon.open();

    // Здесь должна быть реальная отправка данных на сервер
    console.log('Отправка отзыва:', {
        phone: user_telephone,
        review: review,
        coordinates: userLocation
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
            }
        })
    })
    let data = await Response.json()
    alert(data.massage);
    

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
        user_id = userData.user.user_id;
        user_telephone = userData.user.user_telephone;
        document.querySelector("#phoneNumberComment").innerHTML = user_telephone;

    
})

// reviewsData.reviews.forEach(review => {
//     const reviewPlacemark = new ymaps.Placemark([review.coordinates.lat, review.coordinates.lng], {
//         balloonContent: `
//             <div class="p-2 overflow-y-scroll h-auto ">
//                 <h3 class="font-bold mb-1">Отзыв</h3>
//                 <p class="mb-2">${review.review_text}</p>
//                 <p class="text-sm text-gray-600">Телефон: ${review.user_telephone}</p>
//             </div>
//         `
//     }, {
//         preset: 'islands#greenIcon'
//     });
//     map.geoObjects.add(reviewPlacemark);
// })