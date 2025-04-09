 // Toast Notification Function
 export function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `py-1 px-2 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 opacity-0 transform
     translate-x-10 ${getToastClasses(type)}`;
    
    // Toast content
    toast.innerHTML = `
        <div class="flex font-Halvar text-sm font-semibold">${message}</div>
        <button class="p-0" onclick="this.parentElement.remove()">
            <svg class="w-8 h-10 px-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path class="stroke-2 stroke-gray-500" d="M7.75732 7.75745L16.2426 16.2427" ></path>
                <path class="stroke-2 stroke-gray-500" d="M16.2426 7.75745L7.75732 16.2427" ></path>
            </svg>
        </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-x-10');
        toast.classList.add('opacity-100', 'translate-x-0');
    }, 10);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-10');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    return toast;
}

function getToastClasses(type) {
    const baseClasses = 'bg-white border';
    const typeClasses = {
        'success': 'border-green-500 text-green-700',
        'error': 'border-pink-500 text-pink-700',
        'info': 'border-blue-500 text-blue-700'
    };
    return `${baseClasses} ${typeClasses[type] || typeClasses['info']}`;
}

// Примеры использования:
// showToast('Отзыв успешно отправлен!', 'success');
// showToast('Ошибка при отправке отзыва', 'error');
// showToast('Тест скорости завершен', 'info');
// showToast('Проверьте подключение к интернету', 'warning');
