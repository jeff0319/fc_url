const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3050;

// 静态文件服务
app.use(express.static('public'));
app.use(express.json());

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const SESSION_KEY_ENV = process.env.SESSION_KEY;

function loadSessionKey() {
  if (!SESSION_KEY_ENV || !SESSION_KEY_ENV.trim()) {
    throw new Error('未设置 SESSION_KEY 环境变量');
  }
  return SESSION_KEY_ENV.trim();
}

// API路由：执行curl命令并提取token
app.post('/api/get-token', (req, res) => {
  const { curlCommand, baseUrl } = req.body;
  
  // 默认的curl命令 - 请根据实际需要修改这个命令
  // 示例：const defaultCurlCommand = `curl -X POST 'https://your-api.com/oauth' -H 'Authorization: Bearer YOUR_TOKEN'`;
  // 实际的默认curl命令
  let actualCurlCommand = '';
  let usingCustomCommand = false;
  if (curlCommand && curlCommand.trim()) {
    actualCurlCommand = curlCommand.trim();
    usingCustomCommand = true;
  } else {
    try {
      const sessionKey = loadSessionKey();
      const payload = JSON.stringify({ session_key: sessionKey });
      actualCurlCommand = `curl 'https://fuclaude.jeff0319.com/manage-api/auth/oauth_token' -H 'Content-Type: application/json' -d '${payload}'`;
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  console.log('执行curl命令:', usingCustomCommand ? '使用自定义命令' : '使用默认命令(来自session_key文件)');

  // 执行curl命令
  exec(actualCurlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('执行curl命令时出错:', error);
      return res.status(500).json({ error: '执行curl命令失败: ' + error.message });
    }

    if (stderr) {
      console.error('curl stderr:', stderr);
    }

    try {
      // 解析JSON响应
      const jsonResponse = JSON.parse(stdout);
      
      // 提取login_url
      if (!jsonResponse.login_url) {
        return res.status(400).json({ error: '响应中未找到login_url字段' });
      }

      // 直接使用完整的login_url内容
      const loginUrl = jsonResponse.login_url;
      
      // 构建最终URL：base_url + login_url
      const finalUrl = `${baseUrl || 'https://fuclaude.jeff0319.com'}${loginUrl}`;
      
      res.json({
        success: true,
        loginUrl: loginUrl,
        finalUrl: finalUrl,
        originalResponse: jsonResponse
      });

    } catch (parseError) {
      console.error('解析JSON时出错:', parseError);
      res.status(400).json({ 
        error: '无法解析curl响应为JSON格式', 
        response: stdout 
      });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
});
