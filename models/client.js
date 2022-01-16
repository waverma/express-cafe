var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
	phone_number: {type: String, required: true, max: 10},
	date_of_birth: {type: Date},
  }
);

// Виртуальное свойство для полного имени автора
ClientSchema
	.virtual('name')
	.get(function () {
		return this.last_name + ', ' + this.first_name;
	});

ClientSchema
	.virtual('info')
	.get(function () {
		return this.last_name + ', ' + this.first_name + ' (' + this.phone_number + ')';
	});

// Виртуальное свойство - URL автора
ClientSchema
	.virtual('url')
	.get(function () {
		return '/client/' + this._id;
	});

//Export model
module.exports = mongoose.model('Client', ClientSchema);