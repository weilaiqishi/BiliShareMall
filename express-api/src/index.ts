import express from 'express'
import cors from 'cors'
import { loginRouter } from './routes/login'
import { healthRouter } from './routes/health'
import { searchRouter } from './routes/search'
import { sqliteRouter } from './routes/sqlite'
import { initializeDatabase } from './services/sqlite'

const app = express()
const port = 3000

// Initialize SQLite Database
initializeDatabase()

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

// 搜索相关路由
app.use('/api', searchRouter)

// SQLite 相关路由
app.use('/api', sqliteRouter)

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})