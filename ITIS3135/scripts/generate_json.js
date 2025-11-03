document.addEventListener('DOMContentLoaded', () => {
    // Helper function to safely get the value of an element by ID
    const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    };

    // Attach the event listener to the new button
    const generateButton = document.getElementById('generateJsonButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateJson);
    }
});

function generateJson() {
    // 1. Gather all data into a JavaScript object based on the required JSON keys
    const dataObject = {
        "firstName": getValue('first-name'),
        "preferredName": getValue('nickname'),
        "middleInitial": getValue('middle-name'), // Note: Used middle-name field for middleInitial key
        "lastName": getValue('last-name'),
        "divider": getValue('divider'),
        "mascotAdjective": getValue('mascot-adj'),
        "mascotAnimal": getValue('mascot-animal'),
        "image": getValue('image-path'), // Uses the static path field
        "imageCaption": getValue('picture-caption'),
        "personalStatement": getValue('personal-statement'),
        
        // Mapping the 7 bullets to the 5 required keys:
        "personalBackground": getValue('personal-background'),
        "professionalBackground": getValue('professional-background'),
        "academicBackground": getValue('academic-background'),
        // Combine the last 4 into 'subjectBackground' or just take the first one that matches the old key
        "subjectBackground": getValue('subject-background-1'), // Taking the first 'Web Development Interests'
        
        "primaryComputer": getValue('primary-computer'),
        "courses": getCourseData(),
        "links": getLinkData()
    };

    // 2. Convert the JavaScript object to a formatted JSON string
    // The 'null, 2' argument ensures the output is nicely indented with 2 spaces.
    const jsonString = JSON.stringify(dataObject, null, 2);

    // 3. Update the H2 heading
    const h2 = document.querySelector('main h2');
    if (h2) {
        h2.textContent = 'Introduction HTML';
    }

    // 4. Replace the form content with the formatted JSON
    const main = document.querySelector('main');
    const form = document.getElementById('intro-form');
    
    if (main && form) {
        // Remove the original form
        form.remove();

        // Create the elements for displaying the highlighted code
        const section = document.createElement('section');
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        // Set up the code element
        code.className = 'json'; // Tell Highlight.js to treat it as JSON
        code.textContent = jsonString;

        // Structure the new content
        pre.appendChild(code);
        section.appendChild(pre);
        
        // Insert the new section into the main content area
        main.appendChild(section);

        // 5. Tell Highlight.js to format the code block
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(code);
        } else {
            console.error("Highlight.js is not loaded. Ensure the script link is correct in your HTML.");
        }
    }
}

// --- Helper Functions to Extract Array Data ---

/**
 * Reads all course groups and extracts the data into an array of objects.
 */
function getCourseData() {
    const courses = [];
    // Select all course groups (assuming you're using class names for easy selection)
    const courseGroups = document.querySelectorAll('.course-group');

    courseGroups.forEach(group => {
        const dept = group.querySelector('.course-dept')?.value.trim() || '';
        const num = group.querySelector('.course-num')?.value.trim() || '';
        const name = group.querySelector('.course-name')?.value.trim() || '';
        const reason = group.querySelector('.course-reason')?.value.trim() || '';

        // Only add the course if the department is not empty (ensures partial/empty rows are ignored)
        if (dept) {
            courses.push({
                "department": dept,
                "number": num,
                "name": name,
                "reason": reason
            });
        }
    });

    return courses;
}

/**
 * Reads all link groups and extracts the name and href into an array of objects.
 */
function getLinkData() {
    const links = [];
    // Select all link groups
    const linkGroups = document.querySelectorAll('.link-group');

    linkGroups.forEach(group => {
        const name = group.querySelector('.link-name')?.value.trim() || '';
        const href = group.querySelector('.link-href')?.value.trim() || '';

        // Only add the link if both name and href are present
        if (name && href) {
            links.push({
                "name": name,
                "href": href
            });
        }
    });

    return links;
}

// NOTE: You will need to implement the 'Add Another Course' functionality 
// in your existing 'introduction.js' or directly in the HTML if you want 
// the user to dynamically add rows before generating the JSON.