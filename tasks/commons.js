'use strict';

var path = require('path');
var fs = require ('fs');
var xlsx = require('node-xlsx');



/**
 * Load the messages from a csv file
 * @param  {[type]}   grunt    [description]
 * @param  {[type]}   filepath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.loadMessages = function(grunt, filepath) {
	var items = {};
	if (!grunt.file.exists(filepath)) {
		// if file doesn't exists, return an empty list
		return items;
	}
	grunt.log.writeln("Load messages from " + filepath);
	var data = xlsx.parse(filepath); // parses a file
	data[0].data.forEach(function(item) {
		var key = item[0];
		if (key !== '') {
			items[item[0]] = item[1];
		}
	});
	return items;
};

/**
 * Save the messages in a csv file
 * @param  {[type]}   grunt    [description]
 * @param  {[type]}   filepath [description]
 * @param  {[type]}   messages [description]
 */
exports.saveMessages = function (grunt, filepath, messages) {
	// create array to be exported to csv
	var data = [];
	for (var key in messages) {
		var msg = messages[key];
		data.push([key, msg]);
	}
	var buffer = xlsx.build([{
		name: "mySheetName",
		data: data
	}]);
	fs.writeFileSync(filepath, buffer, 'binary');
};

/**
 * Return the name of the messages file
 * @param  {[type]} options User options in the Gruntfile.js
 * @param  {[type]} locale  [description]
 * @return {[type]}         [description]
 */
exports.messagesFilename = function(options, locale) {
	// if it's the default locale, so there is no file
	if (locale === options.defaultLocale) {
		return;
	}
	return path.join(options.messagesPath, options.messagesFilePrefix + locale + '.xlsx');
};

/**
 * Replace all occurence of a given substring by a new substring
 * @param  {[type]} data     [description]
 * @param  {[type]} token    [description]
 * @param  {[type]} newtoken [description]
 * @return {[type]}          [description]
 */
exports.replaceAll = function(data, token, newtoken) {
	return data.toString().split(token).join(newtoken);
};