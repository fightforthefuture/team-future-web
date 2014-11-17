var User = Composer.RelationalModel.extend({
    defaults: {
        "first_name": null,
        "last_name": null,
        "email": null,
        "street_address": null,
        "zip": null
    },

    populate: function() {
        if (this.storage_exists)
            this.set({
                "first_name":       localStorage.getItem("user.first_name"),
                "last_name":        localStorage.getItem("user.last_name"),
                "email":            localStorage.getItem("user.email"),
                "street_address":   localStorage.getItem("user.street_address"),
                "zip":              localStorage.getItem("user.zip"),
                "phone_number":     localStorage.getItem("user.phone_number"),
            }, {silent: true});
        return this;
    },

    set_autofill: function(field, val) {
        if (this.storage_exists)
            localStorage.setItem("user."+field, val);

        var data = {};
        data[field] = val;
        this.set(data);
    },

    storage_exists: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }
});
