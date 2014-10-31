var NotificationsHelper = {
    checkExists: function(options) {
        options || (options = {});
        options.yes || (options.yes = function() { });
        options.no || (options.no = function() { });

        var timer = null;

        addon_io.call('are_you_there', {}, function(response) {

            clearTimeout(timer);
            console.log('addon is present: ', response);
            options.yes(response);
        });

        timer = setTimeout(function() {
            console.log('addon is not present!');
            options.no();
        }, 1000);
    }
}

$(function() {
    checkAddonExists();
});
var checkAddonExists = function() {
    NotificationsHelper.checkExists({
        yes: function(data) {
            console.log('yay');
        },
        no: function() {
            console.log('nay');
        }
    });
}