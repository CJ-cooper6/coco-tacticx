// 版本变更记录类型定义
export interface VersionChanges {
  new?: string[];
  improved?: string[];
  fixed?: string[];
  removed?: string[];
}

export interface Version {
  version: string;
  date: string;
  changes: VersionChanges;
  customTitles?: string;
}

// 版本数据
export const versions: Version[] = [
  {
    version: "v1.0.0",
    date: "2025-07-13",
    customTitles: "MVP版本发布！",
    changes: {
      new: [
        "发布足球战术板核心功能",
        "支持基础战术元素绘制",
        "支持战术动画",
        "实现响应式设计",
        "添加PWA支持",
        "集成自动保存功能",
      ],
    },
  },
];
