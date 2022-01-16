#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

var Client = require('./models/client')
var Waiter = require('./models/waiter')
var Reservation = require('./models/reservation')
var Table = require('./models/table')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;


//db.dropDatabase(function(err) {cb(err);});	


var clients = []
var waiters = []
var tables = []
var reservations = []

function clientCreate(first_name, last_name, number, d_birth, cb) {
	clientdetail = {first_name: first_name, last_name: last_name, phone_number: number}
	if (d_birth != false) clientdetail.date_of_birth = d_birth
  
	var client = new Client(clientdetail);
       
	client.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New client: ' + client);
		clients.push(client)
		cb(null, client)
	});
}

function waiterCreate(first_name, last_name, phone_number, gender, date_of_birth, cb) {
	clientdetail = {first_name: first_name, last_name: last_name, phone_number: phone_number, gender: gender}
	if (date_of_birth != false) clientdetail.date_of_birth = date_of_birth
	
	var waiter = new Waiter(clientdetail);
       
	waiter.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New waiter: ' + waiter);
		waiters.push(waiter)
		cb(null, waiter);
	});
}

function tableCreate(number, capacity, waiter, cb) {
  tabledetail = { 
    number: number,
    capacity: capacity,
    waiter: waiter
  }
    
  var table = new Table(tabledetail);    
  table.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New table: ' + table);
    tables.push(table)
    cb(null, table)
  }  );
}


function reservationSchemaCreate(client, table, start_time, end_time, cb) {
	reservationSchemaCreatedetail = { 
		client: client,
		table: table,
		start_time: start_time,
		end_time: end_time
	}
    
	var reservation = new Reservation(reservationSchemaCreatedetail);    
	reservation.save(function (err) {
		if (err) {
			console.log('ERROR CREATING reservation: ' + reservation);
			cb(err, null)
			return
		}
		console.log('New reservation: ' + reservation);
		reservations.push(reservation)
		cb(null, reservation)
	});
}


function createClients(cb) {
    async.series([
        function(callback) {
			clientCreate('CFN1', 'CLN1', '1111111111', '1973-06-06', callback);
        },
        function(callback) {
			clientCreate('CFN2', 'CLN2', '2222222222', '1982-11-8', callback);
        },
        function(callback) {
			clientCreate('CFN3', 'CLN3', '3333333333', '1992-04-06', callback);
        },
        function(callback) {
			clientCreate('CFN4', 'CLN4', '4444444444', '2000-12-16', callback);
        },
        function(callback) {
			clientCreate('CFN5', 'CLN5', '5555555555', '1971-12-16', callback);
        },
		function(callback) {
			clientCreate('CFN6', 'CLN6', '6666666666', '1973-06-06', callback);
        },
        function(callback) {
			clientCreate('CFN7', 'CLN7', '7777777777', '1982-11-8', callback);
        },
        function(callback) {
			clientCreate('CFN8', 'CLN8', '8888888888', '1992-04-06', callback);
        },
        function(callback) {
			clientCreate('CFN9', 'CLN9', '9999999999', '2000-12-16', callback);
        },
        function(callback) {
			clientCreate('CFN10', 'CLN10', '1010101010', '1971-12-16', callback);
        },
        ],
        // optional callback
        cb);
}


function createWaiters(cb) {
    async.series([
        function(callback) {
			waiterCreate('WFN1', 'WLN1', '1233333333', 'Female', '2001-06-06', callback);
        },
        function(callback) {
			waiterCreate('WFN2', 'WLN2', '2233333333', 'Female', '2002-11-8', callback);
        },
        function(callback) {
			waiterCreate('WFN3', 'WLN3', '3233333333', 'Male', '2003-04-06', callback);
        },
        function(callback) {
			waiterCreate('WFN4', 'WLN4', '4233333333', 'Male', '2004-12-16', callback);
        },
        function(callback) {
			waiterCreate('WFN5', 'WLN5', '5233333333', 'Female', '2005-12-16', callback);
        },
        ],
        // optional callback
        cb);
}


function createTable(cb) {
    async.series([
        function(callback) {
			tableCreate(1, 4, waiters[0], callback);
        },
        function(callback) {
			tableCreate(2, 6, waiters[0], callback);
        },
		function(callback) {
			tableCreate(3, 4, waiters[1], callback);
        },
        function(callback) {
			tableCreate(4, 6, waiters[1], callback);
        },
		function(callback) {
			tableCreate(5, 4, waiters[2], callback);
        },
        function(callback) {
			tableCreate(6, 6, waiters[2], callback);
        },
		function(callback) {
			tableCreate(7, 4, waiters[3], callback);
        },
        function(callback) {
			tableCreate(8, 6, waiters[3], callback);
        },
		function(callback) {
			tableCreate(9, 4, waiters[4], callback);
        },
        function(callback) {
			tableCreate(10, 6, waiters[4], callback);
        },
        ],
        // optional callback
        cb);
}


function createReservation(cb) {
    async.series([
        function(callback) {
			reservationSchemaCreate(clients[1], tables[0], '2022-02-01 15:00:00', '2022-02-01 18:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[2], tables[0], '2022-02-01 18:00:00', '2022-02-01 20:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[3], tables[0], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[4], tables[1], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[4], tables[2], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[6], tables[2], '2022-02-01 18:00:00', '2022-02-01 23:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[7], tables[3], '2022-02-01 15:00:00', '2022-02-01 22:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[8], tables[4], '2022-02-01 15:00:00', '2022-02-01 18:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[9], tables[5], '2022-02-01 15:00:00', '2022-02-01 17:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[10], tables[5], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);
        },
		function(callback) {
			reservationSchemaCreate(clients[5], tables[5], '2022-02-01 19:00:00', '2022-02-01 20:30:00', callback);
        },
        ],
        // optional callback
        cb);
}

function createReservation(cb) {
    async.series([
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[0], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[1], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[2], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[3], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[4], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[5], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[6], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[7], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[8], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
		
		function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 12:00:00', '2022-02-01 13:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 13:00:00', '2022-02-01 14:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 14:00:00', '2022-02-01 15:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 15:00:00', '2022-02-01 16:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 16:00:00', '2022-02-01 17:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 17:00:00', '2022-02-01 18:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 18:00:00', '2022-02-01 19:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 19:00:00', '2022-02-01 20:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 20:00:00', '2022-02-01 21:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 21:00:00', '2022-02-01 22:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 22:00:00', '2022-02-01 23:00:00', callback);},
        function(callback) {reservationSchemaCreate(null, tables[9], '2022-02-01 23:00:00', '2022-02-01 24:00:00', callback);},
        ],
        // optional callback
        cb);
}


async.series([
    createClients,
    createWaiters,
    createTable,
    createReservation
],
// Optional callback
function(err, results) {
    //if (err) {
    //    console.log('FINAL ERR: '+err);
    //}
    //else {
    //    console.log('BOOKInstances: '+bookinstances);
    //    
    //}
    // All done, disconnect from database
    mongoose.connection.close();
});