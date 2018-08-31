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
  mongodb: "mongodb://wangqiong:123456@localhost/mydb",
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
  //token密钥
  JWT_secret: "czbcrm3790da047dd8a4c75b14cadaf2a55155",
  //日志文件 log4js配置
  logConfigure: {
    appenders: [{
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%[%d %p %m%]'
        }
      },{
        //主日志文件 { 记录全部日志 }
        type: 'dateFile',
        filename: `${__dirname}/../../logs/blog-debug`,
        pattern:"-yyyyMMdd.log",
        alwaysIncludePattern: true,
        layout: { type: 'basic' }
      }
      // , {
      //   //分类日志文件，配置不同类别日志到不同文件
      //   type: 'dateFile',
      //   filename: `${__dirname}/../../logs/blog-user-debug`,
      //   pattern:"-yyyyMMdd.log",
      //   alwaysIncludePattern: true,
      //   layout: { type: 'basic' },
      //   level: 'DEBUG',
      //   category: 'blog'
      // }
    ]
  },
  uploadFile: {
    path: 'public/upload/',
  },
  emailConfig: {
    host: 'smtp.ym.163.com',//163企业邮箱smtp服务
    user: 'me@halfmy.com',
    pass: 'a3.1415926',
    subject: '半个我的验证邮件',
    text: '验证邮件',
    emailTemplet: function(title, userName, token){
      return `
      <!DOCTYPE html>
      <html>
        <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title></title><meta charset="utf-8" /></head>
        <body>
          <div class="qmbox qm_con_body_content qqmail_webmail_only" id="mailContentContainer" style="">
            <div class="contaner">
              <div class="title">${title}</div>
              <div class="content">
                  <p class="biaoti"><b>亲爱的同志，你好！</b></p>
                  <b class="xtop"><b class="xb1"></b><b class="xb2"></b><b class="xb3"></b><b class="xb4"></b></b>
                  <div class="xboxcontent">
                      <div class="neirong">
                          <p><b>请核对你的用户名：</b><span id="userName" class="font_darkblue">${userName}</span></p>
                          <p><b>$(type)的验证码：</b><span class="font_lightblue"><span id="yzm" data="$(captcha)" onclick="return false;" t="7" style="border-bottom: 1px dashed rgb(204, 204, 204); z-index: 1; position: static;">$(captcha)</span></span><br><span class="font_gray">(请输入该验证码完成$(type)，验证码30分钟内有效！)</span></p>
                          <div class="line">如果你未申请$(type)服务，请忽略该邮件。</div>
                          <p class="foot"><a href='http://127.0.0.1:8080/api/exmail/login?f=${token}'>点击该链接进行登陆验证</a><span data="800-820-5100" onclick="return false;" t="7" style="border-bottom: 1px dashed rgb(204, 204, 204); z-index: 1; position: static;"></span></p>
                      </div>
                  </div>
                  <b class="xbottom"><b class="xb4"></b><b class="xb3"></b><b class="xb2"></b><b class="xb1"></b></b>
              </div>
            </div>
          </div>
        </body>
        <style type="text/css">
          .qmbox body {margin: 0;padding: 0;background: #fff;font-family: "Verdana, Arial, Helvetica, sans-serif";font-size: 14px;line-height: 24px;}
          .qmbox div, .qmbox p, .qmbox span, .qmbox img {margin: 0;padding: 0;}
          .qmbox img {border: none;}
          .qmbox .contaner {margin: 0 auto;}
          .qmbox .title {margin: 0 auto;background: url() #CCC repeat-x;height: 30px;text-align: center;font-weight: bold;padding-top: 12px;font-size: 16px;}
          .qmbox .content {margin: 4px;}
          .qmbox .biaoti {padding: 6px;color: #000;}
          .qmbox .xtop, .qmbox .xbottom {display: block;font-size: 1px;}
          .qmbox .xb1, .qmbox .xb2, .qmbox .xb3, .qmbox .xb4 {display: block;overflow: hidden;}
          .qmbox .xb1, .qmbox .xb2, .qmbox .xb3 {height: 1px;}
          .qmbox .xb2, .qmbox .xb3, .qmbox .xb4 {border-left: 1px solid #BCBCBC;border-right: 1px solid #BCBCBC;}
          .qmbox .xb1 {margin: 0 5px;background: #BCBCBC;}
          .qmbox .xb2 {margin: 0 3px;border-width: 0 2px;}
          .qmbox .xb3 {margin: 0 2px;}
          .qmbox .xb4 {height: 2px;margin: 0 1px;}
          .qmbox .xboxcontent {display: block;border: 0 solid #BCBCBC;border-width: 0 1px;}
          .qmbox .line {margin-top: 6px;border-top: 1px dashed #B9B9B9;padding: 4px;}
          .qmbox .neirong {padding: 6px;color: #666666;}
          .qmbox .foot {padding: 6px;color: #777;}      
          .qmbox .font_darkblue {color: #006699;font-weight: bold;}
          .qmbox .font_lightblue {color: #008BD1;font-weight: bold;}
          .qmbox .font_gray {color: #888;font-size: 12px;}
          .qmbox style, .qmbox script, .qmbox head, .qmbox link, .qmbox meta {display: none !important;}
        </style>
      </html>`;
    }
  }
};
