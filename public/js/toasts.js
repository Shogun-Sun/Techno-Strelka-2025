 // Toast Notification Function
 export function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg flex items-start justify-between transition-all duration-300 opacity-0 transform translate-x-10 ${getToastClasses(type)}`;
    
    // Toast content
    toast.innerHTML = `
        <div class="flex-1">${message}</div>
        <button class="ml-4 text-lg" onclick="this.parentElement.remove()">&times;</button>
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
        'error': 'border-red-500 text-red-700',
        'warning': 'border-yellow-500 text-yellow-700',
        'info': 'border-blue-500 text-blue-700'
    };
    return `${baseClasses} ${typeClasses[type] || typeClasses['info']}`;
}

// Примеры использования:
// showToast('Отзыв успешно отправлен!', 'success');
// showToast('Ошибка при отправке отзыва', 'error');
// showToast('Тест скорости завершен', 'info');
// showToast('Проверьте подключение к интернету', 'warning');
