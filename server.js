const express = require('express');
const cors = require('cors');
const Datastore = require('nedb-promises');
const path = require('path');

const app = express();
// 适配云端端口：Zeabur 会自动通过 process.env.PORT 分配端口
const port = process.env.PORT || 3000;

// 初始化数据库：使用绝对路径确保云端能找到文件
const dbPath = path.join(__dirname, 'database.db');
const db = Datastore.create({ filename: dbPath, autoload: true });

// 中间件配置
app.use(cors());
app.use(express.json());
// 静态文件服务：如果你的 Vue 打包放在 public 文件夹下，这行很重要
app.use(express.static('public')); 

// 路由 1：获取所有留言（按时间倒序排列）
app.get('/api/messages', async (req, res) => {
    try {
        const allMessages = await db.find({}).sort({ date: -1 });
        res.json(allMessages);
    } catch (err) {
        res.status(500).json({ error: "无法读取数据库" });
    }
});

// 路由 2：发布新留言
app.post('/api/update', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "内容不能为空" });

        const newMessage = {
            name: name,
            date: new Date().toLocaleString(),
            level: Math.floor(Math.random() * 10) + 1 // 随机等级 1-10
        };

        const newDoc = await db.insert(newMessage);
        res.json({ status: "发布成功", data: newDoc });
    } catch (err) {
        res.status(500).json({ error: "保存失败" });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 后端已就绪，端口: ${port}`);
});