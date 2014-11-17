var CallModalController = BaseModalController.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: '',
    callId: null,

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

        var calls = notifications.campaign.get('actions').get('calls');
        this.model = calls.get(this.callId);

        console.log('fields: ', this.model.get('fields'));

        data = {};
        var html = notifications.render_template('call_modal', data);
        this.html(html);

        this.render_title(this.form);
        this.render_subtitle(this.form);
        this.render_content(this.form);
        this.render_hidden_fields(this.form);
        this.render_text_fields(this.model.get('fields'), this.form);
        this.render_buttons(this.model.get('fields'), this.form);
        this.render_sharing_links(this.form);
        this.render_bottom_content(this.form);

        this.track_subcontroller('privacy_notice', function() {
            return new PrivacyNoticeController({
                action_host: this.model.get('endpoint')
            });
        }.bind(this));

        return this;
    }
});

