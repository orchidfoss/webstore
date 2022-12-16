(function (exports) {
  "use strict";

  var categoryIcons = {
    communication: "sms",
    education: "help",
    games: "play",
    health: "heart",
    multimedia: "video",
    news: "tab-previews",
    search: "search",
    social: "user",
    travel: "airplane",
    utility: "permissions",
    langpack: "languages",
    addons: "addons",
    miscellaneous: "miscellaneous-select"
  };
  var isListEnabled = false;

  exports.setWebappCategory = function setWebappCategory(id, app) {
    if (document.querySelector('[data-category="' + id + '"]')) {
      var container = document.querySelector(
        '[data-category="' + id + '"] > .webapps'
      );
      container.appendChild(app);
    } else {
      var listItem = document.createElement("li");
      categories.appendChild(listItem);

      var link = document.createElement("a");
      link.href = "#category-" + id;
      link.dataset.l10nId = "category-" + id;
      link.dataset.icon = categoryIcons[id];
      link.onclick = () => {
        var selected = document.querySelector(
          '#sidebar [aria-selected="true"]'
        );
        if (selected) {
          selected.setAttribute("aria-selected", null);
        } else {
          allAppsButton.setAttribute("aria-selected", null);
        }
        link.setAttribute("aria-selected", true);
        openContentView("content", false);
      };
      listItem.appendChild(link);

      var element = document.createElement("div");
      element.id = "category-" + id;
      element.dataset.category = id;
      element.classList.add("webapps-group");
      webapps.appendChild(element);

      document.addEventListener("wheel", () => {
        if (exports.selectedView == "content") {
          if (
            element.getBoundingClientRect().top <=
            window.innerHeight - (element.getBoundingClientRect().height - 1)
          ) {
            var selected = document.querySelector(
              '#sidebar [aria-selected="true"]'
            );
            if (selected && link.isConnected) {
              selected.setAttribute("aria-selected", null);
              link.setAttribute("aria-selected", true);
            }
          }
        }
      });
      document.addEventListener("touchmove", () => {
        if (exports.selectedView == "content") {
          if (
            element.getBoundingClientRect().top <=
            window.innerHeight - (element.getBoundingClientRect().height - 1)
          ) {
            var selected = document.querySelector(
              '#sidebar [aria-selected="true"]'
            );
            if (selected && link.isConnected) {
              selected.setAttribute("aria-selected", null);
              link.setAttribute("aria-selected", true);
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
        expandButton.classList.toggle("active");
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
  };

  exports.createWebappIcon = function createWebappIcon(data, id) {
    var element = document.createElement("a");
    element.href = "?webapp=" + id;
    element.classList.add("webapp");
    element.onclick = (evt) => {
      evt.preventDefault();
      showWebappInfo(data, id, element);
    };
    setWebappCategory(data.categories[0], element);

    OrchidServices.get("profile/" + OrchidServices.userId()).then((data) => {
      if (data.metadata.is_moderator) {
        var modRemove = document.createElement("button");
        modRemove.classList.add("mod-remove");
        modRemove.dataset.icon = "closecancel";
        modRemove.onclick = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          var confirmPrompt = confirm(navigator.mozL10n.get('mod-removeApp'));
          if (confirmPrompt) {
            OrchidServices.remove("webstore/" + id);
            element.remove();
          }
        };
        element.appendChild(modRemove);
      }
    });

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
    context.appendChild(title);

    var titleSpan = document.createElement("span");
    titleSpan.textContent = data.name;
    title.appendChild(titleSpan);

    if (titleSpan.offsetWidth >= title.offsetWidth) {
      title.classList.add("marquee");
      titleSpan.style.animationDuration =
        titleSpan.textContent.length * 200 + "ms";
    }

    var author = document.createElement("a");
    author.classList.add("author");
    author.target = '_blank';
    context.appendChild(author);

    OrchidServices.getWithUpdate("profile/" + data.author_id, function (udata) {
      author.innerHTML = `<span>${udata.username}</span>`;
      author.href = "/profile/?user_id=" + udata.token;
    });

    var categories = document.createElement("div");
    categories.classList.add("categories");
    data.categories.forEach((item) => {
      var category = document.createElement("span");
      category.dataset.l10nId = "category-" + item;
      categories.appendChild(category);
    });
    context.appendChild(categories);

    var pricing = document.createElement("span");
    pricing.classList.add("pricing");
    if (data.price == 0) {
      pricing.dataset.l10nId = "pricing-free";
      pricing.dataset.l10nArgs = "";
    } else {
      pricing.dataset.l10nId = "pricing-paid";
      pricing.dataset.l10nArgs = '{"n": "' + data.price + '"}';
    }
    context.appendChild(pricing);

    var rating = document.createElement("span");
    rating.classList.add("rating");
    rating.dataset.icon = "bookmarked";

    var sum = 0;
    for (var i = 0; i < data.comments.length; i++) {
      sum += parseInt(data.comments[i].rating * 5, 10); //don't forget to add the base
    }
    var avg = sum / data.comments.length;

    rating.dataset.l10nId = "starRating-outOf";
    rating.dataset.l10nArgs =
      '{"n": "' + (Math.round(avg * 10) / 10).toFixed(1) + '"}';
    context.appendChild(rating);

    var nav = document.createElement("nav");
    element.appendChild(nav);

    var installButton = document.createElement("button");
    installButton.classList.add("install-button");
    installButton.dataset.l10nId = "webapp-install";
    nav.appendChild(installButton);
  };

  exports.showWebappInfo = function showWebappInfo(data, id, card) {
    var sidebar = document.getElementById("sidebar");
    var toggleSidebarButton = document.getElementById("toggle-sidebar-button");
    var backButton = document.getElementById("back-button");
    var content = document.getElementById(exports.selectedView);
    var webapp = document.getElementById("webapp");
    var webappHeader = document.getElementById("webapp-header");
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
    var webappDescriptionExpandButton = document.getElementById("webapp-description-expand");
    var webappReleaseDate = document.getElementById("webapp-release-date");
    var webappLanguages = document.getElementById("webapp-languages");
    var webappContacts = document.getElementById("webapp-contacts");
    var webappTerms = document.getElementById("webapp-terms");
    var webappSize = document.getElementById("webapp-size");
    var webappDownloads = document.getElementById("webapp-downloads");
    var webappHasAds = document.getElementById("webapp-has-ads");
    var webappHasTracking = document.getElementById("webapp-has-tracking");
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
    var webappRatingGraphs = document.getElementById("webapp-rating-graphs");

    if (isHistoryEnabled) {
      addToHistory(id);
    }
    if (data.teaser_url) {
      webappBanner.src =
        data.teaser_url.replace("watch?v=", "embed/") +
        "?controls=0&autoplay=1&loop=1&ref=0&fs=0&modestbranding=0";
    }

    webappCard.classList.add("fade-in");
    webappCard.addEventListener("animationend", () => {
      webappCard.classList.remove("fade-in");
    });
    if (card) {
      var originX =
        card.getBoundingClientRect().left +
        card.getBoundingClientRect().width / 2;
      var originY =
        card.getBoundingClientRect().top +
        card.getBoundingClientRect().height / 2;
      webapp.style.transformOrigin = `${originX}px ${originY}px`;
    }

    webapp.classList.add("visible");
    webapp.ontransitionend = () => {
      sidebar.style.display = "none";
      toggleSidebarButton.style.display = "none";
      backButton.style.display = "block";
      content.classList.remove("visible");
    };

    window.history.pushState({ html: "", pageTitle: "" }, "", "?webapp=" + id);
    webapp.onscroll = () => {
      var oldHeight = webappHeader.getBoundingClientRect().height;
      var startY = webappBanner.parentElement.getBoundingClientRect().height;
      var scrolled = webapp.scrollTop >= startY;
      if (scrolled) {
        webappHeader.classList.add('visible');
        webappHeader.style.marginBottom = oldHeight + 'px';
        webappHeader.style.transform = 'translateY(' + ((webapp.scrollTop - startY) - 15) + 'px)';
      } else {
        webappHeader.classList.remove('visible');
        webappHeader.style.marginBottom = '';
        webappHeader.style.transform = 'translateY(0px)';
      }
    };

    backButton.onclick = () => {
      webapp.ontransitionend = null;
      document.body.classList.remove("app-header-shown");

      webappBanner.src = "";
      webappCard.classList.add("fade-out");
      webapp.onscroll = null;

      webappCard.classList.remove("fade-out");
      webapp.classList.remove("visible");
      sidebar.style.display = "block";
      toggleSidebarButton.style.display = "block";
      backButton.style.display = "none";
      content.classList.add("visible");
      window.history.pushState({ html: "", pageTitle: "" }, "", "?");
    };

    webappIcon.src = data.icon;
    webappIcon.onerror = () => {
      webappIcon.src = "images/default.svg";
    };

    if (data._l10n) {
      if (data._l10n[navigator.mozL10n.language.code]) {
        webappName.textContent = data._l10n[navigator.mozL10n.language.code].name;
      } else {
        webappName.textContent = data.name;
      }
    } else {
      webappName.textContent = data.name;
    }
    OrchidServices.getWithUpdate("profile/" + data.author_id, function (udata) {
      webappAuthor.innerHTML = `<span>${udata.username}</span>`;
      webappAuthor.href = "/profile/?user_id=" + udata.token;
      if (udata.metadata.is_verified) {
        webappAuthor.classList.add('verified');
      } else {
        webappAuthor.classList.remove('verified');
      }
    });

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

        webappAverageRating.dataset.l10nArgs =
          '{"n": "' + (Math.round(avg * 10) / 10).toFixed(1) + '"}';
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

      OrchidServices.get("webstore/" + id).then((data) => {
        if (data.downloads) {
          if (data.downloads.indexOf(OrchidServices.userId()) !== -1) {
            OrchidServices.set("webstore/" + id, {
              downloads: [...data.downloads, OrchidServices.userId()],
            });
          }
        } else {
          OrchidServices.set("webstore/" + id, {
            downloads: [OrchidServices.userId()],
          });
        }
      });
    };
    uninstallButton.onclick = () => {};
    uninstallButton.style.display = "none";
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

    webappScreenshots.classList.remove("end");
    webappScreenshots.classList.remove("center");
    webappScreenshots.classList.add("start");
    webappScreenshots.onscroll = () => {
      var left =
        document.dir == "rtl"
          ? webappScreenshots.scrollLeft * -1
          : webappScreenshots.scrollLeft;

      if (left <= 1) {
        webappScreenshots.classList.remove("end");
        webappScreenshots.classList.remove("center");
        webappScreenshots.classList.add("start");
      } else if (
        left >=
        webappScreenshots.scrollWidth - webappScreenshots.offsetWidth - 1
      ) {
        webappScreenshots.classList.remove("center");
        webappScreenshots.classList.remove("start");
        webappScreenshots.classList.add("end");
      } else {
        webappScreenshots.classList.remove("end");
        webappScreenshots.classList.remove("start");
        webappScreenshots.classList.add("center");
      }
    };

    webappDescription.innerText = data.description;
    webappDescription.classList.remove('maximized');
    webappDescriptionExpandButton.onclick = (evt) => {
      evt.preventDefault();
      webappDescription.classList.toggle('maximized');
      webappDescriptionExpandButton.classList.toggle('active');
      if (webappDescription.classList.contains("maximized")) {
        webappDescriptionExpandButton.children[0].dataset.l10nId = "show-less";
      } else {
        webappDescriptionExpandButton.children[0].dataset.l10nId = "show-more";
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    webappTags.innerHTML = '';
    data.tags.forEach((tag) => {
      var element = document.createElement('a');
      element.href = '?searchquery=' + tag + '&user=0';
      element.textContent = tag;
      webappTags.appendChild(element);
    });

    Comments("webstore/" + id, webappComments, true);
    OrchidServices.getWithUpdate("webstore/" + id, (data) => {
      webappCommentsHeader.dataset.l10nArgs =
        '{"n": "' + data.comments.length + '"}';
    });

    if (data.price == 0) {
      webappPricing.dataset.l10nId = "pricing-free";
      webappPricing.dataset.l10nArgs = "";
    } else {
      webappPricing.dataset.l10nId = "pricing-paid";
      webappPricing.dataset.l10nArgs = '{"n": "' + data.price + '"}';
    }

    webappAgeRating.children[0].src =
      "images/rating/" + data.age_rating + ".svg";
    webappAgeRating.children[1].dataset.l10nId = "ageRating-" + data.age_rating;

    if (data.download) {
      webappSize.dataset.l10nArgs =
        '{"n": "' +
        (data.download.length / 1024 / 1024).toFixed(2) +
        navigator.mozL10n.get("megabyte") +
        '"}';
    }
    webappDownloads.dataset.l10nArgs = '{"n": "' + (data.downloads.length || 0) + '"}';
    webappHasAds.dataset.l10nArgs =
      '{"n": "' +
      (data.has_ads
        ? navigator.mozL10n.get("does")
        : navigator.mozL10n.get("dosent")) +
      '"}';
    webappHasTracking.dataset.l10nArgs =
      '{"n": "' +
      (data.has_tracking
        ? navigator.mozL10n.get("does")
        : navigator.mozL10n.get("dosent")) +
      '"}';

    // Rating Graphs
    var fiveStarRaters = data.comments.filter((item) => item.rating == 1);
    var fourStarRaters = data.comments.filter((item) => item.rating == 0.8);
    var threeStarRaters = data.comments.filter((item) => item.rating == 0.6);
    var twoStarRaters = data.comments.filter((item) => item.rating == 0.4);
    var oneStarRaters = data.comments.filter((item) => item.rating == 0.2);

    var graph1 = webappRatingGraphs.querySelector(".graph-1");
    var graph2 = webappRatingGraphs.querySelector(".graph-2");
    var graph3 = webappRatingGraphs.querySelector(".graph-3");
    var graph4 = webappRatingGraphs.querySelector(".graph-4");
    var graph5 = webappRatingGraphs.querySelector(".graph-5");

    graph1
      .querySelector(".progress")
      .style.setProperty(
        "--progress",
        (fiveStarRaters.length / data.comments.length) * 100 + "%"
      );
    graph2
      .querySelector(".progress")
      .style.setProperty(
        "--progress",
        (fourStarRaters.length / data.comments.length) * 100 + "%"
      );
    graph3
      .querySelector(".progress")
      .style.setProperty(
        "--progress",
        (threeStarRaters.length / data.comments.length) * 100 + "%"
      );
    graph4
      .querySelector(".progress")
      .style.setProperty(
        "--progress",
        (twoStarRaters.length / data.comments.length) * 100 + "%"
      );
    graph5
      .querySelector(".progress")
      .style.setProperty(
        "--progress",
        (oneStarRaters.length / data.comments.length) * 100 + "%"
      );

    graph1.querySelector(".users").textContent = EnglishToArabicNumerals(
      fiveStarRaters.length +
        " (" +
        Math.round((fiveStarRaters.length / data.comments.length) * 100) +
        "%)"
    );
    graph2.querySelector(".users").textContent = EnglishToArabicNumerals(
      fourStarRaters.length +
        " (" +
        Math.round((fourStarRaters.length / data.comments.length) * 100) +
        "%)"
    );
    graph3.querySelector(".users").textContent = EnglishToArabicNumerals(
      threeStarRaters.length +
        " (" +
        Math.round((threeStarRaters.length / data.comments.length) * 100) +
        "%)"
    );
    graph4.querySelector(".users").textContent = EnglishToArabicNumerals(
      twoStarRaters.length +
        " (" +
        Math.round((twoStarRaters.length / data.comments.length) * 100) +
        "%)"
    );
    graph5.querySelector(".users").textContent = EnglishToArabicNumerals(
      oneStarRaters.length +
        " (" +
        Math.round((oneStarRaters.length / data.comments.length) * 100) +
        "%)"
    );

    webappReleaseDate.dataset.l10nArgs = '{"n": "' + EnglishToArabicNumerals(new Date(data.published_at).toLocaleDateString(navigator.mozL10n.language.code, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })) + '"}';

    webappLanguages.innerHTML = '';
    data.languages.forEach((lang) => {
      var element = document.createElement('a');
      element.href = '?langpack=' + lang.id;
      element.textContent = lang.name;
      webappLanguages.appendChild(element);
    });

    webappContacts.innerHTML = '';
    data.contacts.forEach((item) => {
      var protocol = item.type == 'tel' ? 'tel:' : 'mailto:';

      var element = document.createElement('a');
      element.href = protocol + item.value;
      element.textContent = item.value;
      webappContacts.appendChild(element);
    });

    webappTerms.innerHTML = '';
    data.terms.forEach((item) => {
      var element = document.createElement('a');
      element.href = item.href;
      element.dataset.l10nId = 'webapp-terms-' + item.type;
      webappTerms.appendChild(element);
    });
  };
})(window);
