function logPageView() {
    var pageViewData = {
        title: document.title,
        url: document.url
    };

    $.post("https://page-logger.herokuapp.com/api/pageview", pageViewData, function() {
        console.log(pageViewData.title + " logged - no errors");
    });
};