<template>
  <div class="landing-page">
    <div class="hero-section">
      <h1 class="title">Coco战术板</h1>
      <p class="subtitle">简单易用的足球战术分析工具</p>
      <router-link to="/board" class="start-button">开始使用</router-link>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">⚽</div>
        <h3>实时绘制</h3>
        <p>直观的拖拽操作，轻松制作战术图</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎥</div>
        <h3>动画演示</h3>
        <p>支持动画效果，展示战术变化过程</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💾</div>
        <h3>导出分享</h3>
        <p>一键导出战术图，方便分享讨论</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  height: 100%;
  background: linear-gradient(135deg, #95e3e1 0%, #3ca49f 100%);
  color: white;
  padding: 2rem;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.hero-section {
  text-align: center;
  padding: 4rem 1rem;
}

.title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.start-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  background-color: white;
  color: #3ca49f;
  border-radius: 2rem;
  text-decoration: none;
  transition: transform 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.start-button:hover {
  transform: translateY(-2px);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.5;
}
</style>
