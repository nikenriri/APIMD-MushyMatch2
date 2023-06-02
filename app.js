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
          res.send(results);
          console.log(results);
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
      SELECT recipes.id_recipe, recipes.name_recipe, recipes.pict_recipe
      FROM recipes
      INNER JOIN mushroom ON recipes.id_jamur = mushroom.id
      WHERE mushroom.id = ?
    `;
  
    db.query(queryStr, [jamurId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Terjadi kesalahan dalam mengambil data.");
      } else {
        res.send(results);
        console.log(results);
      }
    });
  });

//menampilkan detil resep berdasarkan id resep 
app.get('/recipes/:id', function (req, res) {
    const recipesId = req.params.id; // Mengambil ID dari parameter URL
    
    const queryStr = "SELECT * FROM recipes WHERE id_recipe = ?";
    const values = [recipesId];
    db.query(queryStr, values, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Terjadi kesalahan dalam mengambil data.");
      } else {
        if (results.length > 0) {
          res.send(results);
          console.log(results);
        } else {
          res.status(404).send("Data tidak ditemukan.");
        }
      }
    });
});



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})