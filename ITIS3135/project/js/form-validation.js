document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    
    // Function to check if the email format is valid
    function isValidEmail(email) {
        // A simple regex pattern for basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Function to handle the validation check for all fields
    function validateForm() {
        let isValid = true; // Assume valid until an error is found

        // --- 1. Validate Name Field ---
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required.';
            isValid = false;
        } else {
            nameError.textContent = ''; // Clear previous error
        }

        // --- 2. Validate Email Field ---
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required.';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailError.textContent = ''; // Clear previous error
        }

        return isValid;
    }

    // Add event listener to the form's submit event
    form.addEventListener('submit', function(event) {
        // Prevent the form from submitting normally (which would refresh the page)
        event.preventDefault(); 
        
        if (validateForm()) {
            // If validation passes:
            alert('Form submitted successfully! (In a real application, data would now be sent to a server.)');
            // Here you would typically use fetch() or XMLHttpRequest to send the data
            form.reset(); // Clear the form fields
        } else {
            // If validation fails:
            // Error messages are already displayed by validateForm()
            alert('Please correct the errors in the form.');
        }
    });
});