var Account  =   Composer.Model.extend({
    defaults: {
        name: 'Valued Customer',
        addon_exists: false,
        addon_data: {}
    },

    init: function(options) {
    },

    activate_addon: function(data) {
        console.log('activating add-on in account model! ', data.settings);
        this.set(
            {
                addon_exists: true,
                addon_data: data.settings
            }
        );
        if (!data.access_token)
            this.get_access_token();
    },

    get_access_token: function() {
        console.log('Getting access token...');

        // the add-on will send this back down via a direct message
        addon_io.call('get_access_token', {});
    },

    set_access_token: function(token) {
        this.set_addon_data_val('access_token', token);

        console.log('Saved access token in account model: ', token, this.get('addon_data'));
    },

    set_addon_data_val: function(prop, val) {

        var addon_data = this.get('addon_data');
        addon_data[prop] = val;
        this.set({ addon_data: addon_data });
        this.trigger('change:addon_data');
        
        return this;
    }

});