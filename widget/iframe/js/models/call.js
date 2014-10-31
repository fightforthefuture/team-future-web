var Call = Composer.RelationalModel.extend({
    defaults: {
        "title": "",
        "disclosure": "",
        "privacy_policy": "http://localhost"
    },
    relations: {
        fields: {
            collection: Fields
        }
    }
});
var Calls = Composer.Collection.extend({
    model: Call,

    get: function(call_id) {

        if (this.models().length == 0)
            throw 'Unable to retrieve calls - none defined for campaign.';

        if (call_id)
            return this.find_by_id(call_id);
        else
            return this.models()[0];
    }
});