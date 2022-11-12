(function (exports) {
  "use strict";

  exports.viewFunction['settings'] = () => {};

  var profile = document.getElementById("settings-profile");
  var profileAvatar = document.getElementById("settings-profile-avatar");
  var profileUsername = document.getElementById("settings-profile-username");
  var profileEmail = document.getElementById("settings-profile-email");

  // Profile
  function initializeUser() {
    if (OrchidServices.isUserLoggedIn) {
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
  var darkModeEnabled = localStorage.getItem('ws.webstore.darkMode') == 'true';
  var darkModeCheckbox = document.getElementById('settings-dark-mode');
  var root = document.querySelector(':root');

  darkModeCheckbox.checked = darkModeEnabled;
  darkModeCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.darkMode', darkModeCheckbox.checked);
    root.classList.add('transition');
    root.addEventListener('transitionend', () => {
      root.classList.remove('transition');
    });
    root.dataset.theme = darkModeCheckbox.checked ? 'dark' : 'light';
  });

  // Auto Update (Service Worker Needed)
  var autoUpdateEnabled = localStorage.getItem('ws.webstore.autoUpdate') == 'true';
  var autoUpdateCheckbox = document.getElementById('settings-auto-update');
  var root = document.querySelector(':root');

  autoUpdateCheckbox.checked = autoUpdateEnabled;
  autoUpdateCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.webstore.autoUpdate', autoUpdateCheckbox.checked);
  });
})(window);
