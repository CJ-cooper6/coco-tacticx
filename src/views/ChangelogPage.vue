<template>
  <div class="changelog-page">
    <!-- Navigation Header -->
    <Header :show-full-menu="false" />

    <div class="changelog-header">
      <h1 class="changelog-title">更新记录</h1>
    </div>
    <div class="changelog-container">
      <div class="changelog-content">
        <div class="version-item" v-for="version in versions" :key="version.version">
          <div class="version-header">
            <div class="version-info">
              <h2 class="version-number">{{ version.version }}</h2>
              <span class="version-date">{{ version.date }}</span>
            </div>
          </div>

          <div class="version-content">
            <div class="changes-section" v-for="(changes, category) in version.changes" :key="category">
              <h3 class="changes-title">
                {{ getCategoryIcon(category)
                }}{{ version.customTitles ? version.customTitles : getCategoryText(category) }}
              </h3>
              <ul class="changes-list">
                <li v-for="change in changes" :key="change" class="change-item">{{ change }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";

import { versions } from "@/data/versions";

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    new: "✨",
    improved: "🚀",
    fixed: "🐛",
    removed: "🗑️",
  };
  return iconMap[category] || "📝";
};

const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    new: "新增功能",
    improved: "功能优化",
    fixed: "问题修复",
    removed: "移除功能",
  };
  return textMap[category] || category;
};
</script>

<style scoped>
/* Main Layout */
.changelog-page {
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #95e3e1 0%, #3ca49f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.changelog-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0rem 2rem 6rem;
  width: 100%;
  box-sizing: border-box;
}

/* Header */
.changelog-header {
  text-align: center;
  margin: 4rem 0;
}

.changelog-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  word-break: break-word;
}

.changelog-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

.version-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-sizing: border-box;
}

.version-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.version-header {
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.version-number {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: white;
  word-break: break-word;
}

.version-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  white-space: nowrap;
}

.version-content {
  padding: 0 2.5rem 2.5rem;
  box-sizing: border-box;
}

.changes-section {
  margin-bottom: 2rem;
}

.changes-section:last-child {
  margin-bottom: 0;
}

.changes-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-word;
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  position: relative;
  padding-left: 1.5rem;
  word-break: break-word;
  overflow-wrap: break-word;
}

.change-item:last-child {
  border-bottom: none;
}

.change-item::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: bold;
  line-height: 1;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .changelog-title {
    font-size: 2.25rem;
  }

  .changelog-subtitle {
    font-size: 1.1rem;
  }

  .version-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .version-content {
    padding: 0 1.5rem 1.5rem;
  }

  .version-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .version-number {
    font-size: 1.5rem;
  }

  .change-item {
    padding: 0.6rem 0;
    font-size: 0.95rem;
  }

  .change-item::before {
    top: 0.6rem;
  }
}

@media (max-width: 480px) {
  .changelog-title {
    font-size: 2rem;
  }

  .changelog-subtitle {
    font-size: 1rem;
  }

  .version-header {
    padding: 1.25rem 1.25rem 0.75rem;
  }

  .version-content {
    padding: 0 1.25rem 1.25rem;
  }

  .version-number {
    font-size: 1.3rem;
  }

  .version-date {
    font-size: 0.85rem;
  }

  .version-type {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  .changes-title {
    font-size: 1rem;
  }

  .change-item {
    padding: 0.5rem 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .change-item::before {
    top: 0.5rem;
  }
}

* {
  box-sizing: border-box;
  max-width: 100%;
}
</style>
