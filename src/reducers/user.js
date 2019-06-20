import {SET_USER} from '../actions/actionTypes'

let initState = {
  userId: '',
  nickname: '',
  avatarUrl: ''
}
let userCache = null
try{
  userCache = JSON.parse(sessionStorage.getItem('user_profile'))
}catch (e) {
  sessionStorage.removeItem('user_profile')
}

const reducer = (state = userCache || initState, action) => {
  switch (action.type) {
    case SET_USER:
      if (action.user === null) {
        sessionStorage.removeItem('user_profile')
        return initState
      } else {
        sessionStorage.setItem('user_profile', JSON.stringify(action.user))
      }
      return action.user
    default:
      return state
  }
}
export default reducer