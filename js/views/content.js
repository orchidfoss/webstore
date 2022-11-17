(function (exports) {
  "use strict";

  exports.viewFunction['content'] = () => {
    if (navigator.onLine) {
      setTimeout(() => {
        openContentView('loading-screen', false);
      });
      webapps.innerHTML = '';
      categories.innerHTML = '';

      OrchidServices.getList("webstore", function (data, id) {
        openContentView('content', false);
        createWebappIcon(data, id, false);
        if (currentWebapp == id) {
          showWebappInfo(data, id);
        }
      });
    }
  };

  var currentWebapp = '';
  var webapps = document.getElementById("webapps");
  var categories = document.getElementById("categories");

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "webapp":
          currentWebapp = pair[1];
          break;

        default:
          break;
      }
    }
  }
})(window);
