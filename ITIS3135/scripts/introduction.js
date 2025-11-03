// generate_json.js

// Helper function to safely get the value of an element by ID
const getValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
};

// --- Helper Functions to Extract Array Data (using classes defined in HTML) ---

/**
 * Reads all course groups and extracts the data into an array of objects.
 */
function getCourseData() {
    const courses = [];
    // Select all course groups (using the .course-group class)
    const courseGroups = document.querySelectorAll('#courses-container .course-group');

    courseGroups.forEach((group) => {
        // Use querySelector on the group to find the specific inputs within that group
        const deptEl = group.querySelector('.course-dept');
        const dept = deptEl ? deptEl.value.trim() : '';
        const numEl = group.querySelector('.course-num');
        const num = numEl ? numEl.value.trim() : '';
        const nameEl = group.querySelector('.course-name');
        const name = nameEl ? nameEl.value.trim() : '';
        const reasonEl = group.querySelector('.course-reason');
        const reason = reasonEl ? reasonEl.value.trim() : '';

        // Only add the course if the department and number are not empty
        if (dept && num) {
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

    linkGroups.forEach((group) => {
        const nameEl = group.querySelector('.link-name');
        const name = nameEl ? nameEl.value.trim() : '';
        const hrefEl = group.querySelector('.link-href');
        const href = hrefEl ? hrefEl.value.trim() : '';

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

function generateJson() {
    // 1. Gather all data into a JavaScript object based on the required JSON keys
    const dataObject = {
        // --- Personal Information (Matching JSON Keys to your Form IDs) ---
        "firstName": getValue('first-name'),
        "preferredName": getValue('nickname'),
        "middleInitial": getValue('middle-name'), // Using middle-name for middleInitial key
        "lastName": getValue('last-name'),
        "divider": getValue('divider'),
        "mascotAdjective": getValue('mascot-adj'),
        "mascotAnimal": getValue('mascot-animal'),
        
        // --- Image and Background ---
        "image": getValue('image-path'), // Uses the static image-path field we added
        "imageCaption": getValue('picture-caption'),
        "personalStatement": getValue('personal-statement'),
        
        // Mapping the 7 bullets to the 5 required keys:
        "personalBackground": getValue('personal-background'),
        "professionalBackground": getValue('professional-background'),
        "academicBackground": getValue('academic-background'),
        
        // **IMPORTANT:** Since the required JSON has only 5 bullet keys, 
        // we combine the content of the remaining 4 fields into 'subjectBackground'
        "subjectBackground": [
            getValue('subject-background-1'),
            getValue('subject-background-2'),
            getValue('subject-background-3'),
            getValue('subject-background-4')
        ].filter(Boolean).join(' | '), // Joins the 4 bullets with a separator
        
        "primaryComputer": getValue('primary-computer'), // New field added to HTML
        
        // --- Array Data ---
        "courses": getCourseData(),
        "links": getLinkData()
    };

    // 2. Convert the JavaScript object to a formatted JSON string
    // The 'null, 2' arguments ensure the output is nicely indented with 2 spaces.
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

document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the new button
    const generateButton = document.getElementById('generateJsonButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateJson);
    }
});