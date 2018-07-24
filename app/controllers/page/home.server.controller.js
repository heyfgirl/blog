
/**
 * @Author  wqiong
 * @Date    2018-05-24T11:23:53+08:00
 * @Description emnu页面渲染服务
 */
module.exports = {
  index: function(req, res){
    if(req.url !== "/"){
      return res.redirect("/");
    }
    return res.render(`menu/index.html`,{
      portfolio: [
        {
          filter: 'f_stray',
          title: '和氣質哦',
          mood: '大大方方',
          img: 'https://wangqiong.me/public/img/ptf/1.jpg',
          link: '/',
        },
        {
          filter: 'f_stray',
          title: '和氣質哦',
          mood: '大大方方',
          img: 'https://wangqiong.me/public/img/ptf/1.jpg',
          link: '/',
        },
        {
          filter: 'f_city',
          title: '和氣質哦',
          mood: '大大方方',
          img: 'https://wangqiong.me/public/img/ptf/1.jpg',
          link: '/',
        }
      ],
      latest: [
        {
          title: 'Creative Revolution',
          time: 'June 20,',
          comment: '0 Comments',
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`,
          id: '123',
          commentId: '123'
        },
        {
          title: 'Creative Revolution',
          time: 'June 20,',
          comment: '0 Comments',
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`,
          id: '123',
          commentId: '123'
        },
        {
          id: '123',
          commentId: '123',
          title: 'Creative Revolution',
          time: 'June 20,',
          comment: '0 Comments',
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
            saepe cupiditate molitia eveniet iste deleniti. . .`
        },
      ],
      testimonial:[
        {
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
          saepe cupiditate molitia eveniet iste deleniti. . .`,
          author: 'Adamy Smith',
          authorTitle: 'Doe CEO'
        },
        {
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
          saepe cupiditate molitia eveniet iste deleniti. . .`,
          author: 'Adamy Smith',
          authorTitle: 'Doe CEO'
        },
        {
          content: `A blanditiis, ab. Commodi at provident necess itatibus animi consequuntur veritatis nesciunt, totam, natus quo
          saepe cupiditate molitia eveniet iste deleniti. . .`,
          author: 'Adamy Smith',
          authorTitle: 'Doe CEO'
        }
      ]
    });
  },
  about: function(req, res){
    return res.render(`menu/about.html`,{

    });
  },
  contact: function(req, res){
    return res.render(`menu/contact.html`,{

    });
  }
};