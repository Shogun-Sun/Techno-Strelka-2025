function init() {
    const loader = document.getElementById('loader');
    const mapElement = document.getElementById('map');
  
    loader.classList.remove('hidden');
    mapElement.classList.remove('loaded');
  
    let loadedCount = 0;
  
    function tryFinishLoading() {
      loadedCount++;
      if (loadedCount === 2) {
        loader.classList.add('hidden');
        mapElement.classList.add('loaded');
      }
    }
  
    var map = new ymaps.Map('map', {
      center: [55.7558, 37.6173], // Центр карты (Москва)
      zoom: 10,
      controls: ['zoomControl', 'typeSelector', 'fullscreenControl'],
    });
  
    // Первый запрос
    fetch('http://localhost:3000/t2api/offices5600002')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((location) => {
            const schedule = location.daySchedules.map((schedule) => {
              return `<b>${schedule.day}</b>: ${schedule.openTime} - ${schedule.closeTime}`;
            }).join('<br>');
  
            var placemark = new ymaps.Placemark(
              [location.latitude, location.longitude],
              {
                balloonContentHeader: location.city,
                balloonContentBody: location.address,
                balloonContentFooter: `
                  <b>Услуги:</b> ${location.services.map((s) => s.name).join(', ')}<br><br>
                  <b>Часы работы:</b><br>${schedule}`,
              },
              {
                iconLayout: 'default#image',
                iconImageSize: [30, 30],
                iconImageOffset: [-15, -30],
              },
            );
            map.geoObjects.add(placemark);
          });
        } else {
          console.error('Ошибка: Неверный формат данных');
        }
      })
      .catch((error) => console.error('Ошибка при получении данных: ', error))
      .finally(tryFinishLoading); // Завершить анимацию (если оба готовы)
  
    // Второй запрос
    fetch('http://localhost:3000/t2api/offices')
      .then((response) => response.json())
      .then((data) => {
        if (data.meta.status === 'OK') {
          data.data.forEach((location) => {
            var placemark = new ymaps.Placemark(
              [location.latitude, location.longitude],
              {
                balloonContentHeader: location.city,
                balloonContentBody: location.address,
                balloonContentFooter: `<b>Услуги:</b> ${location.services.map((s) => s.name).join(', ')}`,
              },
              {
                iconLayout: 'default#image',
                iconImageSize: [30, 30],
                iconImageOffset: [-15, -30],
              },
            );
            map.geoObjects.add(placemark);
          });
        }
      })
      .catch((error) => console.error('Ошибка при получении данных: ', error))
      .finally(tryFinishLoading); // Завершить анимацию (если оба готовы)
  }
  
  ymaps.ready(init);
  