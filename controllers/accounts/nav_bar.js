var AccountsNavBarController = Composer.Controller.extend({
    inject: '#nav',
    el: false,
    template: 'accounts_nav_bar',

    elements: {
        
    },

    events: {

    },

    _tmp_data: false,

    
    init: function(data)
    {
        console.log('data: ', this.id);

        this.with_bind(notifications.account, 'change:addon_exists', this.render.bind(this));

        this.render();
        
        return this;
    },


    render: function()
    {
        console.log('RENDERING NAV BAR');

        data = {
            id: this.id
        }

        var html = notifications.render_template(this.template, data);
        this.html(html);

        if (notifications.account.get('addon_exists') == false)
            this.track_subcontroller('right_nav', function() {
                return new DownloadButtonController({
                    style: 'nav',
                    inject: '#nav_right'
                });
            });
        else
            this.track_subcontroller('right_nav', function() {
                return new AccountsNavBarDropdownController();
            });


        return this;
    },
});

