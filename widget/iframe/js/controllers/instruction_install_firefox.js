var InstructionInstallFirefoxController = Composer.Controller.extend({
    inject: 'body',
    el: false,
    className: 'instruction install_allow_firefox',

    elements: {
        
    },

    events: {

    },

   
    init: function(data)
    {
        this.render();
        return this;
    },


    render: function()
    {
        this.html(notifications.render_template('instruction_install_firefox'));

        setTimeout(function() {
            $(this.el).addClass('visible')
        }.bind(this), 200);

        setTimeout(function() {
            $(this.el).removeClass('visible')
        }.bind(this), 4000);

        return this;
    },
});

