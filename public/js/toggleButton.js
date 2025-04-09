const coverageRadio = document.getElementById('coverage');
const reviewsRadio = document.getElementById('reviews');
const navIndicator = document.getElementById('navIndicator');

function updateIndicator(){
    if(document.documentElement.clientWidth > 648){
        navIndicator.classList.remove('left-1')
        navIndicator.classList.remove('right-1')
        if(coverageRadio.checked){
            navIndicator.classList.remove('right-4');
            navIndicator.classList.add('left-4');   
        }
        if(reviewsRadio.checked){
            navIndicator.classList.remove('left-4');
            navIndicator.classList.add('right-4');
        }
    } else{
        navIndicator.classList.remove('left-4')
        navIndicator.classList.remove('right-4')
        if(coverageRadio.checked){
            navIndicator.classList.remove('right-1');
            navIndicator.classList.add('left-1');   
        }
        if(reviewsRadio.checked){
            navIndicator.classList.remove('left-1');
            navIndicator.classList.add('right-1');
        } 
    }
}

coverageRadio.addEventListener('change', updateIndicator);
reviewsRadio.addEventListener('change', updateIndicator);
document.addEventListener('DOMContentLoaded', updateIndicator)
window.addEventListener('resize', updateIndicator)
