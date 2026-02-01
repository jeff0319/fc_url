# URL拼接器

一个基于Docker的Web应用，用于执行curl命令并从JSON响应中提取login_url，然后与基础URL拼接构建完整的链接。

## 功能特性

- 🌐 友好的Web界面
- 🔧 执行自定义curl命令
- 🔍 自动提取JSON响应中的login_url
- 🔗 与基础URL拼接构建完整链接
- 📋 一键复制功能
- 🐳 Docker化部署

## 快速开始

### 方法1: 使用Docker Compose (推荐)

1. 创建项目目录并下载所有文件：
```bash
mkdir token-extractor
cd token-extractor
# 将所有提供的文件放入此目录
```

2. 构建并启动服务：
```bash
docker-compose up -d --build
```

3. 访问应用：
```
http://localhost:3030
```

### 方法2: 手动Docker构建

1. 构建Docker镜像：
```bash
docker build -t token-extractor .
```

2. 运行容器：
```bash
docker run -d -p 3030:3000 --name token-extractor token-extractor
```

## 使用方法

### 快速使用（默认命令）
1. 直接访问Web界面
2. 可选择修改基础URL（默认为 `https://abc.com`）
3. 点击"获取链接"按钮即可使用内置的默认curl命令

### 自定义命令
1. 在Web界面中输入你的curl命令，例如：
```bash
   curl -X GET 'https://api.example.com/oauth' -H 'Authorization: Bearer your_token'
```

2. 输入基础URL（可选，默认为 `https://abc.com`）

3. 点击"获取链接"按钮

### 处理流程
4. 系统将：
   - 执行curl命令（默认或自定义）
   - 解析JSON响应
   - 提取完整的`login_url`内容
   - 构建最终URL: `基础URL + login_url`
   - 显示结果供复制使用

## 配置默认curl命令

在 `server.js` 文件中，你可以修改默认的curl命令：
```javascript
// 将这行改为你的实际API调用
const defaultCurlCommand = `curl 'http://abc.com' -H 'Content-Type: application/json' -d '{ "session_key": "abc"}'`;
```

## 预期的JSON响应格式

应用期望curl命令返回如下格式的JSON：
```json
{
  "expires_at": 0,
  "login_url": "/login_oauth?token=xxx"
}
```

系统将提取完整的`login_url`内容，并与基础URL拼接。

**示例：**
- JSON响应: `{"expires_at":0,"login_url":"/login_oauth?token=xxx"}`
- 基础URL: `https://abc.com`
- 最终结果: `https://abc.com/login_oauth?token=xxx`

## 项目结构
```
token-extractor/
├── Dockerfile              # Docker镜像定义
├── docker-compose.yml      # Docker Compose配置
├── package.json            # Node.js依赖
├── server.js              # Express服务器
├── public/
│   └── index.html         # Web界面
└── README.md              # 说明文档
```

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生HTML/CSS/JavaScript
- **容器化**: Docker + Docker Compose
- **系统工具**: curl (Alpine Linux)

## 环境要求

- Docker 20.0+
- Docker Compose 2.0+

## 故障排除

### 常见问题

1. **curl命令执行失败**
   - 检查目标URL是否可访问
   - 验证curl命令语法是否正确
   - 确认网络连接正常

2. **JSON解析失败**
   - 确认curl响应是有效的JSON格式
   - 检查响应中是否包含`login_url`字段

3. **URL拼接结果异常**
   - 确认基础URL格式是否正确
   - 检查`login_url`内容是否完整

### 查看日志
```bash
# 查看容器日志
docker-compose logs -f

# 或者
docker logs token-extractor
```

## 安全注意事项

- 此应用会执行任意的curl命令，请确保在受信任的环境中使用
- 建议不要在生产环境中暴露到公网
- 考虑添加身份验证和访问控制
- 谨慎处理敏感的API密钥和token

## 许可证

MIT License