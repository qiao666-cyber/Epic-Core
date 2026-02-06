const API_URL = 'http://127.0.0.1:1009/api/qiao/epic-free';
let callCount = 84985;

async function fetchEpicGames() {
    const startTime = Date.now();
    const statusEl = document.getElementById('apiStatus');
    const timeEl = document.getElementById('responseTime');
    const statusDot = document.getElementById('statusDot');
    const gamesList = document.getElementById('gamesList');

    try {
        const response = await fetch(API_URL);
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
        callCount++;
        document.getElementById('callCount').textContent = callCount.toLocaleString();

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
                <button onclick="fetchEpicGames()" class="btn btn-secondary">重试</button>
            </div>
        `;
    }
}

function renderGames(games) {
    const gamesList = document.getElementById('gamesList');

    if (!games || games.length === 0) {
        gamesList.innerHTML = `
            <div class="no-games">
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

        const startDate = new Date(game.free_start_at);
        const endDate = new Date(game.free_end_at);
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

document.getElementById('refreshBtn').addEventListener('click', () => {
    fetchEpicGames();
});

document.addEventListener('DOMContentLoaded', () => {
    fetchEpicGames();

    setInterval(() => {
        fetchEpicGames();
    }, 5 * 60 * 1000);
});
