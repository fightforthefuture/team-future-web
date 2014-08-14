var MessagesViewController = Composer.Controller.extend({
    inject: notifications.main_container_selector,
    el: false,
    template: 'messages_view',

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

        return this;
    },
});

