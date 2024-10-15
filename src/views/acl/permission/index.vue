<template>
  <el-container class="chat-container">
    <!-- Sidebar -->
    <el-aside width="250px" class="sidebar">
      <h1 class="logo">deepseek</h1>
      <el-menu default-active="1" class="sidebar-menu">
        <el-menu-item index="1">
          <el-button type="primary" class="full-width"> 通用对话 V2.5 </el-button>
        </el-menu-item>
        <el-menu-item index="1">
          <el-button type="primary" class="full-width"> 代码助手 V2.5 </el-button>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main chat area -->
    <el-container>
      <el-header class="chat-header">
        <h2>通用对话 V2.5</h2>
        <el-button type="text"> 点击查看历史对话 </el-button>
      </el-header>
      <el-main class="chat-main">
        <div class="chat-messages">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message', message.isUser ? 'user-message' : 'ai-message']"
          >
            <div class="message-content">
              <div v-if="!message.isUser" class="ai-icon"></div>
              <div class="message-text">
                <p v-for="(line, index) in message.text.split('\n')" :key="index">{{ line }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <el-footer class="chat-footer">
        <el-input
          v-model="input"
          placeholder="请输入问题..."
          :suffix-icon="Send"
          @keyup.enter="handleSend"
        >
          <template #append>
            <el-button @click="handleSend">发送</el-button>
          </template>
        </el-input>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  { id: 1, text: '你好！很高兴见到你。有什么我可以帮忙的吗？', isUser: false },
  { id: 2, text: '今天的深圳天气', isUser: true },
  {
    id: 3,
    text: '深圳今天的天气情况如下:\n\n• 温度：预计最高气温约为28°C，最低气温约为22°C。\n\n• 天气状况：多云，可能会有局部阵雨。\n\n• 风力：风速约为3-4级，风向为东南风。\n\n• 空气质量：空气质量指数（AQI）为良好至轻度污染之间，建议敏感人群注意防护。\n\n建议外出时携带雨具，并根据天气变化适当增减衣物。希望这些信息对你有帮助！',
    isUser: false
  }
])

const input = ref('')

const handleSend = () => {
  if (input.value.trim()) {
    messages.value.push({ id: messages.value.length + 1, text: input.value, isUser: true })
    input.value = ''
    // Here you would typically call an API to get the AI response
    setTimeout(() => {
      messages.value.push({
        id: messages.value.length + 1,
        text: '这是一个AI回复的示例。',
        isUser: false
      })
    }, 1000)
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
}

.sidebar-menu {
  border-right: none;
}

.full-width {
  width: 100%;
}

.chat-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.chat-main {
  padding: 20px;
  overflow-y: auto;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  margin-bottom: 20px;
}

.user-message {
  align-self: flex-end;
}

.ai-message {
  align-self: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
}

.ai-icon {
  background-color: #409eff;
  color: white;
  padding: 8px;
  border-radius: 4px;
  margin-right: 10px;
}

.message-text {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-text {
  background-color: #e6f1ff;
}

.chat-footer {
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 10px 20px;
}
</style>
