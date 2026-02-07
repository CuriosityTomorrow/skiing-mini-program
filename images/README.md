# 图片资源清单

本目录需要存放以下图片资源。建议使用 PNG 格式，背景透明。

## 必需的图片资源

### Tab栏图标 (81x81px)
- `search.png` - 搜索图标（未选中）
- `search-active.png` - 搜索图标（选中）
- `explore.png` - 探索图标（未选中）
- `explore-active.png` - 探索图标（选中）
- `profile.png` - 个人中心图标（未选中）
- `profile-active.png` - 个人中心图标（选中）

### 通用图标 (32x32px 或 40x40px)
- `search-icon.png` - 搜索放大镜图标
- `close.png` - 关闭/取消图标
- `close-white.png` - 关闭图标（白色）
- `location.png` - 位置图标（大）
- `location-small.png` - 位置图标（小）
- `star.png` - 星星/评分图标
- `pin.png` - 地图标记图标
- `arrow-down.png` - 向下箭头
- `arrow-right.png` - 向右箭头
- `heart.png` - 收藏图标（空心）
- `heart-filled.png` - 收藏图标（实心）
- `share.png` - 分享图标
- `share-white.png` - 分享图标（白色）
- `like.png` - 点赞图标
- `comment.png` - 评论图标

### 功能图标
- `checkbox.png` - 复选框（未选中）40x40px
- `checkbox-checked.png` - 复选框（选中）40x40px
- `ski.png` - 滑雪图标
- `ski-resort.png` - 滑雪场图标
- `flag.png` - 国旗图标
- `edit.png` - 编辑图标
- `review.png` - 评价图标
- `partners.png` - 搭子图标
- `favorite.png` - 收藏图标
- `settings.png` - 设置图标
- `about.png` - 关于图标
- `feedback.png` - 反馈图标
- `add-white.png` - 添加按钮（白色）
- `wechat.png` - 微信图标
- `compare.png` - 对比图标（灰色）
- `compare-white.png` - 对比图标（白色）

### 性别图标
- `male.png` - 男性图标
- `female.png` - 女性图标

### 交通图标
- `train.png` - 火车/高铁图标
- `plane.png` - 飞机图标
- `car.png` - 汽车图标

### 设施图标
- `facility-缆车.png` - 缆车图标
- `facility-餐厅.png` - 餐厅图标
- `facility-租赁.png` - 租赁图标
- `facility-教练.png` - 教练图标
- `facility-民宿.png` - 民宿图标
- `facility-酒店.png` - 酒店图标
- `facility-温泉.png` - 温泉图标
- `facility-停车场.png` - 停车场图标
- `facility-魔毯.png` - 魔毯图标
- `facility-购物中心.png` - 购物中心图标

### 其他
- `empty.png` - 空状态图标（200x200px）
- `empty-compare.png` - 对比空状态图标（240x240px）
- `default-avatar.png` - 默认头像（160x160px）
- `share-bg.png` - 分享背景图（500x400px）

## 临时解决方案

在开发阶段，你可以：

1. **使用在线图标库**
   - Iconfont (https://www.iconfont.cn/)
   - IconPark (https://iconpark.oceanengine.com/)

2. **使用纯色占位图**
   - 创建简单的纯色 PNG 图片

3. **使用 Unsplash 图片**
   - 项目中的滑雪场图片使用了 Unsplash
   - 可以继续使用网络图片 URL

## 图片尺寸建议

| 类型 | 建议尺寸 | 说明 |
|------|----------|------|
| Tab栏图标 | 81x81px | 2倍图 |
| 小图标 | 24x24px ~ 40x40px | 功能图标 |
| 滑雪场缩略图 | 120x90px | 列表展示 |
| 滑雪场详情图 | 750x500px | 轮播图 |
| 用户头像 | 80x80px | 圆形裁剪 |
| 分享背景 | 500x400px | 分享卡片 |

## 注意事项

1. 所有图标建议使用 PNG 格式，支持透明背景
2. 建议使用 @2x 和 @3x 图片以适配不同屏幕
3. 图片文件大小控制在 50KB 以内
4. 可以使用 TinyPNG 等工具压缩图片
