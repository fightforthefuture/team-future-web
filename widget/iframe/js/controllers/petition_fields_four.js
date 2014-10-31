var PetitionFieldsFourController = BaseModalController.extend({
    elements: {
        '.fields': 'fields',
        '.submit_area': 'submit_area'
    },

    disclosure: '',
    privacy_policy: '',

    events: {
    },

    collection: null,

    init: function(data) {
        this.render();
        return this;
    },


    render: function() {
        var html = notifications.render_template(
            'petition_fields_four'
        );
        this.html(html);

        // Render text fields
        // ---------------------------------------------------------------------
        this.render_text_fields(this.collection, this.fields);

        // Render submit button(s)
        // ---------------------------------------------------------------------
        this.render_buttons(this.collection, this.submit_area);

        // Render Checkboxes
        // ---------------------------------------------------------------------
        var checkboxes = this.collection.filter(function(m) {
            return m.get('type') == 'checkbox';
        });

        for (var i = 0; i < checkboxes.length; i++)
            this.track_subcontroller('checkbox_'+i, function() {
                return new CheckboxController({
                    inject: this.submit_area,
                    model: checkboxes[i]
                });
            }.bind(this));

        // Render Disclosure
        // ---------------------------------------------------------------------
        if (this.disclosure)
            this.track_subcontroller('disclosure', function() {
                return new DisclosureController({
                    inject: this.submit_area,
                    disclosure: this.disclosure,
                    privacy_policy: this.privacy_policy
                });
            }.bind(this));
        

        return this;
    }
});

