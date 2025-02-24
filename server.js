import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置CORS
app.use(cors({
    origin: '*', // 允许所有来源访问
    methods: ['GET', 'POST', 'OPTIONS'], // 允许的HTTP方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: true // 允许发送cookie
}));

// 解析JSON请求体
app.use(express.json());

// 托管静态文件
app.use(express.static(join(__dirname)));

// 代理API路由
app.post('/api/analysis', async (req, res) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120秒超时

    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 334e47b8-5f5c-4c22-8d5e-c085f120fef3'
            },
            body: JSON.stringify({
                model: 'deepseek-r1-250120',
                messages: req.body.messages
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`API请求失败：${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('API请求错误:', error);
        res.status(500).json({
            error: error.name === 'AbortError' ? '请求超时，请稍后重试' : error.message
        });
    } finally {
        clearTimeout(timeoutId);
    }
});

// 设置端口
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});