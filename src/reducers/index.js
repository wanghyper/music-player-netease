import {combineReducers} from "redux"
import user from './user'
import header from './header'
import player from './player'

export default combineReducers({
  user,
  header,
  player
})