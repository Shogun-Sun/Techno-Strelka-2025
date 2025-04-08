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
submitReview.addEventListener('click', () => {
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

    // Закрываем модальное окно и очищаем форму
    reviewModal.classList.add('hidden');
    reviewModal.classList.remove('flex');
    reviewText.value = '';

    // Показываем уведомление
    alert('Спасибо за ваш отзыв! Он отмечен на карте.');
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("/user/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(res => res.json())
        .then((userData) => {
            console.log(userData);
            user_id = userData.user.user_id;
            user_telephone = userData.user.user_telephone;
            document.querySelector("#phoneNumberComment").innerHTML = user_telephone;
        });
});
