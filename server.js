require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {});

app.use(
  session({
    secret: "LHDIDH$#%@$^#$^oq$#@%FSDFDSF@$ihvVSFIVHISHI41$#@^#%&#$$@#$JBVVLJSV",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    }
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/views"));

const index = require("./routes/index")
const admin = require("./routes/admin");
const task = require("./routes/task");
app.use("/", index);
app.use("/admin", admin);
app.use("/task", task);

app.use((req, res, next) => {
    let username = [];
    if (req.session.userId) {
        username.push(req.session.username);
    }
  res.render("error", {
        code: "404",
        msg: "Lost in space?",
        icon: "fa-solid fa-meteor",
        username: username
  })
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("Express app listening on port 3000");
});