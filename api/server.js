const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://marko:admin@cluster0.dfuypya.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connected to db"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("hello");
});

const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post("/todo/new", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});
app.put("/todos/updated/:id", async (req, res) => {
  try {
    const updatetodo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json("updated");
  } catch (err) {
    res.json(res);
  }
});

app.listen(3001, () => console.log("server started on port 3001"));
