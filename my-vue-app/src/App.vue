<template>
  <div class="main-container">
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header">
          <span>🚀 全栈匿名留言板</span>
          <el-button type="success" size="small" @click="loadData" circle>
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </template>
      
      <div class="input-section">
        <el-input 
          v-model="newName" 
          placeholder="说点什么吧..." 
          @keyup.enter="updateName"
        />
        <el-button type="primary" @click="updateName" :loading="isSaving">
          发布
        </el-button>
      </div>

      <div class="list-section">
        <el-timeline v-if="messageList.length > 0">
          <el-timeline-item
            v-for="(item, index) in messageList"
            :key="index"
            :timestamp="item.date"
            placement="top"
          >
            <el-card shadow="hover" class="msg-item">
              <h4>{{ item.name }}</h4>
              <p>
                <el-tag size="small" type="info">教头等级: Lv {{ item.level }}</el-tag>
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        
        <el-empty v-else description="广场空空如也，快来抢沙发" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const newName = ref('')
const messageList = ref([])
const isSaving = ref(false)

// 加载数据
const loadData = async () => {
  try {
    // 使用相对路径，适配云端部署
    const res = await fetch('/api/messages')
    if (!res.ok) throw new Error('服务器响应异常')
    messageList.value = await res.json()
  } catch (error) {
    ElMessage.error('获取数据失败，请检查后端状态')
    console.error(error)
  }
}

// 提交数据
const updateName = async () => {
  if (!newName.value.trim()) return ElMessage.warning('内容不能为空哦')
  
  isSaving.value = true
  try {
    const res = await fetch('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.value })
    })
    
    if (res.ok) {
      ElMessage.success('发布成功！')
      newName.value = ''
      await loadData() // 刷新列表
    }
  } catch (error) {
    ElMessage.error('发送失败，请稍后再试')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.main-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}
.input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}
.msg-item h4 {
  margin: 0 0 10px 0;
  color: #303133;
}
.list-section {
  margin-top: 20px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>