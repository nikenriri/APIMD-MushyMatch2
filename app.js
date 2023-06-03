app.get('/get-jamur', function (req, res){
    const queryStr = 'SELECT * FROM mushroom';
    db.query(queryStr, (err, results) => {
        if(err){
            console.log(err);
            res.status(500).send('Terjadi kesalahan saat mengambil data jamur.');
        }else{
            const jamurObj = {};  // Membuat objek baru
            results.forEach((jamur) => {
                jamurObj[jamur.id] = jamur;  // Menambahkan data jamur ke objek dengan ID sebagai kunci
            });
            res.send(jamurObj);
            console.log(jamurObj);
        }
    })
});
