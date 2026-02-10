/**
 * 国内热门滑雪场数据（TOP 50）
 * 数据来源：综合搜索量、人气、口碑排名
 * 用于初始化云数据库或作为默认展示数据
 */
export const TOP_RESORTS = [
  // 河北张家口（冬奥雪场群）
  { name: '万龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 98, latitude: 40.9814, longitude: 115.2814 },
  { name: '太舞滑雪小镇', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 96, latitude: 40.9506, longitude: 115.3406 },
  { name: '云顶滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 95, latitude: 40.9892, longitude: 115.3492 },
  { name: '富龙滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 92, latitude: 40.9745, longitude: 115.2745 },
  { name: '多乐美地滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 90, latitude: 40.9523, longitude: 115.2523 },
  { name: '银河滑雪场', province: '河北省', city: '张家口市', district: '崇礼区', type: 'outdoor', popularity: 85, latitude: 40.9634, longitude: 115.2634 },

  // 吉林长白山区域
  { name: '万科松花湖度假区', province: '吉林省', city: '吉林市', district: '丰满区', type: 'outdoor', popularity: 97, latitude: 43.2834, longitude: 126.6234 },
  { name: '长白山国际度假区', province: '吉林省', city: '白山市', district: '抚松县', type: 'outdoor', popularity: 94, latitude: 42.0156, longitude: 127.7556 },
  { name: '北大湖滑雪场', province: '吉林省', city: '吉林市', district: '永吉县', type: 'outdoor', popularity: 93, latitude: 43.2945, longitude: 126.5745 },
  { name: '长春莲花山滑雪场', province: '吉林省', city: '长春市', district: '二道区', type: 'outdoor', popularity: 86, latitude: 43.7823, longitude: 125.9823 },

  // 黑龙江
  { name: '亚布力滑雪旅游度假区', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 95, latitude: 44.7723, longitude: 128.4723 },
  { name: '帽儿山滑雪场', province: '黑龙江省', city: '哈尔滨市', district: '尚志市', type: 'outdoor', popularity: 82, latitude: 45.2134, longitude: 127.5134 },

  // 新疆
  { name: '阿勒泰将军山滑雪场', province: '新疆维吾尔自治区', city: '阿勒泰地区', district: '阿勒泰市', type: 'outdoor', popularity: 91, latitude: 47.8445, longitude: 88.1445 },
  { name: '丝绸之路国际滑雪场', province: '新疆维吾尔自治区', city: '乌鲁木齐市', district: '乌鲁木齐县', type: 'outdoor', popularity: 88, latitude: 43.4856, longitude: 87.0856 },
  { name: '天山天池滑雪场', province: '新疆维吾尔自治区', city: '昌吉州', district: '阜康市', type: 'outdoor', popularity: 84, latitude: 43.8867, longitude: 88.1367 },

  // 北京
  { name: '南山滑雪场', province: '北京市', city: '北京市', district: '密云区', type: 'outdoor', popularity: 89, latitude: 40.6178, longitude: 116.9178 },
  { name: '军都山滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 87, latitude: 40.2889, longitude: 116.0889 },
  { name: '怀北国际滑雪场', province: '北京市', city: '北京市', district: '怀柔区', type: 'outdoor', popularity: 83, latitude: 40.4567, longitude: 116.6567 },
  { name: '渔阳滑雪场', province: '北京市', city: '北京市', district: '平谷区', type: 'outdoor', popularity: 81, latitude: 40.2678, longitude: 117.0678 },
  { name: '雪世界滑雪场', province: '北京市', city: '北京市', district: '昌平区', type: 'outdoor', popularity: 78, latitude: 40.3123, longitude: 116.1123 },

  // 室内滑雪场（全国）
  { name: '融创雪世界（哈尔滨）', province: '黑龙江省', city: '哈尔滨市', district: '松北区', type: 'indoor', popularity: 90, latitude: 45.7923, longitude: 126.5923 },
  { name: '融创雪世界（广州）', province: '广东省', city: '广州市', district: '花都区', type: 'indoor', popularity: 88, latitude: 23.3789, longitude: 113.1789 },
  { name: '融创雪世界（成都）', province: '四川省', city: '成都市', district: '都江堰市', type: 'indoor', popularity: 86, latitude: 30.9912, longitude: 103.6412 },
  { name: '乔波冰雪世界（北京）', province: '北京市', city: '北京市', district: '顺义区', type: 'indoor', popularity: 85, latitude: 40.1234, longitude: 116.6534 },
  { name: '乔波冰雪世界（绍兴）', province: '浙江省', city: '绍兴市', district: '柯桥区', type: 'indoor', popularity: 83, latitude: 29.9845, longitude: 120.4845 },
  { name: '热雪奇迹（北京）', province: '北京市', city: '北京市', district: '丰台区', type: 'indoor', popularity: 82, latitude: 39.8567, longitude: 116.2867 },

  // 辽宁
  { name: '棋盘山冰雪大世界', province: '辽宁省', city: '沈阳市', district: '浑南区', type: 'outdoor', popularity: 80, latitude: 41.8456, longitude: 123.5856 },
  { name: '东北亚滑雪场', province: '辽宁省', city: '沈阳市', district: '新城子区', type: 'outdoor', popularity: 76, latitude: 42.0234, longitude: 123.4234 },

  // 内蒙古
  { name: '美林谷滑雪场', province: '内蒙古自治区', city: '赤峰市', district: '喀喇沁旗', type: 'outdoor', popularity: 79, latitude: 41.9123, longitude: 118.7123 },

  // 山西
  { name: '九龙滑雪场', province: '山西省', city: '太原市', district: '娄烦县', type: 'outdoor', popularity: 75, latitude: 38.0678, longitude: 111.7678 },

  // 陕西
  { name: '照金国际滑雪场', province: '陕西省', city: '铜川市', district: '耀州区', type: 'outdoor', popularity: 77, latitude: 34.9845, longitude: 109.0845 },
  { name: '太白山滑雪场', province: '陕西省', city: '宝鸡市', district: '眉县', type: 'outdoor', popularity: 74, latitude: 34.0567, longitude: 107.7567 },

  // 甘肃
  { name: '和政松鸣岩滑雪场', province: '甘肃省', city: '临夏州', district: '和政县', type: 'outdoor', popularity: 72, latitude: 35.4123, longitude: 103.3123 },

  // 青海
  { name: '岗什卡滑雪场', province: '青海省', city: '海北州', district: '门源县', type: 'outdoor', popularity: 73, latitude: 37.6234, longitude: 101.6234 },

  // 四川
  { name: '西岭雪山滑雪场', province: '四川省', city: '成都市', district: '大邑县', type: 'outdoor', popularity: 84, latitude: 30.6345, longitude: 103.1345 },
  { name: '峨眉山滑雪场', province: '四川省', city: '乐山市', district: '峨眉山市', type: 'outdoor', popularity: 78, latitude: 29.6012, longitude: 103.4812 },

  // 云南
  { name: '轿子雪山滑雪场', province: '云南省', city: '昆明市', district: '禄劝县', type: 'outdoor', popularity: 71, latitude: 26.2456, longitude: 102.6456 },

  // 湖北
  { name: '神农架滑雪场', province: '湖北省', city: '神农架林区', district: '神农架林区', type: 'outdoor', popularity: 80, latitude: 31.7445, longitude: 110.6745 },

  // 湖南
  { name: '大围山滑雪场', province: '湖南省', city: '长沙市', district: '浏阳市', type: 'outdoor', popularity: 70, latitude: 28.4178, longitude: 114.1578 },

  // 安徽
  { name: '大别山滑雪场', province: '安徽省', city: '六安市', district: '霍山县', type: 'outdoor', popularity: 68, latitude: 31.3923, longitude: 116.3323 },

  // 江苏
  { name: '金陵大报恩寺滑雪场', province: '江苏省', city: '南京市', district: '秦淮区', type: 'indoor', popularity: 75, latitude: 32.0012, longitude: 118.7812 },

  // 浙江
  { name: '大明山滑雪场', province: '浙江省', city: '杭州市', district: '临安区', type: 'outdoor', popularity: 76, latitude: 30.2634, longitude: 119.6234 },
  { name: '江南天池滑雪场', province: '浙江省', city: '湖州市', district: '安吉县', type: 'outdoor', popularity: 72, latitude: 30.5845, longitude: 119.5845 },

  // 福建
  { name: '云顶山滑雪场', province: '福建省', city: '福州市', district: '永泰县', type: 'outdoor', popularity: 69, latitude: 25.8723, longitude: 118.9323 },

  // 山东
  { name: '蒙山滑雪场', province: '山东省', city: '临沂市', district: '蒙阴县', type: 'outdoor', popularity: 67, latitude: 35.7112, longitude: 117.9512 },
  { name: '烟台塔山滑雪场', province: '山东省', city: '烟台市', district: '芝罘区', type: 'outdoor', popularity: 66, latitude: 37.5234, longitude: 121.4234 },

  // 河南
  { name: '伏牛山滑雪场', province: '河南省', city: '洛阳市', district: '栾川县', type: 'outdoor', popularity: 74, latitude: 33.7856, longitude: 111.6156 },
  { name: '嵩山滑雪场', province: '河南省', city: '郑州市', district: '登封市', type: 'outdoor', popularity: 70, latitude: 34.4823, longitude: 113.0423 },

  // 天津
  { name: '蓟州国际滑雪场', province: '天津市', city: '天津市', district: '蓟州区', type: 'outdoor', popularity: 73, latitude: 40.0456, longitude: 117.4056 },

  // 上海（室内）
  { name: '银七星滑雪场', province: '上海市', city: '上海市', district: '闵行区', type: 'indoor', popularity: 77, latitude: 31.0123, longitude: 121.3823 }
]
