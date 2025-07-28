<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="nav-logo">
        <span class="logo-icon">⚽</span>
        <span class="logo-text">Coco足球战术板</span>
      </div>
      <nav class="nav-menu" :class="{ active: mobileMenuOpen }">
        <template v-if="showFullMenu">
          <a href="#home" class="nav-link" @click="scrollToSection('home')">首页</a>
          <a href="#features" class="nav-link" @click="scrollToSection('features')">功能</a>
          <a href="#showcase" class="nav-link" @click="scrollToSection('showcase')">演示</a>
          <router-link :to="{ name: 'changelog' }" class="nav-link">更新记录</router-link>
          <a href="#faq" class="nav-link" @click="scrollToSection('faq')">常见问题</a>
        </template>
        <template v-else>
          <router-link :to="{ name: 'home' }" class="nav-link">返回首页</router-link>
        </template>
        <router-link :to="{ name: 'board' }" target="_blank" class="nav-cta">立即体验</router-link>
      </nav>
      <div class="hamburger" :class="{ active: mobileMenuOpen }" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

interface Props {
  showFullMenu?: boolean;
}

const { showFullMenu = true } = defineProps<Props>();

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

/* Mobile Responsive */
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
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-menu {
    padding: 6rem 1.5rem 1.5rem;
    width: 260px;
  }
}
</style>
