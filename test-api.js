import fetch from 'node-fetch';

async function testVolcAPI() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
        console.log('开始测试火山引擎API...');
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 334e47b8-5f5c-4c22-8d5e-c085f120fef3'
            },
            body: JSON.stringify({
                model: 'deepseek-r1-250120',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个助手'
                    },
                    {
                        role: 'user',
                        content: '你好'
                    }
                ]
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`API请求失败：${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API测试成功！');
        console.log('API响应数据：', JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('API测试失败：', error.message);
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}

// 执行测试
testVolcAPI();