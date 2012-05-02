(function ($){
	$(document).ready(function (){

        window.NavigationView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#nav-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            }
        }); 
	});
	//end document ready
})(jQuery);