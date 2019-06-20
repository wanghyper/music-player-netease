import * as AT from './actionTypes'

export const setUserAction = (user) => {
  return {
    type: AT.SET_USER,
    user
  }
}

export const setHeaderAction = (header) => {
  return {
    type: AT.SET_HEADER,
    header
  }
}
export const setPlayListAction = (playList) => {
  return {
    type: AT.SET_PLAYLIST,
    playList
  }
}
export const addToPlayListAction = (list) => {
  return {
    type: AT.ADD_TO_PLAYLIST,
    list
  }
}
export const playAction = (index) => {
  return{
    type: AT.PLAY,
    index
  }
}
export const pauseAction = () => {
  return{
    type: AT.PAUSE,
  }
}
export const stopAction = () =>{
  return{
    type: AT.STOP
  }
}
//cyclicMode 播放循环模式 0顺序, 1随机
export const playLastAction = (cyclicMode) => {
  return{
    type: AT.PLAY_LAST,
    cyclicMode
  }
}
export const playNextAction = (cyclicMode) => {
  return{
    type: AT.PLAY_NEXT,
    cyclicMode
  }
}