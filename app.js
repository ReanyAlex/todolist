const methodOverride     = require("method-override"),
      bodyParser         = require("body-parser"),
      mongoose           = require("mongoose"),
      express            = require('express'),
      app                = express();

mongoose.connect("mongodb://localhost/restful_todo_app");
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


let todoSchema = new mongoose.Schema({
  todo: String,
  explanation: String,
  created: {type: Date, default: Date.now}
});

let Todo = mongoose.model("Todo", todoSchema);

//Index Route
app.get("/",function(req, res) {
  res.redirect("/index")
})

app.get("/index",function(req, res) {
  Todo.find({},function(err, todos) {
    if (err) {
      console.log(err);
    }else {
      console.log("Index");
      res.render("index",{todos: todos})
    }
  })
})

//New Route
app.get("/index/new",function(req, res) {
  console.log("New");
  res.render("index");
})

//CREATE Route
app.post("/index",function(req, res) {
  console.log("Create");
  //leave off the .todo from req.body.todo to pass in the object
  Todo.create(req.body, function(err, newtodo) {
    if (err) {
      console.log(err);
    }else {
      res.redirect("/index")
    }
  })
})

//SHOW Route
app.get("/index/:id",function(req, res) {
  console.log("Show");
  Todo.findById(req.params.id, function(err, foundtodo) {
    if (err) {
      res.redirect("/index")
    }else {
      res.render("show", {todo: foundtodo});
    }
  });
})

//EDIT Route
app.get("/index/:id/edit", function(req,res) {
  console.log("Edit");
  Todo.findById(req.params.id, function(err, foundtodo) {
    if (err) {
      res.redirect("/index")
    }else {
      res.render("edit", {todo: foundtodo});
    }
  });
});

//UPDATE Route
app.put("/index/:id",function(req,res) {
  console.log("Update");
  // req.body.blog.body = req.sanitize(req.body.blog.body)
  Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo) {
    if (err) {
      res.redirect("/index")
    } else {
      res.redirect("/index/"+req.params.id)
    }
  });
})

//DESTROY Route
app.delete("/index/:id",function(req,res) {
  Todo.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/index")
    } else {
      res.redirect("/index")
    }
  })
})


app.listen(3000, function() {
  console.log('Todo List on port 3000!')
});
