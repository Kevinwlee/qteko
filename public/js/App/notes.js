(function ($){
	//Notes
    window.Note = Task.extend({
        name: "Note"
    });

    window.Notes = Backbone.Collection.extend({
        model: Note,
        localStorage: new Store("notes")
    });
	
	$(document).ready(function (){
		window.NoteView = Backbone.View.extend({
            events: {
                "click span.delete-note": "clear",
                "click li": "edit",
                "click .edit-button": "updateEdit",
                "click .cancel-edit-button": "cancelEdit",
                "keypress input.edit": "updateOnEnter",
                "keyup input.edit": "cancelEditOnEscape"
            },
            initialize: function() {
                this.template = _.template($("#note-template").html());
                this.model.bind('destroy', this.remove, this);
                this.model.bind('change', this.updateChanges, this);
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                $(this.el).insertBefore("#add-note");
                return this;
            },
            updateChanges: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },
            clear: function(e) {
                this.model.clear();
                return false;
            },
            edit: function() {
                if (this.$("div").hasClass("editing")) return;
                this.$("input.edit").val(this.model.get("title"));
                this.$("div").toggleClass("editing");
                this.$("input.edit").focus();
                return false;
            },
            updateEdit: function(e) {
                this.model.save({
                    title: this.$("input.edit").val()
                });
                this.$("div").removeClass("editing");
                return false;
            },
            cancelEdit: function(e) {
                this.$("div").removeClass("editing");
                this.$("input.edit").val(this.model.get("title"));
                return false;
            },
            updateOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.model.save({
                    title: this.$("input.edit").val()
                });
                this.$("div").removeClass("editing");
                return false;
            },
            cancelEditOnEscape: function(e) {
                if (e.keyCode != 27) return;
                this.cancelEdit(e);
                return false;
            }
        });

        window.NotesView = Backbone.View.extend({
            events: {
                "keypress #new-note": "createOnEnter",
                "blur #new-note": "createOnBlur",
            },
            initialize: function() {
                this.template = _.template($("#notes-template").html());
                this.collection.bind('add', this.addOne, this);
                this.collection.bind('reset', this.addAll, this);
            },
            render: function() {
                $(this.el).html(this.template(this.collection.toJSON()));
                return this;
            },
            addOne: function(note) {
                var view = new NoteView({
                    model: note
                });
                view.render();
            },
            addAll: function() {
                this.collection.each(this.addOne);
            },
            createOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.collection.create({
                    title: $("#new-note").val()
                });
                $("#new-note").val('');
            },
            createOnBlur: function(e) {
                if (!$("#new-note").val()) return;
                this.collection.create({
                    title: $("#new-note").val()
                });
                $("#new-note").val('');
            }
        });
        
	});
	//end document readyu
}) (jQuery);