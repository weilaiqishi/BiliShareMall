import express from 'express'
import cors from 'cors'
import { loginRouter } from './routes/login'
import { healthRouter } from './routes/health'

const app = express()
const port = 3000

// 启用 CORS
app.use(cors({
  origin: '*', // Vite 开发服务器默认端口
  credentials: true
}))

app.use(express.json())

// 健康检查路由
app.use('/api', healthRouter)

// 登录相关路由
app.use('/api', loginRouter)

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})