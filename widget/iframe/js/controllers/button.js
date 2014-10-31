var ButtonController = Composer.Controller.extend({
    elements: {
        'click button': 'clicked'
    },

    events: {
    },
    tag: 'button',

    model: null,

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = this.model.toJSON();
        this.html(notifications.render_template('button', data));

        return this;
    },

    clicked: function(e) {
        e.preventDefault();
    }
});

