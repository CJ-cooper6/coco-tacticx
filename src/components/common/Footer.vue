<template>
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
</template>

<script setup lang="ts">
const scrollToFaq = () => {
  const element = document.getElementById("faq");
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
</script>

<style scoped>
.footer {
  margin-top: auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  box-sizing: border-box;
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
  .sitemap-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .qr-code {
    width: 100px;
    height: 100px;
  }

  .qr-desc {
    font-size: 0.8rem;
  }
}
</style>
