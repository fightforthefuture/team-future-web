var Petition = Composer.RelationalModel.extend({
    defaults: {
        "title": "Petition",
        "disclosure": "",
        "privacy_policy": "http://localhost"
    },
    relations: {
        letter: {
            model: Letter
        },
        fields: {
            collection: Fields
        }
    }
});
var Petitions = Composer.Collection.extend({
    model: Petition,

    get: function(petition_id) {

        if (this.models().length == 0)
            throw 'Unable to retrieve petitions - none defined for campaign.';

        if (petition_id)
            return this.find_by_id(petition_id);
        else
            return this.models()[0];
    }
});