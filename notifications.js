var notifications = {

    // base window title
    base_window_title: 'Team Future!',

    // holds the DOM object that turtl does all of its operations within
    main_container_selector: '#main',

    last_url: '',

    // tells the pages controller whether or not to scroll to the top of the
    // window after a page load
    scroll_to_top: true,

    router: null,

    // a place to reference composer controllers by name
    controllers: {},

    // will hold the user's account
    account: false,

    initialized: false,

    _tmp: {},

    set_title: function(title)
    {
        var escape_regexp_chars = function(str) {
            return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        };
        var regex   =   new RegExp('(\\s*\\|\\s*'+escape_regexp_chars(notifications.base_window_title)+')*(\\s*\\|)?$', 'g');
        title       =   title.replace(regex, '');
        if(title == '') title = this.base_window_title;
        else title = title + ' | ' + this.base_window_title;
        document.title  =   title;
    },

    init: function() 
    {
        this.account = new Account();

        this.load_controller('pages', PagesController);
        this.load_controller('nav_bar', AccountsNavBarController);

        var router = new Composer.Router(routes);
        router.bind_links({
            exclude_class: 'external'
        });
        router.bind('fail', function(err) {
            console.log('route: fail: ', err);
        });
        this.router = router;

        addon_io.call('are_you_there', {}, function(response) {
            console.log('addon is present: ', response);
        });

        if (this._tmp.addon_exists)
            this.activate_addon();

        this.initialized = true;
    },

    load_controller: function(name, controller, params, options)
    {
        options || (options = {});

        if(this.controllers[name]) return this.controllers[name];

        // lol this is my comment.
        this.controllers[name]  =   new controller(params, options);
        return this.controllers[name];
    },

    render_template: function(template, data)
    {
        console.log('template: ', template)
        return _.template($('#'+template).html(), data);
    },

    set_addon_data: function(data)
    {
        this._tmp.addon_exists = true;
        this._tmp.addon_data = data;
    },

    activate_addon: function()
    {
        console.log('Activating add-on functionality!');

        this.account.activate_addon(this._tmp.addon_data);

        delete this._tmp.addon_exists;
        delete this._tmp.addon_data;
    },

    route: function(url, options)
    {
        this.router.route(url, options);
    },
}
document.addEventListener('notifications_add_on_message', function(e) {  
    console.log('app received message from content script: ', e);
    switch (e.detail.msg_type) {
        case 'activate':
            notifications.set_addon_data(e.detail.data);

            if (notifications.initialized)
                notifications.activate_addon();

            break;

        case 'put_access_token':

            if (!notifications.account)
                return false;
            
            notifications.account.set_access_token(e.detail.data.access_token);

            break;

        case 'open_settings':
            
            notifications.route('/account');

            break;
    }
});
$(function() {
    notifications.init();
    $(".dropdown-toggle").dropdown();
});