// Function to load Header and Footer (required by instructions for navigation)
function loadHTML(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Load the header and footer (assuming the files are in the root or a 'parts' folder)
// You may need to adjust the path based on your file structure.
// loadHTML('site-header', 'header.html'); 
// loadHTML('site-footer', 'footer.html');

// --- Form Element and Initial Setup ---
const formElement = document.getElementById("intro-form");
const coursesContainer = document.getElementById("courses-container");
const addCourseBtn = document.getElementById("add-course-btn");
const clearButton = document.getElementById("clear-form-btn");
let courseCount = 1; // Tracks number of courses, starting at 1

// Function to reset the form (built into the HTML 'reset' button, but good to have a JS function)
function resetForm() {
    formElement.reset();
    // Recreate the course inputs to the default of 1
    coursesContainer.innerHTML = '';
    courseCount = 1;
    addCourseGroup(true); // Add the first default course
}

// Function to clear all fields (required functionality for the 'Clear' button)
function clearAllFields() {
    // Reset the form first to clear all standard fields and their values
    formElement.reset(); 
    
    // Clear the course container and add back a blank single course
    coursesContainer.innerHTML = '';
    courseCount = 1;
    addCourseGroup(false); // Add a single blank course group
    
    // The reset() call should handle most fields, but we add the logic here 
    // for future proofing if custom elements were used.
    Array.from(formElement.querySelectorAll("input, textarea")).forEach((input) => {
        // Only clear fields that don't have a file type, as clearing a file input is tricky/forbidden
        if (input.type !== 'file') {
             input.value = "";
        }
    });
}

// --- Course Adding/Deleting Functionality ---

/**
 * Adds a new course input group.
 * @param {boolean} useDefaultValues - If true, prefill with default 'ITIS' course data.
 */
function addCourseGroup(useDefaultValues = false) {
    courseCount++;
    
    const div = document.createElement('div');
    div.className = 'course-group';
    div.dataset.courseId = courseCount;
    
    // Default values for prefilling the first course
    const deptVal = useDefaultValues ? "ITIS" : "";
    const numVal = useDefaultValues ? "3135" : "";
    const nameVal = useDefaultValues ? "Web Application Development" : "";
    const reasonVal = useDefaultValues ? "It's required." : "";

    div.innerHTML = `
        <h4>Course ${courseCount}: *</h4>
        <label for="course-dept-${courseCount}">Dept: </label>
        <input type="text" id="course-dept-${courseCount}" name="courseDept${courseCount}" value="${deptVal}" placeholder="e.g., ITIS" required size="5">
        <label for="course-num-${courseCount}">Number: </label>
        <input type="text" id="course-num-${courseCount}" name="courseNum${courseCount}" value="${numVal}" placeholder="e.g., 3135" required size="5">
        <label for="course-name-${courseCount}">Name: </label>
        <input type="text" id="course-name-${courseCount}" name="courseName${courseCount}" value="${nameVal}" placeholder="e.g., Web Application Development" required size="30">
        <label for="course-reason-${courseCount}">Reason: </label>
        <input type="text" id="course-reason-${courseCount}" name="courseReason${courseCount}" value="${reasonVal}" placeholder="e.g., It's required." required size="30">
        <button type="button" class="delete-course-btn" data-course-id="${courseCount}">Delete</button>
    `;

    coursesContainer.appendChild(div);
}

// Listener for the "Add Another Course" button
addCourseBtn.addEventListener('click', () => addCourseGroup(false));

// Listener for dynamically created delete buttons (using event delegation)
coursesContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-course-btn')) {
        // Prevent deleting the *only* remaining course
        if (coursesContainer.querySelectorAll('.course-group').length > 1) {
            e.target.closest('.course-group').remove();
            // We don't decrement courseCount, just let it continue to increase 
            // to ensure unique IDs are used.
        } else {
            alert("You must have at least one course.");
        }
    }
});

// --- Submission Handling and Page Generation ---

// Event listener for the 'Clear' button
clearButton.addEventListener('click', clearAllFields);

