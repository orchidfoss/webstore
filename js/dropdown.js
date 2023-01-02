(function (exports) {
  "use strict";

  function Dropdown(element, dropdown, callback) {
    element.classList.add('dropdown-button');
    element.onclick = (evt) => {
      var activeButtons = document.querySelectorAll('.dropdown-button');
      activeButtons.forEach((buttonElement) => {
        if (buttonElement == element) {
          buttonElement.classList.toggle('active');
          return;
        }
        buttonElement.classList.remove('active');
      });

      dropdown.style.left = element.offsetLeft + 'px';
      dropdown.style.top = element.offsetTop + element.offsetHeight + 'px';
      var activeDropdowns = document.querySelectorAll('.dropdown');
      activeDropdowns.forEach((dropdownElement) => {
        if (dropdownElement == dropdown) {
          dropdownElement.classList.toggle('visible');
          return;
        }
        dropdownElement.classList.remove('visible');
      });

      callback();

      if (element.offsetLeft >= (window.innerWidth - dropdown.offsetWidth - 10)) {
        dropdown.style.left = (element.offsetLeft - (dropdown.offsetWidth - element.offsetWidth)) + 'px';
      }

      var views = dropdown.querySelectorAll('.dropdown-view');
      views.forEach((view, index) => {
        view.classList.remove('previous');

        if (index == 0) {
          view.classList.remove('next');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        } else {
          view.classList.remove('current');
          view.classList.add('next');
        }
      });

      var links = dropdown.querySelectorAll('li[data-for]');
      links.forEach((link) => {
        link.onclick = () => {
          var currentView = document.querySelector('.dropdown-view.current');
          currentView.classList.remove('current');
          currentView.classList.remove('next');
          currentView.classList.add('previous');

          var id = link.dataset.for;
          var view = document.getElementById(id);
          view.classList.remove('next');
          view.classList.remove('previous');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        };
      });

      var headerButtons = dropdown.querySelectorAll('a[data-for]');
      headerButtons.forEach((button) => {
        button.onclick = () => {
          var currentView = document.querySelector('.dropdown-view.current');
          currentView.classList.remove('current');
          currentView.classList.remove('previous');
          currentView.classList.add('next');

          var id = button.dataset.for;
          var view = document.getElementById(id);
          view.classList.remove('next');
          view.classList.remove('previous');
          view.classList.add('current');
          dropdown.style.height = view.offsetHeight + 'px';
        };
      });
    };

    var sidebar = document.getElementById('sidebar');
    var webapp = document.getElementById('webapp');
    var content = document.querySelectorAll('.content');

    [sidebar, webapp, ...content].forEach(uiElement => {
      uiElement.addEventListener('click', () => {
        if (dropdown.classList.contains('visible')) {
          element.classList.remove('dropdown-button');
          dropdown.classList.remove('visible');
        }
      });
    });
  }

  exports.Dropdown = Dropdown;
})(window);
