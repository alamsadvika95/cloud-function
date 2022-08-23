var mysql = require('mysql');
const redis = require('redis');
var moment = require('moment-timezone');

moment.tz.setDefault("Asia/Jakarta");

var con = mysql.createPool({
  host     : '127.0.0.1',
  port     : '3306',
  user     : 'root',
  password : 'Sadvikaalam98_',
  database : 'testing'
});

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

exports.server = (req, res) => {
  try {
    var idProduct = req.body.idProduct;
    // Check the redis store for the data first
    redisClient.get(idProduct, async (err, dataProduct) => {
      if (dataProduct) {
        return res.status(200).send({
          error: false,
          message: `Data for the product with id ${idProduct} from the cache`,
          data: JSON.parse(dataProduct)
        })
      } else { // When the data is not found in the cache then we can make request to the server
  
        var queryString = "SELECT * FROM product WHERE id = ?";
        console.log('Query  ' + queryString);
      
        con.query(queryString, [idProduct],  function (error, results) {
          console.log('Query Timestamp : ' + moment().format('YYYY-MM-DD HH:mm:ss'));
    
          if (error) {
              console.log('Error execute query : ' + error);
          } else {
            console.log('Try selecting...');
    
            if (results.length > 0) {
              res.status(200).send({
                error: false,
                message: `Recipe for ${idProduct} from the server`,
                data: results
              });
              // save the record in the cache for subsequent request
              redisClient.setex(idProduct, 1440, JSON.stringify(results));
              console.log('Retrieve data success');
            } else {
              console.log('Retrieve data failed');
            }
          }
        });
      }
    }) 
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
  // let message = req.query.message || req.body.message || 'Hello World!';
  
};
