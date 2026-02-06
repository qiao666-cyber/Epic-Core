const API_BASE_URL = 'http://127.0.0.1:1009';

const routes = [
    {
        name: 'Epic 免费游戏',
        dsc: '获取 Epic 商店每周免费游戏信息',
        method: 'GET',
        path: '/api/qiao/epic-free',
        priority: 210
    }
];

async function fetchRoutes() {
    const statusEl = document.getElementById('apiStatus');
    const timeEl = document.getElementById('responseTime');
    const statusDot = document.getElementById('statusDot');
    const routesList = document.getElementById('routesList');

    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}/api/qiao/epic-free`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        timeEl.textContent = `${responseTime}ms`;

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }

        statusEl.textContent = '200 OK';
        statusEl.className = 'status-text success';
        statusDot.className = 'status-dot success';

        const result = await response.json();
        
        document.getElementById('routeCount').textContent = routes.length;

        renderRoutes(routes);
        
        // 同时渲染游戏数据
        renderGames(result.data || []);
    } catch (error) {
        statusEl.textContent = 'Error';
        statusEl.className = 'status-text error';
        statusDot.className = 'status-dot error';
        routesList.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>获取失败: ${error.message}</p>
                <button onclick="fetchRoutes()" class="btn btn-secondary">重试</button>
            </div>
        `;
    }
}

function renderRoutes(routes) {
    const routesList = document.getElementById('routesList');

    if (!routes || routes.length === 0) {
        routesList.innerHTML = `
            <div class="loading">
                <p>暂无可用路由</p>
            </div>
        `;
        return;
    }

    routesList.innerHTML = routes.map(route => {
        const methodClass = route.method.toLowerCase();
        
        return `
            <div class="route-card">
                <div class="route-header">
                    <span class="route-method ${methodClass}">${route.method}</span>
                    <span class="route-priority">优先级: ${route.priority}</span>
                </div>
                <div class="route-body">
                    <h3 class="route-name">${route.name}</h3>
                    <p class="route-description">${route.dsc}</p>
                    <div class="route-path">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                        </svg>
                        ${API_BASE_URL}${route.path}
                    </div>
                    <div class="route-actions">
                        <button onclick="copyRoute('${route.path}')" class="btn btn-secondary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                            </svg>
                            复制
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function fetchGames() {
    const statusEl = document.getElementById('gamesStatus');
    const statusDot = document.getElementById('gamesStatusDot');
    const gamesList = document.getElementById('gamesList');

    try {
        gamesList.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>
        `;

        const response = await fetch(`${API_BASE_URL}/api/qiao/epic-free`);
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }

        statusEl.textContent = '200 OK';
        statusEl.className = 'status-text success';
        statusDot.className = 'status-dot success';

        const result = await response.json();
        
        renderGames(result.data || []);
    } catch (error) {
        statusEl.textContent = 'Error';
        statusEl.className = 'status-text error';
        statusDot.className = 'status-dot error';
        gamesList.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>获取失败: ${error.message}</p>
                <button onclick="fetchGames()" class="btn btn-secondary">重试</button>
            </div>
        `;
    }
}

function renderGames(games) {
    const gamesList = document.getElementById('gamesList');

    if (!games || games.length === 0) {
        gamesList.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                    <path d="M6 12h4m-2-2v4m14-2h-8"/>
                </svg>
                <p>暂无免费游戏信息</p>
            </div>
        `;
        return;
    }

    gamesList.innerHTML = games.map(game => {
        const isFreeNow = game.is_free_now;
        const statusClass = isFreeNow ? 'free-now' : 'coming-soon';
        const statusText = isFreeNow ? '🎁 现在免费' : '📅 即将免费';

        const startDate = new Date(game.free_start);
        const endDate = new Date(game.free_end);
        const now = new Date();

        let timeRemaining = '';
        if (isFreeNow) {
            const diff = endDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (days > 0) {
                timeRemaining = `剩余 ${days}天 ${hours}小时`;
            } else if (hours > 0) {
                timeRemaining = `剩余 ${hours}小时`;
            } else {
                timeRemaining = '即将结束';
            }
        } else {
            const diff = startDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            timeRemaining = `${days}天后开始`;
        }

        return `
            <div class="game-card ${statusClass}">
                <div class="game-cover">
                    <img src="${game.cover}" alt="${game.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
                    <div class="game-status">${statusText}</div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span class="game-price">原价: ${game.original_price_desc}</span>
                        <span class="game-seller">${game.seller}</span>
                    </div>
                    <div class="game-time">
                        <div class="time-info">
                            <span class="time-label">开始:</span>
                            <span class="time-value">${game.free_start}</span>
                        </div>
                        <div class="time-info">
                            <span class="time-label">结束:</span>
                            <span class="time-value">${game.free_end}</span>
                        </div>
                        <div class="time-remaining">${timeRemaining}</div>
                    </div>
                    <a href="${game.link}" target="_blank" class="btn btn-link">
                        前往 Epic 商店领取
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function copyRoute(path) {
    const fullUrl = `${API_BASE_URL}${path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        alert('路由地址已复制到剪贴板');
    }).catch(() => {
        alert('复制失败');
    });
}

document.getElementById('refreshBtn').addEventListener('click', () => {
    fetchRoutes();
    fetchGames();
});

document.addEventListener('DOMContentLoaded', () => {
    fetchRoutes();
    fetchGames();
    
    // 每5分钟自动刷新一次
    setInterval(() => {
        fetchGames();
    }, 5 * 60 * 1000);
});
