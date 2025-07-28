<template>
  <div class="landing-page">
    <!-- Navigation Header -->
    <Header />
    <!-- Showcase Section - Moved to top -->
    <div id="showcase" class="showcase-section">
      <div class="showcase-container">
        <h1 class="title">Coco足球战术板</h1>
        <p class="showcase-subtitle">专业的足球战术分析工具，让您的战术思考更加清晰</p>
        <router-link :to="{ name: 'board' }" target="_blank" class="start-button">立即体验</router-link>
        <div class="showcase-image">
          <img src="/case-2.png" alt="Coco足球战术板界面展示" />
        </div>
      </div>
    </div>
    <div id="features" class="features-section">
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

    <!-- Showcase Section -->

    <div class="faq-section" id="faq">
      <h2 class="faq-title">常见问题</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3>如何开始使用？</h3>
          <p>点击"立即体验"按钮，进入战术板页面后，您就可以通过拖拽来创建和编辑战术图了。</p>
        </div>
        <div class="faq-item">
          <h3>是否需要注册账号？</h3>
          <p>目前无需注册即可使用基本功能。未来我们会推出账号系统，提供更多高级功能。</p>
        </div>
        <div class="faq-item">
          <h3>支持哪些设备使用？</h3>
          <p>支持电脑、平板和手机等所有主流设备，界面会自动适应不同屏幕尺寸。</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
</script>

<style scoped>
.landing-page {
  height: 100%;
  background: linear-gradient(135deg, #95e3e1 0%, #3ca49f 100%);
  color: white;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0;
  min-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.hero-section,
.features-section,
.faq-section {
  padding-left: 2rem;
  padding-right: 2rem;
}

.hero-section,
.features-section,
.faq-section {
  flex: 1;
}

/* Updated hero section to account for fixed header */
.hero-section {
  text-align: center;
  padding: 8rem 1rem 6rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.start-button {
  display: inline-block;
  padding: 1.25rem 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  color: var(--primary-700);
  border-radius: 3rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  color: #3ca49f;
  margin-bottom: 6rem;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.25),
    0 8px 25px rgba(0, 0, 0, 0.2);
  background: white;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 6rem auto;
  padding: 0 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.5;
}

.faq-section {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.faq-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.faq-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.faq-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.faq-item p {
  opacity: 0.9;
  line-height: 1.6;
}

/* Showcase Section */
.showcase-section {
  margin: 8rem 0;
  backdrop-filter: blur(10px);
}

.showcase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.showcase-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: white;
}

.showcase-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.showcase-image {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.showcase-image img {
  width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 1rem 4rem;
  }

  .showcase-section {
    margin: 6rem 0;
    padding: 4rem 0;
  }

  .showcase-title {
    font-size: 2rem;
  }

  .showcase-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .showcase-image {
    padding: 1rem;
  }

  .features-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .faq-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .features-section {
    margin: 4rem auto;
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .faq-section {
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .start-button {
    font-size: 1rem;
    padding: 0.8rem 2rem;
  }

  .hero-section {
    padding: 5rem 1rem 3rem;
  }

  .showcase-section {
    margin: 4rem 0;
    padding: 3rem 0;
  }

  .showcase-container {
    padding: 0 1rem;
  }

  .showcase-image {
    padding: 0.8rem;
  }
}
</style>
