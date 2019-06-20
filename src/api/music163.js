const axios = require('axios')
const req = axios.create({
  baseURL: 'http://'+ window.location.hostname+':8000',
  withCredentials: true,
  headers: {}
});
module.exports = {
  login(account, password, loginType) {//手机登录or邮箱登录
    let url = loginType === 1 ?
      `/login/cellphone?phone=${account}&password=${password}`
      : `/login?email=${account}&password=${password}`
    return req.get(url)
  },
  //检查登录状态
  loginStatus() {
    return req.get('/login/status')
  },
  getRecommendSongSheets() {
    return req.get('/personalized')
  },
  getRecommendNewSong() {
    return req.get('/personalized/newsong')
  },
  //根据用户id获取用户歌单
  getSongListByUserId(id) {
    return req.get('/user/playlist?uid=' + id)
  },
  //根据歌单id获取歌单详情
  getListDetailById(id) {
    return req.get('/playlist/detail?id=' + id)
  },
  //获取用户详情
  getUserInfo(id) {
    return req.get('/user/detail?uid=' + id)
  },
  //获取歌曲播放地址
  getPlayUrlById(id) {
    return req.get('/song/url?id=' + id);
  },
  //获取歌曲详情
  getSongDetailById(id) {
    return req.get('/song/detail?ids=' + id)
  },
  //获取歌词
  getLyric(id) {
    return req.get('/lyric?id=' + id)
  },
  //喜欢/取消喜欢歌曲
  likeSong(id, like) {
    return req.get('/like?id=' + id + '&like=' + (like || true))
  },
  //获取喜欢列表
  getLikeList(userId){
    return req.get('/likelist?uid='+userId)
  },
  //获取全部排行榜
  getTopList() {
    return req.get('/toplist')
  }
}
// function serialize(data) {
//   let url = "";
//   Object.keys(data).forEach(key => {
//     let value = data[key] || '';
//     url += `&${key}=${encodeURIComponent(value)}`;
//   })
//   return url ? url.substring(1) : '';
// }