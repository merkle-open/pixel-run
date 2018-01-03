import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  ADD_PLAYERS,
  ADD_PLAYER,
  ADD_PLAYER_NAME,
  ADD_WORLD,
  ADD_INDICATE_FUNCTION,
  SET_GAME,
  ADD_CURSORS,
  ADD_SOUND,
  ADD_TILEMAP_LAYER,
  ADD_BACKGROUND,
  SET_CURRENT_PLAYERS,
  SET_PLAYER_AMOUNT,
  ADD_PLAYER_TO_CURRENT_PLAYERS,
  UPDATE_TEXT_OF_A_CURRENT_PLAYER,
  UPDATE_SCORE_OF_A_CURRENT_PLAYER,
  INCREMENT_CURRENT_STEP,
  INCREMENT_TAB_COUNT,
  TOGGLE_GAME_STATE
} from "./actions";

const initialState = {
  currentStep: 0,
  game: {},
  indicateFunction: {},
  world: "",
  audio: [],
  tilemapLayer: {},
  background: {},
  players: [],
  playerNames: ["", "", ""],
  currentPlayers: [],
  cursors: {},
  session: {},
  gameIsRunning: false
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYERS:
      return { ...state, players: action.players };
    case ADD_PLAYER:
      return { ...state, players: [...state.players, action.player] };
    case ADD_PLAYER_NAME:
      return {
        ...state,
        playerNames: state.playerNames.map(
          (p, i) => (i == action.index ? action.playerName : p)
        )
      };
    case ADD_WORLD:
      return { ...state, world: action.world };
    case ADD_INDICATE_FUNCTION:
      return { ...state, indicateFunction: action.indicateFunction };
    case SET_GAME:
      return { ...state, game: action.game };
    case ADD_CURSORS:
      return { ...state, cursors: action.cursors };
    case ADD_SOUND:
      return { ...state, audio: [...state.audio, action.sound] };
    case ADD_TILEMAP_LAYER:
      return { ...state, tilemapLayer: action.tilemapLayer };
    case ADD_BACKGROUND:
      return { ...state, background: action.background };
    case SET_CURRENT_PLAYERS:
      return { ...state, currentPlayers: action.players };
    case SET_PLAYER_AMOUNT:
      return {
        ...state,
        game: {
          ...state.game,
          players: { ...state.game.players, amount: action.amount }
        }
      };
    case ADD_PLAYER_TO_CURRENT_PLAYERS:
      return {
        ...state,
        currentPlayers: [...state.currentPlayers, action.player]
      };
    case UPDATE_TEXT_OF_A_CURRENT_PLAYER:
      let newCurrentPlayersText = state.currentPlayers.map(p => {
        if (p.id == action.currentUserId) {
          p.text = action.text;
        }
        return p;
      });
      return { ...state, currentPlayers: newCurrentPlayersText };
    case UPDATE_SCORE_OF_A_CURRENT_PLAYER:
      let newCurrentPlayersScore = state.currentPlayers.map(p => {
        if (p.id == action.currentUserId) {
          p.score = action.score;
        }
        return p;
      });
      return { ...state, currentPlayers: newCurrentPlayersScore };
    default:
      return state;
    case INCREMENT_CURRENT_STEP:
      return { ...state, currentStep: state.currentStep + 1 };
    case TOGGLE_GAME_STATE:
      return { ...state, gameIsRunning: !state.gameIsRunning };
  }
}

export default rootReducer;
