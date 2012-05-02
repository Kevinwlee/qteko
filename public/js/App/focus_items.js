(function ($){
	//Focus Items
    window.FocusItem = Task.extend({
        name: "Focus Item"
    });

    window.FocusItems = Backbone.Collection.extend({
        model: FocusItem

    });
	
	$(document).ready(function (){
	    window.FocusItemsView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#focus-template").html());
            },
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            }
        });
    	
	});
	//end document readyu
}) (jQuery);