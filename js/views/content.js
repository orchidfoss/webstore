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
        createIcon(data, id, false);
        if (currentWebapp == id) {
          openInfo(data, id, false);
        }
      });
    }
  };

  var categoryIcons = {
    'communication': 'sms',
    'education': 'help',
    'games': 'play',
    'health': 'heart',
    'multimedia': 'video',
    'news': 'tab-previews',
    'search': 'search',
    'social': 'user',
    'travel': 'airplane',
    'utility': 'permissions'
  };

  var isListEnabled = false;
  var currentWebapp = '';
  var allAppsButton = document.getElementById('sidebar-allapps');
  var webapps = document.getElementById("webapps");
  var categories = document.getElementById("categories");

  function setCategory(id, app) {
    if (document.querySelector('[data-category="' + id + '"]')) {
      var container = document.querySelector(
        '[data-category="' + id + '"] > .webapps'
      );
      container.appendChild(app);
    } else {
      var listItem = document.createElement("li");
      categories.appendChild(listItem);

      var link = document.createElement("a");
      link.href = '#category-' + id;
      link.dataset.l10nId = "category-" + id;
      link.dataset.icon = categoryIcons[id];
      link.onclick = () => {
        var selected = document.querySelector('#sidebar [aria-selected="true"]');
        if (selected) {
          selected.setAttribute('aria-selected', null);
        } else {
          allAppsButton.setAttribute('aria-selected', null);
        }
        link.setAttribute('aria-selected', true);
        openContentView('content', false);
      };
      listItem.appendChild(link);

      var element = document.createElement("div");
      element.id = 'category-' + id;
      element.dataset.category = id;
      element.classList.add("webapps-group");
      webapps.appendChild(element);

      document.addEventListener('wheel', () => {
        if (exports.selectedView == 'content') {
          if (element.getBoundingClientRect().top <= (window.innerHeight - (element.getBoundingClientRect().height - 1))) {
            var selected = document.querySelector('#sidebar [aria-selected="true"]');
            if (selected && link.isConnected) {
              selected.setAttribute('aria-selected', null);
              link.setAttribute('aria-selected', true);
            }
          }
        }
      });
      document.addEventListener('touchmove', () => {
        if (exports.selectedView == 'content') {
          if (element.getBoundingClientRect().top <= (window.innerHeight - (element.getBoundingClientRect().height - 1))) {
            var selected = document.querySelector('#sidebar [aria-selected="true"]');
            if (selected && link.isConnected) {
              selected.setAttribute('aria-selected', null);
              link.setAttribute('aria-selected', true);
            }
          }
        }
      });

      var header = document.createElement("header");
      element.appendChild(header);

      var title = document.createElement("h1");
      title.dataset.l10nId = "category-" + id;
      header.appendChild(title);

      var expandButton = document.createElement("a");
      expandButton.href = "#";
      expandButton.dataset.icon = "expand-chevron";
      expandButton.dataset.l10nId = "show-more";
      expandButton.onclick = (evt) => {
        evt.preventDefault();
        element.classList.toggle("expanded");
        if (element.classList.contains("expanded")) {
          expandButton.dataset.l10nId = "show-less";
        } else {
          expandButton.dataset.l10nId = "show-more";
        }
        expandButton.classList.toggle('active');
      };
      header.appendChild(expandButton);

      var container = document.createElement("div");
      container.classList.add("webapps");
      if (isListEnabled) {
        container.classList.add("list");
      }
      element.appendChild(container);

      container.appendChild(app);

      isListEnabled = !isListEnabled;
    }
  }

  function createIcon(data, id, isBananaHackers) {
    var element = document.createElement("a");
    element.href = "?webapp=" + id;
    element.classList.add("webapp");
    element.title = data.name;
    element.onclick = (evt) => {
      evt.preventDefault();
      openInfo(data, id, isBananaHackers);
    };

    if (isBananaHackers) {
      setCategory(data.meta.categories[0], element);
    } else {
      setCategory(data.categories[0], element);
    }

    var iconHolder = document.createElement("div");
    iconHolder.classList.add("icon-holder");
    element.appendChild(iconHolder);

    var icon = document.createElement("img");
    icon.src = data.icon;
    icon.onerror = () => {
      icon.src = "images/default.svg";
    };
    iconHolder.appendChild(icon);

    var context = document.createElement("div");
    context.classList.add("context");
    element.appendChild(context);

    var title = document.createElement("span");
    title.classList.add("title");
    title.textContent = data.name;
    context.appendChild(title);

    var author = document.createElement("a");
    author.classList.add("author");
    context.appendChild(author);

    OrchidServices.getWithUpdate(
      "profile/" + data.author_id,
      function (udata) {
        author.textContent = udata.username;
        author.href = "/account/?user=" + udata.username;
      }
    );

    var categories = document.createElement("div");
    categories.classList.add("categories");
    data.categories.forEach((item) => {
      var category = document.createElement("span");
      category.dataset.l10nId = "category-" + item;
      categories.appendChild(category);
    });

    context.appendChild(categories);
  }

  function openInfo(data, id, isBananaHackers) {
    var sidebar = document.getElementById("sidebar");
    var toggleSidebarButton = document.getElementById("toggle-sidebar-button");
    var backButton = document.getElementById("back-button");
    var content = document.getElementById(exports.selectedView);
    var webapp = document.getElementById("webapp");
    var webappCard = document.getElementById("webapp-card");
    var webappBanner = document.getElementById("webapp-banner");
    var webappIcon = document.getElementById("webapp-icon");
    var webappName = document.getElementById("webapp-name");
    var webappAuthor = document.getElementById("webapp-author");
    var webappStarRatings = document.getElementById("webapp-star-ratings");
    var webappAverageRating = document.getElementById("webapp-average-rating");
    var webappCategories = document.getElementById("webapp-categories");
    var installButton = document.getElementById("webapp-install-button");
    var uninstallButton = document.getElementById("webapp-uninstall-button");
    var updateButton = document.getElementById("webapp-update-button");
    var webappScreenshots = document.getElementById("webapp-screenshots");
    var webappScreenshotsHolder = document.getElementById(
      "webapp-screenshots-holder"
    );
    var webappDescription = document.getElementById("webapp-description");
    var webappInstallSize = document.getElementById("webapp-size");
    var webappSupportedDevices = document.getElementById(
      "webapp-supported-devices"
    );
    var webappTags = document.getElementById("webapp-tags");
    var webappComments = document.getElementById("webapp-comments");
    var webappCommentsHeader = document.getElementById(
      "webapp-comments-header"
    );
    var webappPricing = document.getElementById("webapp-pricing");
    var webappAgeRating = document.getElementById("webapp-age-rating");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (data.teaser_url) {
      webappBanner.src =
        data.teaser_url.replace("watch?v=", "embed/") +
        "?controls=0&autoplay=1&loop=1&ref=0&fs=0&modestbranding=0";
    }

    webappCard.classList.add("fade-in");
    webappCard.addEventListener("animationend", () => {
      webappCard.classList.remove("fade-in");
    });

    webapp.classList.add("visible");
    sidebar.style.display = "none";
    toggleSidebarButton.style.display = "none";
    backButton.style.display = "block";
    content.classList.remove('visible');
    window.history.pushState({ html: "", pageTitle: "" }, "", "?webapp=" + id);

    backButton.onclick = () => {
      webappBanner.src = "";
      webappCard.classList.add("fade-out");

      // This helps us avoid the page closing next time we open it again.
      setTimeout(() => {
        webappCard.classList.remove("fade-out");
        webapp.classList.remove("visible");
        sidebar.style.display = "block";
        toggleSidebarButton.style.display = "block";
        backButton.style.display = "none";
        content.classList.add('visible');
        window.history.pushState({ html: "", pageTitle: "" }, "", "/webstore/");
      }, 300);
    };

    webappIcon.src = data.icon;
    webappIcon.onerror = () => {
      webappIcon.src = "images/default.svg";
    };

    webappName.textContent = data.name;
    OrchidServices.getWithUpdate(
      "profile/" + data.author_id,
      function (udata) {
        webappAuthor.textContent = udata.username;
        webappAuthor.href = "/account/?user=" + udata.username;
      }
    );

    function initializeRating(commentsArray) {
      if (commentsArray.length == 0) {
        webappAverageRating.textContent = "";
        webappStarRatings.innerHTML = "";
      } else {
        var sum = 0;
        for (var i = 0; i < commentsArray.length; i++) {
          sum += parseInt(commentsArray[i].rating * 5, 10); //don't forget to add the base
        }
        var avg = sum / commentsArray.length;

        webappAverageRating.textContent = Math.round(avg * 10) / 10;
        OrchidServices.set("webstore/" + id, {
          rating_average: Math.round(avg * 10) / 10,
        });

        webappStarRatings.innerHTML = "";
        for (let index = 0; index < parseInt(avg); index++) {
          var star = document.createElement("span");
          star.classList.add("star");
          star.dataset.icon = "bookmarked";
          webappStarRatings.appendChild(star);
        }
        for (let index = 0; index < 5 - parseInt(avg); index++) {
          var star = document.createElement("span");
          star.classList.add("star");
          star.dataset.icon = "bookmark";
          webappStarRatings.appendChild(star);
        }
      }
    }
    initializeRating(data.comments);

    webappCategories.innerHTML = "";
    data.categories.forEach((item) => {
      var category = document.createElement("span");
      category.dataset.l10nId = "category-" + item;
      webappCategories.appendChild(category);
    });

    installButton.onclick = () => {
      if (navigator.mozApps) {
        navigator.mozApps.mgmt.installPackage(data.download.url);
      } else {
        var a = document.createElement("a");
        a.href = data.download;
        a.download = "webapp.orchidpkg.zip";
        a.click();
      }
    };
    uninstallButton.onclick = () => {};
    uninstallButton.style.display = 'none';
    updateButton.onclick = () => {};

    webappScreenshots.innerHTML = "";
    if (data.screenshots) {
      if (data.screenshots.length !== 0) {
        data.screenshots.forEach((item) => {
          var screenshot = document.createElement("img");
          screenshot.src = item;
          webappScreenshots.appendChild(screenshot);
        });
        webappScreenshotsHolder.style.display = "block";
      } else {
        webappScreenshotsHolder.style.display = "none";
      }
    }

    webappDescription.innerText = data.description;
    webappTags.textContent = data.tags.join(", ");

    Comments("webstore/" + id, webappComments, true);
    OrchidServices.getWithUpdate("webstore/" + id, (data) => {
      webappCommentsHeader.dataset.l10nArgs =
        '{"n":"' + data.comments.length + '"}';
    });

    if (data.price == 0) {
      webappPricing.dataset.l10nId = 'pricing-free';
      webappPricing.dataset.l10nArgs = '';
    } else {
      webappPricing.dataset.l10nId = 'pricing-paid';
      webappPricing.dataset.l10nArgs = '{"n": "' + data.price + '"}';
    }

    webappAgeRating.children[0].src = 'images/rating/' + data.age_rating + '.svg';
    webappAgeRating.children[1].dataset.l10nId = 'ageRating-' + data.age_rating;

    webappInstallSize.dataset.l10nArgs = '{"n": "' + ((data.download.length / 1024) / 1024).toFixed(2) + 'MB"}';
  }

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
