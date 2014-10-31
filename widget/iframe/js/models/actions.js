var Actions = Composer.RelationalModel.extend({
    relations: {
        petitions: {
            collection: Petitions
        },
        modals: {
            collection: Modals
        },
        calls: {
            collection: Calls
        }
    }
});