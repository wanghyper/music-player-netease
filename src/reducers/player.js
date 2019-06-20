import {
  PLAY,
  PLAY_LAST,
  PLAY_NEXT,
  PAUSE,
  STOP,
  SET_PLAYLIST,
  ADD_TO_PLAYLIST
} from '../actions/actionTypes'

let initState = {
  status: 'PAUSE',//PAUSE PLAYING STOP
  index: 0,
  playList: []
}
const playerCache = JSON.parse(localStorage.getItem('player_state'));
if (playerCache) {
  localStorage.removeItem('player_state')
  playerCache.status = 'PAUSE'//初始播放状态强制暂停
  playerCache.index = typeof playerCache.index === 'number' ? playerCache.index : 0
  Object.assign(initState, playerCache)
}
const reducer = (state = initState, action) => {
  let newState = {}
  switch (action.type) {
    case PLAY_NEXT:
      newState = {
        status: state.status,
        index: state.index,
        playList: state.playList.slice()
      }
      if (action.cyclicMode === 0) {
        newState.index = state.index === state.playList.length - 1 ? 0 : state.index + 1
      } else if (action.cyclicMode === 1) {
        newState.index = Math.floor(Math.random() * state.playList.length)
      }
      break
    case PLAY_LAST:
      newState = {
        status: state.status,
        index: state.index,
        playList: state.playList.slice()
      }
      if (action.cyclicMode === 0) {
        newState.index = state.index === 0 ? state.playList.length - 1 : state.index - 1
      } else if (action.cyclicMode === 1) {
        newState.index = Math.floor(Math.random() * state.playList.length)
      }
      break
    case PLAY://播放指定歌曲
      newState = {
        status: 'PLAYING',
        index: !action.index && action.index !== 0 ? state.index : action.index,
        playList: state.playList.slice()
      }
      break
    case PAUSE://只会暂停当前播放的歌曲
      newState = {
        status: 'PAUSE',
        index: state.index,
        playList: state.playList.slice()
      }
      break
    case STOP:
      newState = {
        status: 'STOP',
        index: state.index,
        playList: state.playList.slice()
      }
      break
    case SET_PLAYLIST:
      newState = {
        status: state.status,
        index: state.index,
        playList: action.playList
      }
      break
    case ADD_TO_PLAYLIST:
      newState = {
        status: state.status,
        index: state.index,
        playList: [...state.playList, action.list]
      }
      break
    default:
      newState = state
  }
  localStorage.setItem('player_state', JSON.stringify(newState))
  return newState
}
export default reducer