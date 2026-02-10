# ⚡ 快速配置参考

## 🎯 三个关键配置

### 1️⃣ 获取AppID（小程序后台）
```
https://mp.weixin.qq.com/
→ 登录 → 开发 → 开发设置 → AppID（wx开头）
```

### 2️⃣ 获取环境ID（云开发）
```
小程序后台 → 云开发 → 开通 → 创建环境
→ 设置 → 环境ID（cloud1-xxx格式）
```

### 3️⃣ 配置到项目中
```bash
# 修改这两个文件：

frontend/src/manifest.json 第10行：
"appid": "你的AppID"

frontend/src/App.vue 第17行：
env: '你的环境ID'
```

---

## 📝 四个必须完成的操作

### ✅ 1. 创建数据库集合
```
微信开发者工具 → 云开发 → 数据库
→ 添加集合 → 名称: resorts
```

### ✅ 2. 添加测试数据
```
数据库 → 点击resorts → 添加记录
→ 复制粘贴CHECKLIST.md中的数据
```

### ✅ 3. 上传云函数
```
云开发 → 云函数
→ 右键resort-search → 上传并部署
→ 右键resort-detail → 上传并部署
```

### ✅ 4. 启动项目
```bash
cd /Users/samdediannao/skiing/frontend
npm run dev:mp-weixin

# 然后在微信开发者工具导入：
# frontend/dist/dev/mp-weixin
```

---

## 🐛 快速修复常见问题

### ❌ "云函数未找到"
```bash
✓ 确认云函数已上传
✓ 查看云开发控制台的云函数列表
✓ 检查云函数名称是否正确
```

### ❌ "数据库权限错误"
```
云开发 → 设置 → 数据库权限
→ 改为：所有用户可读，仅创建者可读写
```

### ❌ "页面空白"
```
1. 查看控制台错误（红色文字）
2. 确认数据库有数据
3. 确认云函数已部署
```

### ❌ "编译失败"
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重启开发服务器
npm run dev:mp-weixin
```

---

## 📞 立即获取帮助

遇到问题时告诉我：
1. 具体现象（看到什么错误）
2. 错误信息（复制红色文字）
3. 当前步骤（配置到哪一步）

我会帮你解决！

---

**开始配置吧！有问题随时问我** 💬
