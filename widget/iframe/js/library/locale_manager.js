var locale = {
    _chosen_locale: null,
    _strings: {},

    init: function() {

        if (!this.populate_strings('en-us'))
            throw "Missing default locale. WTF?";
    },

    populate_strings: function(locale) {

        if (this._chosen_locale == locale)
            return false;

        console.log('Locale populating: ', locale);

        var strings = this.inherit_strings(locale, locales);

        if (!strings)
            return false;

        for (var property in strings)
            if (strings.hasOwnProperty(property))
                this._strings[property] = strings[property];

        this._chosen_locale = locale;

        return true;
    },

    get: function(string) {

        if (typeof this._strings[string] != "undefined")
            return this._strings[string];

        return string;
    },

    get_chosen: function() {
        return this._chosen_locale;
    },

    get_subst: function(string, replacements) {
        if (typeof this._strings[string] == "undefined")
            return string;

        string = this._strings[string];

        for (var property in replacements)
            if (replacements.hasOwnProperty(property))
                string = string.replace('{'+property+'}',replacements[property])

        return string;
    },

    inherit_strings: function(locale, dataset) {

        var base_locale = locale.substr(0, 2);
        var strings = null;

        for (var property in dataset)
        {
            if (
                dataset.hasOwnProperty(property)
                &&
                property.substr(0, 2) == base_locale
                &&
                (
                    (
                        typeof dataset[property].catchall != "undefined"
                        &&
                        dataset[property].catchall
                    )
                    ||
                    strings == null
                )
            )
            {
                strings = dataset[property];
            }
        }

        if (strings == null)
            strings = {};

        if (typeof dataset[locale] != "undefined")
            for (var property in dataset[locale])
                if (dataset[locale].hasOwnProperty(property))
                    strings[property] = dataset[locale][property];

        return strings;
    }
}
locale.init();