// Event listener for form submission
formElement.addEventListener("submit", function (e) {
    // 1. Prevent default submission (page refresh)
    e.preventDefault(); 

    // 2. Client-side validation is largely handled by the 'required' attribute 
    //    but we can add a check here for good measure, though the browser 
    //    prevents submission if 'required' fields are empty.
    if (!formElement.checkValidity()) {
        alert("Please fill out all required fields (*).");
        return; 
    }

    // 3. Gather all form data
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Special handling for the optional middle name/nickname
    const fullName = [
        data.firstName, 
        (data.middleName || data.nickname) ? `(${data.middleName || data.nickname})` : '',
        data.lastName
    ].filter(Boolean).join(' ');

    // Extract all courses dynamically
    const courses = [];
    const courseGroups = coursesContainer.querySelectorAll('.course-group');
    courseGroups.forEach((group, index) => {
        const courseData = {
            dept: formData.get(`courseDept${index + 1}`),
            num: formData.get(`courseNum${index + 1}`),
            name: formData.get(`courseName${index + 1}`),
            reason: formData.get(`courseReason${index + 1}`)
        };
        // Use the dynamic index from the loop since the form indices can be sparse after deletion
        if (courseData.dept && courseData.num) { // Basic check for a valid course entry
            courses.push(courseData);
        }
    });
    
    // 4. Generate the new page content HTML
    let courseListHTML = courses.map(c => 
        `<li><b>${c.dept} ${c.num} - ${c.name}:</b> ${c.reason}</li>`
    ).join('');

    let linksListHTML = '';
    for(let i = 1; i <= 5; i++) {
        const url = data[`link${i}`];
        if (url) {
            linksListHTML += `<li><a href="${url}" target="_blank">${url}</a></li>`;
        }
    }

    // Handle image file or use default path
    let imageSrc = "images/default_intro_image.jpg"; // Replace with your actual default image path
    let reader = null;

    const fileInput = document.getElementById('picture-file');
    const imageFile = fileInput.files[0];
    
    // Function to complete the page generation after image processing
    const finalizePage = (finalImageSrc) => {
        const resultHTML = `
            <div id="intro-result-page">
                <h2>Introduction Form</h2>
                <hr>
                
                <p>
                    <strong>I, ${data.firstName} ${data.lastName}, acknowledge that I will comply with the terms of the UNC Charlotte Code of Academic Integrity. I understand that violations of the Code of Academic Integrity, including but not limited to, plagiarism, cheating, or misrepresentation of academic work, will result in disciplinary action.</strong>
                </p>
                <p><strong>Date: ${data.ackDate}</strong></p>
                <hr>

                <h3>${data.mascotAdj} ${data.mascotAnimal}</h3>
                <p>${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider} ${data.divider}</p>
                
                <figure>
                    <img src="${finalImageSrc}" alt="${data.pictureCaption}" style="max-width: 300px; height: auto;">
                    <figcaption><strong>${data.pictureCaption}</strong></figcaption>
                </figure>

                <p><strong>Personal Statement:</strong> ${data.personalStatement}</p>
                <hr>

                <h4>Main Background Points</h4>
                <ul>
                    <li><strong>${data.bullet1}</strong>
                        <ul>
                            <li><strong>${data.bullet2}</strong></li>
                            <li><strong>${data.bullet3}</strong>
                                <ul>${courseListHTML}</ul>
                            </li>
                            <li><strong>${data.bullet4}</strong></li>
                            <li><strong>${data.bullet5}</strong></li>
                            <li><strong>${data.bullet6}</strong></li>
                            <li><strong>${data.bullet7}</strong></li>
                        </ul>
                    </li>
                </ul>
                <hr>

                <blockquote>
                    <p>"${data.quote}"</p>
                    <footer>— ${data.quoteAuthor}</footer>
                </blockquote>
                
                ${data.funnyThing ? `<p><strong>Funny Thing:</strong> ${data.funnyThing}</p>` : ''}
                ${data.toShare ? `<p><strong>Something I would like to share:</strong> ${data.toShare}</p>` : ''}
                <hr>

                <h4>Links</h4>
                <ul>${linksListHTML}</ul>
                <hr>
                
                <p><a href="#" onclick="window.location.reload();">Reset and Create a New Introduction</a></p>
            </div>
        `;
        
        // 5. Replace the form with the generated content
        document.querySelector('main').innerHTML = resultHTML;
    };


    // Image Handling Logic
    if (imageFile) {
        // Read the file content as a Data URL
        reader = new FileReader();
        reader.onload = function(e) {
            finalizePage(e.target.result); // Use the uploaded image data URL
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Use the default image path if no file was uploaded
        finalizePage(imageSrc); 
    }

});

// --- Initial Course Setup ---
// Ensure the first course group is present on page load with default values
document.addEventListener('DOMContentLoaded', () => {
    if (coursesContainer.querySelectorAll('.course-group').length === 0) {
        addCourseGroup(true); 
    }
});