var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WaiterSchema = new Schema(
	{
		first_name: {type: String, required: true, max: 100},
		last_name: {type: String, required: true, max: 100},
		phone_number: {type: String, required: true, max: 10},
		gender: {type: String, required: true, max: 100},
		date_of_birth: {type: Date},
	}
);


WaiterSchema
	.virtual('name')
	.get(function () {
		return this.last_name + ', ' + this.first_name;
	});

WaiterSchema
	.virtual('url')
	.get(function () {
		return '/waiter/' + this._id;
	});


module.exports = mongoose.model('Waiter', WaiterSchema);