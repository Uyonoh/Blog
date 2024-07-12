const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


const username = "turakiuyonoh";
const password = process.env.PASSWORD;
const dbName = "blogDB";

// Set LIVE environment variable to true to access online DB
// else use localy hosted DB
const live = process.env.LIVE;

if (live) {
    uri = `mongodb+srv://${username}:${password}@cluster0.zpy0xmc.mongodb.net/`;
} else {
    uri = "mongodb://localhost:27017/"
}

uri += dbName;
console.log("connecting to " + uri);
mongoose.connect(uri);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("post", postSchema);


app.get("/", (req, res) => {

    Post.find({}).then((posts) => {
        if (posts.length === 0) {
            Post.create({
                title: "Samlpe Post",
                content: "Integer et massa a diam vulputate condimentum et sed est. Vestibulum pellentesque elementum ante pulvinar laoreet. Morbi facilisis pellentesque dui. Integer sit amet consectetur arcu. Vivamus id ligula iaculis, dictum libero vel, pellentesque dolor. Vivamus erat lectus, ultricies a tempus quis, gravida at eros. Phasellus a massa non purus gravida cursus non quis magna. Phasellus tincidunt dui id dolor tempor, id aliquet risus ultricies. Sed aliquam hendrerit est in lacinia. Maecenas mattis mauris non dolor blandit mollis. Donec at nulla facilisis, vulputate velit ac, fermentum tellus. Integer vehicula elementum risus, eget blandit nunc venenatis id. Mauris est massa, fringilla ac est a, malesuada rhoncus enim. Ut ultricies eros in congue sodales."
            });
            res.redirect("/");
        }
        res.render("index", {posts: posts});
    })
});

app.get("/about", (req, res) => {
    res.render("about", {});
});

app.get("/contact", (req, res) => {
    res.render("contact", {});
});

app.get("/compose", (req, res) => {
    res.render("compose", {});
});

app.post("/compose", async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    await Post.create({
        title: title,
        content: content
    });
    
    res.redirect("/");
});

app.get("/posts/:postTitle", (req, res) => {
    const postTitle = req.params.postTitle;

    Post.findOne({
        title: postTitle
    }).then((post) => {
        res.render("posts", {post: post});
    }).catch((err) => {
        cosole.log(err);
    })
});



const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log("Server is listening on port: " + port);
});