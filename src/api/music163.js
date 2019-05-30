const axios = require('axios')
const req = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {}
});
module.exports = {
  //根据用户id获取用户歌单
  getSongListByUserId(id) {
    return req.get('/user/playlist?uid=' + id)
  },
  //根据歌单id获取歌单详情
  getListDetailById(id) {
    return req.get('/playlist/detail?id=' + id)
  },
  //获取用户详情
  getUserInfo(id){
    return req.get('/user/detail?uid=' + id)
  }
}