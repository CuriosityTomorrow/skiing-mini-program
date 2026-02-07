// 模拟滑雪场数据
const resortsData = [
  // 中国 - 滑雪场
  {
    id: 1,
    name: '万龙滑雪场',
    nameEn: 'Wanlong Ski Resort',
    city: '张家口',
    country: '中国',
    province: '河北省',
    type: 'outdoor', // indoor/outdoor
    latitude: 40.9515,
    longitude: 115.7697,
    price: 880,
    priceUnit: '天',
    elevation: 2110,
    trails: 32,
    trailsDistribution: {初级: '15%', 中级: '45%', 高级: '40%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '民宿'],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '高铁', duration: '1.5小时', from: '北京北站', detail: '至太子城站'},
      {type: '自驾', duration: '3小时', from: '北京', detail: '京礼高速'}
    ],
    season: '11月-3月',
    rating: 4.7,
    reviewCount: 2843,
    description: '华北地区最大的滑雪场之一，雪质优良，设施完善，是2022冬奥会比赛场地之一。',
    features: ['冬奥会场地', '夜场开放', '儿童教学区'],
    website: 'https://www.wanlongski.com'
  },
  {
    id: 2,
    name: '太舞滑雪场',
    nameEn: 'Thaiwoo Ski Resort',
    city: '张家口',
    country: '中国',
    province: '河北省',
    type: 'outdoor',
    latitude: 40.9389,
    longitude: 115.7583,
    price: 780,
    priceUnit: '天',
    elevation: 2160,
    trails: 28,
    trailsDistribution: {初级: '20%', 中级: '50%', 高级: '30%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '温泉'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    transportation: [
      {type: '高铁', duration: '1.5小时', from: '北京北站', detail: '至太子城站'},
      {type: '自驾', duration: '3小时', from: '北京', detail: '京礼高速'}
    ],
    season: '11月-3月',
    rating: 4.6,
    reviewCount: 1923,
    description: '充满欧式风情的滑雪小镇，适合家庭度假，提供丰富的餐饮和娱乐选择。',
    features: ['欧式小镇', '温泉', '家庭友好'],
    website: 'https://www.thaiwoo.com'
  },
  {
    id: 3,
    name: '哈尔滨融创雪世界',
    nameEn: 'Harbin Sunac Snow World',
    city: '哈尔滨',
    country: '中国',
    province: '黑龙江省',
    type: 'indoor',
    latitude: 45.7732,
    longitude: 126.6535,
    price: 468,
    priceUnit: '4小时',
    elevation: 0,
    trails: 8,
    trailsDistribution: {初级: '40%', 中级: '50%', 高级: '10%'},
    facilities: ['魔毯', '餐厅', '租赁', '教练', '停车场'],
    images: [
      'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '2.5小时', from: '北京', detail: '至哈尔滨太平机场'},
      {type: '高铁', duration: '5.5小时', from: '北京', detail: '至哈尔滨西站'}
    ],
    season: '全年开放',
    rating: 4.3,
    reviewCount: 1456,
    description: '大型室内滑雪场，全年可滑雪，温度恒定，适合初学者和练习。',
    features: ['全年开放', '室内恒温', '适合初学'],
    website: 'https://www.sunac.com'
  },
  {
    id: 4,
    name: '广州融创雪世界',
    nameEn: 'Guangzhou Sunac Snow World',
    city: '广州',
    country: '中国',
    province: '广东省',
    type: 'indoor',
    latitude: 23.1815,
    longitude: 113.2852,
    price: 598,
    priceUnit: '4小时',
    elevation: 0,
    trails: 6,
    trailsDistribution: {初级: '50%', 中级: '45%', 高级: '5%'},
    facilities: ['魔毯', '餐厅', '租赁', '教练', '停车场'],
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '3小时', from: '北京', detail: '至广州白云机场'},
      {type: '高铁', duration: '8小时', from: '北京', detail: '至广州南站'}
    ],
    season: '全年开放',
    rating: 4.4,
    reviewCount: 2341,
    description: '华南地区最大的室内滑雪场，让南方朋友也能体验冰雪乐趣。',
    features: ['全年开放', '南方少有', '交通便利'],
    website: 'https://www.sunac.com'
  },
  {
    id: 5,
    name: '长白山万达滑雪场',
    nameEn: 'Changbaishan Wanda Ski Resort',
    city: '白山',
    country: '中国',
    province: '吉林省',
    type: 'outdoor',
    latitude: 41.9125,
    longitude: 128.0683,
    price: 980,
    priceUnit: '天',
    elevation: 1200,
    trails: 43,
    trailsDistribution: {初级: '10%', 中级: '45%', 高级: '45%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '温泉'],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '2小时', from: '北京', detail: '至长白山机场'},
      {type: '高铁', duration: '7小时', from: '北京', detail: '至长白山站'}
    ],
    season: '11月-4月',
    rating: 4.8,
    reviewCount: 3156,
    description: '亚洲顶级滑雪度假区，雪期长、雪质好，集滑雪、温泉、度假于一体。',
    features: ['雪期长', '温泉度假', '粉雪天堂'],
    website: 'https://www.wandachangbaishan.com'
  },
  {
    id: 6,
    name: '新疆丝绸之路滑雪场',
    nameEn: 'Silk Road Ski Resort',
    city: '乌鲁木齐',
    country: '中国',
    province: '新疆',
    type: 'outdoor',
    latitude: 43.8256,
    longitude: 87.6183,
    price: 468,
    priceUnit: '天',
    elevation: 2500,
    trails: 35,
    trailsDistribution: {初级: '15%', 中级: '50%', 高级: '35%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '4小时', from: '北京', detail: '至乌鲁木齐地窝堡机场'}
    ],
    season: '11月-3月',
    rating: 4.5,
    reviewCount: 1678,
    description: '西部最大滑雪场，海拔高、雪道长，拥有亚洲最长索道。',
    features: ['高海拔', '长雪道', '超长索道'],
    website: 'https://www.silkroadski.com'
  },

  // 日本 - 滑雪场
  {
    id: 101,
    name: '二世古滑雪场',
    nameEn: 'Niseko United',
    city: '二世古',
    country: '日本',
    province: '北海道',
    type: 'outdoor',
    latitude: 42.8648,
    longitude: 140.6795,
    price: 800,
    priceUnit: '天',
    elevation: 1308,
    trails: 61,
    trailsDistribution: {初级: '30%', 中级: '40%', 高级: '30%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '温泉', '酒店'],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '4小时', from: '北京', detail: '至新千岁机场，转巴士2.5小时'},
      {type: '飞机', duration: '3小时', from: '上海', detail: '至新千岁机场，转巴士2.5小时'}
    ],
    season: '12月-4月',
    rating: 4.9,
    reviewCount: 5623,
    description: '世界著名的粉雪天堂，降雪量惊人，国际化的滑雪胜地。',
    features: ['世界著名粉雪', '国际化', '降雪量大'],
    website: 'https://www.niseko.ne.jp'
  },
  {
    id: 102,
    name: '苗场滑雪场',
    nameEn: 'Naeba Ski Resort',
    city: '汤泽町',
    country: '日本',
    province: '新泻县',
    type: 'outdoor',
    latitude: 36.7728,
    longitude: 138.8625,
    price: 650,
    priceUnit: '天',
    elevation: 1789,
    trails: 34,
    trailsDistribution: {初级: '35%', 中级: '40%', 高级: '25%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店'],
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '3小时', from: '上海', detail: '至东京成田，转JR2小时'}
    ],
    season: '12月-4月',
    rating: 4.6,
    reviewCount: 3421,
    description: '日本最大的单一滑雪场，设施完善，适合各水平滑雪者。',
    features: ['大型滑雪场', '设施完善', '适合全家'],
    website: 'https://www.princehotels.com'
  },
  {
    id: 103,
    name: '富士天HTMLElement高原滑雪场',
    nameEn: 'Fujiten Snow Resort',
    city: '富士吉田',
    country: '日本',
    province: '山梨县',
    type: 'outdoor',
    latitude: 35.4972,
    longitude: 138.7467,
    price: 520,
    priceUnit: '天',
    elevation: 1400,
    trails: 14,
    trailsDistribution: {初级: '40%', 中级: '45%', 高级: '15%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '停车场'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '3小时', from: '北京', detail: '至东京羽田，转巴士2.5小时'}
    ],
    season: '12月-3月',
    rating: 4.4,
    reviewCount: 2156,
    description: '可眺望富士山的滑雪场，风景绝美，交通便利。',
    features: ['富士山景观', '交通便利', '风景优美'],
    website: 'https://www.fujiten.com'
  },

  // 瑞士 - 滑雪场
  {
    id: 201,
    name: '采尔马特滑雪场',
    nameEn: 'Zermatt Matterhorn',
    city: '采尔马特',
    country: '瑞士',
    province: '瓦莱州',
    type: 'outdoor',
    latitude: 46.0171,
    longitude: 7.7483,
    price: 1200,
    priceUnit: '天',
    elevation: 3883,
    trails: 360,
    trailsDistribution: {初级: '20%', 中级: '50%', 高级: '30%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '温泉'],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '11小时', from: '北京', detail: '至苏黎世，转火车3.5小时'},
      {type: '飞机', duration: '12小时', from: '上海', detail: '至苏黎世，转火车3.5小时'}
    ],
    season: '11月-5月',
    rating: 5.0,
    reviewCount: 8934,
    description: '世界顶级滑雪胜地，马特洪峰脚下，欧洲最大的滑雪区。',
    features: ['世界顶级', '马特洪峰', '超大滑雪区'],
    website: 'https://www.zermatt.com'
  },
  {
    id: 202,
    name: '韦尔比耶滑雪场',
    nameEn: 'Verbier',
    city: '韦尔比耶',
    country: '瑞士',
    province: '瓦莱州',
    type: 'outdoor',
    latitude: 46.0936,
    longitude: 7.2269,
    price: 1100,
    priceUnit: '天',
    elevation: 3330,
    trails: 410,
    trailsDistribution: {初级: '15%', 中级: '45%', 高级: '40%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '酒吧'],
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '11小时', from: '北京', detail: '至日内瓦，转火车2小时'}
    ],
    season: '12月-4月',
    rating: 4.8,
    reviewCount: 6789,
    description: '自由式滑雪圣地，挑战性强，夜生活丰富。',
    features: ['自由式圣地', '挑战性强', '夜生活丰富'],
    website: 'https://www.verbier.ch'
  },

  // 法国 - 滑雪场
  {
    id: 301,
    name: '夏蒙尼滑雪场',
    nameEn: 'Chamonix Mont Blanc',
    city: '夏蒙尼',
    country: '法国',
    province: '上萨瓦省',
    type: 'outdoor',
    latitude: 45.9237,
    longitude: 6.8694,
    price: 950,
    priceUnit: '天',
    elevation: 3842,
    trails: 150,
    trailsDistribution: {初级: '10%', 中级: '40%', 高级: '50%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '冰川探险'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '11小时', from: '北京', detail: '至日内瓦，转大巴1小时'}
    ],
    season: '12月-4月',
    rating: 4.7,
    reviewCount: 7234,
    description: '现代滑雪运动发源地，勃朗峰脚下，挑战者天堂。',
    features: ['滑雪发源地', '勃朗峰', '极限挑战'],
    website: 'https://www.chamonix.com'
  },
  {
    id: 302,
    name: '库尔舍瓦勒滑雪场',
    nameEn: 'Courchevel',
    city: '库尔舍瓦勒',
    country: '法国',
    province: '萨瓦省',
    type: 'outdoor',
    latitude: 45.4189,
    longitude: 6.6339,
    price: 1050,
    priceUnit: '天',
    elevation: 2738,
    trails: 600,
    trailsDistribution: {初级: '30%', 中级: '45%', 高级: '25%'},
    facilities: ['缆车', '米其林餐厅', '租赁', '教练', '奢华酒店'],
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '11小时', from: '北京', detail: '至里昂，转大巴2小时'}
    ],
    season: '12月-4月',
    rating: 4.7,
    reviewCount: 5432,
    description: '世界最大滑雪区Les 3 Vallées的一部分，奢华度假胜地。',
    features: ['奢华度假', '最大滑雪区', '米其林美食'],
    website: 'https://www.courchevel.com'
  },

  // 美国 - 滑雪场
  {
    id: 401,
    name: '范尔滑雪场',
    nameEn: 'Vail Ski Resort',
    city: '范尔',
    country: '美国',
    province: '科罗拉多州',
    type: 'outdoor',
    latitude: 39.6403,
    longitude: -106.3742,
    price: 1350,
    priceUnit: '天',
    elevation: 3527,
    trails: 193,
    trailsDistribution: {初级: '18%', 中级: '51%', 高级: '31%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '购物中心'],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '15小时', from: '北京', detail: '至丹佛，转大巴2小时'}
    ],
    season: '11月-4月',
    rating: 4.8,
    reviewCount: 9876,
    description: '美国最大滑雪场之一，后碗地形独特，雪道宽阔。',
    features: ['超大雪场', '后碗地形', '宽阔雪道'],
    website: 'https://www.vail.com'
  },
  {
    id: 402,
    name: '阿斯彭滑雪场',
    nameEn: 'Aspen Snowmass',
    city: '阿斯彭',
    country: '美国',
    province: '科罗拉多州',
    type: 'outdoor',
    latitude: 39.1911,
    longitude: -106.8175,
    price: 1450,
    priceUnit: '天',
    elevation: 3813,
    trails: 336,
    trailsDistribution: {初级: '25%', 中级: '45%', 高级: '30%'},
    facilities: ['缆车', '高端餐厅', '租赁', '教练', '奢华酒店', '购物'],
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '15小时', from: '北京', detail: '至丹佛，转飞机4小时'}
    ],
    season: '11月-4月',
    rating: 4.9,
    reviewCount: 7654,
    description: '美国最著名的高端滑雪胜地，名流聚集地，四大雪山可选。',
    features: ['高端度假', '名流胜地', '四山联滑'],
    website: 'https://www.aspensnowmass.com'
  },

  // 加拿大 - 滑雪场
  {
    id: 501,
    name: '惠斯勒黑梳山滑雪场',
    nameEn: 'Whistler Blackcomb',
    city: '惠斯勒',
    country: '加拿大',
    province: '不列颠哥伦比亚省',
    type: 'outdoor',
    latitude: 50.1155,
    longitude: -122.9542,
    price: 1180,
    priceUnit: '天',
    elevation: 2284,
    trails: 200,
    trailsDistribution: {初级: '15%', 中级: '55%', 高级: '30%'},
    facilities: ['缆车', '餐厅', '租赁', '教练', '酒店', '温泉'],
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    transportation: [
      {type: '飞机', duration: '12小时', from: '北京', detail: '至温哥华，转大巴2小时'}
    ],
    season: '11月-5月',
    rating: 4.9,
    reviewCount: 8765,
    description: '北美最大滑雪场，2010冬奥会场地，雪道丰富多样。',
    features: ['北美最大', '冬奥会场', '四季度假'],
    website: 'https://www.whistlerblackcomb.com'
  }
];

