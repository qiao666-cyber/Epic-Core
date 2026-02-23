import AIStream from '#infrastructure/aistream/aistream.js';
import BotUtil from '#utils/botutil.js';

const EPIC_API_URL = 'https://uapis.cn/api/v1/game/epic-free';

async function fetchEpicFreeGames() {
  const response = await fetch(EPIC_API_URL);
  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }
  return response.json();
}

function formatGameInfo(game) {
  const now = Date.now();
  const startDate = game.free_start_at;
  const endDate = game.free_end_at;
  
  let status = '未知';
  let remainingTime = null;
  
  if (startDate && endDate) {
    if (now < startDate) {
      status = '即将免费';
      const diff = startDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      remainingTime = `${days}天${hours}小时后开始`;
    } else if (now >= startDate && now <= endDate) {
      status = '限时免费';
      const diff = endDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      remainingTime = `剩余${days}天${hours}小时`;
    } else {
      status = '已结束';
    }
  }
  
  return {
    id: game.id,
    title: game.title,
    description: game.description,
    cover: game.cover,
    originalPrice: game.original_price_desc,
    seller: game.seller,
    link: game.link,
    status,
    remainingTime,
    freeStart: game.free_start,
    freeEnd: game.free_end,
    isFreeNow: game.is_free_now
  };
}

export default class EpicStream extends AIStream {
  constructor() {
    super({
      name: 'epic',
      description: 'Epic Games Store 免费游戏查询',
      version: '1.0.0',
      author: 'XRK',
      priority: 210,
      config: {
        enabled: true,
        temperature: 0.3,
        maxTokens: 2000
      }
    });
    
    this.cache = null;
    this.cacheTime = 0;
    this.cacheTTL = 5 * 60 * 1000;
  }

  async init() {
    await super.init();
    this.registerAllFunctions();
  }

  registerAllFunctions() {
    this.registerMCPTool('get_free_games', {
      description: '获取 Epic Games Store 当前免费游戏列表',
      inputSchema: {
        type: 'object',
        properties: {
          includeUpcoming: {
            type: 'boolean',
            description: '是否包含即将免费的游戏',
            default: false
          }
        },
        required: []
      },
      handler: async (args = {}) => {
        const { includeUpcoming = false } = args;
        
        try {
          const data = await this.getGamesWithCache();
          const games = data.data || [];
          const now = Date.now();
          
          let filteredGames = games;
          if (!includeUpcoming) {
            filteredGames = games.filter(game => game.is_free_now === true);
          }
          
          return {
            success: true,
            data: {
              count: filteredGames.length,
              games: filteredGames.map(formatGameInfo)
            }
          };
        } catch (error) {
          BotUtil.makeLog('error', `[epic] 获取免费游戏失败: ${error.message}`, 'EpicStream');
          return { success: false, error: error.message };
        }
      },
      enabled: true
    });

    this.registerMCPTool('get_upcoming_games', {
      description: '获取即将免费的游戏列表',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: '返回数量限制',
            default: 5
          }
        },
        required: []
      },
      handler: async (args = {}) => {
        const { limit = 5 } = args;
        
        try {
          const data = await this.getGamesWithCache();
          const games = data.data || [];
          const now = Date.now();
          
          const upcomingGames = games
            .filter(game => game.free_start_at && now < game.free_start_at)
            .sort((a, b) => a.free_start_at - b.free_start_at)
            .slice(0, limit);
          
          return {
            success: true,
            data: {
              count: upcomingGames.length,
              games: upcomingGames.map(formatGameInfo)
            }
          };
        } catch (error) {
          BotUtil.makeLog('error', `[epic] 获取即将免费游戏失败: ${error.message}`, 'EpicStream');
          return { success: false, error: error.message };
        }
      },
      enabled: true
    });

    this.registerMCPTool('search_game', {
      description: '搜索游戏',
      inputSchema: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: '搜索关键词' }
        },
        required: ['keyword']
      },
      handler: async (args = {}) => {
        const { keyword } = args;
        
        if (!keyword?.trim()) {
          return { success: false, error: '关键词不能为空' };
        }
        
        try {
          const data = await this.getGamesWithCache();
          const games = data.data || [];
          const searchKeyword = keyword.toLowerCase().trim();
          
          const matchedGames = games.filter(game => 
            game.title?.toLowerCase().includes(searchKeyword) ||
            game.description?.toLowerCase().includes(searchKeyword)
          );
          
          return {
            success: true,
            data: {
              keyword,
              count: matchedGames.length,
              games: matchedGames.map(formatGameInfo)
            }
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      enabled: true
    });
  }

  async getGamesWithCache() {
    const now = Date.now();
    
    if (this.cache && (now - this.cacheTime) < this.cacheTTL) {
      return this.cache;
    }
    
    const data = await fetchEpicFreeGames();
    this.cache = data;
    this.cacheTime = now;
    
    return data;
  }

  buildSystemPrompt() {
    return `【Epic Games Store 免费游戏查询】
工具列表：
- epic.get_free_games: 获取当前免费游戏
- epic.get_upcoming_games: 获取即将免费游戏
- epic.search_game: 搜索游戏`;
  }
}
