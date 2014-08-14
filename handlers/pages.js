var pages = {
    home: function()
    {
        notifications.controllers.pages.load(PagesLandingController, {});
    },

    welcome: function()
    {
        notifications.controllers.pages.load_static('pages_welcome', {});
    }
}