(function ($){
	window.Docket = Backbone.Model.extend({
        name: "Docket"
    });

    Dockets = Backbone.Collection.extend({
        model: Docket,
        localStorage: new Store("dockets")
    });
	
	$(document).ready(function (){
		window.DocketView = Backbone.View.extend({
            events: {
                "click #reset-docket": "resetDocket"
            },
            initialize: function() {
                this.template = _.template($("#docket-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            resetDocket: function() {
                console.log("reset docket clicked");
                //create a docket and save it
                var date = new Date();
                var docket = new Docket({
                    mit: this.options.mit,
                    pomodoros: this.options.pomodoros,
                    distractions: this.options.distractions,
                    activities: this.options.activities,
                    actionItems: this.options.actionItems,
                    notes: this.options.notes,
                    date: date.toLocaleDateString()
                });

                dockets = new Dockets();
                dockets.create(docket);

                var pomodorosStore = new Store("pomodoros");
                _.each(pomodorosStore.findAll(),
                function(a) {
                    pomodorosStore.destroy(a);
                });

                var distractionsStore = new Store("distractions");
                _.each(distractionsStore.findAll(),
                function(a) {
                    distractionsStore.destroy(a);
                });

                var activitiesStore = new Store("activities");
                _.each(activitiesStore.findAll(),
                function(a) {
                    activitiesStore.destroy(a);
                });

                var notesStore = new Store("notes");
                _.each(notesStore.findAll(),
                function(a) {
                    notesStore.destroy(a);
                });
            }
        });
        
        window.DocketsView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#dockets-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            } 
        });
        window.DocketsListItemView = Backbone.View.extend({
            events: {
                "click li": "show",
            },
            initialize: function() {
                this.template = _.template($("#dockets-list-items-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            show: function () {
                App.navigate("dockets/" + this.model.id, {trigger: true});
            }
        });
        
        window.DocketsListView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#dockets-list-template").html());
                this.collection.bind('reset', this.addAll, this);
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            addOne: function(docket) {
                var view = new DocketsListItemView({
                    model: docket
                });
                this.$("#dockets-list-items").append(view.render().el);
            },
            addAll: function () {
                this.collection.each(this.addOne);
            } 
        });
        
        window.DocketDetailView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#docket-readonly-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            }            
        });
		
	});
	//end document readyu
}) (jQuery);