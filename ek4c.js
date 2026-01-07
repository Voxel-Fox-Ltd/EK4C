if(window.location.hostname == "ych.commishes.com") {
    if(window.location.pathname.startsWith("/category/")) {
        console.log("Starting EK4C on ych.commishes.com/category");
        YCHCategory.setup().then(() => {
            YCHCategory.main();
        });
    }
    else if(window.location.pathname.startsWith("/auction/")) {
        console.log("Starting EK4C on ych.commishes.com/auction");
        YCHAuction.setup();
    }
    else if(window.location.pathname.startsWith("/user/")) {
        console.log("Starting EK4C on ych.commishes.com/user");
        YCHUser.setup();
    }
}
else {
    console.log("EK4C: Not on a supported site, doing nothing.");
}
