<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledge } from '@/api'

const knowledgeList = ref([])

const fetchKnowledge = async () => {
  try {
    const res = await getKnowledge()
    knowledgeList.value = res
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchKnowledge()
})
</script>

<template>
  <view class="page-container">
    <u-search placeholder="搜索月子百科知识" shape="round" :show-action="false"></u-search>
    
    <view class="article-list">
      <view v-for="item in knowledgeList" :key="item.id" class="article-card">
        <view class="article-info">
          <text class="article-category">{{ item.category }}</text>
          <text class="article-title">{{ item.title }}</text>
          <text class="article-excerpt">{{ item.content?.substring(0, 40) }}...</text>
          <view class="article-footer">
            <u-icon name="eye" size="14" color="#B5A89F"></u-icon>
            <text class="views">阅读量 120+</text>
          </view>
        </view>
        <u-image src="/static/placeholder-doc.png" width="90px" height="70px" radius="8px"></u-image>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 30rpx;
  background-color: var(--color-bg);
  min-height: 100vh;
}
.article-list {
  margin-top: 40rpx;
}
.article-card {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: var(--shadow-card);
}
.article-info {
  flex: 1;
  padding-right: 20rpx;
}
.article-category {
  font-size: 20rpx;
  color: var(--color-primary);
  background: #FFF5F2;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  display: inline-block;
  margin-bottom: 12rpx;
}
.article-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--color-text-primary);
  display: block;
  margin-bottom: 12rpx;
}
.article-excerpt {
  font-size: 24rpx;
  color: var(--color-text-hint);
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: block;
}
.article-footer {
  display: flex;
  align-items: center;
}
.views {
  font-size: 22rpx;
  color: var(--color-text-hint);
  margin-left: 8rpx;
}
</style>
