'use strict';

var _             = require('lodash'),
    HtmlEncode    = require('htmlencode'),
    SsmlValidator = require("ssml-validator"),
    Pokedex       = require('pokedex-promise-v2');

module.exports = (function() {
  
  var Dexter = (function() {

    function Dexter(alexa) {
      // Loop through all the properties of the class and re-assign the functions to bind "this" to maintain scope throughout.
      _.forOwn(proto, function(value, key) {
        if(_.isFunction(proto[key])) {
          proto[key] = proto[key].bind(this);
        }
      }.bind(this));
      proto.pokedex = new Pokedex();
    }

    var proto = {
      // Constants
      // ---------

      APP_ID:           "amzn1.ask.skill.92cb9cda-9cac-49d8-af27-480f1de038f4",
      languageStrings:  {
        "en": {
          "translation": {
              "SKILL_NAME":                 "Dexter",
              "WELCOME_MESSAGE":            "Hello I am Dexter. Ask me about a Pokemon.",
              "WELCOME_REPROMPT":           "For instructions on what you can say, please say help me.",
              "HELP_MESSAGE":               "You can ask about Pokemon. For example, tell me about a Bulbasaur, or, you can say exit...Now, what can I help you with?",
              "HELP_REPROMPT":              "You can say things like, tell me about Bulbasaur, or you can say exit...Now, what can I help you with?",
              "STOP_MESSAGE":               "Logging out.",
              "POKEMON_REPEAT_MESSAGE":     "Try saying repeat.",
              "POKEMON_NOT_FOUND_MESSAGE":  "I\'m sorry, I could not locate that pokemon in my memory bank",
              "POKEMON_NOT_FOUND_REPROMPT": "Try another pokemon name"
          }
        }
      },
      pokedex:          null,


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
        var pokemonSlot    = ev.event.request.intent.slots.pokemon,
            pokemonName    = "",
            cardTitle      = null,
            pokedexData    = null,
            speechOutput   = null,
            repromptSpeech = null;
        if (pokemonSlot && pokemonSlot.value) {
            pokemonName = pokemonSlot.value.toLowerCase();
        }

        cardTitle = pokemonName;
        this.pokedex.getPokemonSpeciesByName(pokemonName)
        .then(function(response) {
          var pokedexEntry = null;
          if(response && response.flavor_text_entries && response.flavor_text_entries.length > 0) {
            pokedexEntry = _.find(response.flavor_text_entries, function(entry) {
              return entry.language.name === "en" && entry.version.name === "blue";
            });

            pokedexData = pokedexEntry.flavor_text;
            // Remove new lines and tabs.
            while(pokedexData.indexOf("\n") > -1) {
              pokedexData = _.replace(pokedexData, "\n", " ");
            }
            while(pokedexData.indexOf("\f") > -1) {
              pokedexData = _.replace(pokedexData, "\f", " ");
            }
            ev.emit(':tellWithCard', pokedexData, ev.attributes['repromptSpeech'], cardTitle, pokedexData);
          }
          else {
            speechOutput   = ev.t("POKEMON_NOT_FOUND_MESSAGE"),
            repromptSpeech = ev.t("POKEMON_NOT_FOUND_REPROMPT");
            speechOutput += repromptSpeech;
            ev.attributes['speechOutput'] = speechOutput;
            ev.attributes['repromptSpeech'] = repromptSpeech;

            ev.emit(':ask', speechOutput, repromptSpeech);
          }
        })
        .catch(function(error) {
          speechOutput   = ev.t("POKEMON_NOT_FOUND_MESSAGE"),
          repromptSpeech = ev.t("POKEMON_NOT_FOUND_REPROMPT");
          speechOutput += repromptSpeech;
          ev.attributes['speechOutput'] = speechOutput;
          ev.attributes['repromptSpeech'] = repromptSpeech;

          ev.emit(':ask', speechOutput, repromptSpeech);
        });
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