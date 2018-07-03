/**
 * @Author  Lolo
 * @Date    2018-04-10T09:55:33+08:00
 * @Description 返回结果数据组织模块
 */

module.exports = {
  response: function(data, code){
    data = data || '';
    code = code || 200;
    let result = code === 200 ? 'success' : 'error';

    return {
      result: result,
      data: data,
      errCode: code,
    };
  },
  err: function(msg, code){
    msg = msg || '操作发生错误';
    code = code || 500;

    let err = new Error(msg);
    err.code = code;

    return err;
  }
};
