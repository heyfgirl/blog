// const nodeMailer = require('nodemailer');
// const config = require('../../../config/config');
const sysLibs = require('../../libs/libs');
// const logger = require("../../libs/log4js");

module.exports = {
  /**
   * 发送邮件
  */
  payment: (req, res, next) => {
    console.log(req.body);
    console.log(req.query);


    function expreMn (m, n){
      let sumN = m*n;
      let ni = Number(n);
      var arryObj = [];
      for(let i = 1; i <= m; i++){
        var arrl = [];
        for(let i2=1; i2 <= n; i2++){
          arrl[i2-1] = (i-1)*n + i2;
        }
        arryObj[i-1] = arrl;
      }
      //循环输出 m-1 行
      let s = 0;
      let resNumbs = [];
      let Compass = 1;//指南针1为向下，0为向上
      let line = 0;//转折点在上
      for(let it = 0; it <= sumN; it++){
        //s为行指针
        if(!arryObj[1]){
          s = 0;
        }
        if(!arryObj[0]){
          break;
        }
        if(s === 0){
          resNumbs.push(arryObj[s][0]);
          //第一行未排完
          let newArr = arryObj[s].slice(1);
          if(arryObj[s][1] && line === 0){
            resNumbs.push(arryObj[s][1]);
            newArr = arryObj[s].slice(2);
            if(!arryObj[s][2]){
              //行上升
              arryObj = arryObj.slice(1);
              m--;
              s--;
              line = 1;//转折点转下
            }else{
              arryObj[s] = newArr;
            }
          }else if(line === 0){
            //行上升
            arryObj = arryObj.slice(1);
            s--;
            m--;
            line = 1;//转折点转下
          }else if(line === 1){
            arryObj[s] = newArr;
            if(!newArr[0]){
              arryObj = arryObj.slice(1);
              m--;
              s--;
            }
          }
          s++;
          Compass = 1;
          continue;
        }
        //最下行换方向
        if(s === (arryObj.length-1)){
          resNumbs.push(arryObj[s][0]);
          let newArr = arryObj[s].slice(1);
          if(arryObj[s][1] && line === 1){
            resNumbs.push(arryObj[s][1]);
            newArr = arryObj[s].slice(2);
          }
          arryObj[s] = newArr;
          s--;
          Compass = 0;
          continue;
        }
        //指针在中间时需判断此时指南针方向
        if(s !==0 && s !== (arryObj.length-1)){
          if(s > arryObj.length-1){
            s--;
          }
          if(s < 0){
            s++;
          }
          //向下时候
          if(Compass === 1){
            resNumbs.push(arryObj[s][0]);
            let newArr = arryObj[s].slice(1);
            arryObj[s] = newArr;
            if(resNumbs[resNumbs.length-1] - resNumbs[resNumbs.length-2] === ni){ //已经折叠过
              Compass = 0;
              s--;
            }else{
              s++;
            }
          }
          if(Compass === 0){
            resNumbs.push(arryObj[s][0]);
            let newArr = arryObj[s].slice(1);
            arryObj[s] = newArr;
            s--;
          }
          continue;
        }
      }
      // console.log(arryObj);
      return resNumbs;
    }
    let resturt = expreMn(10, 5);
    // console.log(resturt);
    return res.json(JSON.stringify(resturt));
    // return next();
  },
  // 两数之和
  twoNumber: function(req, res){
    let oneN, twoN, Answer = [], answer = {}, sumN = 9, arryN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for(let i = 0; i < arryN.length; i++){
      oneN = arryN[answer['a'] = i];
      for(let i2 = (i + 1); i2 < arryN.length; i2++){
        twoN = arryN[answer['b'] = i2];
        if((oneN + twoN) === sumN){
          Answer.push(JSON.parse(JSON.stringify(answer)));
        }
      }
    }
    return res.json(Answer);
  },
  //无重复字符的最长子串
  LongestString: function(req, res){
    let twoS = '', str = 'abcdsdgfhgdhgjsgadvafdA';
    for(let i = 0; i < str.length; i++){
      let oneS = '';
      let newStr = str.substr(i);
      let oldStr = str.substr(0, i);
      for(let t = 0; t < newStr.length; t++){
        if(oneS.indexOf(newStr[t]) === -1){
          oneS += newStr[t];
          if(oneS.length > twoS.length){
            twoS = oneS;
          }
        }else{
          i = oldStr.length + newStr.indexOf(newStr[t]);
          if(oneS.length > twoS.length){
            twoS = oneS;
          }
          break;
        }
      }
    }
    return res.json(twoS);
  },
  //两个排序数组的中位数
  Median: function(req, res){
    let str = 'PAYPALISHIRING';
    
  },
  //反转整数
  reversalInt: function(req, res){
    let initial = `<p style="text-align:left;" class="MsoNormal" align="left">
      <b><span style="font-family:'微软雅黑','sans-serif';">（三）价格情况：</span></b><span style="font-family:'微软雅黑','sans-serif';">根据市物价局（<span>2018</span>年第<span>55</span>批、第<span>63</span>批）价格公示，本次开盘销售的住房<span>2#</span>均价<u><span>10200</span></u>元<span>/</span>㎡，<span>5#</span>均价<u><span>11500</span></u>元<span>/</span>㎡，具体一房一价见市物价局网站、公司销售现场、项目微信公众号（微信号：红星·紫御半山）。<b><span></span></b></span>
    </p>`;
    let PRICE_REGEX = /均价<u><span>([\d]+?)<\/span>/g;
    // while(PRICE_REGEX.test(initial)){
    //   console.log(RegExp.$1);
    // }
    let sx = initial.match(PRICE_REGEX);
    console.log(sx);
    return res.json(3);
  },
  testTree: function(req, res){
    let as = new Promise(function(resolve, reject){
      console.log(22)
      reject(23);
    }).then(function(data){
      console.log(data)
      return 2;
    }, function(err){
      console.log(err);
      return err;
    }).then(function(data){
      console.log(data)
      return(2);
    }, function(err){
      console.log(err);
    });
    return res.json(as);
  },
  //非相邻二叉树最大值
  twoTree: function(req, res){
    let EventEmitter = require('events').EventEmitter;
    const myEmitter = new EventEmitter();
    const connection = (id) => {
      console.log(id++);
    };
    const connection2 = (id) => {
      console.log(id++);
    };
    myEmitter.on('newListener', (event, listener) => {
      console.log(26);
    });

    myEmitter.on('connection', connection);
    myEmitter.on('connection', connection2);

    myEmitter.emit('connection', 56);


    let pp = new Promise(function(resolve, reject){
      resolve(2);
    });
    console.log(pp);
    let tree = {
      'root': {
        value: 10,
        'left': {
          value: 3,
          'left': {
            value: 2
          },
          'right': {
            value: 4,
            'right': {
              value: 9,
              'left': {
                value: 8,
              },
              'right': {
                value: 9
              }
            }
          }
        },
        'right': {
          value:18,
          'left':{
            value: 13,
          },
          'right':{
            value: 21,
          }
        }
      }
    };

    // 实现Promise
    function myPromise(executor){
      var self = this;
      self.status = 'pending';
      self.data = undefined;
      self.onResolvedCallback = [];
      self.onRejectedCallback = [];

      //promise 成功
      function resolve(value){
        if(self.status === 'pending'){
          self.status = 'resolved';
          self.data = value;
          for(let i =0; i < self.onResolvedCallback.length; i++){
            self.onResolvedCallback[i](value);
          }
        }
      }
      //promise 失败
      function reject(reason){
        if(self.status === 'pending'){
          self.status = 'rejected';
          self.data = reason;
          for(let i =0; i < self.onRejectedCallback.length; i++){
            self.onRejectedCallback[i](reason);
          }
        }
      }
      //then 回调
      myPromise.prototype.then = function(onResolved, onRejected){
        var self2 = this;
        var promise2;
        //判断then得参数是否为函数
        onResolved = typeof onResolved === 'function' ? onResolved : function(v){ return v; };
        onRejected = typeof onRejected === 'function' ? onRejected : function(r){ throw r; };
        //返回新的promise
        if(self2.status === 'resolved'){
          return promise2 = new myPromise(function(resolve, reject){
            try{
              var x = onResolved(self2.data);
              if(x instanceof myPromise){
                return x.then(resolve, reject);
              }
              return resolve(x);
            }catch(err){
              reject(err);
            }
          });
        }
        if(self2.status === 'rejected'){
          return promise2 = new myPromise(function(resolve, reject){
            try{
              var x = onRejected(self2.data);
              if(x instanceof myPromise){
                return x.then(resolve, reject);
              }
              return reject(self2.data);
            }catch(err){
              reject(err);
            }
          });
        }
        if(self2.status === 'pending'){
          return promise2 = new myPromise(function(resolve, reject){
            self2.onResolvedCallback.push(function(value){
              try{
                var x = onResolved(self2.data);
                if(x instanceof myPromise){
                  return x.then(resolve, reject);
                }
                return resolve(self2.data);
              }catch(err){
                reject(err);
              }
            });
            self2.onRejectedCallback.push(function(value){
              try{
                var x = onRejected(self2.data);
                if(x instanceof myPromise){
                  return x.then(resolve, reject);
                }
                return reject(self2.data);
              }catch(err){
                reject(err);
              }
            });
          });
        }
      };
      //cath 回调
      myPromise.prototype.catch = function(onRejected){
        return this.then(null, onRejected);
      };
      //promise 结束回调
      try{
        executor(resolve, reject);
      }catch(err){
        reject(err);
      }
    }

    let promise = new myPromise(function(resolve, reject){
      resolve(22);
    }).then(function(res){
      console.log(res);
      return new myPromise(function(resolve, reject){
        resolve(2);
      });
      return 4;
    },function(err){
      return new myPromise(function(resolve, reject){
        resolve(2);
      });
      console.log(err);
    });
    console.log(promise.resolve);

    return res.json(tree);
  }
};