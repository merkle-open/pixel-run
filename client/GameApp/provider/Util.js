import settings from "../settings";
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
    const saveData = data || this.data;
    const keys = Object.keys(saveData);
    keys.forEach(key => {
      result = Util.replaceAll(result, `{${key}}`, saveData[key]);
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
    this.enabled = settings.debug === true;
    this.namespace = namespace || "undefined";
  }

  /**
   * Apply arguments to the warn function if enabled
   */
  static warn(...args) {
    console.warn(...args);
  }

  /**
   * Apply arguments to the info function if enabled
   */
  static info(...args) {
    console.info(...args);
  }

  /**
   * Apply arguments to the error function if enabled
   */
  static error(...args) {
    console.error(...args);
  }

  /**
   * Apply arguments to the log function if enabled
   */
  static log(...args) {
    console.log(...args);
  }

  /**
   * Throws a new game error with a status and reason
   * @param  {String} reason      Error reason
   * @param  {String} status      Error status
   */
  static throw(reason, status) {
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

/**
 * Replace all orccurencies in a string with a replacement
 * @param  {String} target         Input ressource
 * @param  {*} search               Placeholder
 * @param  {*} replacement          Any value to replace
 * @return {String}                 Compiled
 */
Util.replaceAll = (target, search, replacement) =>
  target.replace(new RegExp(search, "g"), replacement);

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
