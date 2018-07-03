/**
 * @Author  wq
 * @Date    2018-04-09T17:54:43+08:00
 * @Description web相关的配置
 */

module.exports = {
  "development": "ahaaa! your lost!",
  "port": 8080,
  "redis_common": {
    "redis_host": "127.0.0.1",
    "redis_port": 6379,
    "max_clients": 10,
    "min_clients": 1,
    "key": "cw"
  },
  mongodb: "mongodb://localhost/mydb",
  qiniu: {
    ak: "u6mVUjMsvSUJ2BTqNYzj_nW_1BkqVuSzLjKF5-Bf",
    sk: "u3wg3F8nP0KiwNqlGUeMmIA9Zwxx5FlJ8IwvrVfL",
    bucket: "cdnczb",
    bucketsecure: "cdnczbsecure",
  },
  "redisKey": {
    "cwRoomInfoMap": "cw_room_info_map",
    //登陆信息hash
    "LoginInfoMap":"me_logininfo_map",
    //用户信息hash
    "UserInfoMap":"me_userinfo_map"
  },
  login: {
    // redis 中登录尝试标志 key
    redisLockedFlag: "my_page_login_restrict_hashmap",
    // 超过尝试次数之后的限制登录时间
    loginDelayTime: 15 * 60 * 1000,
    // 最大尝试次数
    loginTryTimes: 5,
    //登陆接口URL
    url: 'http://test.czbapp.com/crmdev/'
  },
  JWT_secret: "czbcrm3790da047dd8a4c75b14cadaf2a55155",
  logDir: './logs/',
};
