var PetitionModalController = BaseModalController.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: '',
    petitionId: null,

    elements: {
        'form': 'form'
    },

    events: {
    },

    model: null,

    
    init: function(data) {
        this.with_bind(notifications.campaign, 'change',this.render.bind(this));
        this.render();
        return this;
    },

    render: function() {

        if (!notifications.campaign.isInitialized())
            return this.html(notifications.render_template('loading_modal'));

        var petitions = notifications.campaign.get('actions').get('petitions');
        this.model = petitions.get(this.petitionId);

        console.log('petition: ', this.model.toJSON());

        data = {};
        var html = notifications.render_template('petition_modal', data);
        this.html(html);

        this.render_title(this.form);
        this.render_hidden_fields(this.form);

        if (this.model.get('letter'))
            this.track_subcontroller('letter', function() {
                return new PetitionLetterController({
                    inject: this.form,
                    model: this.model.get('letter')
                });
            }.bind(this));

        var text_fields = this.model.get('fields').filter(function(m) {
            return m.get('type') == 'text';
        });

        // JL NOTE ~ Only support those petitions with 4 text fields for now
        if (text_fields.length == 4)
            this.track_subcontroller('fields', function() {
                return new PetitionFieldsFourController({
                    inject: this.form,
                    collection: this.model.get('fields'),
                    disclosure: this.model.get('disclosure'),
                    privacy_policy: notifications.campaign.get_privacy_policy()
                });
            }.bind(this));

        this.track_subcontroller('privacy_notice', function() {
            return new PrivacyNoticeController({
                action_host: this.model.get('endpoint')
            });
        }.bind(this));

        return this;
    }
});

