function logPageView(title) {
    var pageViewData = {
        title  : title || document.title,
        url    : document.location.origin +
                 document.location.pathname
    };

    // console.log("Logging page view:");
    // console.log(pageViewData);

    $.post("https://page-logger.herokuapp.com/api/pageview", pageViewData, function() {
        // console.log(pageViewData.title + " logged - no errors");
    });
};
