
var express = require('express');
var bodyParser = require('body-parser');
var app = express(); 
var { Client, Pool } = require("pg");

app.use(bodyParser.urlencoded({ extended: false}));
app.set('view engine', 'ejs');
app.use( bodyParser.json() );
app.use(express.static(__dirname));

var port = process.env.PORT || 8080;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';



var pool = new Pool({
  host: 'ec2-54-243-241-62.compute-1.amazonaws.com',
  user: 'ppwqkzzxrwnoik',
  password: '7224f99a9812445f300328a68c6b709eb2ad37312466eebcd86024269dbcbea5',
  database: 'd2v3t8q347e85f',
  port: 5432,
  ssl: true
});



app.get('/', function(req, resp) {
  resp.sendFile(__dirname + '/index.html');
});



app.post('/', function(req, resp) {
  resp.sendFile(__dirname + '/index.html');
});


app.post('/result', function(req, resp) {
    
pool.connect((err, client, done) => {
  var input = req.body.longLink;
    // console.log(input)
    if(input == "") {
      resp.render('addedLink');
    } else {

      var sql = "INSERT INTO link_table(original_link, short_link) VALUES ('"+input+"', '') RETURNING id";
      pool.query(sql, function (err, result) {
          if (err) {
              console.log(err)
          } else {
            forId = result.rows[0].id;
            var myObj = {
              original_link: input,
              short_link: 'short.Link.sh/'+forId,
            };

            resp.render("result", {
              myObj : myObj,
              title : 'result'
            });

            // console.log(result);
        }      
    });
    }

  })
});
  
  
  app.get('/Short/:getId', function(req, resp) {
  
          var para = req.params.getId;
          var secSql = "SELECT original_link FROM link_table WHERE id= '"+para+"'";
          console.log("work")
      pool.query(secSql, function (err, result) {
        if (err) throw err;
        resp.redirect(result.rows[0].original_link);
        console.log(result.rows[0].original_link);
      });
      // console.log(result.rows[0].original_link);
  });




app.listen(port, function() {
    console.log('my app is running');
  });