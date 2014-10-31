var Modal = Composer.Model.extend({
    defaults: {
        "title": ""
    }
});
var Modals = Composer.Collection.extend({
    model: Modal,

    get: function(modal_id) {

        if (this.models().length == 0)
            throw 'Unable to retrieve modals - none defined for campaign.';

        if (modal_id)
            return this.find_by_id(modal_id);
        else
            return this.models()[0];
    }
});