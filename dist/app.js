'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* IMPORTANT
* Change these paths to your own SSL and Apple Pay certificates,
* with the appropriate merchant identifier and domain
* See the README for more information.
*/
/*
Copyright (C) 2016 Vantiv. All Rights Reserved.

Adapted from EmporiumWeb:
https://developer.apple.com/library/content/samplecode/EmporiumWeb/Introduction/Intro.html
 
Abstract:
Sets up a simple Express HTTP server to host the example page, and handles requesting 
the Apple Pay merchant session from Apple's servers.
*/

var APPLE_PAY_CERTIFICATE_PATH = "./certificates/applePayCert.pem";
//const SSL_CERTIFICATE_PATH = "./certificates/cert.pem";
//const SSL_KEY_PATH = "./certificates/key.pem";
var MERCHANT_IDENTIFIER = "merchant.com.mercury.prelive";
var MERCHANT_DOMAIN = "vantivapplepayweb.herokuapp.com";

try {
	_fs2.default.accessSync(APPLE_PAY_CERTIFICATE_PATH);
	//  fs.accessSync(SSL_CERTIFICATE_PATH);
	//  fs.accessSync(SSL_KEY_PATH);
} catch (e) {
	throw new Error('You must generate your SSL and Apple Pay certificates before running this example.');
}

//const sslKey = fs.readFileSync(SSL_KEY_PATH);
//const sslCert = fs.readFileSync(SSL_CERTIFICATE_PATH);
var applePayCert = _fs2.default.readFileSync(APPLE_PAY_CERTIFICATE_PATH);

/**
* Set up our server and static page hosting
*/
console.log('__dirname: ' + __dirname);
var options = {
	index: 'index.html'
};
var app = (0, _express2.default)();
app.use(_express2.default.static('public'));
app.use('/.well-known', _express2.default.static('.well-known'));
app.use(_bodyParser2.default.json());

/**
* A POST endpoint to obtain a merchant session for Apple Pay.
* The client provides the URL to call in its body.
* Merchant validation is always carried out server side rather than on
* the client for security reasons.
*/
app.post('/getApplePaySession', function (req, res) {

	// We need a URL from the client to call
	if (!req.body.url) return res.sendStatus(400);

	console.log(req.body.url);
	// We must provide our Apple Pay certificate, merchant ID, domain name, and display name
	var options = {
		url: req.body.url,
		cert: applePayCert,
		key: applePayCert,
		method: 'post',
		body: {
			merchantIdentifier: MERCHANT_IDENTIFIER,
			domainName: MERCHANT_DOMAIN,
			displayName: 'My Store'
		},
		json: true
	};

	// Send the request to the Apple Pay server and return the response to the client
	(0, _request2.default)(options, function (err, response, body) {
		if (err) {
			console.log('Error generating Apple Pay session!');
			console.log(err, response, body);
			res.status(500).send(body);
		}
		res.send(body);
	});
});

app.post('/makeVantivIPCall', function (req, res) {
	console.log('hit /makeVantivIPCall');
	console.log(req.body.registrationId + " " + req.body.amount);

	var options = {
		url: _config2.default.vantivIPURL + "/PaymentsAPI/Credit/SaleByRecordNo",
		method: 'post',
		headers: {
			"content-type": "application/json",
			"accept": "*/*",
			"authorization": "Basic " + _config2.default.vantivIPAuth
		},
		body: {
			"OperatorID": "TEST",
			"InvoiceNo": "123456",
			"Purchase": req.body.amount,
			"Tax": "0.00",
			"TokenType": "RegistrationId",
			"RecordNo": req.body.registrationId,
			"Frequency": "OneTime"
		},
		json: true
	};

	(0, _request2.default)(options, function (err, response, body) {
		if (err) {
			console.log(err, response, body);
			res.status(500).send(body);
		}
		res.send(body);
	});
});

/**
* Start serving the app.
*/
_http2.default.createServer(app).listen(process.env.PORT || 4567);