// 模拟用户点评数据
const reviewsData = [
  {
    id: 1,
    resortId: 1,
    user: {
      id: 101,
      nickname: '雪霸天',
      avatar: 'https://i.pravatar.cc/150?img=1',
      skiType: '单板',
      experience: '5个雪季',
      level: '艺高人胆大',
      gender: '男',
      location: '北京'
    },
    rating: 5,
    content: '万龙不愧是顶级雪场，雪质超好，中级道特别长！唯一的缺点就是周末人太多了，建议错峰去。',
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400'
    ],
    date: '2025-01-15',
    likes: 234,
    replies: [
      {
        user: { nickname: '雪场小助手', avatar: 'https://i.pravatar.cc/150?img=2' },
        content: '感谢您的评价！建议您关注我们的公众号，可以查看实时人流量哦~',
        date: '2025-01-16'
      }
    ],
    tags: ['雪质好', '适合进阶', '周末人多']
  },
  {
    id: 2,
    resortId: 1,
    user: {
      id: 102,
      nickname: '小白爱滑雪',
      avatar: 'https://i.pravatar.cc/150?img=3',
      skiType: '双板',
      experience: '1个雪季',
      level: '小白',
      gender: '女',
      location: '天津'
    },
    rating: 4,
    content: '第一次来万龙，作为小白有点害怕，教练很耐心。高级道太吓人了😅，还在魔毯区练习中。',
    images: [],
    date: '2025-01-10',
    likes: 89,
    replies: [],
    tags: ['适合初学', '教练专业']
  },
  {
    id: 3,
    resortId: 101,
    user: {
      id: 103,
      nickname: '粉雪猎人',
      avatar: 'https://i.pravatar.cc/150?img=4',
      skiType: '单板',
      experience: '8个雪季',
      level: '顶尖',
      gender: '男',
      location: '上海'
    },
    rating: 5,
    content: '二世古的粉雪名不虚传！降雪量太夸张了，每天都在下雪。适合各个水平的滑雪者，特别推荐Annapuri区，人少雪好！',
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ],
    date: '2025-01-08',
    likes: 567,
    replies: [],
    tags: ['粉雪天堂', '降雪量大', '推荐']
  }
];

