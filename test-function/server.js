var mysql = require('mysql');
var moment = require('moment-timezone');

moment.tz.setDefault("Asia/Jakarta");

var con = mysql.createPool({
  host     : '10.91.32.3',
  port     : '3306',
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : 'testing'
});

exports.server = (req, res) => {

  var queryString = "SELECT * FROM product";
  console.log('Query  ' + queryString);

  con.query(queryString, function (error, results) {
      console.log('Query Timestamp : ' + moment().format('YYYY-MM-DD HH:mm:ss'));

      if (error) {
          console.log('Error execute query : ' + error);
      } else {
        console.log('Try selecting...');

        if (results.length > 0) {
          res.status(200).send(results);
          console.log('Retrieve data success');
        } else {
          res.status(500).send(results);
          console.log('Retrieve data failed');
        }
      }

  });

  // let message = req.query.message || req.body.message || 'Hello World!';
  
};
