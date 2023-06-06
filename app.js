const express = require('express');
const app = express();
const { db } = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

//menampilkan semua data jamur
app.get('/get-jamur', function (req, res){
    const queryStr = 'SELECT * FROM mushroom';
    db.query(queryStr, (err, results) => {
        if(err){
            console.log(err);
            res.status(500).send("Terjadi kesalahan dalam mengambil data.");
        }else{
            res.send(results);
            console.log(results);
        }
    })
})


//menampilkan data jamur berdasarkan id
app.get('/jamur/:id', function (req, res) {
    const id = req.params.id; // Mengambil ID dari parameter URL
    
    const queryStr = "SELECT * FROM mushroom WHERE id = ?";
    const values = [id];
    db.query(queryStr, values, (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send("Terjadi kesalahan dalam mengambil data.");
      } else {
          if (results.length > 0) {
              const jamur = results[0];  // Mengambil resep pertama dari hasil query
              const jamurObj = {
                  id_jamur: jamur.id,
                  name: jamur.name,
                  latin_name: jamur.latin_name,
                  description: jamur.description,
                  habitat: jamur.habitat,
                  picture: jamur.pict,
                  status: jamur.status
              };
              res.send(jamurObj);
              console.log(jamurObj);
          } else {
              res.status(404).send("Data tidak ditemukan.");
          }
      }
  });
});


//menampilkan list resep berdasarkan id jamur
app.get('/list-recipes/:id', function (req, res) {
  const jamurId = req.params.id;

  const queryStr = `
    SELECT recipes.id_recipe, recipes.name_recipe, recipes.pict_recipe, mushroom.name
    FROM recipes
    INNER JOIN mushroom ON recipes.id_jamur = mushroom.id
    WHERE mushroom.id = ?
  `;

  db.query(queryStr, [jamurId], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send("Terjadi kesalahan dalam mengambil data.");
      } else {
        if(results.length > 0){
          const recipesObj = results.map(recipe => {
              return {
                  id_recipe: recipe.id_recipe,
                  name_recipe: recipe.name_recipe,
                  pict_recipe: recipe.pict_recipe,
                  name_jamur: recipe.name
              };
          });
          res.send(recipesObj);
          console.log(recipesObj);
        }
      }
  });
});


//menampilkan detil resep berdasarkan id resep 
app.get('/recipes/:id', function (req, res) {
    const recipesId = req.params.id; // Mengambil ID dari parameter URL
    
    const queryStr = "SELECT id_recipe, name_recipe, ingredients, steps, pict_recipe, video FROM recipes WHERE id_recipe = ?";
    const values = [recipesId];
    db.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Terjadi kesalahan dalam mengambil data.");
        } else {
            if (results.length > 0) {
                const recipe = results[0];  // Mengambil resep pertama dari hasil query
                const recipeObj = {
                    id_recipe: recipe.id_recipe,
                    name_recipe: recipe.name_recipe,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    pict_recipe: recipe.pict_recipe,
                    video: recipe.video
                };
                res.send(recipeObj);
                console.log(recipeObj);
            } else {
                res.status(404).send("Data tidak ditemukan.");
            }
        }
    });
});


//melakukan pencarian pada data jamur
app.get('/search', function (req, res) {
    const searchTerm = req.query.q; // Mengambil parameter pencarian dari query string (contoh: /search?q=keyword)
    const queryStr = `
        SELECT * FROM mushroom
        WHERE name LIKE '%${searchTerm}%'
    `;

    db.query(queryStr, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Terjadi kesalahan dalam melakukan pencarian.');
        } else {
            const jamurObj = {};  // Membuat objek baru
            results.forEach((jamur) => {
              jamurObj[jamur.id] = jamur;  // Menambahkan data jamur ke objek dengan ID sebagai kunci
          });
          res.send(jamurObj);
          console.log(jamurObj);
        }
    });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})
