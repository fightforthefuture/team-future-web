var ContentController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    content: '',
    className: 'content',
    tag: 'p',

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = {content: this.content}
        var html = notifications.render_template('content', data);
        this.html(html);

        return this;
    }
});

