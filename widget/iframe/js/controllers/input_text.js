var InputTextController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    model: null,

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = this.model.toJSON();
        this.html(notifications.render_template('input_text', data));

        return this;
    }
});

