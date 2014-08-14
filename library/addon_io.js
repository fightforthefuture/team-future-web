/**
 *	asson_io.js - core functionality for communication to and from the add-ons
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
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

		document.dispatchEvent(new CustomEvent("notifications_add_on_request", {detail:request}));
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