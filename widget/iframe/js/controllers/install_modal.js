var InstallModalController = Composer.Controller.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: '',

    elements: {
    },

    events: {
        'click a.install': 'install',
        'click a.cancel': 'cancel'
    },

    init: function(data) {

        this.render();
        return this;
    },


    render: function() {

        data = {}
        var html = notifications.render_template('install_modal', data);
        this.html(html);

        return this;
    },

    install: function(e) {
        if (e)
            e.preventDefault();

        switch (this.get_browser()) {
            case 'Chrome':
                console.log('Trying to install from webstore')
                chrome.webstore.install();

                break;

            case 'Firefox':

                this.track_subcontroller('instructions', function() {
                    return new InstructionInstallFirefoxController({});
                }.bind(this));

                var params = {
                    "Team Future for Firefox": {
                        URL: '/downloads/xpi/team_future.0.0.2.xpi',  
                        IconURL: '/images/download/teamfuture_32x32.png',
                        
                        toString: function () { return this.URL; }
                    }
                };
                InstallTrigger.install(params);

                break;

            default:
                alert('your browser is not supported lol');
                break;
        }
    },

    cancel: function(e) {
        if (e)
            e.preventDefault();

        notifications.closeOverlay();
    },

    get_browser: function() {
        if (window.chrome)
            return 'Chrome';
        else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            return 'Firefox';
        else
            return 'Other';
    }

});

