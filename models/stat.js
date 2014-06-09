var mongoose = require('mongoose')
    ,Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost/09s");

var statSchema = new Schema({
    time: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String
    },
    visitor: {
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        },
        referer: {
            type: String
        }
    }
});
module.exports = connection.model('Stat', statSchema);