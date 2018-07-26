/**
 * @Author  wq
 * @Date    2018-04-23T16:44:47+08:00
 * @Description mongoose Schema of user
 */
const Schema = require('mongoose').Schema;

module.exports = new Schema({
  //标题名称
  title: String,
  //副标题
  subTitle: String,
  //心情描述
  mood: String,
  //考虑选择器
  filter: String,
  /**
   * 博客类型
   * 1:为相册类型 album
   * 2:为文章类型 book
  **/
  type: String,
  //封面
  image: String,
  //摘要
  abstract: String,
  //内容
  content: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: 'mg_post'
});
