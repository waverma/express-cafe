var mongoose = require('mongoose');
var moment = require('moment');
var Table = require('../models/table');

var Schema = mongoose.Schema;


var ReservationSchema = new Schema(
	{
		client: {type: Schema.ObjectId, ref: 'Client', required: false},
		table: {type: Schema.ObjectId, ref: 'Table', required: true},
		start_time: {type: Date, required: true},
		end_time: {type: Date, required: true},
	}
);



ReservationSchema
	.virtual('url')
	.get(function () {
		return '/reservation/' + this._id;
	});
	
ReservationSchema
	.virtual('date_range')
	.get(function () {
		return moment(this.start_time).format('Do MMMM (HH:mm)') + ' - ' + moment(this.end_time).format('Do MMMM (HH:mm)');
});

ReservationSchema
	.virtual('time_range')
	.get(function () {
		return moment(this.start_time).format('HH:mm') + ' - ' + moment(this.end_time).format('HH:mm');
});

ReservationSchema
	.virtual('comparable_date')
	.get(function () {
		return this.start_time.toISOString();
});
	
	
module.exports = mongoose.model('Reservation', ReservationSchema);