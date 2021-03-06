/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");
**********************************************************************/

window.require = function() {
  var modules = {};
  var definitions = {};
  var nodejs_require = typeof window.require === 'function' ? window.require : null;

  var f = function(id, body) {
    if( id.substr( 0, 7 ) == 'node://' ) {
      // Calling for a NodeJS module.
      if( !nodejs_require ) {
        throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
      }
      return nodejs_require( id.substr( 7 ) );
    }

    if( typeof body === 'function' ) {
      definitions[id] = body;
      return body;
    }
    var mod;
    body = definitions[id];
    if (typeof body === 'undefined') {
      var err = new Error("Required module is missing: " + id);
      console.error(err.stack);
      throw err;
    }
    mod = modules[id];
    if (typeof mod === 'undefined') {
      mod = {exports: {}};
      var exports = mod.exports;
      body(f, mod, exports);
      modules[id] = mod.exports;
      mod = mod.exports;
    }
    return mod;
  };
  return f;
}();



/** @module $ */require( '$', function(require, module, exports) {
  exports.config={"name":"\"canvas-3d\"","description":"\"An API emulating a subset of canvas 2d in WebGL.\"","author":"\"tolokoban\"","version":"\"0.0.1\"","major":"0","minor":"0","revision":"1","date":"2017-08-14T09:09:42.000Z","consts":{}};
  var currentLang = null;
  exports.lang = function(lang) {
    if (lang === undefined) {
      if (window.localStorage) {
        lang = window.localStorage.getItem("Language");
      }
      if (!lang) {
        lang = window.navigator.language;
        if (!lang) {
          lang = window.navigator.browserLanguage;
          if (!lang) {
            lang = "fr";
          }
        }
      }
      lang = lang.substr(0, 2).toLowerCase();
    }
    currentLang = lang;
    if (window.localStorage) {
      window.localStorage.setItem("Language", lang);
    }
    return lang;
  };
  exports.intl = function(words, params) {
    var dic = words[exports.lang()],
        k = params[0],
        txt, newTxt, i, c, lastIdx, pos;
    var defLang;
    for( defLang in words ) break;
    if( !defLang ) return k;
    if (!dic) {
      dic = words[defLang];
      if( !dic ) {
        return k;
      }
    }
    txt = dic[k];
    if( !txt ) {
      dic = words[defLang];
      txt = dic[k];
    }
    if (!txt) return k;
    if (params.length > 1) {
      newTxt = "";
      lastIdx = 0;
      for (i = 0 ; i < txt.length ; i++) {
        c = txt.charAt(i);
        if (c === '$') {
          newTxt += txt.substring(lastIdx, i);
          i++;
          pos = txt.charCodeAt(i) - 48;
          if (pos < 0 || pos >= params.length) {
            newTxt += "$" + txt.charAt(i);
          } else {
            newTxt += params[pos];
          }
          lastIdx = i + 1;
        } else if (c === '\\') {
          newTxt += txt.substring(lastIdx, i);
          i++;
          newTxt += txt.charAt(i);
          lastIdx = i + 1;
        }
      }
      newTxt += txt.substr(lastIdx);
      txt = newTxt;
    }
    return txt;
  };
});
