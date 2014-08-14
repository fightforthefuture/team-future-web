var AccountsNavBarDropdownController = Composer.Controller.extend({
    inject: '#nav_right',
    tag: 'li',
    el: false,
    template: 'accounts_nav_bar_dropdown',

    elements: {
        
    },

    events: {
        'click a': 'handle_dropdown'
    },

    _tmp_data: false,

    
    init: function(data)
    {
        this.render();
        
        return this;
    },


    render: function()
    {
        var html = notifications.render_template(this.template, data);
        this.html(html);

        return this;
    },

    handle_dropdown: function(e) {
        /*
        e.preventDefault();
        return false;
        */
    }
});

