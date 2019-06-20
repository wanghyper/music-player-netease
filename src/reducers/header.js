import {SET_HEADER} from '../actions/actionTypes'
const initState = {
  hasHistory: false,
  name: ''
}
const reducer = (state = initState, action)=> {
  switch (action.type) {
    case SET_HEADER:
      return action.header
    default:
      return state
  }
}
export default reducer