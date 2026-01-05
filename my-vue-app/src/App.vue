<template>
  <div style="max-width: 600px; margin: 50px auto;">
    <el-card shadow="hover">
      <template #header><span>💬 全栈匿名留言板</span></template>
      
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <el-input v-model="newName" placeholder="说点什么吧..." />
        <el-button type="primary" @click="updateName">发布留言</el-button>
      </div>

      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in messageList"
          :key="index"
          :timestamp="item.date"
          placement="top"
        >
          <el-card>
            <h4>{{ item.name }}</h4>
            <p>开发者等级：<el-tag size="small">Lv {{ item.level }}</el-tag></p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      
      <el-empty v-if="messageList.length === 0" description="暂无留言" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const newName = ref('')
const messageList = ref([]) // 存储留言列表的数组

const loadData = async () => {
  const res = await fetch('/api/messages') // 调用获取全部数据的接口
  messageList.value = await res.json()
}

const updateName = async () => {
  if (!newName.value) return ElMessage.warning('内容不能为空')
  
  await fetch('/api/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName.value })
  })
  
  newName.value = '' // 清空输入框
  loadData() // 重新加载列表
}

onMounted(loadData)
</script>