(function(ns){
    var Books = Backbone.Collection.extend({
        url: "/books",

        parse: function(data) {
            return _.map(data.books, function(book) {return book;});
        },

        comparator: function(book_a) {
            return -book_a.get("startfinishdates")[0].finished_stamp;
        }
    });

    var BookView = Backbone.View.extend({
        tagName: "li",

        render: function () {
            var link = "http://www.librarything.com/work/book/" + this.model.get("book_id");
            var a = $("<a href='" + link + "'></a>");
            a.html(this.model.get("title") + " (" + parseInt(this.model.get("rating"), 10)*2 + "/10)");
            this.$el.html(a);
            return this;
        }
    });


    var LibraryThingView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, "addOne");
            this.collection = new Books();
            this.collection.on("reset", this.addAll, this);
            this.collection.fetch();
        },

        addAll: function () {
            _.each(this.collection.slice(0, 5), this.addOne);
        },

        addOne: function (book) {
            this.$el.append(new BookView({"model": book}).render().$el);
        }
    });

    var Commits = Backbone.Collection.extend({
        url: "/code"
    });

    var CommitView = Backbone.View.extend({
        tagName: "li",

        render: function () {
            var type = this.model.get("type").replace("Event", "");
            this.$el.html(type +": "+ this.model.get("repo").name + " (" + this.model.get("payload").commits.length + " commits)");

            var ul = $("<ul></ul>");
            ul.append(_.map(this.model.get("payload").commits.reverse(), function(commit){
                return $("<li>" + commit.message + "</li>")
            }));
            ul.hide();

            this.$el.append(ul);
            return this;
        }
    });

    var GitHubView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, "addOne");
            this.collection = new Commits();
            this.collection.on("reset", this.addAll, this);
            this.collection.fetch();
        },

        addAll: function () {
            var c = this.collection.filter(function(commit){return commit.get("type") === "PushEvent"});
            _.each(c.slice(0, 5), this.addOne);
            //this.collection.each(this.addOne);
        },

        addOne: function (book) {
            this.$el.append(new CommitView({"model": book}).render().$el);
        }
    });

    $(document).ready(function () {
        var bookView = new LibraryThingView({"el": $("#librarything")});
        var ghView = new GitHubView({"el": $("#github")});
    });

}());