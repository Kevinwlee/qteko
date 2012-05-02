(function ($){
    
	
	$(document).ready(function (){
		window.ActionItemView = Backbone.View.extend({
            events: {
                "click .delete": "clear",
                "click .done": "updateDone",
                "click .view": "edit",
                "click .edit-button": "updateEdit",
                "click .cancel-edit-button": "cancelEdit",
                "keypress input.edit": "updateOnEnter",
                "keyup input.edit": "cancelEditOnEscape",
                "click a.send-to": "sendTo"
            },
            initialize: function(options) {
                _.bindAll(this, "updateChanges", "clear", 'updateDone', "edit", "updateEdit", "cancelEdit","updateOnEnter","cancelEditOnEscape", "sendTo");
                this.template = _.template($("#action-item-template").html());
                this.model.bind('destroy', this.remove, this);
                this.model.bind('change', this.updateChanges, this);
                this.notificationCenter = options.notificationCenter;
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                // $(this.el).insertBefore("#add_action_item");
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
            updateDone: function(e) {
                this.model.toggle();
                if (this.model.get("done") ) {
                    this.notificationCenter.trigger("action-item-completed", this.model);
                }
                return false;
            },
            edit: function(e) {
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
            sendTo: function() {
                var link = "mailto:"
                + "?subject=" + escape(this.model.get("title"));

                window.open(link);
                return false;
            }
        });

        window.ActionItemsView = Backbone.View.extend({
            events: {
                "keypress #new-action-item": "createOnEnter",
                "blur #new-action-item": "createOnBlur",
                "sortstop":"handleSorted"
            },            
            statsTemplate: _.template($('#action-items-stats-template').html()),
            initialize: function(options) {
                _.bindAll(this,"addOne", "addAll", "createOnEnter", "createOnBlur");
                this.template = _.template($("#action-items-template").html());

                this.collection.bind('add', this.addOne, this);
                this.collection.bind('reset', this.addAll, this);
                this.collection.bind('all', this.updateStats, this);
                
                this.notificationCenter = options.notificationCenter;
                
            },
            render: function() {
                $(this.el).html(this.template(this.collection.toJSON()));
                this.updateStats();
                return this;
            },
            addOne: function(todo) {
                var view = new ActionItemView({
                    model: todo,
                    notificationCenter:this.notificationCenter
                });
                // var $parent = this.$("#action_items").child.first();
                 this.$("#action_items").prepend(view.render().el).sortable();
                // $(view.render().el).insertBefore($parent).sortable();
                // $(view.render().el).parent().sortable();
            },
            addAll: function() {
                $(this.el).empty();
                this.render();
                this.collection.each(this.addOne);
            },
            createOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.collection.create({
                    title: $("#new-action-item").val()
                });
                $("#new-action-item").val('');
            },
            createOnBlur: function(e) {
                if (!$("#new-action-item").val()) return;
                this.collection.create({
                    title: $("#new-action-item").val()
                });
                $("#new-action-item").val('');
            },
            handleSorted: function (event, ui) {
                console.log(_.pluck(this.$el.children("div").find(".view"), "id"));
                var newOrder = _.pluck(this.$el.children("div").find(".view"), "id");
                for (var i=newOrder.length; i >0 ; i--) {
                    var id = newOrder[i]
                    var ai = this.collection.get(id)
                    ai.save({order:i});
                };
                this.collection.sort();
            },
            updateStats: function () {
                $stats = this.$('#stats');
                console.log("update status!")
                var done = this.collection.done().length;
                var total = this.collection.length
                var completed = done == total;
                $stats.html(this.statsTemplate({done: done, total: total, completed:completed}));                
            }
        });
      
	});
	//end document readyu
}) (jQuery);