var Campaign = Composer.RelationalModel.extend({
    relations: {
        actions: {
            model: Actions
        }
    },

    defaults: {
        initialized: false
    },

    init: function() {
    },

    isInitialized: function() {
        return this.get('initialized');
    },

    activate: function(data) {
        this.set(data, {silent: true});

        /*
        if (this.get('locales'))
        {
            this.set(this.get('locales').es, {upsert: true, silent: true});
            // console.log('hurk durk: ', this.get('locales').es);
        }
        */
        //alert('trol');
        //console.log('merged model: ', this.toJSON());

        this.handle_locale();

        this.set({ initialized: true});
    },

    get_privacy_policy: function() {
        if (this.get('org') && this.get('org').privacy_url)
            return this.get('org').privacy_url;
    },

    handle_locale: function(options) {
        options || (options = {});

        var possible_locales    = this.get('locales', []);
        var my_locale           = locale.get_chosen();
        var my_base_locale      = my_locale.substr(0, 2);

        if (
            !this.get('default_locale')
            ||
            possible_locales.length == 0
            ||
            my_locale == this.get('default_locale') // no point doing the work
        ) {
            return;
        }

        console.log('handle_locale: ', this.id());
        console.log('    my_locale: ', my_locale);
        console.log('    my_base_locale: ', my_base_locale);

        // start with the original data
        var localized = this.toJSON();

        // we don't want people doing anything silly with the overrides
        var sanitize = function(obj) {
            if (typeof obj['org'] != "undefined")
                delete obj['org'];

            if (typeof obj['via'] != "undefined")
                delete obj['via'];

            return obj;
        };

        // then build up any catch-all or generally applicable language
        var base_language_strings = null;

        for (var prop in possible_locales)
        {
            if (
                possible_locales.hasOwnProperty(prop)
                &&
                prop.substr(0, 2) == my_base_locale
                &&
                (
                    (
                        typeof possible_locales[prop].catchall != "undefined"
                        &&
                        possible_locales[prop].catchall
                    )
                    ||
                    base_language_strings == null
                )
            )
            {
                console.log('    found catch-all language: ', prop);
                base_language_strings = possible_locales[prop];
            }
        }

        if (base_language_strings)
            localized = $.extend(true, localized, 
                sanitize(base_language_strings));
        
        // finally override with locales that precisely match the given locale
        if (typeof possible_locales[my_locale] != "undefined")
        {
            console.log('    found EXACT language: ', my_locale);
            localized = $.extend(true, localized,
                sanitize(possible_locales[my_locale]));
        }

        console.log('    setting language: ' ,localized);

        this.set(localized, {silent: true});
    }
});