/**
 * 主要是用于全局数据的读取redis pool
 * 
 * @ 2014-3-27 created by Sid@flyantgame.com
 * 
 * @ Lolo 2015-1-13 modify for xinqu
 *
 * @ Lolo 2017-07-21T14:16:23+08:00 modify for cab crm
 */

var NodePool = require('generic-pool');
//var Nutcracker = require('nutcracker');
var Redis = require('redis');
var esConfig = require('../../config/config');
// var sPool = new SolPool(dsConfig.redis_common);

client = Redis.createClient(esConfig.redis_common.redis_port, esConfig.redis_common.redis_host);
if(esConfig.redis_common.redis_pwd) {
  client.auth(esConfig.redis_common.redis_pwd);
}
exports.client = client;
var sPool = NodePool.Pool({
  name: 'es_common_redis',
  create: function(cb){
    var c = Redis.createClient(esConfig.redis_common.redis_port, esConfig.redis_common.redis_host);
    // var c = Nutcracker.createClient(esConfig.redis_common.redis_port, esConfig.redis_common.redis_host);
    // var c = Nutcracker.createClient(esConfig.redis_common.redis_port, esConfig.redis_common.redis_host, esConfig.redis_common.redis_pwd);
    if(esConfig.redis_common.redis_pwd) c.auth(esConfig.redis_common.redis_pwd);
    cb(null, c);
  },
  destroy: function(c){
    c.end(true);
  },
  max: 10,
  min: 1,
  idleTimeoutMillis: 30000,
  log: false
});


var redisPool = {};

redisPool.hvals = function(hash, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.hvals(hash, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] hvals 值时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.hset = function(hash, key, value){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.hset(hash, key, value);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] hset 时，从连接池获取连接失败', err);
    }
  });
};

redisPool.hget = function(hash, key, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.hget(hash, key, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] get 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.hgetall = function(hash, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.hgetall(hash, function(error, value){
        sPool.release(rConn);
        //奇数个为键，偶数个为值
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] hgetall 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.zrevrange = function(hash, start, stop, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.zrevrange(hash, start, stop, function(error, value){
        sPool.release(rConn);
        //奇数个为键，偶数个为值
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] zrevrange 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.del = function(key){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.del(key);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] del 时，从连接池获取连接失败', err);
    }
  });
};

redisPool.exists = function(key, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.exists(key, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] get 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.get = function(key, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.get(key, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] get 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.hexists = function(hash, key, cb){
  // console.log('this is redisPool.hget, hash, key', hash, key);
  sPool.acquire(function(err, rConn){
    // console.log('sPool.acquire, err:', err);
    if(!err) {
      // console.log('!err here, rConn: ', rConn);
      rConn.hexists(hash, key, function(error, value){
        // console.log('rConn.hget, error, value', error, value);
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] hget 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.hget = function(hash, key, cb){
  // console.log('this is redisPool.hget, hash, key', hash, key);
  sPool.acquire(function(err, rConn){
    // console.log('sPool.acquire, err:', err);
    if(!err) {
      // console.log('!err here, rConn: ', rConn);
      rConn.hget(hash, key, function(error, value){
        // console.log('rConn.hget, error, value', error, value);
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] hget 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.hdel = function(hash, key, cb){
  // console.log('this is redisPool.hget, hash, key', hash, key);
  sPool.acquire(function(err, rConn){
    // console.log('sPool.acquire, err:', err);
    if(!err) {
      // console.log('!err here, rConn: ', rConn);
      rConn.hdel(hash, key, function(error, value){
        // console.log('rConn.hget, error, value', error, value);
        sPool.release(rConn);
        // cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] hget 时，从连接池获取连接失败', err);
      // cb(err, null);
    }
  });
};

redisPool.mget = function(key, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.mget(key, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] 读取多值 mget 时，从连接池获取连接失败', err);
      cb(err, null);
    }
  });
};

redisPool.set = function(key, value, callback){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.set(key, value, function(err, rlt) {
        if(callback){
          callback(err, rlt);
        }
      });
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] set 时，从连接池获取连接失败', err);
    }
  });
};

redisPool.expire = function(key, value){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.expire(key, value);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] 写入值时，从连接池获取连接失败', err);
    }
  });
};

redisPool.zAdd = function(key, score, member){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.zadd(key, score, member);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] zadd 时，从连接池获取连接失败', err);
    }
  });
};

redisPool.zRevRangeByScore = function(key, max, min, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.zrevrangebyscore(key, max, min, function(err, zrrsRlt){
        sPool.release(rConn);
        cb(err, zrrsRlt);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] zadd 时，从连接池获取连接失败', err);
    }
  });
};

/*
 @2014-4-24, nutcracker not support keys
redisPool.keys = function(key, cb){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.keys(key, function(error, value){
        sPool.release(rConn);
        cb(error, value);
      });
    } else {
      errorRecorder.log(__filename, '[Common Redis] 查询键名列表时，从连接池获取连接失败', err);
    }
  });
};
*/

/**
 * update Lolo 2017-08-10T15:43:05+08:00
 * for redis publish and subscribe
 */
redisPool.publish = function(channel, msg){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.publish(channel, msg);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] get 时，从连接池获取连接失败', err);
    }
  });
};

redisPool.subscribe = function(channel){
  sPool.acquire(function(err, rConn){
    if(!err) {
      rConn.subscribe(channel);
      sPool.release(rConn);
    } else {
      errorRecorder.log(__filename, '[Common Redis] get 时，从连接池获取连接失败', err);
    }
  });
};

exports.redisPool = redisPool;
