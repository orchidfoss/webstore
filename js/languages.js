(function (exports) {
  "use strict";

  var selectedLanguage = localStorage.getItem("ws.webstore.language") || navigator.language;

  window.addEventListener("load", function () {
    navigator.mozL10n.language.code = selectedLanguage;
  });
})(window);
