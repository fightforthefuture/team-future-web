var Campaign = Composer.RelationalModel.extend({
    relations: {
        actions: {
            model: Actions
        }
    },

    defaults: {
        initialized: false
    },

    isInitialized: function() {
        return this.get('initialized');
    },

    activate: function(data) {
        this.set({ initialized: true}, {silent: true});
        this.set(data);
    }
});