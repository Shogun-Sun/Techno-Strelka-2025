import { showToast } from "./toasts.js";

let user_id;
let user_telephone;
let map;
let userLocation = null; // Изначально null
let userPlacemark = null;
document.getElementById('chat_bot').addEventListener('click', () => { window.location.href = "/chatbot"})

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
            document.getElementById('filt_cover').classList.remove('lg:hidden');
            document.getElementById("openModal2").classList.remove("hidden")

            map.geoObjects.removeAll()
            addSelfpoint()
            document.getElementById("checkbox_2g").checked = true;
            document.getElementById("checkbox_3g").checked = true;
            document.getElementById("checkbox_4g").checked = true;
            document.getElementById("checkbox_lte450").checked = true;
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

        document.querySelector(".checkbox_2g_modal").addEventListener("change", toggleLayer);
        document.querySelector(".checkbox_3g_modal").addEventListener("change", toggleLayer);
        document.querySelector(".checkbox_4g_modal").addEventListener("change", toggleLayer);
        document.querySelector(".checkbox_lte450_modal").addEventListener("change", toggleLayer);
    }    

    reviews.addEventListener("change", () => {
        console.log(reviews.checked)
        if (reviews.checked) {
            for (var key in layers) {
                map.layers.remove(layers[key]);
            }
            document.getElementById('filt_cover').classList.add('lg:hidden');
            document.getElementById("openModal2").classList.add("hidden")
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
  
document.getElementById('startTest').addEventListener('click', function() {
    startSpeedTest();
  });

async function startSpeedTest() {
        // Тест ping
        let result = {}
        document.querySelector("#results").classList.add("hidden")
        document.querySelector("#startTest").innerText = "Тестирование..."
        const pingStart = performance.now();
        await fetch('https://httpbin.org/get', {cache: 'no-store'});
        const pingEnd = performance.now();
        result.ping = Math.round(pingEnd - pingStart);
        console.log(result)
        
        // Тест загрузки (download)
        const downloadStart = performance.now();
        const downloadSize = 5 * 1024 * 1024; // 5MB тестовый файл
        await fetch(`https://httpbin.org/bytes/${downloadSize}`, {cache: 'no-store'});
        const downloadEnd = performance.now();
        const downloadSpeed = (downloadSize * 8 / (downloadEnd - downloadStart) / 1000).toFixed(2);
        result.download = downloadSpeed;
        console.log(result)
        // Тест отдачи (upload) - упрощенный
        const uploadStart = performance.now();
        const uploadSize = 1 * 1024 * 1024 ; // 1MB данных
        await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: new ArrayBuffer(uploadSize),
          cache: 'no-store'
        });
        const uploadEnd = performance.now();
        const uploadSpeed = (uploadSize * 8 / (uploadEnd - uploadStart) / 1000).toFixed(2);
        result.upload = uploadSpeed;
        console.log(result)

        document.querySelector("#startTest").innerText = "Пройти еще раз"
        document.querySelector("#download-speed").innerText = result.download;
        document.querySelector("#upload-speed").innerText = result.upload;
        document.querySelector("#ping").innerText = result.ping;
        document.querySelector("#results").classList.remove("hidden")
        



      }

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