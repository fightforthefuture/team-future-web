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
if (typeof _tf_options == "undefined")
    _tf_options = {};

if (typeof _tf_options.actionUrl == "undefined")
    _tf_options.actionUrl = '/actions.js';

if (typeof _tf_options.action == "undefined")
    _tf_options.action = null;

var TeamFuture = {

	options: {
		iframePath: 'http://notifications.dev/widget/iframe'
	},
	iframeEventListener: null,
    installPollInterval: null,
    actionData: null,
    actionDataLoadCallbacks: [],

	init: function() {

		for (var k in _tf_options) this.options[k] = _tf_options[k];

        this.loadActionData();

		return this;
	},

    loadActionData: function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = this.options.actionUrl;
        document.getElementsByTagName('body')[0].appendChild(script);
    },

    jsonp: function(data) {
        this.parseActionData(data);
    },

    parseActionData: function(data) {
        data = JSON.parse(JSON.stringify(data));

        if (!data.campaigns.length)
            throw 'No action data to parse';

        if (this.options.action == null)
            this.actionData = data.campaigns[0];
        else
            for (var i = 0; i < data.campaigns.length; i++)
                if (data.campaigns[i].id == this.options.action)
                    this.actionData = data.campaigns[i];
        
        if (!this.actionData)
            throw 'The specified action was not found in the data file.';

        for (var i = 0; i < this.actionDataLoadCallbacks.length; i++)
            this.actionDataLoadCallbacks[i]();
    },

	createIframe: function(options) {

		this.injectCSS('_tf_iframe_css', '#_tf_iframe { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20000; }');

		var iframe = document.createElement('iframe');
        var origin = encodeURIComponent(window.location.origin);
		iframe.id = '_tf_iframe';
		iframe.src = this.options.iframePath + '/iframe.html?origin=' + origin;
		iframe.frameBorder = 0;
		iframe.allowTransparency = true; 
		iframe.style.display = 'none';
		document.body.appendChild(iframe);

		var sendMessage = function(requestType, data)
		{
			data || (data = {});
			data.requestType = requestType;
			data.TF_WIDGET_MSG = true;
			iframe.contentWindow.postMessage(data, '*');
		}
		this.iframeEventListener = function(e) {
			if (!e.data || !e.data.TF_IFRAME_MSG)
				return;

			delete e.data.TF_IFRAME_MSG;

			switch (e.data.requestType) {
				case 'ready':
					iframe.style.display = 'block';
					sendMessage('activate', options);

                    if (this.actionData)
                        sendMessage('putActionData', this.actionData);
                    else
                        this.actionDataLoadCallbacks.push(function() {
                            sendMessage('putActionData', this.actionData);
                        }.bind(this));

					break;
				case 'close':
					this.destroyIframe();
					break;
			}
		}.bind(this);

		var method = window.addEventListener ? "addEventListener":"attachEvent";
		var eventer = window[method];
		var messageEvent = method == "attachEvent" ? "onmessage" : "message";

		eventer(messageEvent, this.iframeEventListener, false);
	},

	destroyIframe: function() {
		var iframe = document.getElementById('_tf_iframe');
		iframe.parentNode.removeChild(iframe);

		var css = document.getElementById('_tf_iframe_css');
		css.parentNode.removeChild(css);

		if (window.addEventListener)
			window.removeEventListener("message", this.iframeEventListener);
		else
			window.detachEvent("onmessage", this.iframeEventListener);

        this.stopInstallPoll();

		this.iframeEventListener = null;
	},

	injectCSS: function(id, css)
	{
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = id;
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	},

	checkAddonExists: function(options) {
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
        }, 100);
    },

    signPetition: function(options) {
        options || (options = {});
        options.petitionId || (options.petitionId = null);
        options.action = 'petition';

    	this.checkAddonExists({
    		yes: function() {
    			this.createIframe(options);
    		}.bind(this),
    		no: function() {
    			this.install(options, 'petition');
    		}.bind(this)
    	});
    },

    install: function(options, afterAction) {
        options || (options = {});
        options.action = 'install';

        this.createIframe(options);

        this.installPollInterval = setInterval(function() {
            this.checkAddonExists({
                yes: function() {
                    this.stopInstallPoll();
                    this.signPetition(options);
                }.bind(this)
            });
        }.bind(this), 250);

    },

    stopInstallPoll: function() {
        if (!this.installPollInterval)
            return;
        window.clearInterval(this.installPollInterval);
        this.installPollInterval = null;
    }

}

// Wait for DOM content to load.
switch (document.readyState) {
    case "complete":
    case "loaded":
    case "interactive":
        TeamFuture.init();
        break;

    default:
        try {
            document.addEventListener(
                'DOMContentLoaded',
                TeamFuture.init.bind(TeamFuture),
                false);
        }
        catch (err) {
            console.log('Team Future is not compatible with this browser :\'(');
        }
        break;
}