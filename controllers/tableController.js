var Table = require('../models/table');
var Client = require('../models/client');
var Waiter = require('../models/waiter');
var mongoose = require('mongoose');
var Reservation = require('../models/reservation');
var moment = require('moment');
const { body,validationResult } = require('express-validator');


var async = require('async');

exports.table_list = function(req, res, next) {
	res.render('layout', { title: 'sd' });
};

exports.cafe_description = function(req, res, next) {
	res.render('cafe_desc', { title: 'Ristorante la Gazzella' });
};

exports.cafe_menu = function(req, res, next) {
	res.render('cafe_menu', { title: 'Меню' });
};

exports.reserv_day_select_get = function(req, res, next) {
	res.render('day_select', { title: 'В какой день?' });
};

exports.invalid_client_number_get = function(req, res, next) {
	res.render('invalid_client_number', { title: 'Пользователь с таким номером телефона уже существует, и это не вы ;)' });
};

exports.invalid_client_number_post = [
	(req, res, next) => {
		res.redirect('/cafe/reservation/' + req.params.time1 + '/' + req.params.time2 +'/form');
	}
];

exports.reserv_day_select_post = [
	(req, res, next) => {
			res.redirect('/cafe/reservation/join/' + req.body.day + '/' + req.body.time1 + '/' + req.body.time2);
	}
];

exports.reserv_date_join_get = function(req, res, next) {
	res.redirect('/cafe/reservation/' + req.params.day + 'T' + req.params.time1 + ':00.000Z' + '/' +  req.params.day + 'T' + req.params.time2 + ':00.000Z' + '/form');
};


exports.success_post = [
	(req, res, next) => {
			res.redirect('/');
	}
];

exports.success_get = function(req, res, next) {
	res.render('success_reserv', { title: 'Вы успешно забронировали столик' });
};


exports.reserv_get = function(req, res, next) {
	async.parallel({
        reservations: function(callback) {
			Reservation.find({
				$and:[
					{ 'client': null },
					{ $and: [
							{ 'start_time': { $gte: (new Date(new Date(req.params.time1) - 100)).toISOString().slice(0, -1) }, },
							{ 'end_time': { $lte: (new Date(new Date(req.params.time2))).toISOString().slice(0, -1) }, },
					]},
				]
			})
				.sort({start_time : 1})
				.populate('client')
				.populate({ 
					path: 'table',
					populate: {
						path: 'waiter',
						model: 'Waiter'
					} 
				})
				.exec(callback);
		},		
		
    }, function(err, results) {
		if (err) { return next(err); }
		res.render('reservation_form', { title: 'В какой день?', reservations: results.reservations });
	});
};

exports.reserv_post = [
	(req, res, next) => {
			new_client = new Client({first_name: req.body.first_name, last_name: req.body.last_name, phone_number: req.body.number});
			Client.find({'phone_number': req.body.number}) 
					.exec(function(err, results) {
						if (results.length != 0){
							if (results[0].first_name == req.body.first_name && results[0].last_name == req.body.last_name){
								Reservation.update({_id: req.body.reservation}, {client: results[0]}, function(err, affected, resp) {console.log(resp);});
								res.redirect('/cafe/reservation/success');
							} else{
								res.redirect('/cafe/reservation/wrong/' +  req.params.time1 + '/' + req.params.time2);
							}
						} else{
							new_client.save(function (err) {
								if (err) { return next(err); }
									Reservation.update({_id: req.body.reservation}, {client: new_client}, function(err, affected, resp) {console.log(resp);});
									res.redirect('/cafe/reservation/success');
								});
						}
					});
        }
];
