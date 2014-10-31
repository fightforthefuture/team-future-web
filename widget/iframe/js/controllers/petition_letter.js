var PetitionLetterController = Composer.Controller.extend({
    elements: {
        'textarea': 'letterText'
    },

    events: {
    },

    model: null,

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        var html = notifications.render_template(
            'petition_letter',
            this.model.toJSON()
        );
        this.html(html);

        setTimeout(function() {
            $(this.letterText).expanding();
        }.bind(this), 10);

        return this;
    }
});

