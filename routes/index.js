var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index2', {
        title: 'Homepage'
    });
});

/* GET test page. */
router.get('/test', function(req, res, next) {
	res.render('index0', {
		title: 'Express'
	});
});

module.exports = router;
