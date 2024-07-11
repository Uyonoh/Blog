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

uri = `mongodb+srv://${username}:${password}@cluster0.zpy0xmc.mongodb.net/${dbName}`;
mongoose.connect(uri);


app.get("/", (req, res) => {
    res.render("index", {});
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

app.post("/compose", (req, res) => {
    res.redirect("/");
});



const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log("Server is listening on port: " + port);
});