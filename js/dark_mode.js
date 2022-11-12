(function (exports) {
  "use strict";

  var darkModeEnabled = localStorage.getItem("ws.webstore.darkMode") == "true";
  var root = document.querySelector(":root");

  root.dataset.theme = darkModeEnabled ? "dark" : "light";
})(window);
