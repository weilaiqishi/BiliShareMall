import axios from 'axios'

const baseUrl = 'https://passport.bilibili.com'

export async function getLoginKeyAndUrl(userAgent: string) {
  const response = await axios.get(`${baseUrl}/x/passport-login/web/qrcode/generate`, {
    headers: {
      'User-Agent': userAgent
    }
  })
  const { code, data } = response.data

  if (code === 0 && data) {
    return {
      key: data.qrcode_key,
      url: data.url
    }
  }

  throw new Error('获取二维码失败')
}

export async function verifyLogin(key: string, userAgent: string) {
  const response = await axios.get(`${baseUrl}/x/passport-login/web/qrcode/poll`, {
    params: { qrcode_key: key },
    headers: {
      'User-Agent': userAgent
    }
  })
  const { code, data } = response.data
  console.log('verifyLogin -> response.data -> ', response.data)

  if (code === 0 && data && data.url) {
    // 从data.url中解析SESSDATA和bili_jct
    const urlParams = new URLSearchParams(data.url.split('?')[1])
    const SESSDATA = urlParams.get('SESSDATA')
    const bili_jct = urlParams.get('bili_jct')

    // 模拟Go代码中的buvid3获取逻辑，这里简化为固定值或从其他地方获取
    // 实际项目中buvid3可能需要通过B站API获取，或者由前端生成并传递
    const buvid3 = 'YOUR_BUVID3_HERE' // 替换为实际获取buvid3的逻辑

    let cookieString = `buvid3=${buvid3};`
    if (SESSDATA) {
      cookieString += `SESSDATA=${SESSDATA};`
    }
    if (bili_jct) {
      cookieString += `bili_jct=${bili_jct};`
    }

    return {
      status: data.code,
      message: data.message,
      cookie: cookieString
    }
  }

  if (code === 0 && data && data.code === 86038) {
    // 二维码失效
    throw new Error('二维码已失效')
  }

  if (code === 0 && data && data.code === 86090) {
    // 二维码未确认
    throw new Error('二维码未确认')
  }

  if (code === 0 && data && data.code === 86101) {
    // 未扫码
    throw new Error('请扫码')
  }

  throw new Error('验证登录失败')
}