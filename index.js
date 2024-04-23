const express = require("express");
const route = require('./src/routes/route')
const mongoose = require("mongoose");
const app = express();

mongoose.set("strictQuery", true);

app.use(express.json());

mongoose.connect(
    "mongodb+srv://sanketmunishwar7:q5WEY4lK4vMAzwbJ@cluster0.0jenlvx.mongodb.net/Sanket-blog1?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
 .then(() => console.log("DB is Connected"))
 .catch((err) => console.log(err));

app.use("/", route);

app.listen(4000, function () {
  console.log("Express app running on port" + 4000);
});