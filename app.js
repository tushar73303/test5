const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const app = express();
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to Your MongoDB Atlas Database
mongoose.connect("mongodb+srv://tushar73303:Keiw9LAlXxVfvXee@senecaweb.pcg58hk.mongodb.net/?retryWrites=true&w=majority");// mongodb string
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});
// define the company schema
const TodoSchema = new Schema({
  
    "task": String,
    "completed":Boolean
    
  
  });
  // register the Company model using the companySchema
  // use the web322_users collection in the db to store documents
  //var MyModel  = mongoose.model("web322_users", mySchema);
  var ToDoList = mongoose.model("todo", TodoSchema);







app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return date;
        }
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname:".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));






// Routes Main

app.get('/', async (req, res) => {   
    const data = await ToDoList.find();
    res.render('index', { data , layout:false });
});


// add
app.post('/add', async (req, res) => {
  const { task } = req.body;
  if (task) {
  var NewUser = new ToDoList({
      task: task
     
    });
    await NewUser.save();
  }
  res.redirect('/');
});

// complete post
app.post('/complete/:id', async (req, res) => {
  const id = req.params.id;


    if (id) {
    await ToDoList.findByIdAndUpdate(id, { completed : true});
    }
    
    res.redirect('/');
});




// edit get
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
    //const id = req.query.id;
    
    const data = await ToDoList.find({"_id" : id} , "_id task");
    res.render('edit', { data , layout:false });
    
});


// Update Id
app.post('/update/:id', async (req, res) => {
  const id = req.params.id;
  const task = req.body.task;
  if (id && task) {
  await ToDoList.findByIdAndUpdate(id, { task });
  }
  res.redirect('/');
  
});


// Delete Id
app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  if (id) {
  await ToDoList.findByIdAndDelete(id);
  }
  res.redirect('/');
});


// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
