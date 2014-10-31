var InstallModalController = Composer.Controller.extend({
    inject: notifications.main_container_selector,
    el: false,
    className: '',

    elements: {
    },

    events: {
        'click a.install': 'install'
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

    install: function() {

        // JL NOTE ~ Firefox only for now lol
        var xpi_url = '/downloads/xpi/team_future.'+FIREFOX_XPI_VER+'.xpi';
        window.location.href = xpi_url;

        this.track_subcontroller('instructions', function() {
            return new InstructionInstallFirefoxController({});
        }.bind(this));
    }
});

