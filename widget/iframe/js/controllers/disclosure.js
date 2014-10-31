var DisclosureController = Composer.Controller.extend({
    elements: {
    },

    events: {
    },

    disclosure: '',
    privacy_policy: '',
    tag: 'p',
    className: 'disclosure',

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        data = {
            disclosure: this.disclosure,
            privacy_policy: this.privacy_policy
        };
        this.html(notifications.render_template('disclosure', data));

        return this;
    }
});

