var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.Types.ObjectId,
    ai = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/09s");
ai.initialize(connection);

var linkSchema = new Schema({
    id: ObjectId,
    address: String,
    url: String,
    date: {
        type: Date,
        default: Date.now
    },
    visitors: [{
        ipAddress: String,
        userAgent: String,
        referer: String,
        time: Date
    }],
    ipAddress: String,
    type: String
});

linkSchema.plugin(ai.plugin, {
    startAt: 1,
    field: 'id'
});
module.exports = connection.model('Link', linkSchema);