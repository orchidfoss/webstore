(function (exports) {
  "use strict";

  exports.viewFunction['submit'] = () => {};

  var categories = new TagsInput({
    selector: "submit-categories",
    duplicate: false,
    max: 10,
  });

  var tags = new TagsInput({
    selector: "submit-tags",
    duplicate: false,
    max: 10,
  });

  function submit() {
    var object = {
      token: '(this will be randomly generated)',
      author_id: '(your user ID is hidden for privacy)',
      teaser_url: data.teaser_url,
      published_at: Date.now(),
      icon: data.icon,
      name: data.name,
      description: data.description,
      screenshots: data.screenshots,
      download: data.download,
      has_ads: data.has_ads,
      has_tracking: data.has_tracking,
      categories: categories.arr.map(element => {
        return element.toLowerCase();
      }),
      tags: tags.arr,
      age_rating: data.age_rating,
      price: data.price,
      comments: []
    }
  }
})(window);
