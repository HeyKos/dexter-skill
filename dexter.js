'use strict';

var _   = require('lodash'),
Pokedex = require('./pokedex.js');

module.exports = (function() {
  
  var Dexter = (function() {

    function Dexter(alexa) {
      // Loop through all the properties of the class and re-assign the functions to bind "this" to maintain scope throughout.
      _.forOwn(proto, function(value, key) {
        if(_.isFunction(proto[key])) {
          proto[key] = proto[key].bind(this);
        }
      }.bind(this));
    }

    var proto = {
      // Constants
      // ---------

      APP_ID: "amzn1.ask.skill.bded8f69-fa6f-466e-9f53-f08a02aae80f",
      languageStrings: {
        "en": {
          "translation": {
              "SKILL_NAME": "Dexter",
              "WELCOME_MESSAGE": "Hello I am Dexter. Ask me about a Pokemon.",
              "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
              "HELP_MESSAGE": "You can ask about Pokemon. For example, tell me about a Bulbasaur, or, you can say exit...Now, what can I help you with?",
              "HELP_REPROMPT": "You can say things like, tell me about Bulbasaur, or you can say exit...Now, what can I help you with?",
              "STOP_MESSAGE": "Logging out.",
              "POKEMON_REPEAT_MESSAGE": "Try saying repeat.",
              "POKEMON_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know.",
              "POKEMON_NOT_FOUND_REPROMPT": "What else can I help with?"
          }
        }
      },

      // Handlers
      // ---------
      launchResponse: function(alexa){
        alexa.attributes['speechOutput'] = alexa.t("WELCOME_MESSAGE", alexa.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        alexa.attributes['repromptSpeech'] = alexa.t("WELCOME_REPROMPT");
        alexa.emit(':ask', alexa.attributes['speechOutput'], alexa.attributes['repromptSpeech'])
      },
      sendPokedexResponse: function (ev) {
        var pokemonSlot = ev.event.request.intent.slots.pokemon,
            pokemonName = "";
        if (pokemonSlot && pokemonSlot.value) {
            pokemonName = pokemonSlot.value.toLowerCase();
        }

        var cardTitle = pokemonName;
        var pokedexData = Pokedex[pokemonName];

        if (pokedexData) {
          ev.attributes['speechOutput'] = pokedexData;
          ev.attributes['repromptSpeech'] = ev.t("POKEMON_REPEAT_MESSAGE");
          ev.emit(':tellWithCard', pokedexData, ev.attributes['repromptSpeech'], cardTitle, pokedexData);
        } 
        else {
          var speechOutput   = ev.t("POKEMON_NOT_FOUND_MESSAGE"),
              repromptSpeech = ev.t("POKEMON_NOT_FOUND_REPROMPT");
          
          speechOutput += repromptSpeech;
          ev.attributes['speechOutput'] = speechOutput;
          ev.attributes['repromptSpeech'] = repromptSpeech;

          ev.emit(':ask', speechOutput, repromptSpeech);
        }
      }, 
      sendHelpResponse: function (alexa) {
        var speechOutput = alexa.t("HELP_MESSAGE");
        alexa.emit(':ask', speechOutput, speechOutput);
      },
      sendStopResponse: function(alexa) {
        alexa.emit(':tell', alexa.t("STOP_MESSAGE"));
      }
    }

    Dexter.prototype = proto;
    return Dexter;

  })();

  return Dexter;

})();