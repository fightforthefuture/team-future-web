var PagesController =   Composer.Controller.extend({
    inject: notifications.main_container_selector,
    className: 'pages',

    template: 'pages_home',

    cur_controller: false, 

    init: function()
    {
        this.bind('onroute', this.on_route.bind(this));
        this.bind('preroute', this.pre_route.bind(this));
        this.bind('route', this.pre_load.bind(this));
        this.bind('loaded', this.post_load.bind(this));
    },

    release: function()
    {
        this.release_current();
        this.unbind();
        return this.parent();
    },

    on_route: function(url)
    {
    },

    pre_route: function(url)
    {
        // scroll to the top of the window (but ONLY if we're not in a modal).
        var last    =   (notifications.last_url || window.location.pathname).replace(/\-\-.*/, '');
        var cur     =   url.replace(/\-\-.*/, '');
        if(last != cur)
        {
            // this variable is read by the pages controller on post_load to see
            // if we should scroll to the top after a trigger('loaded') event.
            // if we did the scroll here, it would happen before the page content
            // changes and would be confusing.
            notifications.scroll_to_top =   true;
        }
    },

    pre_load: function()
    {
        this.page_loading(true);
    },

    post_load: function()
    {
        // unhide body after initial HTML has loaded
        $(document.body).removeClass('initial');

        // this is delayed to prevent a race condition where the "route" event
        // fires after the "loaded" event
        setTimeout(function() { this.page_loading(false); }.bind(this), 200);

        // scroll_to_top is set in the notifications::route_callback function in notifications.js
        //console.log('scroll');
        if(notifications.scroll_to_top)
        {
            window.scrollTo(0, 0);
            notifications.scroll_to_top =   false;
        }

    },

    load: function(cls, data, options)
    {
        data || (data = {});
        options || (options = {});

        if(typeof(cls) == 'string')
        {
            var cls =   window[cls];
        }

        // load the controller, setting is as the current controller for the page.
        // this helps us track and release it later on
        if(options.keep_current && cls == this.cur_controller.$constructor)
        {
            Object.each(data, function(v, k) {
                this.cur_controller[k]  =   v;
            }, this);
            this.cur_controller.init();
        }
        else
        {
            this.release_current();
            this.cur_controller =   new cls(data, {clean_injection: true});
        }

        if(!options.skip_loaded_event)
        {
            // trigger the loaded event unless asked not to (presumably by the
            // handler). also, delay the event just to catch any last-minute
            // async issues.
            setTimeout(function() {
                this.trigger('loaded');
            }.bind(this), 1);
        }

        // return the controller
        return this.cur_controller;
    },

    load_static: function(tpl, data)
    {
        data || (data = {});

        this.release_current();

        this.template   =   tpl;
        this.render(data);

        // technically does the same thing, and faster.
        $(notifications.main_container_selector).append(this.el);

        this.trigger('loaded');
    },

    render: function(data)
    {
        data || (data = {});

        var html = notifications.render_template(this.template, data);
        this.html(html);

        return this;
    },

    /**
     * if there is a controller currently being displayed through the pages system,
     * release it and nullify the reference to it.
     */
    release_current: function()
    {
        // clear title so it doesn't persist across pages when the target page
        // doesn't set it
        notifications.set_title('');

        if(!this.cur_controller) return false;
        this.cur_controller.release();
        this.cur_controller =   false;
        return true;
    },

    page_loading: function(yesno)
    {
        var yesno   =   !!yesno;
        if(yesno)
        {
            $(document.html).addClass('loading');
        }
        else
        {
            $(document.html).removeClass('loading');
        }
    }
});