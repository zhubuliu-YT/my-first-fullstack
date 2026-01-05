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

// 1. 获取所有留言 (Read All)
app.get('/api/messages', async (req, res) => {
    // 按照时间倒序排列，最新的留言在最上面
    const allMessages = await db.find({}).sort({ date: -1 }); 
    res.json(allMessages);
});

// 2. 插入新留言 (Create)
app.post('/api/update', async (req, res) => {
    const receivedName = req.body.name;
    const newMessage = { 
        name: receivedName, 
        date: new Date().toLocaleString(), // 记录留言时间
        level: Math.floor(Math.random() * 10) // 随机给个等级玩玩
    };
    
    // 注意：删掉之前的 db.remove({})，我们现在要保留历史！
    const newDoc = await db.insert(newMessage); 
    res.json({ status: "留言成功！", data: newDoc });
});

// 必须这样写，云端才能访问
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 服务器上线，监听端口: ${port}`);
});