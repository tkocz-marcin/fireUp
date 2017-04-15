var express = require('express')
var app = express()
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

app.get('/save', function(req, res) {
    var fs = require('fs');

    function readWriteAsync(quote, author, time, amount) {
        fs.readFile('./public/js/information.json', 'utf-8', function(err, data) {
            if (err) throw err;

            var old = data;
            let newValue = `const information = [{
            		quote: "${quote}",
            		author: "${author}",
            		lastDateInMiliseconds: ${time},
            		amount: ${amount},
            	}]`

            fs.writeFile('./public/js/information.json', newValue, 'utf-8', function(err) {
                if (err) throw err;
                console.log('Zapis!');
            });
        });
    }

    readWriteAsync(req.query.quote, req.query.author, req.query.time, req.query.amount);
    res.send(); 
})
