/**
 * 表结构更新脚本
 * 用于检查并更新数据库表结构，添加缺失的字段
 */
import { initializeDatabase, closeDatabase } from '../services/sqlite'

// 初始化数据库并更新表结构
initializeDatabase()

console.log('表结构更新完成，现在可以正常使用更新商品详情功能了')

// 关闭数据库连接
closeDatabase()