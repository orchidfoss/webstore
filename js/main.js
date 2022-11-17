(function (exports) {
  "use strict";

  exports.EnglishToArabicNumerals = function EnglishToArabicNumerals(
    numberString
  ) {
    var arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (document.dir == "rtl") {
      return numberString
        .toLocaleString(navigator.mozL10n.language.code)
        .replace(/[0-9]/g, function (w) {
          return arabicNumerals[+w];
        });
    } else {
      return numberString;
    }
  };

  var offlineMessage = document.getElementById("offline-message");
  var offlineMessageSettingsButton =
    offlineMessage.querySelector(".settings-button");
  var offlineMessageReloadButton =
    offlineMessage.querySelector(".reload-button");

  offlineMessageReloadButton.onclick = () => {
    location.reload();
  };

  var splashscreen = document.getElementById("splashscreen");
  var optionsButton = document.getElementById("options-button");
  var profileButton = document.getElementById("profile-button");
  var profileAvatar = document.getElementById("profile-avatar");

  var sidebar = document.getElementById("sidebar");
  var toggleSidebarButton = document.getElementById("toggle-sidebar-button");

  window.addEventListener("load", function () {
    function initializeUser() {
      if (OrchidServices.isUserLoggedIn()) {
        OrchidServices.getWithUpdate(
          "profile/" + OrchidServices.userId(),
          function (data) {
            profileButton.title = data.username;
            profileAvatar.alt = data.username;
            if (data.profile_picture !== "") {
              profileAvatar.src = data.profile_picture;
            } else {
              profileAvatar.src = "/images/profile_pictures/avatar_default.svg";
            }
          }
        );
        optionsButton.style.display = "none";
      } else {
        profileButton.style.display = "none";
      }
    }

    if (navigator.onLine) {
      initializeUser();
    } else {
      offlineMessage.classList.add("visible");
      profileButton.style.display = "none";
    }

    splashscreen.classList.add("hidden");
    openContentView("content");
  });

  toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
  });

  // Side Tabs
  var allAppsButton = document.getElementById("sidebar-allapps");
  var featuredButton = document.getElementById("sidebar-featured");
  var historyButton = document.getElementById("sidebar-history");
  var installedAppsButton = document.getElementById("sidebar-installed-apps");
  var settingsButton = document.getElementById("sidebar-settings");

  allAppsButton.onclick = () => {
    var selected = document.querySelector('[aria-selected="true"]');
    selected.setAttribute("aria-selected", null);
    allAppsButton.setAttribute("aria-selected", true);
    openContentView("content", true);
  };

  featuredButton.onclick = () => {
    openContentView("featured", true);
  };

  var isHistoryEnabled =
    localStorage.getItem("ws.webstore.historyEnabled") == "true" || true;
  if (isHistoryEnabled) {
    historyButton.style.display = "none";
  }
  historyButton.onclick = () => {
    openContentView("history", true);
  };

  installedAppsButton.onclick = () => {
    openContentView("installed-apps", true);
  };

  settingsButton.onclick = () => {
    openContentView("settings", true);
  };
})(window);
