var mongo = require('mongoskin');
var db = mongo.db("mongodb://mirza:0123456789@ds053251.mongolab.com:53251/hakmof", ["scraped_data", "scraped_twitter"]);

var graph = require('fbgraph');
var token = require('../tokens');
graph.setAccessToken(token.fb.token);


pages_arr = [];
pages_arr.push("IAESTEMacedonia");
pages_arr.push("EESTECLCSkopje");
pages_arr.push("900653919979708");  //Plenum
pages_arr.push("1553840998179517"); //Ekonomski Plenum
pages_arr.push("MOF.edu");


// Facebook Graph Calls to Periodically Collect Data
for (var i in pages_arr) {
    graph.get(pages_arr[i] + "/posts?limit=250", function (err, res) {
        var collection = db.collection('scraped_data');
        var rows = [];
        for (var i in res['data']) {
            var objekt = {};

            objekt.created_time = res['data'][i]['created_time'];
            objekt.message = res['data'][i]['description'];
            objekt.name = res['data'][i]['from']['name'];
            objekt.pictures = res['data'][i]['picture'];
            objekt.shares = res['data'][i]['shares'];
            objekt.type = res['data'][i]['type'];
            objekt.link = res['data'][i]['link'];

            rows.push(objekt);
        }

        collection.insert(rows, function (err, result) {
            //console.log(result);
        });
    });
}