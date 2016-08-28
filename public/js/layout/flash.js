(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var notify = require('notifyjs-browser')(null, $);

$.notify.defaults({
  autoHideDelay: 15000
});

for (var val in flash) {
  var len = flash[val].length;
  for (var i = 0; i < len; i++) {
    $.notify(flash[val][i], val);
  }
}

},{"jquery":"jquery","notifyjs-browser":"notifyjs-browser"}]},{},[1]);
