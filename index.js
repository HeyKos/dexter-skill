'use strict';

var Alexa  = require('alexa-sdk'),
    Dexter = require('./dexter.js');

exports.handler = function(event, context, callback) {
  var alexa  = Alexa.handler(event, context),
      dexter = new Dexter();

  alexa.APP_ID = dexter.APP_ID;
  alexa.resources = dexter.languageStrings;

  alexa.registerHandlers({
    "LaunchRequest": function() {
      dexter.sendPokedexResponse(this);
    },
    "GetPokedexEntryIntent": function() {
      dexter.sendPokedexResponse(this);
    },
    "AMAZON.HelpIntent": function() {
      dexter.sendHelpResponse(this);
    },
    "AMAZON.CancelIntent": function() {
      dexter.sendStopResponse(this);
    },
    "AMAZON.StopIntent": function() {
      dexter.sendStopResponse(this);
    }
  });
  alexa.execute();
};