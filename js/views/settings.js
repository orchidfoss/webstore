(function (exports) {
  "use strict";

  exports.viewFunction['settings'] = () => {};

  var root = document.querySelector(':root');

  var profile = document.getElementById("settings-profile");
  var profileButton = profile.querySelector("li");
  var profileAvatar = document.getElementById("settings-profile-avatar");
  var profileUsername = document.getElementById("settings-profile-username");
  var profileEmail = document.getElementById("settings-profile-email");

  // Profile
  function initializeUser() {
    if (OrchidServices.isUserLoggedIn()) {
      OrchidServices.getWithUpdate(
        "profile/" + OrchidServices.userId(),
        function (data) {
          profileUsername.textContent = data.username;
          profileEmail.textContent = data.email;
          profileAvatar.alt = data.username;
          if (data.profile_picture !== "") {
            profileAvatar.src = data.profile_picture;
          } else {
            profileAvatar.src = "/images/profile_pictures/avatar_default.svg";
          }
        }
      );

      profileButton.addEventListener('click', () => {
        location.href = '/profile/?user_id=' + OrchidServices.userId();
      });
    } else {
      profile.style.display = "none";
    }
  }

  if (navigator.onLine) {
    initializeUser();
  } else {
    profile.style.display = "none";
  }

  // Dark Mode
  var darkModeEnabled = (localStorage.getItem('ws.webstore.darkMode') == 'true') || false;
  var darkModeCheckbox = document.getElementById('settings-dark-mode');

  darkModeCheckbox.checked = darkModeEnabled;
  darkModeCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.darkMode', darkModeCheckbox.checked);
    root.classList.add('transition');
    root.addEventListener('transitionend', () => {
      root.classList.remove('transition');
    });
    root.dataset.theme = darkModeCheckbox.checked ? 'dark' : 'light';
    root.dataset.accentScheme = darkModeCheckbox.checked ? "light" : "dark";
  });

  // Auto Update (Service Worker Needed)
  var autoUpdateEnabled = (localStorage.getItem('ws.webstore.auto_update') == 'true') || true;
  var autoUpdateCheckbox = document.getElementById('settings-auto-update');

  autoUpdateCheckbox.checked = autoUpdateEnabled;
  autoUpdateCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.autoUpdate', autoUpdateCheckbox.checked);
  });

  // Language
  var selectedLanguage = localStorage.getItem("ws.webstore.language") || navigator.language;
  var languagesDropdown = document.getElementById('settings-languages');

  window.addEventListener('load', () => {
    languagesDropdown.value = selectedLanguage;
  });
  languagesDropdown.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.language', languagesDropdown.value);
    navigator.mozL10n.language.code = languagesDropdown.value;
  });

  var client = new XMLHttpRequest();
  client.open('GET', '/locales.json');
  client.onreadystatechange = function() {
    languagesDropdown.innerHTML = '';
    var entries = Object.entries(JSON.parse(client.responseText));
    entries.forEach(entry => {
      var option = document.createElement('option');
      option.value = entry[0];
      option.textContent = entry[1];
      languagesDropdown.appendChild(option);
    });
  };
  client.send();

  // Elastic Scroll
  var elasticScrollEnabled = (localStorage.getItem('ws.webstore.elastic_scroll') == 'true') || false;
  var elasticScrollCheckbox = document.getElementById('settings-elastic-scroll');

  elasticScrollCheckbox.checked = elasticScrollEnabled;
  elasticScrollCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.elastic_scroll', elasticScrollCheckbox.checked);
    location.reload();
  });

  // History
  var historyEnabled = (localStorage.getItem('ws.webstore.historyEnabled') == 'true') || true;
  var historyCheckbox = document.getElementById('settings-history');
  var historyClearButton = document.getElementById('settings-history-clear');
  var historyButton = document.getElementById("sidebar-history");

  historyCheckbox.checked = historyEnabled;
  historyCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.historyEnabled', historyCheckbox.checked);
    if (historyCheckbox.checked) {
      historyButton.style.display = 'block';
    } else {
      historyButton.style.display = 'none';
    }
  });

  historyCheckbox.addEventListener('click', function() {
    localStorage.setItem('ws.webstore.history', '[]');
  });
})(window);
