
var mongoose = require('mongoose');
var connection =  mongoose.connect('mongodb://localhost/db');

module.exports = connection;



