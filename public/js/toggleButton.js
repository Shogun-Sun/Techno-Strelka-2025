document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('navContainer');
    const navItems = document.querySelectorAll('.nav-item');
    const navIndicator = document.getElementById('navIndicator');
    const navSwitches = document.querySelectorAll('input[name="navSwitch"]');

    function updateIndicator() {
        const activeItem = document.querySelector('.nav-item input:checked').parentElement;
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        
        // Вычисляем смещение относительно контейнера
        const offset = itemRect.left - containerRect.left;
        
        // Устанавливаем ширину индикатора равной ширине активного элемента
        navIndicator.style.width = `${itemRect.width}px`;
        
        // Применяем смещение
        navIndicator.style.transform = `translateX(${offset}px)`;
    }

    // Инициализация
    updateIndicator();

    // Обработчики событий
    navSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', updateIndicator);
    });

    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateIndicator);
});