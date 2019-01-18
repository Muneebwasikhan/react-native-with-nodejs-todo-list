const mongoose = require("mongoose");

let todoSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true
  }
});

const Todo = mongoose.model("todoList",todoSchema);




module.exports = Todo;