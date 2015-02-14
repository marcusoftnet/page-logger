function logPageView() {
    var pageViewData = {
        title: document.title,
        url: document.url
    };

    console.log("Logging page view:");
    console.log(pageViewData);

    $.post("https://page-logger.herokuapp.com/api/pageview", pageViewData, function() {
        console.log(pageViewData.title + " logged - no errors");
    });
};