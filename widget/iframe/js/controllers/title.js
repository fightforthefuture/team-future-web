var TitleController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    title: '',
    action: '',
    tag: 'h1',

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = {title: this.title, action: this.action}
        var html = notifications.render_template('title', data);
        this.html(html);

        return this;
    }
});

