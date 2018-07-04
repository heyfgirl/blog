
/**
 * @Author  wq
 * @Date    2018-04-23T16:01:58+08:00
 * @Description 错误代码的接口配置 以及相信息 配置
 */
module.exports = {
  USER: {
    SESSION_EXPIRED:{
      code: 1001,
      desc: "会话过期"
    },
    AUTH_FAIL: {
      code: 1002,
      desc: "会话验证失败"
    }
  },
  PARAM: {
    DEFECT: {
      code: 2001,
      desc: "参数缺失"
    }
  }
};