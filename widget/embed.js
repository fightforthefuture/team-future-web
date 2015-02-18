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
		iframePath: 'https://www.censorshipalerts.org/widget/iframe'
        //iframePath: 'http://notifications.dev/widget/iframe'
	},
    iframe: null,
	iframeEventListener: null,
    installPollInterval: null,
    installAfterAction: null,
    installAfterOptions: null,
    actionData: null,
    actionDataLoadCallbacks: [],

    // Will be overridden by any preference set in add-on settings trololol
    locale: (navigator.userLanguage || navigator.language).toLowerCase(),

	init: function() {

		for (var k in _tf_options) this.options[k] = _tf_options[k];

        this.loadActionData();

        if (window.location.hash.indexOf('tf_install_') != -1)
        {
            var installData = JSON.parse(atob(window.location.hash.substr(12)));

            console.log('INSTALL DATA: ', installData);

            switch (installData.after) {
                case 'petition':
                    this.signPetition({
                        petitionId: installData.options.petitionId
                    });
                    break;
                case 'subscribe':
                    this.subscribe({})
                    break;
            }
        }

		return this;
	},

    loadActionData: function() {

        links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++)
            if (links[i].type == 'application/oap+jsonp')
                this.options.actionUrl = links[i].href;

        if (!window.OAP)
            window.OAP = {};
        
        window.OAP.jsonp = this.jsonp.bind(this);

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

        if (!data.org)
            throw 'No org information';

        if (this.options.action == null)
            this.actionData = data.campaigns[0];
        else
            for (var i = 0; i < data.campaigns.length; i++)
                if (data.campaigns[i].id == this.options.action)
                    this.actionData = data.campaigns[i];
        
        if (!this.actionData)
            throw 'The specified action was not found in the data file.';

        this.actionData.org = data.org;

        for (var i = 0; i < this.actionDataLoadCallbacks.length; i++)
            this.actionDataLoadCallbacks[i]();
    },

    sendIframeMessage: function(requestType, data)
    {
        data || (data = {});
        data.requestType = requestType;
        data.TF_WIDGET_MSG = true;
        data.locale = this.locale;
        if (this.iframe)
            this.iframe.contentWindow.postMessage(data, '*');
    },

	createIframe: function(options) {

		this.injectCSS('_tf_iframe_css', '#_tf_iframe { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20000; }');

		this.iframe = document.createElement('iframe');
        var origin = encodeURIComponent(window.location.origin);
		this.iframe.id = '_tf_iframe';
		this.iframe.src = this.options.iframePath+'/iframe.html?origin='+origin;
		this.iframe.frameBorder = 0;
		this.iframe.allowTransparency = true; 
		this.iframe.style.display = 'none';
		document.body.appendChild(this.iframe);

		this.iframeEventListener = function(e) {
			if (!e.data || !e.data.TF_IFRAME_MSG)
				return;

			delete e.data.TF_IFRAME_MSG;

			switch (e.data.requestType) {
				case 'ready':
					this.iframe.style.display = 'block';
					this.sendIframeMessage('activate', options);

                    if (this.actionData)
                        this.sendIframeMessage('putActionData',this.actionData);
                    else
                        this.actionDataLoadCallbacks.push(function() {
                            this.sendIframeMessage(
                                'putActionData',
                                this.actionData
                            );
                        }.bind(this));

					break;
				case 'close':
					this.destroyIframe();
                    
                    if (e.data.after == 'subscribe')
                        this.subscribe();

					break;
                case 'triggerInstall':
                    var data = {
                        after: this.installAfterAction,
                        options: this.installAfterOptions
                    };
                    console.log('triggered install: ', data);
                    data = window.btoa(JSON.stringify(data));
                    window.location.hash = 'tf_install_'+data;
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
        this.iframe = null;

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

            if (response.locale)
                this.locale = response.locale;

            options.yes(response);
        }.bind(this));

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
                if (!this.iframe)
                    this.createIframe(options);
                else
                    this.sendIframeMessage('petition', options);

    		}.bind(this),
    		no: function() {
    			this.install(options, 'petition');
    		}.bind(this)
    	});
    },

    subscribe: function(options) {
        options || (options = {});

        this.checkAddonExists({
            yes: function() {
                addon_io.call('add_subscription', {}, function(response) {});
            }.bind(this),
            no: function() {
                this.install(options, 'subscribe');
            }.bind(this)
        });
    },

    install: function(options, afterAction) {
        options || (options = {});
        options.action = 'install';

        this.installAfterOptions = options;
        this.installAfterAction = afterAction;

        this.createIframe(this.installAfterOptions);

        this.installPollInterval = setInterval(function() {
            this.checkAddonExists({
                yes: function() {
                    this.stopInstallPoll();
                    
                    switch (this.installAfterAction) {
                        case 'subscribe':
                            this.sendIframeMessage('deactivate', {
                                after: this.installAfterAction
                            });
                            break;
                        case 'petition':
                            this.signPetition(this.installAfterOptions);
                            break;
                    }
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
var addon_io = {

    callbacks: {},

    initialize: function()
    {
        document.addEventListener('notifications_add_on_response', function(e) {
            this.handle_response(e.detail);
        }.bind(this));

        return this;        
    },

    call: function(msg_type, data, callback)
    {
        data || (data = {});

        var id = this.generate_id();

        if (callback)
        {
            console.log('setting callbacks['+id+']!');
            this.callbacks[id] = callback;
        }

        var request = {
            msg_type: msg_type,
            data: data,
            id: id
        }

        console.log('addon_io: sending message ('+request.id+': '+request.msg_type+'): ', request);

        document.dispatchEvent(
            new CustomEvent("notifications_add_on_request", {detail:request})
        );
    },

    handle_response: function(data)
    {
        console.log('addon_io: received message ('+data.id+': '+data.msg_type+')');

        if (typeof this.callbacks[data.id] != "undefined")
        {
            this.callbacks[data.id](data.data);
            delete this.callbacks[data.id];
        }
    },

    generate_id: function()
    {
        var num = Math.round(Math.random() * 1000000000);

        if (typeof this.callbacks[num] != "undefined")
            return this.generate_id();
        
        return num;
    }
}.initialize();