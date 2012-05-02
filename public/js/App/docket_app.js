(function($) {
    $(document).ready(function() {
        window.DocketRouter = Backbone.Router.extend({
            routes: {
                '': "home",
                "mit": "mitOnly",
                "focus": "focusOnly",
                "week": "week",
                "dockets": "dockets",
                "dockets/:docketId" : "docket"
            },
            initialize: function() {
                this.navView = new NavigationView({});
                
                this.weeklyView = new WeeklyView({});
                
                this.docketsView = new DocketsView({});
                
                this.docketView = new DocketView({});
                                
                
                var notificationCenter = _.clone(Backbone.Events);

                dockets= new Dockets();
                this.docketsListView = new DocketsListView({ 
                    collection:dockets
                });

                mit = new MIT();
                this.mitView = new MITView({
                    collection: mit,
                    notificationCenter: notificationCenter
                });

                var focus = new FocusItems([{
                    title: "focus 1"
                },
                {
                    title: "focus 2"
                },
                {
                    title: "focus 3"
                }]);
                this.focusView = new FocusItemsView({
                    model: focus
                });

                activities = new Activities();
                this.activitiesView = new ActivitiesView({
                    collection: activities,
                    notificationCenter: notificationCenter
                });

                actionItems = new ActionItems();
                this.actionItemsView = new ActionItemsView({
                    collection: actionItems,
                    notificationCenter: notificationCenter
                });

                notes = new Notes();
                this.notesView = new NotesView({
                    collection: notes
                });

                pomodoros = new Pomodoros();
                this.pomodorosView = new PomodorosView({
                    collection: pomodoros,
                    notificationCenter: notificationCenter
                });

                distractions = new Distractions();
                this.distractionsView = new DistractionsView({
                    collection: distractions,
                    notificationCenter: notificationCenter
                });

                habits = new Habits();
                this.gridView = new GridView({
                    collection: habits
                });

                this.docketView = new DocketView({
                    mit: mit,
                    activities: activities,
                    pomodoros: pomodoros,
                    distractions: distractions,
                    actionItems: actionItems,
                    notes: notes
                });
            },
            addDefaultMIT: function(collection, response) {
                if (response.length === 0) {
                    collection.create({
                        title: "what's most important today?"
                    });
                    collection.create({
                        title: "click me to rename me?"
                    });
                    collection.create({
                        title: "don't have 3 important things, you're a zen master of focus!"
                    });
                }
            },
            addDefaultPomodoros: function(collection, response) {
                if (response.length === 0) {
                    for (var i = 0; i < 8; i++) {
                        collection.create();
                    };
                }
            },
            addDefaultDistractions: function(collection, response) {
                if (response.length === 0) {
                    for (var i = 0; i < 8; i++) {
                        collection.create();
                    };
                }
            },

            home: function() {
                $("#docket-container").empty();
                $("#docket-container").append(this.navView.render().el);
                $("#docket-container").append(this.docketView.render().el);

                $("#mit-container").append(this.mitView.render().el);
                mit.fetch({
                    success: this.addDefaultMIT
                });
                // $("#focus-container").append(this.focusView.render().el);
                $("#activities-container").append(this.activitiesView.render().el);
                activities.fetch();

                $("#action-items-container").append(this.actionItemsView.render().el);
                actionItems.fetch();

                $("#note-container").append(this.notesView.render().el);
                notes.fetch();

                $("#pomodoros-container").append(this.pomodorosView.render().el);
                pomodoros.fetch({
                    success: this.addDefaultPomodoros
                });

                $("#distractions-container").append(this.distractionsView.render().el);
                distractions.fetch({
                    success: this.addDefaultDistractions
                });

            },
            mitOnly: function() {
                $("#docket-container").empty();
                $("#docket-container").append(this.docketView.render().el);
                $("#mit-container").append(this.mitView.render().el)
            },
            focusOnly: function() {
                $("#docket-container").empty();
                $("#docket-container").append(this.docketView.render().el);
                $("#focus-container").append(this.focusView.render().el)
            },
            week: function() {
                $("#docket-container").empty();
                $("#docket-container").append(this.navView.render().el);
                $("#docket-container").append(this.weeklyView.render().el);
                $("#grid-container").append(this.gridView.render().el);
                habits.fetch();
            },
            dockets : function () {
                $("#docket-container").empty();
                $("#docket-container").append(this.navView.render().el);
                $("#docket-container").append(this.docketsView.render().el);
                $("#dockets-container").append(this.docketsListView.render().el);
                dockets.fetch();
            },
            docket: function (docketId) {
                $("#docket-container").empty();
                $("#docket-container").append(this.navView.render().el);
                var aDocket = dockets.get(docketId);                
                console.log(aDocket);
                var docketDetailView = new DocketDetailView({
                    model:aDocket
                });
                
                $("#docket-container").append(docketDetailView.render().el);
                console.log("you clike me", docketId);
            }
        });
        // Kick off the application
        window.App = new DocketRouter();
        Backbone.history.start();

    });
    //end document ready
})(jQuery);
