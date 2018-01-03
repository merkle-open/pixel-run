import store from "../redux/store";

/**
 * Custom error type for all avaible game failures,
 * can be thrown with the debugger or called manually.
 * @param {String} message      Reason
 */
function GameError(message) {
  this.name = "GameError";
  this.message = message || "Undefined error";
}

GameError.prototype = Error.prototype;
window.GameError = GameError;

function Util() {
  // class wrapper
}

Util.noop = () => {
  // Basic no-operation method
};

/**
 * Private helper to order the score descending
 * @param  {Array} score        Highscore array
 * @return {Array}              Ordered array
 */
Util.orderScore = score => {
  function compare(a, b) {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    }
    return 0;
  }
  return score.sort(compare);
};

/**
 * Set the defaults for a variable. Custom handler can
 * also be used to check the value (to prevent long conditions)
 * @param  {T} input                Input value
 * @param  {T} defaultValue         Default value
 * @param  {Function} custom        Custom validator
 * @return {T}                      Right value
 */
Util.default = (input, defaultValue, custom) => {
  if (typeof custom === "function") {
    if (custom(input) === true) {
      return input;
    }
    return defaultValue;
  } else if (!input || input === undefined || input === null) {
    return defaultValue;
  }
  return input;
};

/**
 * Generates a clone of an object (without proto values)
 * @param  {Object} obj         Object to clone
 * @return {Object}             Cloned object
 */
Util.clone = obj => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  const copy = obj.constructor();
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr) && attr !== "_saveState") {
      copy[attr] = obj[attr];
    }
  }
  return copy;
};

/**
 * Hyphenates a camelCased string
 * @param  {String} str         Any camel/pascal cased string
 * @return {String}             Hyphenated string
 */
Util.hyphenate = str => str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Creates a new replacer instance
 * @constructor
 * @param {String} input        Template string
 * @param {Object} data         Dataset
 */
class Replacer {
  constructor(input, data) {
    this.input = input;
    this.data = data;
    return this;
  }

  /**
   * Main replace method, replaces each key set with {<value>} with
   * the key associated in the data. Data can be passed in this method
   * or directly in the constructor of the replacer.
   * @param  {Object} data    Optional data
   * @return {String}         Compiled string
   */
  replace(data) {
    let result = this.input;
    if (data === undefined) {
      data = this.data;
    }
    const keys = Object.keys(data);
    keys.forEach(key => {
      result = Util.replaceAll(result, `{${key}}`, data[key]);
    });
    return result;
  }
}

/**
 * Shorthand for creation and calling the replace method,
 * easiest usage for the replace logic.
 * @param  {String} input       Template string
 * @param  {Object} data        Dataset
 * @return {String}             Compiled string
 */
Util.replace = (input, data) => new Replacer(input).replace(data);

Util.Replacer = Replacer;

/**
 * Used for debugging the application and its states
 * @constructor
 * @param {String} namespace        Debugger namespace
 */
class Debugger {
  constructor(namespace) {
    this.enabled = store.getState().settings.debug === true;
    this.namespace = namespace || "undefined";
  }

  /**
   * Apply arguments to the warn function if enabled
   */
  warn(...args) {
    if (console && console.warn) {
      this.$out(args, args => {
        console.warn(...args);
      });
    }
  }

  /**
   * Apply arguments to the info function if enabled
   */
  info(...args) {
    if (console && console.info) {
      this.$out(args, args => {
        console.info(...args);
      });
    }
  }

  /**
   * Apply arguments to the error function if enabled
   */
  error(...args) {
    if (console && console.error) {
      this.$out(args, args => {
        console.error(...args);
      });
    }
  }

  /**
   * Apply arguments to the log function if enabled
   */
  log(...args) {
    if (console) {
      this.$out(args, args => {
        console.log(...args);
      });
    }
  }

  /**
   * Throws a new game error with a status and reason
   * @param  {String} reason      Error reason
   * @param  {String} status      Error status
   */
  throw(reason, status) {
    throw new GameError(`${reason}(${status})`);
  }

  /**
   * Output provider (internal method)
   * @param  {[type]} handle [description]
   * @return {[type]}        [description]
   */
  $out(values, handle) {
    const args = Array.prototype.slice.call(values);
    args.unshift(`[${this.namespace}]:`);
    handle(args);
  }
}

Util.Debugger = Debugger;

/**
 * Like Object.keys but get the values and not keys
 * @param  {Object} dataObject      Object target
 * @return {Array}                  Object values
 */
Util.getValues = dataObject => {
  const dataArray = [];
  for (const o in dataObject) {
    dataArray.push(dataObject[o]);
  }
  return dataArray;
};

/**
 * Get playerscores in compressed object form
 * @return {Obejct}                 Compressed score info
 */
Util.getPlayerScoreData = () => {
  const res = Util.orderScore(store.getState().currentPlayers);

  return {
    p1: res[0] ? res[0].name : "-",
    p2: res[1] ? res[1].name : "-",
    p3: res[2] ? res[2].name : "-",
    p1s: res[0] ? res[0].score : "-",
    p2s: res[1] ? res[1].score : "-",
    p3s: res[2] ? res[2].score : "-",
    p1img: res[0] ? res[0].image() : "",
    p2img: res[1] ? res[1].image() : "",
    p3img: res[2] ? res[2].image() : "",
    wtype: store.getState().world
  };
};

/**
 * Replace all orccurencies in a string with a replacement
 * @param  {String} target         Input ressource
 * @param  {*} search               Placeholder
 * @param  {*} replacement          Any value to replace
 * @return {String}                 Compiled
 */
Util.replaceAll = (target, search, replacement) =>
  target.replace(new RegExp(search, "g"), replacement);

/**
 * Gets the score in a HTML string (tr>td) for inserting
 * it into a table body
 * @return {String}                 HTML markup
 */
Util.getScoreTable = (opts, handler) => {
  const generated = [];
  $.get("/api/get/scores", scores => {
    scores.forEach(score => {
      generated.push("<tr><td>");
      if (opts.index) {
        generated.push("<strong>");
        generated.push(`# ${score.index}`);
        generated.push("</strong></td><td>");
      }
      generated.push(score.score);
      generated.push("</td><td>");
      generated.push(score.name);
      generated.push("</td><td>");
      generated.push(Util.firstToUpper(score.world));
      generated.push("</td><tr>");
    });

    handler(generated.join("\n"));
  });
};

Util.calculate = {
  /**
   * Calculates the score from the x-axis value
   * of a player in the game
   * @param  {Number} pixels      Pixel value
   * @return {Number}             Player score
   */
  score(pixels) {
    const calc = pixels / 100;
    return Math.round(calc);
  }
};

/**
 * Transform first char to upper (capitalize)
 * @param  {String} value       Input value
 * @return {String}             Capitalized string
 */
Util.firstToUpper = value => value.charAt(0).toUpperCase() + value.slice(1);

export { Debugger, Replacer, GameError };
export default Util;
