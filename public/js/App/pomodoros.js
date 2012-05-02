(function ($){
	//Pomodoros
    window.Pomodoros = ActionItems.extend({
        model: ActionItem,
        localStorage: new Store("pomodoros")
    });
	
	$(document).ready(function (){
		window.PomodoroView = Backbone.View.extend({
            events: {
                "click": "updateDone"
            },
            tagName: "span",
            initialize: function(options) {
                this.template = _.template($("#pomodoro-template").html());
                this.model.bind('change', this.updateChanges, this);
                this.notificationCenter = options.notificationCenter;
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },
            updateChanges: function() {
                $(this.el).html(this.template(this.model.toJSON()));
            },
            updateDone: function(e) {
                this.model.toggle();
                if ( this.model.get("done") ) {
                    this.notificationCenter.trigger("pomodoro-entered", this.model);
                }
                return false;
            }
        });

        window.PomodorosView = Backbone.View.extend({
            initialize: function(options) {
                _.bindAll(this,"addOne", "addAll")
                this.template = _.template($("#pomodoros-template").html());
                this.collection.bind('reset', this.addAll, this);
                this.collection.bind('add', this.addOne, this);
                this.notificationCenter = options.notificationCenter;
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            addOne: function(todo) {
                var view = new PomodoroView({
                    model: todo,
                    notificationCenter: this.notificationCenter
                });
                this.$("#pomodoros").append(view.render().el);
            },
            // Add all items in the **Todos** collection at once.
            addAll: function() {
                this.collection.each(this.addOne);
            }
        });
        
	});
	//end document readyu
}) (jQuery);