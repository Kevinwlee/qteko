(function ($){
	//Activities
    window.Activity = Task.extend({
        name: "Activity"
    });

    window.Activities = Backbone.Collection.extend({
        model: Activity,
        localStorage: new Store("activities")
    });
    
	
	$(document).ready(function (){
		window.ActivityView = Backbone.View.extend({
            events: {
                "click span.delete-activity": "clear",
                "click li": "edit",
                "click .edit-button": "updateEdit",
                "click .cancel-edit-button": "cancelEdit",
                "keypress input.edit": "updateOnEnter",
                "keyup input.edit": "cancelEditOnEscape"

            },
            initialize: function() {
                this.template = _.template($("#activity-template").html());
                this.model.bind('destroy', this.remove, this);
                this.model.bind('change', this.updateChanges, this);
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                $(this.el).insertAfter("#add-activity");
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

        window.ActivitiesView = Backbone.View.extend({
            events: {
                "keypress #new-activity": "createOnEnter",
                "blur #new-activity": "createOnBlur"
            },
            initialize: function(options) {
                _.bindAll(this,"createOnPomodoroEntered","createOnDistractionEntered", "createOnMITCompleted", "createOnActionItemCompleted");
                
                this.template = _.template($("#activities-template").html());
                this.collection.bind('add', this.addOne, this);
                this.collection.bind('reset', this.addAll, this);
                this.notificationCenter = options.notificationCenter;
                options.notificationCenter.on("pomodoro-entered", this.createOnPomodoroEntered);
                options.notificationCenter.on("distraction-entered", this.createOnDistractionEntered);
                options.notificationCenter.on("mit-completed", this.createOnMITCompleted);
                options.notificationCenter.on("action-item-completed", this.createOnActionItemCompleted);
                
            },
            render: function() {
                $(this.el).html(this.template(this.collection.toJSON()));
                return this;
            },
            addOne: function(activity) {
                var view = new ActivityView({
                    model: activity
                });
                view.render();
            },
            addAll: function() {
                this.collection.each(this.addOne);
            },
            createOnEnter: function(e) {
                if (e.keyCode != 13) return;
                this.collection.create({
                    title: $("#new-activity").val()
                });
                $("#new-activity").val('');
            },
            createOnBlur: function(e) {
                if (!$("#new-activity").val()) return;
                this.collection.create({
                    title: $("#new-activity").val()
                });
                $("#new-activity").val('');
            },
            createOnPomodoroEntered: function(pomodoro) {
                this.collection.create({
                    title:"(p) 30min, pomodoro completed"
                });                
            },
            createOnDistractionEntered: function(distraction) {
                this.collection.create({
                    title:"d, don't worry, just get back to what's important!"
                });                
            },
            createOnMITCompleted: function(mit) {
                var text = "P, MIT completed: "+ mit.get("title");
                this.collection.create({
                    title:text
                });                
            },
            createOnActionItemCompleted: function(actionItem) {
                var text = "P, completed: "+ actionItem.get("title");
                this.collection.create({
                    title:text
                });                
            }
            
        });
       
	});
	//end document readyu
}) (jQuery);