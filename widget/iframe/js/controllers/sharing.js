var SharingController = Composer.Controller.extend({
    elements: {
    },

    events: {
        'click a.twitter': 'click_twitter',
        'click a.facebook': 'click_facebook'
    },

    className: 'sharing',

    sharing: null,

    init: function(data) {
        this.sharing = notifications.campaign.get('sharing');
        
        if (!this.sharing)
            return false;

        this.render();
        return this;
    },


    render: function() {

        var html = notifications.render_template('sharing', this.sharing);
        this.html(html);

        return this;
    },

    click_twitter: function(e) {
        e.preventDefault();

        var text = encodeURIComponent(this.sharing.twitter.text);
        var url = encodeURIComponent(this.sharing.twitter.url);

        window.open('https://twitter.com/intent/tweet?url='+url+'&text='+text);
    },

    click_facebook: function(e) {
        e.preventDefault();

        var url = encodeURIComponent(this.sharing.facebook.url);

        window.open('https://www.facebook.com/sharer.php?u='+url);
    }
});

