$(function(){
	//My basic task model
	var Task = Backbone.Model.extend({
		defaults: function(){
			return {
				title: "empty task..."
			};
		},
		initialize: function(){
			if (!this.get("title")) {
			        this.set({"title": this.defaults.title});
			      }
		}
	});
	
	//Model of collection of tasks
	var TaskList = Backbone.Collection.extend({
		model: Task,
		localStorage: new Store("tasks-backbone")
	});
	
	//Creat a global TaskList
	var Tasks = new TaskList;
	
	//The View
	var TaskView = Backbone.View.extend({
		tagName: "li",
		template: _.template($("#task-template").html()),
		events: {
			"blur .item": "saySomething"
		},
		initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },  
		render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    saySomething: function() {
      console.log("something");
    }
	});
	
	var AppView = Backbone.View.extend({
    el: $("#mit"),
    events: {
      "keypress #new-task":  "createOnEnter"
    },
    initialize: function() {
      this.input = this.$("#new-task");

      Tasks.bind('add', this.addOne, this);
      Tasks.bind('reset', this.addAll, this);
      Tasks.bind('all', this.render, this);

      Tasks.fetch();
    },
    render: function() {
			
    },
		addOne: function(todo) {
      var view = new TaskView({model: todo});
      this.$("#mit-list").append(view.render().el);
    },
    addAll: function() {
      Tasks.each(this.addOne);
    },
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      // if (!this.input.val()) return;
			if (Tasks.length < 3) {
	      Tasks.create({title: this.input.val()});
	      this.input.val('');
			} else {
				alert("You can only have 3");
			}
    },
  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;
});