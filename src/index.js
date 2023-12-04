const express = require("express");
const route = require("../router/router");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://DeeptirthaMukherjee:QYKI3k8QSKC4I7FZ@cluster1.khatgm1.mongodb.net/project4-db?retryWrites=true&w=majority",
    { UseNewUrlParser: true }
  )
  .then(()=> console.log("MongoDB is connected"))
  .catch((err) =>console.log(err.message));
  app.use("/",route);
  app.listen(process.env.PORT ||  3001,function(){
  console.log("listining at " +(process.env.PORT || 3001))
});