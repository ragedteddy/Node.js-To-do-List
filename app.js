const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-nikhil2:mongonikhil2@cluster0.vnuzq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });

});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
        });
        res.redirect("/" + listName);
    }

});

app.post("/delete/:customListName", function(req, res) {
    const customListName = req.params.customListName;

    if (customListName === "Today") {
        Item.deleteOne({ _id: req.body.checkbox }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Selected Item was deleted successfully.");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: customListName }, { $pull: { items: { _id: req.body.checkbox } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + customListName);
            }
        });
    }
});


app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", { listTitle: customListName, newListItems: foundList.items });
            }
        } else {
            console.log("Something went wrong!");
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started.");
});