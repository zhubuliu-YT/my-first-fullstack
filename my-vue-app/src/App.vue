<template>
  <div style="max-width: 600px; margin: 50px auto;">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>🚀 全栈开发者控制台</span>
        </div>
      </template>
      
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <el-input v-model="newName" placeholder="请输入您的尊姓大名" clearable />
        <el-button type="primary" @click="updateName" :loading="isSaving">
          保存修改
        </el-button>
      </div>

      <el-descriptions title="当前系统状态" :column="1" border>
        <el-descriptions-item label="👤 当前用户">{{ userData.name }}</el-descriptions-item>
        <el-descriptions-item label="⭐ 开发者等级">
          <el-tag size="small">Level {{ userData.level }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="📡 后端状态">
          <el-badge is-dot type="success"> 运行中 (Port 3000) </el-badge>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
// ... 这里保持之前的逻辑，只需增加一个 isSaving 状态 ...
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus' // 引入漂亮的消息提示

const userData = ref({ name: '', level: 0 })
const newName = ref('')
const isSaving = ref(false)

const loadData = async () => {
  const res = await fetch('http://localhost:3000/api/user')
  userData.value = await res.json()
}

const updateName = async () => {
  if (!newName.value) return ElMessage.warning('名字不能为空哦！')
  
  isSaving.value = true
  try {
    await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.value })
    })
    ElMessage.success('保存成功！数据已持久化。')
    await loadData()
    newName.value = ''
  } finally {
    isSaving.value = false
  }
}

onMounted(loadData)
</script>