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

        data = {
            locale: {
                install_headline: locale.get('install_headline'),
                install_benefits: locale.get('install_benefits'),
                install_know: locale.get('install_know'),
                install_notifications: locale.get('install_notifications'),
                install_action: locale.get('install_action'),
                install_no: locale.get('install_no'),
                install_yes: locale.get('install_yes')
            }
        }
        var html = notifications.render_template('install_modal', data);
        this.html(html);

        return this;
    },

    install: function(e) {
        if (e)
            e.preventDefault();

        switch (this.get_browser()) {
            case 'Chrome':
                /*
                console.log('Trying to install from webstore')
                chrome.webstore.install();
                */
                notifications.triggerInstall();

                break;

            case 'Firefox':

                this.track_subcontroller('instructions', function() {
                    return new InstructionInstallFirefoxController({});
                }.bind(this));

                var params = {
                    "Team Future for Firefox": {
                        URL: '/downloads/xpi/team_future.0.0.4.xpi',   
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

