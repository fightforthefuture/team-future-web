var pages = {
    home: function()
    {
        notifications.controllers.pages.load(PagesLandingController, {});
    },

    developers: function()
    {
        notifications.controllers.pages.load_static('pages_developers', {});
    },

    welcome: function()
    {
        notifications.controllers.pages.load_static('pages_welcome', {});
    }
}