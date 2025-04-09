# SparklerLib 🎇 基于Pixi.js的烟花/礼花效果库

## 🔥 效果演示
![SparklerLib 烟花效果演示](实际GIF链接)
*（展示烟花发射、爆炸及拖尾动画效果）*

## 📦 安装方式
```bash
# 安装核心库
npm install sparklerlib

# 安装必需依赖（Pixi.js）
npm install pixi.js
```

## 🚀 使用示例
### 1. Vue 3组件集成
```vue
<template>
  <div ref="pixiContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
import { initScene } from "sparklerlib";

const pixiContainer = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  if (!pixiContainer.value) {
    return;
  }
  const app = new Application();
  const config = {
    width: pixiContainer.value.clientWidth,
    height: pixiContainer.value.clientHeight,
    backgroundColor: 0x000000,
    fireworkRange: {
      min: 3,
      max: 5
    }, // 每次发射1 - 3个烟花（固定位置未设置时生效）
    interval: 5 * 1000, // 发射间隔时间（毫秒）
    secondaryExplosionDelay: 300,
    firstExplosionParticleCount: 10, // 首次爆炸粒子数量
    secondExplosionParticleCount: 10, // 二次爆炸粒子数量
    fixedFireworkPosition: [
      { x: 100, y: 400 },
      { x: 200, y: 400 },
      { x: 300, y: 400 }
    ], // 固定发射点（默认随机）
    firstExplosionTimeTargetY: { min: 50, max: 150 },
    fireworkSpeedRange: { min: 5, max: 10 },
    firstExplosionParticleSizeRange: { min: 1, max: 3 },
    secondExplosionParticleSizeRange: { min: 0.5, max: 1.5 },
    firstExplosionParticleColorPalette: [0xff0000, 0x00ff00, 0x0000ff],
    secondExplosionParticleColorPalette: [0xffff00, 0xff00ff, 0x00ffff],
    fireworkDotSize: 3,
    fireworkDotColor: 0xffffff,
    trailTransparency: 0.2, // 粒子拖尾透明度（0 - 1）
    maxTrailLength: 3,
    gravity: 0.1
  };

  const { cleanup } = await initScene(pixiContainer.value, config);
  onUnmounted(cleanup);
});
</script>

<style scoped>
div {
  width: 400px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

```