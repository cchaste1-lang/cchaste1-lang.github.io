let slideIndex = 1; 

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("my-slides");
    
    if (n > slides.length) { slideIndex = 1 }    
    if (n < 1) { slideIndex = slides.length }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    slides[slideIndex-1].style.display = "block";  
}

// Function called by the Prev/Next buttons (must be global or accessed via window)
window.plusSlides = function(n) {
    showSlides(slideIndex += n);
}

document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex); 
});