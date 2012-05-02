(function ($){
	//MIT
    window.MIT = ActionItems.extend({
        model: ActionItem,
        localStorage: new Store("important-items")
    });
    
	
	$(document).ready(function (){
	    window.TaskView = Backbone.View.extend({
            events: {
                "click li": "edit",
                "click .edit-button": "updateEdit",
                "click .cancel-edit-button": "cancelEdit",
                "keypress input.edit": "updateOnEnter",
                "keyup input.edit": "cancelEditOnEscape",
                "click .done": "updateDone"
            },
            initialize: function(options) {
                this.template = _.template($("#important-task-template").html());
                this.model.bind('destroy', this.remove, this);
                this.model.bind('change', this.updateChanges, this);
                this.notificationCenter = options.notificationCenter;
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },
            updateChanges: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
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
            },
            updateDone: function(e) {
                this.model.toggle();
                if ( this.model.get("done") ) {
                    this.notificationCenter.trigger("mit-completed", this.model);
                }                
                return false;
            }

        });

        window.MITView = Backbone.View.extend({
            initialize: function(options) {
                _.bindAll(this,"addOne", "addAll");
                this.template = _.template($("#mit-template").html());
                this.collection.bind('reset', this.addAll, this);
                this.collection.bind('add', this.addOne, this);
                this.notificationCenter = options.notificationCenter
            },
            render: function() {
                $(this.el).html(this.template(this.collection.toJSON()));
                return this;
            },
            addOne: function(todo) {
                var view = new TaskView({
                    model: todo,
                    notificationCenter:this.notificationCenter
                });
                this.$("#mit-items").append(view.render().el);
            },

            // Add all items in the **Todos** collection at once.
            addAll: function() {
                this.collection.each(this.addOne);
            }
        });
    	
	});
	//end document readyu
}) (jQuery);