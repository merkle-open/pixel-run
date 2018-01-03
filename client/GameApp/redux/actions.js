/*
 * action types
 */

export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";
export const ADD_PLAYERS = "ADD_PLAYERS";
export const ADD_WORLD = "ADD_WORLD";
export const ADD_INDICATE_FUNCTION = "ADD_INDICATE_FUNCTION";
export const SET_GAME = "SET_GAME";
export const ADD_CURSORS = "ADD_CURSORS";
export const ADD_SOUND = "ADD_SOUND";
export const ADD_TILEMAP_LAYER = "ADD_TILEMAP_LAYER";
export const ADD_BACKGROUND = "ADD_BACKGROUND";
export const SET_CURRENT_PLAYERS = "SET_CURRENT_PLAYERS";
export const SET_PLAYER_AMOUNT = "SET_PLAYER_AMOUNT";
export const ADD_PLAYER_TO_CURRENT_PLAYERS = "ADD_PLAYER_TO_CURRENT_PLAYERS";
export const ADD_PLAYER_NAME = "ADD_PLAYER_NAME";
export const ADD_PLAYER = "ADD_PLAYER";
export const UPDATE_TEXT_OF_A_CURRENT_PLAYER =
  "UPDATE_TEXT_OF_A_CURRENT_PLAYER";
export const UPDATE_SCORE_OF_A_CURRENT_PLAYER =
  "UPDATE_SCORE_OF_A_CURRENT_PLAYER";
export const INCREMENT_CURRENT_STEP = "INCREMENT_CURRENT_STEP";
export const TOGGLE_GAME_STATE = "TOGGLE_GAME_STATE";

/*
 * action creators
 */

export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index };
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter };
}

export function addPlayers(players) {
  return { type: ADD_PLAYERS, players };
}

export function addPlayer(player) {
  return { type: ADD_PLAYER, player };
}

export function addWorld(world) {
  return { type: ADD_WORLD, world };
}

export function addIndicateFunction(indicateFunction) {
  return { type: ADD_INDICATE_FUNCTION, indicateFunction };
}

export function setGame(game) {
  return { type: SET_GAME, game };
}

export function addCursors(cursors) {
  return { type: ADD_CURSORS, cursors };
}

export function addSound(sound) {
  return { type: ADD_SOUND, sound };
}

export function addTilemapLayer(tilemapLayer) {
  return { type: ADD_TILEMAP_LAYER, tilemapLayer };
}

export function addBackground(background) {
  return { type: ADD_BACKGROUND, background };
}

export function setCurrentPlayers(players) {
  return { type: SET_CURRENT_PLAYERS, players };
}

export function setPlayerAmount(amount) {
  return { type: SET_PLAYER_AMOUNT, amount };
}

export function addPlayerToCurrentPlayers(player) {
  return { type: ADD_PLAYER_TO_CURRENT_PLAYERS, player };
}

export function addPlayerName(playerName, index) {
  return { type: ADD_PLAYER_NAME, playerName, index };
}

export function updateTextOfACurrentPlayer(currentUserId, text) {
  return { type: UPDATE_TEXT_OF_A_CURRENT_PLAYER, currentUserId, text };
}

export function updateScoreOfACurrentPlayer(currentUserId, score) {
  return { type: UPDATE_SCORE_OF_A_CURRENT_PLAYER, currentUserId, score };
}

export function incrementCurrentStep() {
  return { type: INCREMENT_CURRENT_STEP };
}

export function toggleGameState() {
  return { type: TOGGLE_GAME_STATE };
}
