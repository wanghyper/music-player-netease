const axios = require('axios')
const req = axios.create({
  baseURL: 'https://v1.itooi.cn/tencent',
  timeout: 3000,
  headers: {},
  transformResponse: [function (res) {
    try {
      res = JSON.parse(res)
      return res.data
    } catch (e) {
      return res;
    }
    
  }]
});

const API = {
  /*根据歌曲列表id获取列表*/
  getSongListById(id) {
    return req.get('/songList?id=' + id)
  },
  getPlayUrlById(id) {
    return req.get(`/url?id=${id}&quality=320`)
  },
  getDetailById(id){
    return req.get(`/song?id=${id}`)
  }
}
module.exports = API
