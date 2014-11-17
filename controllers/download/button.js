var DownloadButtonController = Composer.Controller.extend({
    inject: null,   // overridden
    style: null,    // 'nav' | 'big'
    el: false,
    tag: 'li', 

    elements: {
        
    },

    events: {
        'click a': 'do_install'
    },

    _tmp_data: false,

    
    init: function(data)
    {
        this.render();
        
        return this;
    },


    render: function()
    { 
        console.log('RENDERING NAV BAR');

        data = {
            browser: this.get_browser()
        }

        switch(this.style) {
            case 'nav':

                if (data.browser == 'Other')
                    return console.log('Other browser not supported here :(');

                var template = 'download_button_nav'
                break;
            case 'big':

                var template = 'download_button_big'
                break;
        }

        var html = notifications.render_template(template, data);
        this.html(html);

        return this;
    },

    do_install: function(e) {

        e.preventDefault();

        switch (this.get_browser()) {
            case 'Chrome':
                console.log('Trying to install from webstore')
                chrome.webstore.install();

                break;

            case 'Firefox':

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


        return false;
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

