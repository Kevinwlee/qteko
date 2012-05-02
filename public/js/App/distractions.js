(function ($){
	//Distractions
    window.Distractions = ActionItems.extend({
        model: ActionItem,
        localStorage: new Store("distractions")
    });
    
	$(document).ready(function (){
		window.DistractionView = Backbone.View.extend({
            events: {
                "click": "updateDone"
            },
            tagName: "span",
            initialize: function(options) {
                this.template = _.template($("#distraction-template").html());
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
                    this.notificationCenter.trigger("distraction-entered", this.model);
                }
                return false;
            }
        });

        window.DistractionsView = Backbone.View.extend({
            initialize: function(options) {
                _.bindAll(this,"addOne", "addAll");
                this.template = _.template($("#distractions-template").html());
                this.collection.bind('reset', this.addAll, this);
                this.collection.bind('add', this.addOne, this);
                this.notificationCenter = options.notificationCenter;
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            addOne: function(todo) {
                var view = new DistractionView({
                    model: todo,
                    notificationCenter: this.notificationCenter
                });
                this.$("#distractions").append(view.render().el);
            },
            addAll: function() {
                this.collection.each(this.addOne);
            }
        });

	});
	//end document ready
})(jQuery);