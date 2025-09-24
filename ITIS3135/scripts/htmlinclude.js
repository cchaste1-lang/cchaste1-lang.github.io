function includeHTML() {
  let elements = document.querySelectorAll('[data-include]');
  elements.forEach(el => {
    let file = el.getAttribute('data-include');
    if (file) {
      fetch(file)
        .then(response => response.text())
        .then(data => {
          el.innerHTML = data;
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", includeHTML);
