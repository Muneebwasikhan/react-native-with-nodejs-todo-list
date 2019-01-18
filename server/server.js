const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const Todo = require("./model/todo");



const mongoose = require("mongoose");
mongoose.connect(keys.mongoUri,{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.post("/add",(req,res) => {
  let body = {
    text: req.body.text
  }

  const newTodo = new Todo(body);
  newTodo.save().then((todoData) => {
    console.log(todoData);
    res.send({success: true, data: todoData})
  }).catch(err => {
    res.send({success: false, message: err.message})
  });
});
app.post("/update",(req,res) => {

  Todo.findOneAndUpdate({_id: req.body.id},{$set:{text: req.body.text}},{new: true}).then((updatedValue => {
    res.send({success: true, data: updatedValue})
  })).catch(err => {
    res.send({success: false, message: err.message})
  });
});
app.post("/delete",(req,res) => {

 Todo.findByIdAndDelete(req.body.id,() => {
   res.send({success: true})
 }).catch(err => {
  res.send({success: false, message: err.message})
});
});

app.get("/getlist",(req,res) => {
  Todo.find({}).then(data => {
    res.send({success: true, data})
  }).catch(err => {
    res.send({success: false, message: err.message})
  });
})

const port = process.env.PORT || 8000;

app.listen(port,() => {
  console.log(`listening on ${port}`)
})