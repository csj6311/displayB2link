var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connection = require('../config/db');
mongoose.Promise = require('bluebird');

var displaySchema = new Schema({
    divNo           : String,
    pageId          : String,
    pageType        : String,
    use             : String,
    file            : String,
    filepath        : String,
    chartData       : {
        year : { type: String, default: null },
        month : { type: String, default: null }
    },
    regDate         : Date
});



module.exports = connection.model('displayModel',displaySchema);;