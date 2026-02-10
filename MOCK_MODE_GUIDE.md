# Mock 模式使用说明

## 已完成的更改

### 1. 添加了 Mock 配置
- 文件：`frontend/infrastructure/config/index.js`
- 作用：控制是否使用 Mock 数据
- 当前状态：`useMock: true`（开启 Mock 模式）

### 2. 添加了 Mock 数据
- 文件：`frontend/infrastructure/mock/resortMockData.js`
- 内容：5 个滑雪场的模拟数据
  - 万龙滑雪场（河北张家口，室外）
  - 太舞滑雪场（河北张家口，室外）
  - 乔波冰雪世界（北京，室内）
  - 军都山滑雪场（北京，室外）
  - 融创雪世界（广州，室内）

### 3. 更新了云函数客户端
- 文件：`frontend/infrastructure/api/CloudFunctionClient.js`
- 改动：添加了 Mock 模式支持
  - 当 `useMock: true` 时，返回本地模拟数据
  - 当 `useMock: false` 时，调用真实的微信云函数

### 4. 清理了所有 TypeScript 类型注解
已更新的文件：
- ✅ `application/services/ResortSearchService.app.js`
- ✅ `application/mappers/ResortMapper.js`
- ✅ `domain/resort/entities/Resort.entity.js`
- ✅ `domain/resort/repositories/IResortRepository.js`
- ✅ `domain/resort/services/ResortSearchService.domain.js`
- ✅ `infrastructure/api/CloudFunctionClient.js`
- ✅ `infrastructure/api/ResortRepository.impl.js`
- ✅ `di/container.js`
- ✅ `shared/types/index.js`

---

## 如何测试

### 在微信开发者工具中测试

1. **打开微信开发者工具**
   - 确保 HBuilderX 已经运行项目到微信开发者工具

2. **查看控制台日志**
   - 你应该看到 `[Mock模式] 调用云函数: resort-search` 的日志

3. **测试搜索功能**
   - 页面加载时会自动显示所有滑雪场
   - 尝试搜索 "北京"
   - 尝试点击筛选按钮切换 "室内"/"室外"

---

## 如何切换到真实云函数

当你的女朋友把云开发账号权限给你后：

1. **修改配置文件**
   ```javascript
   // frontend/infrastructure/config/index.js
   export const appConfig = {
     useMock: false,  // 改为 false
     // ...
   }
   ```

2. **上传云函数**
   - 在微信开发者工具中右键 `cloudfunctions/resort-search`
   - 选择 "上传并部署：云端安装依赖"
   - 对 `resort-detail` 重复相同操作

3. **在数据库中导入数据**
   - 打开云开发控制台
   - 进入数据库
   - 创建 `resorts` 集合
   - 导入测试数据（可以用 mock 数据）

4. **测试**
   - 刷新小程序
   - 控制台会显示真实的云函数调用日志

---

## Mock 数据说明

当前 Mock 数据支持的功能：

### 搜索功能
- ✅ 关键词搜索（名称、城市、省份）
- ✅ 类型筛选（室内/室外）
- ✅ 分页（limit/offset）
- ✅ 模拟 300ms 网络延迟

### 详情功能
- ✅ 根据 ID 查询详情
- ✅ 不存在时返回错误

---

## 下一步开发

现在你可以：

1. **测试搜索页面**
   - 查看列表显示是否正常
   - 测试搜索功能
   - 测试筛选功能

2. **开发详情页面**
   - 创建 `pages/resort/detail/index.vue`
   - 使用相同的 Mock 模式获取数据

3. **添加更多 Mock 数据**
   - 编辑 `resortMockData.js`
   - 添加更多滑雪场数据

---

## 常见问题

### Q: 为什么看不到数据？
A: 检查微信开发者工具控制台，查看是否有错误信息

### Q: Mock 模式会影响性能吗？
A: 不会，Mock 数据存储在本地，响应速度很快（模拟了 300ms 延迟）

### Q: 可以修改 Mock 数据吗？
A: 可以，直接编辑 `resortMockData.js` 文件

### Q: 如何添加更多云函数 Mock？
A: 在 `resortMockData.js` 的 `mockCloudFunction` 对象中添加新的方法
