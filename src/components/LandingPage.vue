<template>
  <div class="landing-page">
    <div class="hero-section">
      <h1 class="title">Coco战术板</h1>
      <p class="subtitle">简单易用的足球战术分析工具</p>
      <router-link :to="{ name: 'board' }" target="_blank" class="start-button">开始使用</router-link>
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

    <div class="faq-section" id="faq">
      <h2 class="faq-title">常见问题</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3>如何开始使用？</h3>
          <p>点击"开始使用"按钮，进入战术板页面后，您就可以通过拖拽来创建和编辑战术图了。</p>
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

    <footer class="footer">
      <div class="sitemap-section">
        <div class="sitemap-grid">
          <div class="sitemap-column">
            <h3>文档</h3>
            <ul>
              <li>快速开始</li>
              <li>使用教程</li>
              <li><a href="#faq" @click.prevent="scrollToFaq">常见问题</a></li>
            </ul>
          </div>
          <div class="sitemap-column">
            <h3>关于</h3>
            <ul>
              <li>关于我们</li>
              <li>隐私政策</li>
              <li>使用条款</li>
            </ul>
          </div>
          <div class="sitemap-column">
            <h3>联系</h3>
            <ul>
              <li><a href="https://github.com/CJ-cooper6/coco-tacticx" target="_blank">GitHub</a></li>
              <li>cha473172339@163.com</li>
              <li>
                <a href="https://qiyjcn5ub3.feishu.cn/share/base/form/shrcnFrxVlFamvENvwhHw2noxXe" target="_blank">
                  问题反馈
                </a>
              </li>
            </ul>
            <div class="qr-codes-container">
              <div class="qr-code-item">
                <img src="/qq-group.png" alt="QQ群二维码" class="qr-code" />
                <p class="qr-desc">QQ交流群：38793551</p>
              </div>
              <div class="qr-code-item">
                <img src="/wechat-mp.jpg" alt="微信公众号二维码" class="qr-code" />
                <p class="qr-desc">微信公众号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-content">
        <div class="copyright">© 2024 - 2025 Coco战术板. All Rights Reserved.</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const scrollToFaq = () => {
  const faqElement = document.getElementById("faq");
  if (faqElement) {
    faqElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
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
.faq-section,
.sitemap-section {
  padding-left: 2rem;
  padding-right: 2rem;
}

.hero-section,
.features-section,
.faq-section,
.sitemap-section {
  flex: 1;
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

.faq-section {
  max-width: 1200px;
  margin: 4rem auto;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.2s;
}

.faq-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.faq-item p {
  opacity: 0.9;
  line-height: 1.6;
}

.sitemap-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 2rem 1rem;
}

.sitemap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.sitemap-column h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: white;
}

.sitemap-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sitemap-column ul li {
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.sitemap-column ul li {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.sitemap-column ul li:hover {
  color: white;
}

.sitemap-column ul li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.sitemap-column ul li a:hover {
  color: white;
}

.footer {
  margin-top: 0;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.copyright {
  margin-bottom: 0.5rem;
}

.icp-info a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.icp-info a:hover {
  color: white;
}

.contact-list {
  display: flex;
  gap: 2rem;
}

.qq-group {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
}

.qq-group h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  color: white;
}

.qq-group .qr-code {
  width: 150px;
  height: 150px;
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
}

.qr-codes-container {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.qr-code-item {
  padding: 0.8rem;
  border-radius: 0.8rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.qr-code-item:hover {
  transform: translateY(-2px);
}

.qr-code {
  width: 90px;
  height: 90px;
  border-radius: 0.5rem;
  background: white;
  padding: 0.4rem;
}

.qr-desc {
  margin-top: 0.6rem;
  margin-bottom: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .sitemap-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-list {
    flex-direction: column;
    gap: 1rem;
  }

  .qq-group .qr-code {
    width: 100px;
    height: 100px;
  }

  .qr-codes-container {
    grid-template-columns: 1fr;
  }

  .qr-code {
    width: 100px;
    height: 100px;
  }

  .qr-desc {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .sitemap-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .faq-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .features-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .sitemap-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .features-section {
    grid-template-columns: 1fr;
  }

  .sitemap-grid {
    grid-template-columns: repeat(2, 1fr);
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
}
</style>
