import { HttpResponse } from '#utils/http-utils.js';

const EPIC_API_URL = 'https://uapis.cn/api/v1/game/epic-free';

async function fetchEpicFreeGames() {
  const response = await fetch(EPIC_API_URL);
  const data = await response.json();
  return data;
}

export default {
  name: 'epic-free',
  dsc: 'Epic免费游戏API',
  priority: 210,
  routes: [
    {
      method: 'GET',
      path: '/api/qiao/epic-free',
      handler: HttpResponse.asyncHandler(async (req, res, Bot) => {
        try {
          const result = await fetchEpicFreeGames();
          HttpResponse.success(res, result);
        } catch (error) {
          HttpResponse.error(res, error, 500, 'epic.free');
        }
      }, 'epic.free')
    }
  ]
};
