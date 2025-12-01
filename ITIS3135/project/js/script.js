// Wait until the entire HTML document is loaded before running script
document.addEventListener('DOMContentLoaded', function() {
    // 1. Select all the question buttons
    const faqQuestions = document.querySelectorAll('.faq-question');

    // 2. Loop through each question button
    faqQuestions.forEach(question => {
        // 3. Attach a click event listener to each button
        question.addEventListener('click', function() {
            // Get the element right after the button (which is the answer container)
            const answer = this.nextElementSibling;
            
            // Toggle the 'hidden' class to show/hide the answer
            answer.classList.toggle('hidden');
        });
    });
});
