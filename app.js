const API_KEY = 'sk-0Tz9Tz9Tz9Tz9Tz9Tz9T3BlbkFJTz9Tz9Tz9Tz9Tz9T';

const questionInput = document.getElementById('question');
const generateButton = document.getElementById('generate');
const loadingIndicator = document.getElementById('loading');
const pyramidContent = document.getElementById('pyramid');
const firstPrincipleContent = document.getElementById('first-principle');
const fiveWContent = document.getElementById('five-w');

let timerInterval;
let startTime;

generateButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) {
        alert('请输入问题');
        return;
    }

    // 显示加载状态
    generateButton.disabled = true;
    loadingIndicator.style.display = 'block';
    pyramidContent.textContent = '';
    firstPrincipleContent.textContent = '';
    fiveWContent.textContent = '';

    // 启动计时器
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        loadingIndicator.dataset.time = `${elapsedTime}秒`;
    }, 1000);

    try {
        // 金字塔分析
        const pyramidPrompt = `请使用金字塔思维分析以下问题，给出分析结果：${question}`;
        const pyramidAnalysis = await getAnalysis(pyramidPrompt);
        pyramidContent.textContent = pyramidAnalysis;
        pyramidContent.onclick = () => {
            const url = `detail.html?title=${encodeURIComponent('金字塔分析')}&content=${encodeURIComponent(pyramidAnalysis)}`;
            window.open(url, '_blank');
        };
        pyramidContent.style.cursor = 'pointer';

        // 第一性原理分析
        const firstPrinciplePrompt = `请使用第一性原理分析以下问题，给出分析结果：${question}`;
        const firstPrincipleAnalysis = await getAnalysis(firstPrinciplePrompt);
        firstPrincipleContent.textContent = firstPrincipleAnalysis;
        firstPrincipleContent.onclick = () => {
            const url = `detail.html?title=${encodeURIComponent('第一性原理分析')}&content=${encodeURIComponent(firstPrincipleAnalysis)}`;
            window.open(url, '_blank');
        };
        firstPrincipleContent.style.cursor = 'pointer';

        // 5W分析
        const fiveWPrompt = `请使用5W分析法（What是什么、Why为什么、Who谁、When何时、Where何地）分析以下问题，给出分析结果：${question}`;
        const fiveWAnalysis = await getAnalysis(fiveWPrompt);
        fiveWContent.textContent = fiveWAnalysis;
        fiveWContent.onclick = () => {
            const url = `detail.html?title=${encodeURIComponent('5W分析')}&content=${encodeURIComponent(fiveWAnalysis)}`;
            window.open(url, '_blank');
        };
        fiveWContent.style.cursor = 'pointer';
    } catch (error) {
        console.error('API请求错误:', error);
        alert('分析过程中出现错误：' + (error.message || '无法连接到服务器，请检查网络连接或稍后重试'));
    } finally {
        // 清除计时器
        clearInterval(timerInterval);
        // 恢复按钮状态和隐藏加载指示器
        generateButton.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});

async function getAnalysis(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120秒超时

    try {
        const response = await fetch('/api/analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的问题分析助手，擅长使用各种分析方法帮助用户深入理解和解决问题。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`API请求失败：${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请稍后重试');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}