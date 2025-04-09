import { showToast } from "./toasts.js";

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
var layers = {};

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
            showToast("Не удалось определить ваше местоположение. Убедитесь, что геолокация включена.", "error");
        });
    }

    coverage.addEventListener("change", () => {
        if (coverage.checked) {
            map.geoObjects.removeAll()
            addSelfpoint()
            document.getElementById("checkbox_2g").checked = true;
            document.getElementById("checkbox_3g").checked = true;
            document.getElementById("checkbox_4g").checked = true;
            document.getElementById("checkbox_lte450").checked = true;
            document.getElementById('filt_cover').classList.remove('hidden');
            getCoverage()
        }
    })

    function getCoverage() {
        zoomControl();
        map.events.add('boundschange', zoomControl); 

        layers["2g"] = new ymaps.Layer('https://nnov.t2.ru/maps/_2g/%z/%x/%y.png', {
            tileTransparent: true, // Прозрачность тайлов
            notFoundTile: 'https://nnov.t2.ru/maps/_2g/empty.png' // Путь к изображению для отсутствующих тайлов
        });
        
        layers["3g"] = new ymaps.Layer('https://nnov.t2.ru/maps/_3g/%z/%x/%y.png', {
            tileTransparent: true,
            notFoundTile: 'https://nnov.t2.ru/maps/_2g/empty.png'
        });

        layers["4g"] = new ymaps.Layer('https://nnov.t2.ru/maps/_4g/%z/%x/%y.png', {
            tileTransparent: true,
            notFoundTile: 'https://nnov.t2.ru/maps/_2g/empty.png'
        });

        layers["lte450"] = new ymaps.Layer('https://nnov.t2.ru/maps/_skylink/%z/%x/%y.png', {
            tileTransparent: true,
            notFoundTile: 'https://nnov.t2.ru/maps/_2g/empty.png'
        });

        // Добавляем все слои на карту
        for (var key in layers) {
            map.layers.add(layers[key]);
        }

        // Обработчик изменений в чекбоксах
        document.getElementById("checkbox_2g").addEventListener("change", toggleLayer);
        document.getElementById("checkbox_3g").addEventListener("change", toggleLayer);
        document.getElementById("checkbox_4g").addEventListener("change", toggleLayer);
        document.getElementById("checkbox_lte450").addEventListener("change", toggleLayer);
    }    

    reviews.addEventListener("change", () => {
        if (reviews.checked) {
            for (var key in layers) {
                map.layers.remove(layers[key]);
            }
            document.getElementById('filt_cover').classList.add('hidden');
            map.geoObjects.removeAll();
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
            // Создаем кластеризатор с кастомным балуном
            const clusterer = new ymaps.Clusterer({
                preset: 'islands#invertedVioletClusterIcons',
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: true,
                clusterBalloonContentLayout: 'cluster#balloonCarousel', // Используем карусель
                // clusterBalloonItemContentLayout: 'balloonContent_template', // Используем наш шаблон
                clusterBalloonPanelMaxMapArea: 0, // Не ограничиваем область карты
                clusterBalloonContentLayoutWidth: 300, // Ширина балуна
                clusterBalloonContentLayoutHeight: 200, // Высота балуна
                clusterBalloonPagerSize: 5, // Количество видимых элементов в пагинаторе
                clusterBalloonPagerVisible: true, // Показываем пагинатор
                
                // Настройки иконок кластера
                clusterIcons: [
                    {
                        href: '/pictures/messages.png',
                        size: [40, 40],
                        offset: [-20, -20]
                    },
                ],
                clusterIconContentLayout: null,
                clusterIconPieChartRadius: 25,
                clusterIconPieChartCoreRadius: 10,
                clusterIconPieChartStrokeWidth: 3,
                
                // Параметры группировки
                groupByCoordinates: false,
                gridSize: 64,
                clusterMinClusterSize: 2
            })
    
            // Массив для хранения меток
            const placemarks = [];
            
            reviewsData.data.forEach(review => {
                let reviewPlacemark = new ymaps.Placemark(
                    [review.coordinates.lat, review.coordinates.lng], 
                    {
                        hintContent: `Комментарий пользователя ${review.user.user_telephone}`,
                        balloonContent: window.balloonContent_template(review),
                        // Добавляем все данные отзыва в свойства метки
                        reviewData: review
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageHref: '/pictures/comment.png',
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -15]
                    }
                );
                
                placemarks.push(reviewPlacemark);
            });
            
            console.log(reviewsData)
            // Добавляем метки в кластеризатор
            clusterer.add(placemarks);
            
            // Очищаем карту и добавляем кластеризатор
            map.geoObjects.removeAll();
            map.geoObjects.add(clusterer);
            
            // Добавляем метку пользователя (если нужно)
            if (userPlacemark) {
                map.geoObjects.add(userPlacemark);
            }
    
            // Обработчик клика по кластеру
            clusterer.events.add('click', function (e) {
                const target = e.get('target');
                
                // Проверяем, является ли target кластером
                if (target instanceof ymaps.Clusterer) {
                    const cluster = target;
                    const geoObjects = cluster.getGeoObjects();
                    
                    // Если в кластере только одна метка, открываем ее балун
                    if (geoObjects.length === 1) {
                        geoObjects[0].balloon.open();
                        return;
                    }
                } 
            });
        });
    }

// ... (остальной код остается без изменений)

    document.getElementById('reviews').click()
}

function toggleLayer() {
    if (document.getElementById("checkbox_2g").checked) {
        map.layers.add(layers["2g"]);
    } else {
        map.layers.remove(layers["2g"]);
    }

    if (document.getElementById("checkbox_3g").checked) {
        map.layers.add(layers["3g"]);
    } else {
        map.layers.remove(layers["3g"]);
    }

    if (document.getElementById("checkbox_4g").checked) {
        map.layers.add(layers["4g"]);
    } else {
        map.layers.remove(layers["4g"]);
    }

    if (document.getElementById("checkbox_lte450").checked) {
        map.layers.add(layers["lte450"]);
    } else {
        map.layers.remove(layers["lte450"]);
    }
}

function zoomControl() {
    const zoom = map.getZoom();
    console.log(zoom);

    if (zoom > 10) {
        map.setZoom(10); // Минимальный зум
    }
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
    showToast('Тест скорости начат...', 'info');
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
        showToast('Пожалуйста, напишите ваш отзыв', "error");
        return;
    }

    if (!userLocation) {
        showToast('Не удалось определить ваше местоположение', "error");
        return;
    }

    // Создаем метку с отзывом на карте
    const reviewPlacemark = new ymaps.Placemark(userLocation, {
        hintContent: 'Комментарий пользователя',
        balloonContent: window.balloonContent_template({
            "review_text": review,
            "review_speed_test": {
                "download":downloadEl.innerText,
                "upload":uploadEl.innerText,
                "ping":pingEl.innerText,
            },
            "user": {
                "user_telephone": user_telephone,
            }
        })
    }, {
        iconLayout: 'default#image',
        iconImageHref: '/pictures/comment.png',
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
    showToast(data.message, "succes");
    

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
                showToast(userOutMessage.message, "success")
            })
        }
        user_id = userData.user.user_id;
        user_telephone = userData.user.user_telephone;
        document.querySelector("#phoneNumberComment").textContent = user_telephone;

})