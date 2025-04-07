const phoneScreen = 640;
const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const cancelButton = document.getElementById('cancelButton');
const modalContent = document.getElementById("mainModal");

openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('flex');    
    modal.classList.add('opacity-100');
    }, 10);
});

const closeModal = () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
    modal.classList.add('hidden');
    }, 10);
};

closeModalButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);

if(screen.width < phoneScreen)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});