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
const offices = document.getElementById('offices');


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
            hideLoader()
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
            document.getElementById("openOfficesModalBtn").classList.add("hidden")
            map.geoObjects.removeAll();
            addSelfpoint()
            getReviews()
            hideLoader()
        }
    })

    function getReviews() {
        map.events.remove('boundschange', zoomControl); 
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

    offices.addEventListener("change", () => {
        showLoader()
        console.log(document.getElementById("loader"))
        document.getElementById("loader").classList.remove("hidden")
        if (offices.checked) {
            for (var key in layers) {
                map.layers.remove(layers[key]);
            }
            document.getElementById('filt_cover').classList.add('lg:hidden');
            document.getElementById("openModal2").classList.add("hidden")
            document.getElementById("openOfficesModalBtn").classList.remove("hidden")
            map.geoObjects.removeAll();
            addSelfpoint()
            getOffices()
            
        }
    })

    document.getElementById('reviews').click()
}

// function getOffices() {
//     showLoader();
//     let filters = document.querySelectorAll(".custom-checkbox");
//     let filer_id = ''
//     filters.forEach((filter) => {
//         if (filter.checked) {
//             filer_id += filter.dataset.filterid
//         }

//     })
//     fetch(`http://localhost:3000/t2api/offices${filer_id}`)
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data)
//       if (data.meta?.status === 'OK') {
//         data.data.forEach((location) => {
//           var placemark = new ymaps.Placemark(
//             [location.latitude, location.longitude],
//             {
//               balloonContentHeader: location.city,
//               balloonContentBody: location.address,
//               balloonContentFooter: `<b>Услуги:</b> ${location.services.map((s) => s.name).join(', ')}`,
//             },
//             {
//               iconLayout: 'default#image',
//               iconImageSize: [30, 30],
//               iconImageOffset: [-15, -30],
//             },
//           );
//           map.geoObjects.add(placemark);
//         });
//       }
//       hideLoader();
//     })
//     .catch((error) => {
//         console.error('Ошибка при получении данных: ', error)
//         showToast('Ошибка при получении данных: ', "error")
//     })
// }

let currentRoute = null;
let currentActivePlacemark = null;

