var express = require('express');
var router = express.Router();
var Link = require('../models/link');
var Stat = require('../models/stat');

router.all('*', function(req, res, next) {
    var stat = new Stat({
        url: req.url,
        visitor: {
            ipAddress: req.ip,
            userAgent: req.header('user-agent'),
            referer: req.header('Referer')
        }
    });
    stat.save(function(err) {
        if (err) throw err;
        next();
    });
});

/* GET home page. */
router.get('/', function(req, res) {
    var linksCount, visitsCount;
    Link.find({}, function(err, links) {
        linksCount = links.length;
        Stat.find({}, function(err, stats) {
            visitsCount = stats.length;
            res.render('index', { title: 'Short It Up! | 09s.ir', linksCount: linksCount, visitsCount: visitsCount });
        });
    });
});

router.post('/', function(req, res) {
    var url = req.body.address.search(/^http[s]?\:\/\//) == -1 ? 'http://' + req.body.address : req.body.address;
    var type = req.body.type ? req.body.type : 'Website';
    console.log(type);
    var link = new Link({
        address: url,
        ipAddress: req.ip,
        type: type
    });
    link.save(function(err) {
        if (err) res.json(err);
        res.json(link);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    Link.findOne({id: id}, function(err, link) {
        if (err) {
            res.send(500, 'Something messed up! -_-');
        }
        else {
            if (!link) {
                res.send(404, 'Not found! :(');
            }
            else {
                link.visitors.push({
                    ipAddress: req.ip,
                    userAgent: req.header('user-agent'),
                    referer: req.header('Referer'),
                    time: Date.now()
                });
                link.save();
                res.redirect(302, link.address);
            }
        }
    });
});

router.get('/:id/stats', function(req, res) {
    var id = req.params.id;
    Link.findOne({id: id}, {'__v': 0, '_id': 0, 'visitors._id': 0}, function(err, link) {
        if (err) {
            res.send(500, 'Something messed up! -_-');
        }
        else {
            if (!link) {
                res.send(404, 'Not found! :(');
            }
            else {
                res.render('stats', {title: 'Stats of ' + link.address, stats: link});
            }
        }
    });
});

module.exports = router;
