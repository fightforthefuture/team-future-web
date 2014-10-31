var SubtitleController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    subtitle: '',
    tag: 'h2',

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = {subtitle: this.subtitle}
        var html = notifications.render_template('subtitle', data);
        this.html(html);

        return this;
    }
});

