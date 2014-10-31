var CheckboxController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    model: null,
    className: 'checkbox',

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = this.model.toJSON();
        this.html(notifications.render_template('checkbox', data));

        return this;
    }
});