function getOffices() {
    showLoader();
    let filters = document.querySelectorAll(".custom-checkbox");
    let filer_id = '';
    filters.forEach((filter) => {
        if (filter.checked) {
            filer_id += filter.dataset.filterid;
        }
    });

    fetch(`http://localhost:3000/t2api/offices${filer_id}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.meta?.status === 'OK') {
            data.data.forEach((location) => {
                const defaultIcon = '/pictures/pin-unchosen.d47d1abd.svg';
                const selectedIcon = '/pictures/pin-chosen.c894ed87.svg';

                const placemark = new ymaps.Placemark(
                    [location.latitude, location.longitude],
                    {
                        balloonContentHeader: location.city,
                        balloonContentBody: location.address,
                        balloonContentFooter: `<b>Услуги:</b> ${location.services.map((s) => s.name).join(', ')}`,
                    },
                    {
                        iconLayout: 'default#image',
                        iconImageSize: [20, 30],
                        iconImageHref: defaultIcon,
                        iconImageOffset: [-15, -30],
                    }
                );

                placemark.events.add('click', function() {
                    // Меняем иконку у предыдущей активной метки (если была)
                    if (currentActivePlacemark) {
                        currentActivePlacemark.options.set('iconImageHref', defaultIcon);
                    }

                    // Сохраняем текущую активную метку и меняем её иконку
                    currentActivePlacemark = placemark;
                    placemark.options.set('iconImageHref', selectedIcon);

                    // Получаем координаты пользователя
                    ymaps.geolocation.get().then(function(result) {
                        const userCoordinates = result.geoObjects.get(0).geometry.getCoordinates();

                        if (currentRoute) {
                            map.geoObjects.remove(currentRoute);
                        }

                        ymaps.route([userCoordinates, [location.latitude, location.longitude]]).then(function(route) {
                            route.getWayPoints().options.set('visible', false);
                            map.geoObjects.add(route);
                            currentRoute = route;
                        }, function(error) {
                            console.error('Ошибка при построении маршрута:', error);
                        });
                    });
                });

                map.geoObjects.add(placemark);
            });
        }
        hideLoader();
    })
    .catch((error) => {
        console.error('Ошибка при получении данных: ', error);
        showToast('Ошибка при получении данных: ', "error");
    });
}




// Добавьте эту кнопку в ваш интерфейс (например, рядом с кнопкой "Добавить отзыв")
const openOfficesModalBtn = document.createElement('button');
openOfficesModalBtn.id = 'openOfficesModalBtn';
openOfficesModalBtn.className = 'bg-black text-lg text-white px-3 py-2 lg:px-6 lg:py-2 rounded-xl shadow-lg hover:bg-gray-950 transition-colors duration-300 \
focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-Halvar';
openOfficesModalBtn.textContent = 'Фильтр офисов';
document.querySelector('.fixed.bottom-8.right-8.z-10.flex.flex-col.gap-4').appendChild(openOfficesModalBtn);

// Обработчики событий для модального окна офисов
const officesModal = document.getElementById('officesModal');
const closeOfficesModalBtn = document.getElementById('closeOfficesModal');
const applyOfficeFiltersBtn = document.getElementById('applyOfficeFilters');
const clear_filter = document.getElementById('clear_filter');
const applyOfficeFilters = document.getElementById('applyOfficeFilters');


openOfficesModalBtn.addEventListener('click', () => {
    officesModal.classList.remove('hidden');
    setTimeout(() => {
        officesModal.classList.add('flex');
    }, 10);
});

closeOfficesModalBtn.addEventListener('click', () => {
    officesModal.classList.remove('flex');
    setTimeout(() => {
        officesModal.classList.add('hidden');
    }, 10);
});

clear_filter.addEventListener("click", () => {
    document.querySelectorAll(".custom-checkbox").forEach((box) => {
        box.checked = false;
    })
    closeOfficesModalBtn.click()
    getOffices()
})

applyOfficeFilters.addEventListener("click", () => {
    closeOfficesModalBtn.click()
    getOffices()
})


applyOfficeFiltersBtn.addEventListener('click', () => {
    // Здесь будет логика применения фильтров
    officesModal.classList.remove('flex');
    setTimeout(() => {
        officesModal.classList.add('hidden');
    }, 10);
    
    // Показываем уведомление об успешном применении фильтров
    showToast('Фильтры офисов применены', 'success');
});

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

const open_chat = document.querySelector("#openChat");
const chat_area = document.querySelector("#chatArea");

// Инициализация - скрываем чат полностью за пределами экрана
chat_area.classList.add("translate-x-full");

open_chat.addEventListener("click", () => {
    // Переключение видимости чата
    chat_area.classList.toggle("translate-x-full");
    chat_area.classList.toggle("translate-x-0");
    
    // Анимация кнопки
    open_chat.classList.toggle('-left-7.5');
    open_chat.classList.toggle('-left-15');
    open_chat.innerText = open_chat.innerText == "<" ? ">" : "<";
});

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
    if (reviews.checked) {
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
    
    }
    
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
});

// Функция для отображения загрузчика
function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('loader').classList.add('flex');
}

// Функция для скрытия загрузчика
function hideLoader() {
    document.getElementById('loader').classList.remove('flex');
    document.getElementById('loader').classList.add('hidden');
}


document.addEventListener("DOMContentLoaded", async () => {
    ymaps.ready(() => {
        // Проверяем, поддерживает ли браузер геолокацию
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              const coords = [56.316309, 43.927515];

              try {
                // Получаем адрес с помощью Яндекс API
                const addressResult = await ymaps.geocode(coords);

                // Получаем первый геообъект (адрес)
                const firstGeoObject = addressResult.geoObjects.get(0);

                if (firstGeoObject) {
                  const components = firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.Address.Components');
                  let district = 'Не удалось найти район';
                  components.forEach(component => {
                    if (component.kind === 'district') {
                      district = component.name;
                    }
                  });

                  // Сообщение
                  fetch('http://localhost:3000/chips/get', {
                    method: 'POST',
                    headers: {
                      'Accept': '*/*',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      chip_district: district,
                    }),
                  })
                  .then(response => {
                    if (!response.ok) {
                      return response.json().then(err => { throw new Error(err.message); });
                    }
                    return response.json();
                  })
                  .then(data => {
                    appendBotMessage(data.chip_description)
                    document.querySelector("#openChat").click()
                  })
                  .catch(error => console.log(error.message));
                  
                  
                } else {
                //   alert('Не удалось найти район.');
                }
              } catch (err) {
                console.error('Ошибка при получении данных геокодирования:', err);
                showToast('Не удалось получить информацию о вашем местоположении.', "error")
              }
            },
            (error) => {
              console.error('Ошибка геолокации:', error);
              showToast('Не удалось получить координаты пользователя.', "error");
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          showToast('Геолокация не поддерживается этим браузером.', "error");
        }
      });
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
    
    

    function appendBotMessage(text) {
        let iframeDoc = document.querySelector("iframe").contentWindow.document;
        let chat = iframeDoc.querySelector("#chat")
        console.log(chat)
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-start mb-4';
        messageDiv.innerHTML = `
          <div class="bg-gray-100 text-black rounded-xl px-4 py-2 max-w-xs md:max-w-md">
            <p class="font-medium font-Halvar">Tele2Bot</p>
            <p class="font-Rooftop">${text}</p>
          </div>
        `;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
      }

})