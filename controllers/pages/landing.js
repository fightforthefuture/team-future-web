var PagesLandingController = Composer.Controller.extend({
    inject: notifications.main_container_selector,
    el: false,
    template: 'pages_home',
    className: 'pages',

    elements: {
        
    },

    events: {

    },

    _tmp_data: false,

    
    init: function(data)
    {
        console.log('data: ', this.id);
        this.render();
        
        return this;
    },


    render: function()
    {
        data = {
            id: this.id
        }

        var html = notifications.render_template(this.template, data);
        this.html(html);

        if (notifications.account.get('addon_exists') == false)
            this.track_subcontroller('download_button', function() {
                return new DownloadButtonController({
                    style: 'big',
                    inject: '.download'
                });
            });

        return this;
    },
});

