// generate_html.js

// Helper function to safely get the value of an element by ID
const getValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
};

document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the new button
    const generateButton = document.getElementById('generateHtmlButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateHtml);
    }
});

function generateHtml() {
    // 1. Gather form data (reusing the logic from your introduction.js/generate_json.js)
    const data = {
        firstName: getValue('first-name'),
        preferredName: getValue('nickname'),
        middleInitial: getValue('middle-name'),
        lastName: getValue('last-name'),
        divider: getValue('divider'),
        mascotAdjective: getValue('mascot-adj'),
        mascotAnimal: getValue('mascot-animal'),
        imagePath: getValue('image-path'),
        imageCaption: getValue('picture-caption'),
        personalStatement: getValue('personal-statement'),
        
        // Background Bullets
        personalBackground: getValue('personal-background'),
        professionalBackground: getValue('professional-background'),
        academicBackground: getValue('academic-background'),
        webDevInterests: getValue('subject-background-1'),
        courseGoals: getValue('subject-background-2'),
        somethingUnique: getValue('subject-background-3'),
        futurePlans: getValue('subject-background-4'),

        // Links
        links: getLinkData(),
        // Courses (using the same structure as generate_json.js)
        courses: getCourseData(), 
    };

    // 2. Construct the HTML String (using template literals for structure)
    // This HTML should mimic the output from your form's submit handler, 
    // but formatted for the example output.

    let courseListItems = data.courses.map(c => `
    <li>
        <strong>${c.department} ${c.number} - ${c.name}:</strong> ${c.reason}
    </li>`).join('');

    let linkListItems = data.links.map(link => `
    <li>
        <a href="${link.href}" target="_blank">${link.name}</a>
    </li>`).join('');


    const rawHtmlOutput = `
<section id="introduction-output">
    <h2>Introduction Output</h2>
    
    <h3>${data.firstName} ${data.middleInitial ? data.middleInitial + '. ' : ''}"${data.preferredName}" ${data.lastName} ${data.divider} ${data.mascotAdjective} ${data.mascotAnimal}</h3>
    <hr />

    <figure>
        <img
            src="${data.imagePath}"
            alt="${data.imageCaption}"
            style="max-width: 300px; height: auto;"
        />
        <figcaption>
            <strong>${data.imageCaption}</strong>
        </figcaption>
    </figure>

    <p>
        <strong>Personal Statement:</strong> ${data.personalStatement}
    </p>
    <hr />

    <h4>Background</h4>
    <ul>
        <li>
            <strong>Personal Background:</strong> ${data.personalBackground}
        </li>
        <li>
            <strong>Professional Background:</strong> ${data.professionalBackground}
        </li>
        <li>
            <strong>Academic Background:</strong> ${data.academicBackground}
            <ul>
                ${courseListItems}
            </ul>
        </li>
        <li>
            <strong>Web Development Interests:</strong> ${data.webDevInterests}
        </li>
        <li>
            <strong>Course Goals:</strong> ${data.courseGoals}
        </li>
        <li>
            <strong>Something Unique:</strong> ${data.somethingUnique}
        </li>
        <li>
            <strong>Future Plans:</strong> ${data.futurePlans}
        </li>
    </ul>
    <hr />

    <h4>Links</h4>
    <ul>
        ${linkListItems}
    </ul>
</section>
`;

    // 3. Escape the HTML String so it displays as code
    // Replace < with &lt; and > with &gt;
    const escapedHtml = rawHtmlOutput
        .replace(/&/g, '&amp;') // Must escape & first
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // 4. Update the H2 heading
    const h2 = document.querySelector('main h2');
    if (h2) {
        h2.textContent = 'Introduction HTML';
    }

    // 5. Replace the form content with the formatted HTML code
    const main = document.querySelector('main');
    const form = document.getElementById('intro-form');
    
    if (main && form) {
        form.remove();

        const section = document.createElement('section');
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        // Set up the code element
        // Use 'html' or 'xml' for highlighting HTML code
        code.className = 'html'; 
        code.innerHTML = escapedHtml; // Use innerHTML since we already escaped the content

        pre.appendChild(code);
        section.appendChild(pre);
        main.appendChild(section);

        // 6. Tell Highlight.js to format the code block
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(code);
        } else {
            console.error("Highlight.js is not loaded. Ensure the script link is correct.");
        }
    }
}


// --- Helper Functions to Extract Array Data (Copied from generate_json.js) ---

/**
 * Reads all course groups and extracts the data into an array of objects.
 */
function getCourseData() {
    const courses = [];
    const courseGroups = document.querySelectorAll('#courses-container .course-group');

    courseGroups.forEach(group => {
        const dept = group.querySelector('.course-dept')?.value.trim() || '';
        const num = group.querySelector('.course-num')?.value.trim() || '';
        const name = group.querySelector('.course-name')?.value.trim() || '';
        const reason = group.querySelector('.course-reason')?.value.trim() || '';

        if (dept && num) {
            courses.push({ "department": dept, "number": num, "name": name, "reason": reason });
        }
    });
    return courses;
}

/**
 * Reads all link groups and extracts the name and href into an array of objects.
 */
function getLinkData() {
    const links = [];
    const linkGroups = document.querySelectorAll('.link-group');

    linkGroups.forEach(group => {
        const name = group.querySelector('.link-name')?.value.trim() || '';
        const href = group.querySelector('.link-href')?.value.trim() || '';

        if (name && href) {
            links.push({ "name": name, "href": href });
        }
    });
    return links;
}