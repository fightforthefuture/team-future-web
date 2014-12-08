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
        console.log('merged model: ', this.toJSON());
        this.set({ initialized: true});
    },

    get_privacy_policy: function() {
        if (this.get('org') && this.get('org').privacy_url)
            return this.get('org').privacy_url;
    }
});