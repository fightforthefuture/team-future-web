/*
 @licstart  The following is the entire license notice for the
    JavaScript code in this page.

 Copyright (C) 2014 Center for Rights in Action
 Copyright (C) 2014 Jeff Lyon

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version. The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 @licend  The above is the entire license notice
    for the JavaScript code in this page.
 */
var notifications = {
	
    main_container_selector: '#main',

    controller_swap_delay: 500,
    cur_controller: null,
    controllers: {},
    campaign: null,
    user: null,

	init: function() {
		this.showOverlay();
		this.campaign = new Campaign();
        this.user = new User().populate();
	},

	showOverlay: function() {
		$('.overlay').addClass('visible');
        $('.overlay').click(function(e) {
            if ($(e.target).hasClass('containerVisible')) {
                this.closeOverlay();
            }
        }.bind(this));
        window.addEventListener("keyup", function(e){
            if(e.keyCode == 27)
                this.closeOverlay();
        }.bind(this), false);
	},

    closeOverlay: function(afterAction) {
        afterAction || (afterAction = null);
        $('.overlay').removeClass('visible');
        setTimeout(function() {
            sendMessage('close', {after: afterAction});
        }.bind(this), 500);
    },

	performAction: function(action, options) {

		options || (options = {});

		if (this.cur_controller)
		{
			this.close_current();

			return setTimeout(function() {
				this.performAction(action);
			}.bind(this), this.controller_swap_delay);
		}

		switch (action) {

			case 'install':
				this.controllers[action] = new InstallModalController();
				break;

			case 'petition':
				this.controllers[action] = new PetitionModalController({
                    petitionId: options.petitionId
                });
				break;

            case 'call':
                this.controllers[action] = new CallModalController({
                    callId: options.callId
                });
                break;

            case 'modal':
                this.controllers[action] = new ModalController({
                    modalId: options.modalId
                });
                break;
		}

		this.cur_controller = this.controllers[action];

		$('.overlay > div').addClass('containerVisible');
		setTimeout(function() {
			$('.overlay > div').addClass('visible');
		}, 100);
	},

    nextAction: function(next) {
        var actions = this.campaign.get('actions');

        var overrideAndExecute = function(action, model, overrides) {
            model.set(overrides);
            var options = {};
            options[action+'Id'] = model.get('id');

            this.performAction(action, options);
        }.bind(this);

        for (var i = 0; i < actions.get('petitions').models().length; i++)
            if (actions.get('petitions').models()[i].get('id') == next.id)
                return overrideAndExecute(
                    'petition',
                    actions.get('petitions').models()[i],
                    next.overrides);

        for (var i = 0; i < actions.get('calls').models().length; i++)
            if (actions.get('calls').models()[i].get('id') == next.id)
                return overrideAndExecute(
                    'call',
                    actions.get('calls').models()[i],
                    next.overrides);

        for (var i = 0; i < actions.get('modals').models().length; i++)
            if (actions.get('modals').models()[i].get('id') == next.id)
                return overrideAndExecute(
                    'modal',
                    actions.get('modals').models()[i],
                    next.overrides);

    },

	render_template: function(template, data)
    {
    	data || (data = {});
    	return _.template($('#'+template).html(), data);
    },

    close_current: function() {
    	$('.overlay > div').addClass('swapping');
    	setTimeout(function() {
    		this.cur_controller.release();
    		this.cur_controller = null;
    	}.bind(this), this.controller_swap_delay - 5);
    }
}

var ORIGIN = location.href.match(/origin=(.+)/);

if (!ORIGIN || Object.prototype.toString.call(ORIGIN) !== '[object Array]')
    throw 'ERROR: origin is a required parameter, but you didn\'t pass it :\'(';
else
	ORIGIN = decodeURIComponent(ORIGIN[1]);

window.addEventListener('message', function(e) {
    if (!e.data || !e.data.TF_WIDGET_MSG)
        return;

    delete e.data.TF_WIDGET_MSG;

    if (e.origin != ORIGIN)
    	throw 'Unauthorized origin.';

    switch (e.data.requestType) {

        case 'activate':
        case 'petition':
            notifications.performAction(e.data.action, e.data);
            break;

        case 'putActionData':
        	console.log('GOT ACTION DATA: ', e.data);
        	notifications.campaign.activate(e.data);
        	break;

        case 'deactivate':
            notifications.closeOverlay(e.data.after);
            break;
    }
});

var sendMessage = function(requestType, data)
{
    data || (data = {});
    data.requestType = requestType;
    data.TF_IFRAME_MSG = true;
    parent.postMessage(data, ORIGIN);
}

$(document).ready(function() {
	notifications.init();
	sendMessage('ready');
});