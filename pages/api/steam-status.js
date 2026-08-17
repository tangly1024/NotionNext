import CONFIG from '@/themes/heo/config'

const DEFAULT_CACHE_SECONDS = 120

// 内存缓存，避免每次请求都调用 Steam API
let steamCache = { data: null, updatedAt: 0 }
// 游戏中文名缓存（Steam 商店接口，24 小时有效）
const gameNameCache = new Map()

// Steam personastate -> 中文状态
const PERSONA_STATES = [
  { code: 0, text: '离线' },
  { code: 1, text: '在线' },
  { code: 2, text: '忙碌' },
  { code: 3, text: '离开' },
  { code: 4, text: '小睡' },
  { code: 5, text: '想交易' },
  { code: 6, text: '想玩游戏' }
]

function getConfigValue(key) {
  return process.env[key] || CONFIG[key]
}

async function getChineseGameName(appid) {
  if (!appid) {
    return ''
  }
  const key = String(appid)
  // 优先使用配置中的中文名映射
  const configured = CONFIG.HEO_STEAM_GAME_NAMES?.[key]
  if (configured) {
    return configured
  }
  const cached = gameNameCache.get(key)
  if (cached && Date.now() - cached.ts < 24 * 60 * 60 * 1000) {
    return cached.name
  }
  try {
    const url =
      'https://store.steampowered.com/api/appdetails' +
      `?appids=${encodeURIComponent(key)}&l=schinese&cc=CN`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Steam store HTTP ${response.status}`)
    }
    const json = await response.json()
    const name = json?.[key]?.data?.name || ''
    gameNameCache.set(key, { name, ts: Date.now() })
    return name
  } catch {
    return ''
  }
}

/**
 * 获取最近玩过的游戏（用于离线时展示“xx前玩了[游戏]”）
 */
async function fetchLastPlayedGame(apiKey, steamId) {
  try {
    const url =
      'https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/' +
      `?key=${encodeURIComponent(apiKey)}&steamid=${encodeURIComponent(
        steamId
      )}&count=5&format=json`
    const response = await fetch(url)
    if (!response.ok) {
      return null
    }
    const json = await response.json()
    const games = json?.response?.games
    if (!Array.isArray(games) || games.length === 0) {
      return null
    }
    // 以最近两周的游玩时长倒序近似“最近在玩”
    games.sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))
    return { appid: games[0].appid, name: games[0].name || '' }
  } catch {
    return null
  }
}

/**
 * 统计当前正在玩同一款游戏的好友数量（用于“和 xx 个朋友遨游”文案）
 */
async function fetchNumFriendsInGame(apiKey, steamId, gameId) {
  if (!gameId) {
    return 0
  }
  try {
    const friendUrl =
      'https://api.steampowered.com/ISteamUser/GetFriendList/v0001/' +
      `?key=${encodeURIComponent(apiKey)}&steamid=${encodeURIComponent(
        steamId
      )}&relationship=friend&format=json`
    const friendResp = await fetch(friendUrl)
    if (!friendResp.ok) {
      return 0
    }
    const friendJson = await friendResp.json()
    const friends = friendJson?.friendslist?.friends || []
    if (!Array.isArray(friends) || friends.length === 0) {
      return 0
    }
    // GetPlayerSummaries 一次最多查询 100 个好友
    const ids = friends
      .slice(0, 100)
      .map(friend => friend.steamid)
      .join(',')
    const summaryUrl =
      'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/' +
      `?key=${encodeURIComponent(apiKey)}&steamids=${encodeURIComponent(
        ids
      )}&format=json`
    const summaryResp = await fetch(summaryUrl)
    if (!summaryResp.ok) {
      return 0
    }
    const summaryJson = await summaryResp.json()
    const players = summaryJson?.response?.players || []
    return players.filter(
      friend => String(friend.gameid) === String(gameId)
    ).length
  } catch {
    return 0
  }
}

async function buildPlayer(player, lastPlayed, numFriendsInGame) {
  const personaState =
    PERSONA_STATES.find(item => item.code === player.personastate) ||
    PERSONA_STATES[0]
  const inGame = Boolean(player.gameextrainfo)
  const gameNameCn = inGame ? await getChineseGameName(player.gameid) : ''
  const lastPlayedGameNameCn = lastPlayed
    ? await getChineseGameName(lastPlayed.appid)
    : ''
  return {
    personaname: player.personaname || '',
    avatarfull: player.avatarfull || '',
    profileurl: player.profileurl || '',
    personastate: player.personastate ?? 0,
    personastateText: personaState.text,
    gameextrainfo: player.gameextrainfo || '',
    gameid: player.gameid || '',
    gameNameCn,
    inGame,
    numFriendsInGame,
    lastlogoff: player.lastlogoff || 0,
    lastPlayedGameId: lastPlayed?.appid || '',
    lastPlayedGameName: lastPlayed?.name || '',
    lastPlayedGameNameCn
  }
}

/**
 * 代理 Steam Web API：GetPlayerSummaries
 * 配置 HEO_STEAM_API_KEY / HEO_STEAM_ID 后即可使用，密钥不会暴露给前端
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // API Key 只从环境变量读取，避免密钥进入前端或代码仓库
  const apiKey = process.env.HEO_STEAM_API_KEY || ''
  const steamId = process.env.HEO_STEAM_ID || CONFIG.HEO_STEAM_ID || ''
  if (!apiKey || !steamId) {
    return res.status(200).json({ enabled: false })
  }

  const cacheSeconds = Number(
    getConfigValue('HEO_STEAM_CACHE_SECONDS') || DEFAULT_CACHE_SECONDS
  )
  const ttl =
    Number.isFinite(cacheSeconds) && cacheSeconds > 0
      ? cacheSeconds * 1000
      : DEFAULT_CACHE_SECONDS * 1000

  // 命中缓存直接返回
  if (steamCache.data && Date.now() - steamCache.updatedAt < ttl) {
    return res.status(200).json(steamCache.data)
  }

  try {
    const summaryUrl =
      'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/' +
      `?key=${encodeURIComponent(apiKey)}&steamids=${encodeURIComponent(
        steamId
      )}&format=json`
    const [response, lastPlayed] = await Promise.all([
      fetch(summaryUrl),
      fetchLastPlayedGame(apiKey, steamId)
    ])
    if (!response.ok) {
      throw new Error(`Steam API HTTP ${response.status}`)
    }
    const json = await response.json()
    const player = json?.response?.players?.[0] || null
    const numFriendsInGame = player?.gameid
      ? await fetchNumFriendsInGame(apiKey, steamId, player.gameid)
      : 0
    const data = {
      enabled: true,
      player: player
        ? await buildPlayer(player, lastPlayed, numFriendsInGame)
        : null
    }

    steamCache = { data, updatedAt: Date.now() }
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${Math.round(ttl / 1000)}, stale-while-revalidate=60`
    )
    return res.status(200).json(data)
  } catch (error) {
    // 请求失败时优先使用缓存兜底，避免瞬时故障影响页面
    if (steamCache.data) {
      return res.status(200).json(steamCache.data)
    }
    return res
      .status(502)
      .json({ enabled: true, player: null, error: 'Steam API 请求失败' })
  }
}
