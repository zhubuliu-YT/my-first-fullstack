const express = require('express');
const cors = require('cors');
const Datastore = require('nedb-promises');
const path = require('path');

const app = express();
// 适配云端端口，Zeabur 会自动分配端口到 process.env.PORT
const port = process.env.PORT || 3000;

// 初始化数据库
const dbPath = path.join(__dirname, 'database.db');
const db = Datastore.create({ filename: dbPath, autoload: true });

// 中间件配置
app.use(cors());
app.use(express.json());
// 如果你把 Vue 打包后的 dist 放在这里，这行就起作用
app.use(express.static('public')); 

// 路由 1：获取所有留言（按时间倒序）
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
            level: Math.floor(Math.random() * 10) + 1 // 随机 1-10 级
        };

        const newDoc = await db.insert(newMessage);
        res.json({ status: "发布成功", data: newDoc });
    } catch (err) {
        res.status(500).json({ error: "保存失败" });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 全栈后台已就绪: http://localhost:${port}`);
});