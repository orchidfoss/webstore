(function (exports) {
  "use strict";

  var slideshowList = [
    {
      background: 'images/unified.png',
      title: 'slideshow-store-title',
      detail: 'slideshow-store-detail',
      linkTo: '#'
    },
    {
      background: 'images/libremedia_bg.svg',
      wordmark: 'images/libremedia_wordmark.svg',
      detail: 'slideshow-libremedia-detail',
      linkTo: 'https://sites.google.com/view/libremedia/home',
      linkText: 'visit-website'
    },
    {
      background: 'https://source.unsplash.com/random',
      title: 'slideshow-unsplash-title',
      detail: 'slideshow-unsplash-detail',
      linkTo: 'https://www.unsplash.com/',
      linkText: 'visit-website'
    },
    {
      background: 'images/purple.png',
      wordmark: 'images/firefox.svg',
      detail: 'slideshow-firefox-detail',
      linkTo: 'https://www.mozilla.org/',
      linkText: 'visit-website'
    }
  ];

  var slideshowContainer = document.getElementById('slideshow');
  var slideshowPosters = slideshowContainer.querySelector('.holder');
  var backButton = slideshowContainer.querySelector('.controls .back');
  var forwardButton = slideshowContainer.querySelector('.controls .forward');
  var slideshowDots = slideshowContainer.querySelector('.dots');

  slideshowList.forEach((slideshow, index) => {
    var element = document.createElement('div');
    element.classList.add('slideshow');
    if (index == 0) {
      element.classList.add('current');
    }
    slideshowPosters.appendChild(element);

    var background = document.createElement('img');
    background.src = slideshow.background;
    element.appendChild(background);

    var context = document.createElement('div');
    element.appendChild(context);

    if (slideshow.wordmark) {
      var wordmark = document.createElement('img');
      wordmark.src = slideshow.wordmark;
      context.appendChild(wordmark);
    }

    if (slideshow.title) {
      var title = document.createElement('h1');
      title.dataset.l10nId = slideshow.title;
      context.appendChild(title);
    }

    if (slideshow.detail) {
      var detail = document.createElement('p');
      detail.dataset.l10nId = slideshow.detail;
      context.appendChild(detail);
    }

    if (slideshow.linkTo) {
      var link = document.createElement('a');
      link.href = slideshow.linkTo;
      link.target = '_blank';
      if (slideshow.linkText) {
        link.dataset.l10nId = slideshow.linkText;
      } else {
        link.dataset.l10nId = 'learn-more';
      }
      context.appendChild(link);
    }

    var dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
      var selectedSlideshow = slideshowPosters.querySelector('.slideshow.current');
      if (selectedSlideshow) {
        selectedSlideshow.classList.remove('current');
      }

      var selectedDot = slideshowDots.querySelector('.dot.active');
      if (selectedDot) {
        selectedDot.classList.remove('active');
      }

      element.classList.add('current');
      dot.classList.add('active');
    });
    if (index == 0) {
      dot.classList.add('active');
    }
    slideshowDots.appendChild(dot);
  });

  setInterval(() => {
    var selectedSlideshow = slideshowPosters.querySelector('.slideshow.current');
    if (selectedSlideshow) {
      selectedSlideshow.classList.remove('current');
    }

    var selectedDot = slideshowDots.querySelector('.dot.active');
    if (selectedDot) {
      selectedDot.classList.remove('active');
    }

    if (selectedSlideshow.nextElementSibling) {
      selectedSlideshow.nextElementSibling.classList.add('current');
    } else {
      slideshowPosters.children[0].classList.add('current');
    }

    if (selectedDot.nextElementSibling) {
      selectedDot.nextElementSibling.classList.add('active');
    } else {
      slideshowDots.children[0].classList.add('active');
    }
  }, 4000);

  backButton.addEventListener('click', () => {
    var selectedSlideshow = slideshowPosters.querySelector('.slideshow.current');
    if (selectedSlideshow) {
      selectedSlideshow.classList.remove('current');
    }

    var selectedDot = slideshowDots.querySelector('.dot.active');
    if (selectedDot) {
      selectedDot.classList.remove('active');
    }

    if (selectedSlideshow.previousElementSibling) {
      selectedSlideshow.previousElementSibling.classList.add('current');
    } else {
      slideshowPosters.children[slideshowPosters.children.length - 1].classList.add('current');
    }

    if (selectedDot.previousElementSibling) {
      selectedDot.previousElementSibling.classList.add('active');
    } else {
      slideshowDots.children[slideshowDots.children.length - 1].classList.add('active');
    }
  });

  forwardButton.addEventListener('click', () => {
    var selectedSlideshow = slideshowPosters.querySelector('.slideshow.current');
    if (selectedSlideshow) {
      selectedSlideshow.classList.remove('current');
    }

    var selectedDot = slideshowDots.querySelector('.dot.active');
    if (selectedDot) {
      selectedDot.classList.remove('active');
    }

    if (selectedSlideshow.nextElementSibling) {
      selectedSlideshow.nextElementSibling.classList.add('current');
    } else {
      slideshowPosters.children[0].classList.add('current');
    }

    if (selectedDot.nextElementSibling) {
      selectedDot.nextElementSibling.classList.add('active');
    } else {
      slideshowDots.children[0].classList.add('active');
    }
  });
})(window);
