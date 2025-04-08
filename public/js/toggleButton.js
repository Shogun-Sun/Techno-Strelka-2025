const coverageRadio = document.getElementById('coverage');
const reviewsRadio = document.getElementById('reviews');
const navIndicator = document.getElementById('navIndicator');

function updateIndicator(){
    
    if(coverageRadio.checked){
        navIndicator.classList.remove('right-3');
        navIndicator.classList.add('left-3');   
    }
    if(reviewsRadio.checked){
        navIndicator.classList.remove('left-3');
        navIndicator.classList.add('right-3');
    }
}

coverageRadio.addEventListener('change', updateIndicator);
reviewsRadio.addEventListener('change', updateIndicator);