// 模拟寻找滑雪搭子数据
const partnersData = [
  {
    id: 1,
    user: {
      id: 201,
      nickname: '北京单板小伙',
      avatar: 'https://i.pravatar.cc/150?img=5',
      skiType: '单板',
      experience: '3个雪季',
      level: '有点水平但不多',
      gender: '男',
      age: 26,
      location: '北京',
      wechat: 'snowboy2025'
    },
    targetResort: '万龙滑雪场',
    plannedDate: '2025-02-15',
    description: '计划2月中旬去万龙刷2天，找个水平相当的小伙伴一起拍照拍视频！我可以开车去，AA油费过路费。',
    tags: ['可开车', '喜欢拍照', 'AA制'],
    status: 'open', // open/full/closed
    joiners: [],
    maxJoiners: 3,
    createTime: '2025-01-20'
  },
  {
    id: 2,
    user: {
      id: 202,
      nickname: '双板小姐姐',
      avatar: 'https://i.pravatar.cc/150?img=6',
      skiType: '双板',
      experience: '4个雪季',
      level: '艺高人胆大',
      gender: '女',
      age: 24,
      location: '上海',
      wechat: 'ski_girl_2024'
    },
    targetResort: '二世古滑雪场',
    plannedDate: '2025-03-10',
    description: '3月去二世古计划玩5天，找个女生搭子一起住酒店可以省点钱～我是双板，水平差不多的一起出发！',
    tags: ['女生专属', '可拼房', '日本行'],
    status: 'open',
    joiners: [{ id: 203, nickname: '滑雪爱好者' }],
    maxJoiners: 2,
    createTime: '2025-01-18'
  }
];

