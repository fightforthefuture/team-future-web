var PrivacyNoticeController = Composer.Controller.extend({
    inject: 'body',
    el: false,
    className: 'privacy_notice',

    elements: {
        
    },

    events: {

    },

    action_host: null,

   
    init: function(data)
    {
        this.format_action_host();
        this.render();
        return this;
    },

    format_action_host: function() {
        var h = this.action_host;

        h = h.replace('http://', '').replace('https://', '').replace('//', '');

        var slash_index = h.indexOf('/');
        if (slash_index != -1)
            h = h.substr(0, slash_index);
        

        this.action_host = h;
    },


    render: function()
    {
        data = {
            action_host: this.action_host
        };
        this.html(notifications.render_template('privacy_notice', data));

        setTimeout(function() {
            $(this.el).addClass('visible')
        }.bind(this), 200);

        return this;
    },
});

