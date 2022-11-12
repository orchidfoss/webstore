(function (exports) {
  "use strict";

  var selectedLanguage = localStorage.getItem("ws.language");

  window.addEventListener("load", function () {
    navigator.mozL10n.language.code = selectedLanguage;
  });
})(window);
