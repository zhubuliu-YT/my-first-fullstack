const express = require('express');
const cors = require('cors');
const Datastore = require('nedb-promises'); // 1. 换成这个新包
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'database.db');

// 2. 初始化数据库（新方式）
const db = Datastore.create({ filename: dbPath, autoload: true });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 3. 异步测试写入
async function initDB() {
    try {
        await db.insert({ name: "系统已自动修复", level: 1 });
        console.log("✅ 现代数据库已就绪，数据已存入！");
    } catch (err) {
        console.error("❌ 还是不行？报错：", err);
    }
}
initDB();

// 路由 1：获取数据 (Read)
app.get('/api/user', async (req, res) => {
    const docs = await db.find({});
    res.json(docs[0] || { name: "全栈工程师 [求互骂擦]", level: 0 });
});

// 路由 2：保存数据 (Update)
app.post('/api/update', async (req, res) => {
    const receivedName = req.body.name;
    await db.remove({}, { multi: true }); // 清空旧的
    const newDoc = await db.insert({ name: receivedName, level: 100 }); // 存入新的
    res.json({ status: "写入成功！", data: newDoc });
});

// 必须这样写，云端才能访问
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 服务器上线，监听端口: ${port}`);
});