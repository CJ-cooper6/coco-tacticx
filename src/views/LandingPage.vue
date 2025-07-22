<template>
  <div class="landing-page">
    <!-- Navigation Header -->
    <header class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <span class="logo-icon">⚽</span>
          <span class="logo-text">Coco足球战术板</span>
        </div>
        <nav class="nav-menu" :class="{ active: mobileMenuOpen }">
          <a href="#home" class="nav-link" @click="scrollToSection('home')">首页</a>
          <a href="#features" class="nav-link" @click="scrollToSection('features')">功能</a>
          <a href="#showcase" class="nav-link" @click="scrollToSection('showcase')">演示</a>
          <a href="#faq" class="nav-link" @click="scrollToSection('faq')">常见问题</a>
          <router-link :to="{ name: 'board' }" target="_blank" class="nav-cta">立即体验</router-link>
        </nav>
        <div class="hamburger" :class="{ active: mobileMenuOpen }" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
    <!-- Showcase Section - Moved to top -->
    <div id="showcase" class="showcase-section">
      <div class="showcase-container">
        <h1 class="title">Coco足球战术板</h1>
        <p class="showcase-subtitle">直观的界面设计，专业的战术分析功能，让您的战术思考更加清晰</p>
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
        <div class="copyright">© 2024 - 2025 Coco足球战术板. All Rights Reserved.</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
  mobileMenuOpen.value = false;
};

const scrollToFaq = () => {
  scrollToSection("faq");
};
</script>

<style scoped>
/* Navigation Header */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #76c4c2;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.logo-icon {
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: white;
  color: #3ca49f;
}

.nav-cta:hover {
  transform: translateY(-3px);
  background: white;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}
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
  margin: 8rem auto;
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
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .hamburger {
    display: flex;
    z-index: 1001;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    left: -100%;
    bottom: 0;
    width: 280px;
    background: #64a7a5;
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 6rem 2rem 2rem;
    gap: 2rem;
    transform: translateX(0);
    transition: left 0.3s ease;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-link {
    font-size: 1.2rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

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

@media (max-width: 1024px) {
  .faq-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }

  .features-section {
    margin: 4rem auto;
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .faq-section {
    margin: 6rem auto;
    padding: 0 1rem;
  }

  .sitemap-grid {
    grid-template-columns: 1fr;
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

  .nav-menu {
    padding: 6rem 1.5rem 1.5rem;
    width: 260px;
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
