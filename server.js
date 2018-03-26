var express = require('express');
var fs = require('fs');
var request = require('request');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/addRecipe', function(req, res){
  var newRecipe = req.body;
  var currentRecipes = JSON.parse(fs.readFileSync('recipeTest.json', 'utf8'));
  currentRecipes.push(newRecipe);

  saveRecipeToFile(currentRecipes, function(err) {
    if (err) {
      return;
    }
  });
})

app.get('/recipes', function(req, res){
  var recipes = JSON.parse(fs.readFileSync('recipeTest.json', 'utf8'));
  var newRecipes = [];
  var flag = false;

  let data = recipes.map((item) => {
    flag = false;
    item.ingredients.map((i) =>{
      if((i.name.toLowerCase().includes(req.query.keyword) ||
          item.name.toLowerCase().includes(req.query.keyword)) && flag == false){
        flag = true;
        newRecipes.push(item);
      }
    })
  })
  res.json(newRecipes);

})

function saveRecipeToFile(recipe, callback) {
  fs.writeFile('./recipeTest.json', JSON.stringify(recipe), callback);
}

app.listen('8080');

exports = module.exports = app;
