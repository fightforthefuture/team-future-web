var BaseModalController = Composer.Controller.extend({
    
    elements: {
        'form': 'form'
    },

    events: {
        'submit form': 'submit',
        'click a': 'click_link'
    },

    model: null,

    render_title: function(inject) {
        if (this.model.get('title'))
            this.track_subcontroller('title', function() {
                return new TitleController({
                    inject: inject,
                    title: this.model.get('title'),
                    action: this.model.get('action')
                });
            }.bind(this));
    },

    render_subtitle: function(inject) {
        if (this.model.get('subtitle'))
            this.track_subcontroller('subtitle', function() {
                return new SubtitleController({
                    inject: inject,
                    subtitle: this.model.get('subtitle')
                });
            }.bind(this));
    },

    render_content: function(inject) {
        if (this.model.get('content'))
            this.track_subcontroller('content', function() {
                return new ContentController({
                    inject: inject,
                    content: this.model.get('content')
                });
            }.bind(this));
    },

    render_sharing_links: function(inject) {
        if (this.model.get('show_sharing_links'))
            this.track_subcontroller('sharing_links', function() {
                return new SharingController({ inject: inject });
            }.bind(this));
    },

    render_bottom_content: function(inject) {
        if (this.model.get('bottom_content'))
            this.track_subcontroller('bottom_content', function() {
                return new ContentController({
                    inject: inject,
                    content: this.model.get('bottom_content'),
                    className: 'content bottom'
                });
            }.bind(this));
    },

    render_hidden_fields: function(inject) {
        var hidden_fields = this.model.get('fields').filter(function(m) {
            return m.get('type') == 'hidden';
        });

        for (var i = 0; i < hidden_fields.length; i++)
            this.track_subcontroller('hidden_'+i, function() {
                return new HiddenFieldController({
                    inject: inject,
                    model: hidden_fields[i]
                });
            }.bind(this));
    },

    render_text_fields: function(collection, inject) {
        var text_fields = collection.filter(function(m) {
            return m.get('type') == 'text';
        });

        for (var i = 0; i < text_fields.length; i++)
            this.track_subcontroller('field_'+i, function() {
                return new InputTextController({
                    inject: inject,
                    model: text_fields[i]
                });
            }.bind(this));
    },

    render_buttons: function(collection, inject) {
        var submit_buttons = collection.filter(function(m) {
            return m.get('type') == 'submit';
        });

        for (var i = 0; i < submit_buttons.length; i++)
            this.track_subcontroller('submit_'+i, function() {
                return new ButtonController({
                    inject: inject,
                    model: submit_buttons[i]
                });
            }.bind(this));
    },

    submit: function(e) {
        e.preventDefault();

        console.log('elements: ', this.form.elements);

        var data        = {};
        var elements    = this.form.elements;
        var letter      = this.model.get('letter');
        var fields      = this.model.get('fields');

        if (letter && letter.get('editable'))
            data[letter.get('field')] = elements[letter.get('field')].value;

        for (var i = 0; i < fields.models().length; i++)
        {
            var model = fields.models()[i];
            
            switch (model.get('type')) {
                case 'hidden':
                case 'text':
                    var value = elements[model.get('name')].value;

                    if (value == "true")
                        value = true;
                    else if (value == "false")
                        value = false;

                    data[model.get('name')] = value;
                    break;

                case 'checkbox':
                    var checkbox_state = elements[model.get('name')].checked;

                    if (model.get('reverse_value'))
                        checkbox_state = !checkbox_state;

                    data[model.get('name')] = checkbox_state;
                    break;
            }
        }
        console.log('data: ', data);

        // notifications.nextAction(this.model.get('next'));

        $.ajax({
            url: this.model.get('endpoint'),
            data: data,
            type: model.get('method', 'post'),
            success: function(response) {
                console.log('response: ', response);
                notifications.nextAction(this.model.get('next'));
            }.bind(this)
        });

    },

    click_link: function(e) {
        e.preventDefault();

        if (e.target.href.indexOf('#') != -1)
        {
            var next = {id: e.target.href.substr(e.target.href.indexOf('#')+1)};
            notifications.nextAction(next);
        }
        else
            window.open(e.target.href);
    }
});