// 按地区分组的滑雪场
const getResortsByRegion = () => {
  const regions = {};

  resortsData.forEach(resort => {
    const key = resort.country;
    if (!regions[key]) {
      regions[key] = [];
    }
    regions[key].push(resort);
  });

  return regions;
};

// 按城市分组的滑雪场
const getResortsByCity = () => {
  const cities = {};

  resortsData.forEach(resort => {
    const key = `${resort.city}, ${resort.country}`;
    if (!cities[key]) {
      cities[key] = [];
    }
    cities[key].push(resort);
  });

  return cities;
};

// 笔记数据
const notesData = [
  {
    id: 1001,
    type: 'experience',
    title: '万龙周末两天一夜，雪质绝了！',
    content: '周六去的，人不多，中级道随便刷。雪道很宽，适合练活儿。缆车排队15分钟，体验很好。晚上住在崇礼县城，性价比挺高的。周日又刷了一上午，雪质依然保持得很好。推荐大家错峰出行，周末上午人最少！',
    coverImage: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    author: {
      id: 301,
      nickname: '单板小王',
      avatar: 'https://i.pravatar.cc/150?img=11',
      displayTags: ['单板', '摄影控', '崇礼常驻']
    },
    resortId: 1,
    resortName: '万龙滑雪场',
    likes: 234,
    comments: 45,
    isLiked: false,
    isCollected: false,
    tags: ['万龙', '周末游', '雪质好'],
    createTime: '2025-02-07T10:30:00',
    location: '张家口市'
  },
  {
    id: 1002,
    type: 'partner',
    title: '2月15去太舞，找个小伙伴一起拍照！',
    content: '计划2月中旬去太舞刷2天，找个水平相当的小伙伴一起拍照拍视频！我可以开车去，AA油费过路费。要求：能熟练滑中级道，喜欢拍照，性格好相处～',
    coverImage: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
    images: [
      'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800'
    ],
    author: {
      id: 302,
      nickname: '北京单板小伙',
      avatar: 'https://i.pravatar.cc/150?img=12',
      displayTags: ['单板', '周末滑手', '可开车']
    },
    resortId: 2,
    resortName: '太舞滑雪场',
    likes: 89,
    comments: 23,
    isLiked: false,
    isCollected: false,
    tags: ['找搭子', '太舞', '可开车'],
    createTime: '2025-02-06T15:20:00',
    location: '北京',
    partnerInfo: {
      plannedDate: '2025-02-15',
      maxJoiners: 3,
      currentJoiners: 1,
      tags: ['可开车', '喜欢拍照', 'AA制'],
      status: 'open'
    }
  },
  {
    id: 1003,
    type: 'experience',
    title: '哈尔滨融创室内滑雪初体验',
    content: '作为小白，第一次在室内滑雪场体验。温度控制在-3度左右，不会太冷。雪道虽然不多，但对新手足够了。教练很耐心，一节课基本就能在魔毯区滑行了。推荐新手来室内练习基础！',
    coverImage: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
    ],
    author: {
      id: 303,
      nickname: '小白爱滑雪',
      avatar: 'https://i.pravatar.cc/150?img=13',
      displayTags: ['双板', '小白', '夜场爱好者']
    },
    resortId: 3,
    resortName: '哈尔滨融创雪世界',
    likes: 156,
    comments: 32,
    isLiked: false,
    isCollected: false,
    tags: ['室内滑雪', '新手友好', '哈尔滨'],
    createTime: '2025-02-05T20:15:00',
    location: '哈尔滨'
  },
  {
    id: 1004,
    type: 'partner',
    title: '3月二世古5天行，找个女生搭子拼房～',
    content: '3月去二世古计划玩5天，找个女生搭子一起住酒店可以省点钱～我是双板，水平差不多的一起出发！机票已订好，酒店可以一起拼。',
    coverImage: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    author: {
      id: 304,
      nickname: '双板小姐姐',
      avatar: 'https://i.pravatar.cc/150?img=6',
      displayTags: ['双板', '艺高人胆大', '女生专属']
    },
    resortId: 101,
    resortName: '二世古滑雪场',
    likes: 267,
    comments: 56,
    isLiked: false,
    isCollected: false,
    tags: ['找搭子', '日本行', '女生拼房'],
    createTime: '2025-02-04T18:40:00',
    location: '上海',
    partnerInfo: {
      plannedDate: '2025-03-10',
      maxJoiners: 2,
      currentJoiners: 2,
      tags: ['女生专属', '可拼房', '日本行'],
      status: 'open'
    }
  },
  {
    id: 1005,
    type: 'experience',
    title: '广州融创周末打卡，全年都能滑雪！',
    content: '南方雪友的福音！室内滑雪场全年开放，夏天也能过过瘾。雪道长度适中，宽度够，新手到中级都能玩。温度控制得很好，不会觉得冷。推荐周边的朋友常来刷刷～',
    coverImage: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
    images: [
      'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800'
    ],
    author: {
      id: 305,
      nickname: '南方雪友',
      avatar: 'https://i.pravatar.cc/150?img=14',
      displayTags: ['单板', '周末滑手', '室内控']
    },
    resortId: 4,
    resortName: '广州融创雪世界',
    likes: 189,
    comments: 28,
    isLiked: false,
    isCollected: false,
    tags: ['室内滑雪', '广州', '全年开放'],
    createTime: '2025-02-03T12:00:00',
    location: '广州'
  },
  {
    id: 1006,
    type: 'experience',
    title: '云顶滑雪场夜场体验，灯光超美！',
    content: '第一次体验夜场滑雪，氛围太棒了！灯光打在雪道上特别美，人比白天少很多。晚上7点到10点，雪质保持得很好。推荐大家试试夜场，别有一番风味～',
    coverImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800'
    ],
    author: {
      id: 306,
      nickname: '夜场爱好者',
      avatar: 'https://i.pravatar.cc/150?img=15',
      displayTags: ['单板', '夜场爱好者', '崇礼常驻']
    },
    resortId: 5,
    resortName: '云顶滑雪场',
    likes: 312,
    comments: 67,
    isLiked: false,
    isCollected: false,
    tags: ['夜场', '云顶', '灯光美'],
    createTime: '2025-02-02T22:30:00',
    location: '张家口'
  },
  {
    id: 1007,
    type: 'partner',
    title: '初中水平找个搭子，这周末去南山',
    content: '这周末计划去南山滑雪，找个水平相当的小伙伴一起。我双板，能滑中级道，希望你也差不多。可以一起拼车，费用AA。时间定在周六或者周日都可以。',
    coverImage: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
    images: [],
    author: {
      id: 307,
      nickname: '周末滑雪派',
      avatar: 'https://i.pravatar.cc/150?img=16',
      displayTags: ['双板', '刚入门', '周末滑手']
    },
    resortId: 6,
    resortName: '南山滑雪场',
    likes: 78,
    comments: 19,
    isLiked: false,
    isCollected: false,
    tags: ['找搭子', '南山', '周末'],
    createTime: '2025-02-01T09:15:00',
    location: '北京',
    partnerInfo: {
      plannedDate: '2025-02-10',
      maxJoiners: 2,
      currentJoiners: 1,
      tags: ['初中水平', 'AA制', '周末'],
      status: 'open'
    }
  },
  {
    id: 1008,
    type: 'experience',
    title: '富龙滑雪场攻略，新手必看！',
    content: '富龙特别适合新手！魔毯区很宽，教练专业。价格比万龙太舞便宜不少，性价比高。雪道设计合理，初级道长且宽，练习基础很舒服。推荐新手先来这里练手再去挑战更高的雪场。',
    coverImage: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
    images: [
      'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800'
    ],
    author: {
      id: 308,
      nickname: '滑雪教练小张',
      avatar: 'https://i.pravatar.cc/150?img=17',
      displayTags: ['双板', '顶尖', '教练']
    },
    resortId: 7,
    resortName: '富龙滑雪场',
    likes: 445,
    comments: 89,
    isLiked: false,
    isCollected: false,
    tags: ['新手攻略', '富龙', '性价比'],
    createTime: '2025-01-31T16:45:00',
    location: '张家口'
  }
];

module.exports = {
  resortsData,
  reviewsData,
  partnersData,
  notesData,
  getResortsByRegion,
  getResortsByCity
};
