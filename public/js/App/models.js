(function ($){
    //Tasks
    window.Task = Backbone.Model.extend({
        name: "task",
        clear: function() {
            this.destroy();
        }
    });

    //Action Items
    window.ActionItem = Task.extend({
        defaults: function() {
            return {
                title: "this one is already done!",
                done: false
            };
        },
        name: "ActionItem",
        toggle: function() {
            this.save({
                done: !this.get("done")
            });
        }
    });
    
    window.ActionItems = Backbone.Collection.extend({
        model: ActionItem,
        localStorage: new Store("action-items"),
        comparator: function(actionItem) {
          return actionItem.get('order');
        },
        done: function() {
          return this.filter(function(todo){ return todo.get('done'); });
        },
        remaining: function() {
          return this.without.apply(this, this.done());
        }
        
    });
	
})(jQuery);