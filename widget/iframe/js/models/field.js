var Field = Composer.Model.extend({
    init: function() {
        
        if (this.get('autofill') && this.get('type') == 'text')
            this.set({value: notifications.user.get(this.get('autofill'))});

        return this;
    },

    id_key: 'name',
});
var Fields = Composer.Collection.extend({
    model: Field
});