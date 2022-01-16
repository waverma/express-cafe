var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema(
	{
		number: {type: String, required: true},
		capacity: {type: String, required: true},
		waiter: {type: Schema.ObjectId, ref: 'Waiter', required: true},
	}
);


TableSchema
	.virtual('url')
	.get(function () {
		return '/Table/' + this._id;
	});


module.exports = mongoose.model('Table', TableSchema);