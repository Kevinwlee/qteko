(function($) {

     window.HabitAction = Backbone.Model.extend({
        defaults: function() {
            return {
                state: ""
            };
        },
        toggleState: function() {
            if (this.get("state") == "") {
                this.set("state", "icon-ok");
            } else if (this.get("state") == "icon-ok") {
                this.set("state", "icon-cancel");
            } else {
                this.set("state", "icon-minus");
            }
        }
    });

    window.HabitActions = Backbone.Collection.extend({
        model: HabitAction
    });

    window.Habit = Backbone.Model.extend({
            defaults: function() {
    
                var habitActions = [
                new HabitAction({
                    day: "monday"
                }),
                new HabitAction({
                    day: "tuesday"
                }),
                new HabitAction({
                    day: "wednesday"
                }),
                new HabitAction({
                    day: "thursday"
                }),
                new HabitAction({
                    day: "friday"
                }),
                new HabitAction({
                    day: "saturday"
                }),
                new HabitAction({
                    day: "sunday"
                })
                ];
    
                return {
                    title: "",
                    items: habitActions
                };
            }
        });

     window.Habits = Backbone.Collection.extend({
        model: Habit,
        localStorage: new Store("habits")
    });

    //add the views after the page has loaded
    $(document).ready(function() {

        window.WeeklyView = Backbone.View.extend({
            initialize: function() {
                this.template = _.template($("#weekly-template").html());
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            updateChanges: function() {
                $(this.el).html(this.template(this.model.toJSON()));
            }
        });

        window.GridRowView = Backbone.View.extend({
            events: {
                "click td": "toggleState"
            },
            tagName: "tr",
            initialize: function() {
                this.template = _.template($("#grid-row-template").html());
                this.model.bind('change', this.render, this);
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            toggleState: function(e) {
                console.log(e.target.className);
            }
        });
        
        window.GridView = Backbone.View.extend({
            events: {
                "keypress #new-habit": "createOnEnter"
            },
            initialize: function() {
                this.template = _.template($("#grid-template").html());
                this.collection.bind('reset', this.addAll, this);
                this.collection.bind('add', this.addOne, this);
            },
            render: function() {
                $(this.el).html(this.template({}));
                return this;
            },
            addOne: function(habit) {
                var view = new GridRowView({
                    model: habit
                });
                this.$("#new-habit-row").before(view.render().el);
            },
            addAll: function() {
                this.collection.each(this.addOne);
            },
            createOnEnter: function(e) {
                if (e.keyCode != 13) return;
                habit = new Habit({
                    title: $("#new-habit").val()
                });
                this.collection.create(habit);
                console.log(habit)
                $("#new-habit").val('');
            }
        });
    });
    //end document ready
}) (jQuery);