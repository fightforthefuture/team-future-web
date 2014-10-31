var HiddenFieldController = Composer.Controller.extend({
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
        this.html(notifications.render_template('hidden_field', data));

        return this;
    }
});

