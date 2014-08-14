var AccountsEditController = Composer.Controller.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: 'accounts',

    elements: {
        
    },

    events: {

    },

    _tmp_data: false,

    
    init: function(data)
    {
        this.with_bind(notifications.account, 'change:addon_data', this.render.bind(this));
        this.render();
        
        return this;
    },


    render: function()
    {
        data = {}



        console.log('addon_data: ', notifications.account.get('addon_data'));
        if (!notifications.account.get('addon_data').access_token)
        {
            var html = notifications.render_template('pages_loading', data);
        }
        else
        {
            var html = notifications.render_template('accounts_edit', data);
        }

        
        this.html(html);

        return this;
    },
});

