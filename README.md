# 民杰云营 - 微信小程序

这是一个功能完整的微信小程序开发模板。

## 项目结构

```
minjieyunying/
├── app.js                  # 小程序逻辑
├── app.json                # 小程序公共配置
├── app.wxss                # 小程序公共样式
├── project.config.json     # 项目配置文件
├── sitemap.json           # 站点地图配置
├── pages/                 # 页面目录
│   ├── index/            # 首页
│   │   ├── index.js
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   └── index.json
│   └── logs/             # 日志页面
│       ├── logs.js
│       ├── logs.wxml
│       ├── logs.wxss
│       └── logs.json
├── utils/                # 工具函数目录
│   ├── util.js          # 通用工具函数
│   ├── request.js       # 网络请求封装
│   └── storage.js       # 本地存储封装
└── images/              # 图片资源目录
```

## 功能特性

- ✅ 完整的项目结构
- ✅ 封装的网络请求模块
- ✅ 本地存储管理
- ✅ 常用工具函数
- ✅ 示例页面和交互
- ✅ 用户信息获取
- ✅ 日志记录功能

## 开始使用

### 1. 导入项目

使用微信开发者工具导入本项目。

### 2. 配置 AppID

在 `project.config.json` 文件中,将 `appid` 字段修改为你的小程序 AppID:

```json
{
  "appid": "your-appid-here"
}
```

### 3. 配置 API 地址

在 `utils/request.js` 文件中,修改 `BASE_URL` 为你的后端 API 地址:

```javascript
const BASE_URL = 'https://your-api-domain.com'
```

### 4. 运行项目

在微信开发者工具中点击"编译"按钮即可运行。

## 工具函数说明

### util.js - 通用工具函数

- `formatTime(date)` - 格式化时间
- `throttle(fn, delay)` - 节流函数
- `debounce(fn, delay)` - 防抖函数
- `deepClone(obj)` - 深拷贝对象
- `generateId()` - 生成唯一ID
- `formatFileSize(size)` - 格式化文件大小
- `validatePhone(phone)` - 验证手机号
- `validateEmail(email)` - 验证邮箱
- `validateIdCard(idCard)` - 验证身份证号

### request.js - 网络请求

- `get(url, data, options)` - GET请求
- `post(url, data, options)` - POST请求
- `put(url, data, options)` - PUT请求
- `del(url, data, options)` - DELETE请求
- `uploadFile(url, filePath, formData)` - 上传文件
- `downloadFile(url)` - 下载文件

### storage.js - 本地存储

- `setStorage(key, value)` - 设置存储
- `getStorage(key, defaultValue)` - 获取存储
- `removeStorage(key)` - 删除存储
- `clearStorage()` - 清空所有存储
- `setUserInfo(userInfo)` - 设置用户信息
- `getUserInfo()` - 获取用户信息
- `setToken(token)` - 设置token
- `getToken()` - 获取token

## 开发建议

1. **代码规范**: 保持代码风格一致,使用注释说明关键逻辑
2. **错误处理**: 合理处理各种异常情况,给用户友好的提示
3. **性能优化**: 避免频繁的 setData 操作,合理使用数据绑定
4. **安全性**: 不要在代码中暴露敏感信息,使用 HTTPS 进行通信

## 注意事项

- 确保已在微信公众平台配置服务器域名
- 上传代码前检查是否有敏感信息
- 合理使用小程序的缓存机制
- 注意小程序包大小限制(主包2MB,分包8MB)

## 技术支持

如有问题,请提交 Issue 或联系开发团队。

## 许可证

MIT License
