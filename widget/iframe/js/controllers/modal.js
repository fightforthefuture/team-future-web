var ModalController = BaseModalController.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: '',
    modalId: null,

    elements: {
        '.modal': 'modal'
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

        var modals = notifications.campaign.get('actions').get('modals');
        this.model = modals.get(this.modalId);

        data = {};
        var html = notifications.render_template('modal', data);
        this.html(html);

        this.render_title(this.modal);
        this.render_subtitle(this.modal);
        this.render_content(this.modal);
        this.render_sharing_links(this.modal);
        this.render_bottom_content(this.modal);

        return this;
    }
});

