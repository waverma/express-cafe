var Table = require('../models/table');
var Client = require('../models/client');
var Waiter = require('../models/waiter');
var mongoose = require('mongoose');
var Reservation = require('../models/reservation');
var moment = require('moment');
const { body,validationResult } = require('express-validator');




const Vonage = require('@vonage/server-sdk')
const vonage = new Vonage({
  apiKey: "9e7ddfe4",
  apiSecret: "Vn8evY5omNOGe7tb"
})
const from = "Vonage APIs"
const to = "79655189368"
const text = 'A text message sent using the Vonage SMS API'



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
		var url = '/cafe/reservation/' + req.params.time1 + '/' + req.params.time2 +'/form'
		res.redirect(url);
	}
];

exports.reserv_day_select_post = [
	(req, res, next) => {
			res.redirect('/cafe/reservation/join/' + req.body.day + '/' + req.body.time1 + '/' + req.body.time2);
	}
];

exports.reserv_date_join_get = function(req, res, next) {
	var url = '/cafe/reservation/' + req.params.day + 'T' + req.params.time1 + ':00.000Z' + '/' +  req.params.day + 'T' + req.params.time2 + ':00.000Z' + '/form'
	res.redirect(url);
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
	console.log(new Date(req.params.time1).toISOString())
	console.log(new Date(req.params.time2).toISOString())
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
		res.render('table_info', { title: 'В какой день?', reservations: results.reservations });
	});
};

exports.reserv_post = [
	(req, res, next) => {
			new_client = new Client({first_name: req.body.first_name, last_name: req.body.last_name, phone_number: req.body.number});
			console.log(req.body.first_name)
			console.log(req.body.last_name)
			console.log(req.body.number)
			
			if (req.body.first_name == 'admin'){
				vonage.message.sendSms(from, to, text, (err, responseData) => {
					if (err) {
						console.log(err);
					} else {
						if(responseData.messages[0]['status'] === "0") {
							console.log("Message sent successfully.");
						} else {
							console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
						}
					}
				})
				res.redirect('/cafe/reservation/success');
				console.log('ADMIN DETECTED')
				return;
			}
			
			Client.find({'phone_number': req.body.number}) 
					.exec(function(err, results) {
						if (results.length != 0){
							if (results[0].first_name == req.body.first_name && results[0].last_name == req.body.last_name){
								Reservation.update({_id: req.body.reservation}, {client: results[0]}, function(err, affected, resp) {console.log(resp);});
								console.log(req.body.reservation)
								res.redirect('/cafe/reservation/success');
							} else{
								console.log('INVALID CLIENT DETAILS')
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


exports.table_info = function(req, res, next) {
	async.parallel({
		table: function(callback) {
			Table.findById(req.params.id)
				.populate('waiter')
				.exec(callback);
		},
		
		list_tables: function(callback) {
			Table.find({}, 'number capacity')
				.exec(callback);
		},
		
		reservations: function(callback) {
			Reservation.find({ 'table': req.params.id , 'client': null})
				.sort({start_time : 1})
				.populate('client')
				.exec(callback);
		},

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.table==null) {
            var err = new Error('Table not found');
            err.status = 404;
            return next(err);
        }
		
		res.render('table_info', { title: 'Table info', table: results.table, table_list: results.list_tables, reservations: results.reservations} );
	});
};





// Создать брони по запросу POST.
//exports.reservation_create_post = [
//    // Convert the reservation to an array.
//    (req, res, next) => {
//        if(!(req.body.reservation instanceof Array)){
//            if(typeof req.body.reservation ==='undefined')
//            req.body.reservation = [];
//            else
//            req.body.reservation = new Array(req.body.reservation);
//        }
//        next();
//    },
//
//    // Validate and sanitise fields.
//    //body('first_name', 'Firstname must not be empty.').trim().isLength({ min: 1 }).escape(),
//    //body('last_name', 'Lastname must not be empty.').trim().isLength({ min: 1 }).escape(),
//    //body('number', 'Number must be contain 10 digits.').trim().isLength({ min: 10, max: 10 }).escape(),
//	//body('reservation', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
//
//    // Process request after validation and sanitization.
//    (req, res, next) => {
//
//        // Extract the validation errors from a request.
//        const errors = 	validationResult(req);
//
//        // Create a Book object with escaped and trimmed data.
//        var reservation = new Reservation(
//          { 
//            reservation: req.body.reservation
//          });
//
//        if (!errors.isEmpty()) {
//            async.parallel({
//                reservations: function(callback) {
//					Reservation.find({ 'table': req.params.id , 'client': null})
//						.sort({start_time : 1})
//						.populate('client')
//						.exec(callback);
//				},
//            }, function(err, results) {
//                if (err) { return next(err); }
//                res.render('table_info', { title: 'Reserve a table', reservation: reservation, errors: errors.array() });
//            });
//            return;
//        }
//        else {
//			//cl = new Client({first_name: req.body.first_name, last_name: req.body.reservation.last_name, phone_number: req.body.number});
//			//
//			//cl.save(function (err) {
//            //    if (err) { return next(err); }
//            //       Reservation.update({_id: req.body.reservation._id}, {"client" : cl }, {upsert:true}, function (err) {
//			//		if (err) { return next(err); }
//			//			res.redirect('/');
//			//			console.log('updated: ' + req.body.first_name);
//			//			console.log('updated: ' + req.body.last_name);
//			//			console.log('updated: ' + req.body.number);
//			//		});
//            //    });
//				
//			//reservation.update({_id: req.body.reservation._id}, {"client" : cl }, {upsert:true})
//            
//			//res.redirect('/');
//        }
//    }
//];

//exports.book_update_get = function(req, res, next) {
//
//    // Get book, authors and genres for form.
//    async.parallel({
//        book: function(callback) {
//            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
//        },
//        authors: function(callback) {
//            Author.find(callback);
//        },
//        genres: function(callback) {
//            Genre.find(callback);
//        },
//        }, function(err, results) {
//            if (err) { return next(err); }
//            if (results.book==null) { // No results.
//                var err = new Error('Book not found');
//                err.status = 404;
//                return next(err);
//            }
//            res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
//        });
//
//};

//exports.index = function(req, res) {
//    res.send('NOT IMPLEMENTED: Site Home Page');
//};
