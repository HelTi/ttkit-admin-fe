/**
 * 
 * 数据结构
const webData = [
  {
    categoryName: '视频',
    children:[
      {
        name: '好看视频',
        url: "https://haokan.baidu.com/"
      },
      {
        name: '爱奇艺高清',
        url: "http://www.iqiyi.com/"
      },
    ]
  },
  {
    categoryName: '综合',
    children:[
      {
        name: '高顿教育',
        url: "https://www.gaodun.com/"
      },
      {
        name: '百度百科',
        url: "https://baike.baidu.com/"
      },
    ]
  },
]

 */

/**
 * [{"categoryName":"视频","children":[{"name":"好看视频","url":"https://haokan.baidu.com/"},{"name":"爱奇艺高清","url":"http://www.iqiyi.com/"},{"name":"腾讯视频","url":"http://v.qq.com/"},{"name":"百度直播","url":"https://live.baidu.com/?source=hao123"},{"name":"优酷网","url":"http://www.youku.com/"},{"name":"芒果TV","url":"http://www.mgtv.com/"},{"name":"搜狐视频","url":"http://tv.sohu.com/"},{"name":"咪咕视频","url":"https://www.miguvideo.com/mgs/website/prd/sportsHomePage.html?token=&from=migu"},{"name":"百搜视频","url":"https://v.xiaodutv.com/"},{"name":"央视网","url":"https://tv.cctv.com/"}]},{"categoryName":"综合","children":[{"name":"高顿教育","url":"https://www.gaodun.com/"},{"name":"百度百科","url":"https://baike.baidu.com/"},{"name":"智慧教育","url":"https://basic.smartedu.cn/"},{"name":"学科网","url":"https://www.zxxk.com/"},{"name":"豆丁网","url":"https://www.docin.com/"},{"name":"征信中心","url":"https://ipcrs.pbccrc.org.cn/"},{"name":"网易公开课","url":"https://open.163.com"},{"name":"千图网","url":"https://www.58pic.com/"},{"name":"教育考试","url":"http://pindao.hao123.com/jiaoyu"},{"name":"百度营销","url":"http://e.baidu.com/ebaidu/home?refer=1200"}]},{"categoryName":"游戏","children":[{"name":"百度游戏","url":"http://wan.baidu.com/home?idfrom=4084"},{"name":"37网游","url":"https://baiduzm.37.com/?uid=3339811"},{"name":"9377页游","url":"http://wvw.9377j.com/tg/baidu_kuzhan03/?uid=ccqqz"},{"name":"4366页游","url":"https://4366cq.381pk.com/123966/"},{"name":"7K7K小游戏","url":"http://www.7k7k.com/?7kfrom=hao123"},{"name":"游侠网","url":"https://www.ali213.net/"},{"name":"17173","url":"https://www.17173.com/"},{"name":"游民星空","url":"https://www.gamersky.com/"},{"name":"4399游戏","url":"https://www.4399.com/"},{"name":"hao123游戏","url":"https://game.hao123.com/"}]},{"categoryName":"页游","children":[{"name":"2024传奇","url":"http://tp.9377s.com/1159531/?sid=new"},{"name":"传奇新世界","url":"https://4366cq.381pk.com/125646/"},{"name":"传奇怀旧服","url":"http://tp.9377s.com/1172275/?sid=new"},{"name":"大师兄传奇","url":"https://90w.danweigame.com/9p64my57/"},{"name":"1.76传奇","url":"https://4366cq.381pk.com/125647/"},{"name":"星神纪元","url":"https://wan.baidu.com/cover?gameId=61497956&idfrom=4084"},{"name":"巨龙猎手","url":"https://wan.baidu.com/cover?gameId=58573089&idfrom=4084"},{"name":"战online","url":"https://wan.baidu.com/cover?gameId=38183418&idfrom=4084"},{"name":"传奇盛世2","url":"https://wan.baidu.com/cover?gameId=33342023&idfrom=4084"},{"name":"原始传奇","url":"https://wan.baidu.com/cover?gameId=24063258&idfrom=4084"}]},{"categoryName":"购物","children":[{"name":"爱淘宝","url":"https://s.click.taobao.com/1ilLlvt?pid=mm_43125636_4246598_114818700427"},{"name":"当当网","url":"http://www.dangdang.com/"},{"name":"淘宝特卖","url":"https://mos.m.taobao.com/union/taobaoTMPC?pid=mm_43125636_4246598_115463400142"},{"name":"天猫","url":"https://s.click.taobao.com/D5tHITu?pid=mm_43125636_4246598_115693050159"},{"name":"天猫国际","url":"https://s.click.taobao.com/tY80SOu"},{"name":"京东商城","url":"https://union-click.jd.com/jdc?d=iEZf6v"},{"name":"京东家居","url":"https://u.jd.com/bzU4wBI"},{"name":"什么值得买","url":"https://www.smzdm.com/"},{"name":"淘宝网","url":"https://www.taobao.com/"},{"name":"1688","url":"https://www.1688.com/"}]},{"categoryName":"新游","children":[{"name":"梦回江湖","url":"https://wan.baidu.com/cover?gameId=83616427&idfrom=4084"},{"name":"血饮龙纹","url":"https://wan.baidu.com/cover?gameId=27340971&idfrom=4084"},{"name":"雷霆之怒","url":"https://wan.baidu.com/cover?gameId=39337613&idfrom=4084"},{"name":"凡人神将传","url":"https://wan.baidu.com/cover?gameId=27585373&idfrom=4084"},{"name":"刺沙","url":"https://wan.baidu.com/cover?gameId=90887311&idfrom=4084"},{"name":"青云诀","url":"https://wan.baidu.com/cover?gameId=54190045&idfrom=4084"},{"name":"四圣封神","url":"https://wan.baidu.com/cover?gameId=57512343&idfrom=4084"},{"name":"散人打金服","url":"https://wan.baidu.com/cover?gameId=35696569&idfrom=4084"},{"name":"暗夜格斗","url":"https://wan.baidu.com/cover?gameId=98151411&idfrom=4084"},{"name":"沙城高爆版","url":"https://wan.baidu.com/cover?gameId=24063258&idfrom=4084"}]},{"categoryName":"体育","children":[{"name":"新浪体育","url":"http://sports.sina.com.cn/"},{"name":"虎扑体育","url":"https://www.hupu.com/"},{"name":"搜狐体育","url":"http://sports.sohu.com/"},{"name":"腾讯体育","url":"http://sports.qq.com/"},{"name":"CCTV5","url":"http://sports.cntv.cn/"},{"name":"网易体育","url":"http://sports.163.com/"},{"name":"PP体育","url":"http://www.ppsport.com/"},{"name":"凤凰体育","url":"http://sports.ifeng.com/"},{"name":"爱奇艺体育","url":"http://sports.iqiyi.com/"},{"name":"体育热点","url":"http://www.hao123.com/sports"}]},{"categoryName":"小说","children":[{"name":"飞卢小说","url":"https://b.faloo.com"},{"name":"起点中文网","url":"https://www.qidian.com/"},{"name":"QQ阅读","url":"http://book.qq.com/"},{"name":"潇湘书院","url":"http://www.xxsy.net/"},{"name":"晋江文学城","url":"http://www.jjwxc.net/"},{"name":"纵横中文网","url":"http://www.zongheng.com/"},{"name":"七猫中文网","url":"https://www.qimao.com/"},{"name":"小说阅读","url":"http://www.readnovel.com/"},{"name":"小说排行","url":"http://top.baidu.com/buzz?b=7"},{"name":"番茄小说","url":"https://fanqienovel.com/"}]},{"categoryName":"手机","children":[{"name":"中关村在线","url":"http://www.zol.com.cn/"},{"name":"IT之家","url":"http://www.ithome.com/"},{"name":"太平洋手机","url":"http://mobile.pconline.com.cn/"},{"name":"移动","url":"http://www.10086.cn/"},{"name":"华为官网","url":"https://www.vmall.com/"},{"name":"小米官网","url":"http://www.mi.com/"},{"name":"vivo手机","url":"http://www.vivo.com.cn/"},{"name":"华军软件园","url":"http://www.onlinedown.net/"},{"name":"苹果手机","url":"https://www.apple.com/cn/"},{"name":"百度手机助手","url":"https://shouji.baidu.com/"}]},{"categoryName":"社交","children":[{"name":"斗鱼TV","url":"https://www.douyu.com/"},{"name":"知乎","url":"https://www.zhihu.com/explore"},{"name":"QQ空间","url":"http://qzone.qq.com/"},{"name":"CSDN社区","url":"https://www.csdn.net/"},{"name":"新浪微博","url":"https://weibo.com/"},{"name":"百合网","url":"http://www.baihe.com/"},{"name":"珍爱网","url":"http://www.zhenai.com/"},{"name":"虎扑社区","url":"https://bbs.hupu.com/"},{"name":"百度贴吧","url":"https://tieba.baidu.com/index.html"},{"name":"人人网","url":"http://renren.com/"}]},{"categoryName":"汽车","children":[{"name":"汽车之家","url":"https://www.autohome.com.cn/"},{"name":"百度有驾","url":"https://youjia.baidu.com/?sa=hao123"},{"name":"太平洋汽车","url":"http://www.pcauto.com.cn/"},{"name":"易车网","url":"https://www.yiche.com/"},{"name":"汽车大全","url":"http://www.hao123.com/auto"},{"name":"爱卡汽车","url":"http://www.xcar.com.cn/"},{"name":"新浪汽车","url":"http://auto.sina.com.cn/"},{"name":"搜狐汽车","url":"http://auto.sohu.com/"},{"name":"凤凰汽车","url":"http://auto.ifeng.com/"},{"name":"腾讯汽车","url":"http://auto.qq.com/"}]},{"categoryName":"新闻","children":[{"name":"新浪新闻","url":"http://news.sina.com.cn/"},{"name":"观察者网","url":"https://www.guancha.cn/"},{"name":"环球网","url":"http://www.huanqiu.com/"},{"name":"参考消息","url":"http://www.cankaoxiaoxi.com/"},{"name":"中国新闻网","url":"https://www.chinanews.com/"},{"name":"搜狐新闻","url":"http://news.sohu.com/"},{"name":"凤凰军事","url":"http://news.ifeng.com/mil/"},{"name":"腾讯新闻","url":"https://news.qq.com/"},{"name":"网易新闻","url":"https://news.163.com/"},{"name":"hao123推荐","url":"https://tuijian.hao123.com"}]},{"categoryName":"旅游","children":[{"name":"携程网","url":"https://www.ctrip.com/"},{"name":"12306","url":"https://www.12306.cn/"},{"name":"马蜂窝","url":"http://www.mafengwo.cn/"},{"name":"飞猪旅行","url":"https://www.fliggy.com/"},{"name":"途牛","url":"http://www.tuniu.com/"},{"name":"艺龙旅行网","url":"http://www.elong.com/"},{"name":"穷游网","url":"http://www.qyer.com/"},{"name":"同程旅行","url":"https://www.ly.com/"},{"name":"南方航空","url":"https://www.csair.com/cn/"},{"name":"hao123旅游","url":"https://pindao.hao123.com/go"}]},{"categoryName":"招聘","children":[{"name":"前程无忧","url":"http://www.51job.com/"},{"name":"BOSS直聘","url":"https://www.zhipin.com/"},{"name":"猎聘","url":"https://www.liepin.com"},{"name":"应届生求职","url":"http://www.yingjiesheng.com/"},{"name":"拉勾","url":"https://www.lagou.com/"},{"name":"中国公共招聘","url":"http://job.mohrss.gov.cn/"},{"name":"中华英才","url":"http://www.chinahr.com/"},{"name":"实习僧","url":"https://www.shixiseng.com/"},{"name":"看准网","url":"https://www.kanzhun.com/"},{"name":"卫生人才网","url":"https://www.21wecan.com/"}]},{"categoryName":"生活","children":[{"name":"房天下","url":"https://www1.fang.com"},{"name":"安居客","url":"https://www.anjuke.com/"},{"name":"链家网","url":"http://www.lianjia.com/"},{"name":"赶集网","url":"http://www.ganji.com/"},{"name":"爱企查","url":"http://aiqicha.baidu.com/?fr=hao123"},{"name":"下厨房","url":"http://www.xiachufang.com/"},{"name":"百姓网","url":"http://www.baixing.com/"},{"name":"大众点评","url":"http://www.dianping.com/"},{"name":"美团网","url":"https://meituan.com/"},{"name":"天眼查","url":"https://www.tianyancha.com/"}]},{"categoryName":"音乐","children":[{"name":"酷狗音乐","url":"http://www.kugou.com/"},{"name":"网易云音乐","url":"http://music.163.com/"},{"name":"酷我音乐","url":"http://www.kuwo.cn/"},{"name":"QQ音乐","url":"http://y.qq.com/"},{"name":"千千音乐","url":"https://music.taihe.com/"},{"name":"5sing","url":"http://5sing.kugou.com/index.html"},{"name":"清风DJ音乐","url":"http://www.vvvdj.com/"},{"name":"咪咕音乐","url":"http://music.migu.cn/v3"},{"name":"豆瓣音乐","url":"https://music.douban.com/"},{"name":"唱吧","url":"http://changba.com/now/stars/index.html"}]},{"categoryName":"财经","children":[{"name":"东方财富","url":"http://www.eastmoney.com/"},{"name":"新浪财经","url":"http://finance.sina.com.cn/"},{"name":"证券之星","url":"http://www.stockstar.com/"},{"name":"中金在线","url":"http://www.cnfol.com/"},{"name":"同花顺","url":"https://www.10jqka.com.cn/"},{"name":"金融界","url":"http://www.jrj.com.cn/"},{"name":"第一财经","url":"https://www.yicai.com/"},{"name":"和讯网","url":"http://www.hexun.com/"},{"name":"网易财经","url":"https://money.163.com/"},{"name":"雪球","url":"http://xueqiu.com/"}]},{"categoryName":"彩票","children":[{"name":"中国体彩","url":"http://www.lottery.gov.cn/"},{"name":"中国福彩网","url":"http://www.cwl.gov.cn/"},{"name":"新浪彩票","url":"http://lottery.sina.com.cn/"},{"name":"竞彩网","url":"http://www.sporttery.cn/"},{"name":"双色球","url":"https://www.baidu.com/s?word=%E5%8F%8C%E8%89%B2%E7%90%83&tn=50000234_hao_pg&ie=utf-8"},{"name":"全国开奖","url":"https://pindao.hao123.com/caipiao"},{"name":"搜狐彩票","url":"https://sports.sohu.com/s/bet"},{"name":"福彩3D","url":"http://www.cwl.gov.cn/fcpz/yxjs/fc3d/"},{"name":"中彩网","url":"https://www.zhcw.com/"},{"name":"大乐透","url":"https://www.baidu.com/s?word=%E5%A4%A7%E4%B9%90%E9%80%8F&tn=50000240_hao_pg&ie=utf-8&H123Tmp=nunew9"}]},{"categoryName":"银行","children":[{"name":"建设银行","url":"http://www.ccb.com/"},{"name":"中国银行","url":"http://www.boc.cn/"},{"name":"工商银行","url":"http://www.icbc.com.cn/"},{"name":"农业银行","url":"http://www.abchina.com/"},{"name":"交通银行","url":"http://www.bankcomm.com/"},{"name":"招商银行","url":"http://www.cmbchina.com/"},{"name":"兴业银行","url":"https://www.cib.com.cn/cn/index.html"},{"name":"浦发银行","url":"http://www.spdb.com.cn/"},{"name":"邮政储蓄","url":"https://www.psbc.com/cn/"},{"name":"人民银行","url":"http://www.pbc.gov.cn/"}]},{"categoryName":"邮箱","children":[{"name":"163邮箱","url":"http://mail.163.com/"},{"name":"126邮箱","url":"http://mail.126.com/"},{"name":"QQ邮箱","url":"http://mail.qq.com/"},{"name":"新浪邮箱","url":"http://mail.sina.com.cn/"},{"name":"阿里邮箱","url":"http://mail.aliyun.com/"},{"name":"139邮箱","url":"http://mail.10086.cn/"},{"name":"Outlook邮箱","url":"https://outlook.live.com/"},{"name":"搜狐邮箱","url":"https://mail.sohu.com/"},{"name":"百度网盘","url":"https://pan.baidu.com"},{"name":"foxmail邮箱","url":"https://www.foxmail.com/"}]}]
 */

const webData = [];

const doc = document.getElementById("coolsites_wrapper")

// Find all rows in the coolsites
const rows = doc.querySelectorAll("ul.cool-row");

rows.forEach(row => {
  const category = row.querySelector("li.site-item.first a");
  const categoryName = category ? category.textContent.trim() : "Unknown Category";

  const children = [];
  row.querySelectorAll("li.site-item .inline-block-wrapper a.sitelink").forEach(link => {
    const name = link.getAttribute("data-title").trim();
    const url = link.getAttribute("href").trim();

    children.push({
      name: name,
      url: url
    });
  });

  webData.push({
    categoryName: categoryName,
    children: children
  });
});

console.log(JSON.stringify(webData));