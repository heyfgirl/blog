/*
 * 公共函数接口
 *
 **/

var crypto = require('crypto');
var redis = require('../libs/redisSdk').client;
var waterline = require('../../config/waterline');
var moment = require('moment');
var ipaddr = require('ipaddr.js');

exports.saveSalt = function(t_salt, cb){
  waterline.models.salt
  .create({
    salt: t_salt
  }).exec(function(err, rlt){
    if(err) return cb(err);
    return cb(null, rlt);
  });
};

exports.getSalt = function(saltId, cb){
  waterline.models.salt
  .findOne({id: saltId}, function(err, rlt){
    if(err) return cb(err);
    return cb(null, rlt);
  });
};

exports.randomString = function(length){
  if(!length)
    length = 16; //默认返回16个字符串

  var str = '';
  do {
    str = Math.random().toString(36).substring(2);
    if(str.length >= length)
      str = str.substr(0, length);
    else
      str = str + randomString(length - str.length);
  } while(str.length != length)
  return str;
}

//生成6位随机整数
exports.randomint = function(){
  var n = 100000;
  var m = 999999;
  var c = m-n+1;
  var str = Math.floor(Math.random() * c + n);
  return str;
}

exports.md5String = function(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

// 获取请求的 ip 地址信息
exports.getRemoteIp = function(req) {
  var ipString = req.headers['x-forwarded-for']
        || req.connection.remoteAddress
        || req.socket.remoteAddress
        || (req.connection.socket ? req.connection.socket.remoteAddress : '') || '';
  if (ipaddr.IPv4.isValid(ipString)) {
    // ipString is IPv4
    return ipString;
  } else if (ipaddr.IPv6.isValid(ipString)) {
    var ip = ipaddr.IPv6.parse(ipString);
    if (ip.isIPv4MappedAddress()) {
      // ip.toIPv4Address().toString() is IPv4
      return ip.toIPv4Address().toString()
    } else {
      // ipString is IPv6
      console.log("IP地址为IPv6格式: ", ipString);
      return;
    }
  } else {
    // ipString is invalid
    console.log("IP地址无效: ", ipString);
    return;
  }
};

exports.usernameValidate = function(username){
  try{
    var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){2,19}$/;
    return reg.test(username);
  }catch(e){
    logger.error(e.message);
    return false;
  }
};

// 处理技能更新返回字串不是JSON标准格式的问题
exports.retStringToJson = function(str){
  str = str.substr(1, str.length - 2);

  var reg = /"/g;
  str = str.replace(reg, "");
  reg = /=/g;
  str = str.replace(reg, ":");
  var retInfo= {};

  var arr = str.split(',');
  arr.forEach(function(it){
    var kv = it.split(':');
    retInfo[kv[0].trim()] = kv[1].trim();
  });

  return retInfo;
};

/**
 * 获取缓存数据接口
 * 2017-08-09T09:51:36+08:00
 * 
 * @apiParam {String} name 缓存数据模块名称 
 * @apiParam {String} [type] 可选，缓存数据具体条目类型
 * 
 */
exports.getCache = function(name, type){
  if(!name) return null;

  var cacheInit = {};
  if(!process.cache || !process.cache[name]){
    // 没有缓存数据，直接返回空
    return null;
  }

  cacheInit = process.cache[name];

  if(type){
    if(cacheInit[type]){
      cacheInit = cacheInit[type];
    }else{
      // 没有指定模块的缓存类别数据
      return null;
    }
  }

  return JSON.parse(JSON.stringify(cacheInit));
};

/**
 * 加密电话号码函数
 * @Param {String} mobi 电话号码
 */
exports.hideMobi = function(mobi, ifHide){
  if(!ifHide){
    return mobi;
  }
  if(!mobi) return '';
  if(typeof mobi !== 'string') return mobi;
  if(mobi.length < 6) return mobi;

  var lenHide = (mobi.length == 8 || mobi.length == 12) ? 4 : 3;
  return mobi.substr(0, lenHide) + '****' + mobi.substr(lenHide + 4);
};

// 加密数组里面的电话信息
exports.hideMobiArr = function(mobi, ifHide){
  if(!ifHide){
    return mobi;
  }

  if(!mobi) mobi = [];
  if(!Array.isArray(mobi)) mobi = [mobi];

  mobi.forEach(function(v, index){
    if(typeof v !== 'string') return;
    if(v.length < 6) return;

    var lenHide = (v.length == 8 || v.length == 12) ? 4 : 3;
    mobi[index] = v.substr(0, lenHide) + '****' + v.substr(lenHide + 4);
  });

  return mobi;
};


// 获取指定类型的时间段
exports.getDateTimeByType = function(type){
  var ret = {r: true, ds: null};
  if(!type) type = 'day';
  var typeList = ['day', 'week', 'month', 'quarter', 'year'];
  if(typeList.indexOf(type) === -1){
    ret.r = false;
    return ret;
  }

  var m = moment();
  switch(type){
    case 'day':
      m.startOf('day');
      break;
    case 'week':
      m.startOf('week');
      break;
    case 'month':
      m.startOf('month');
      break;
    case 'quarter':
      m.startOf('quarter');
      break;
    case 'year':
      m.startOf('year');
      break;
    default:
      break;
  }

  ret.ds = new Date(m.format());
  return ret;
};


/**
 * 处理客户电话信息函数，主要是针对客户有多个电话的情形
 * 
 */
exports.mobiExtProcess = function(mobi){
  if(!mobi) return [];
  
  mobi = mobi.toString();
  mobi = mobi.replace(/[\s-；]+/g, '').replace(/^手机:/g, '').replace(/^住宅:/g, '').replace(/^其他:/g, '').replace(/^工作:/g, '');
  if(mobi.length > 20){
    mobi = mobi.replace(/手机/g, '').replace(/住宅/g, '').replace(/其他/g, '').replace(/工作/g, '');
  }

  return mobi.split(':');
}

exports.genderProcess = function(gender){
  var g = '-1';
  switch(gender){
    case '男':
    case 1:
    case '1':
    case 'b':
    case 'm':
      g = '1';
      break;
    case '女':
    case '0':
    case 0:
    case 'f':
    case 'g':
      g = '0';
      break;
    default:
      g = '-1';
      break;
  }

  return g;
}

exports.principalPreprocess = function(principal){
  if(!principal) return '';
  var tPrincipal = principal.replace(/\s/g, '').split('，');
  return tPrincipal[tPrincipal.length - 1];
}