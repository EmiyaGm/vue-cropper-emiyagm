<template>
  <div ref="canvasContainer" class="canvas-container" :style="`width: ${width}px;height: ${height}px`"></div>
  <button @click="download" class="btn">download</button>
  <a :href="downImg" download="demo.png" ref="downloadDom"></a>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'ThreeImageLoader',
  props: {
    originImage: '',
    width: 100,
    height: 100
  },
  data() {
    return {
      downImg: '#',
    }
  },
  mounted() {
    this.initThree()
    window.addEventListener('resize', this.onWindowResize) // 监听窗口变化调整尺寸
  },
  methods: {
    initThree() {
      // 获取 DOM 元素
      const canvasContainer = this.$refs.canvasContainer

      // 创建场景
      this.scene = new THREE.Scene()

      this.scene.background = null;

      const aspect = window.innerWidth / window.innerHeight;

      // 创建相机
      this.camera = new THREE.OrthographicCamera(
        -5 * aspect, // left
        5 * aspect,  // right
        5,           // top
        -5,          // bottom
        0.1,         // near clipping plane
        1000         // far clipping plane
      )
      this.camera.position.z = 5

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ alpha: true })
      this.renderer.setSize(
        canvasContainer.offsetWidth,
        canvasContainer.offsetHeight,
      )
      canvasContainer.appendChild(this.renderer.domElement)

      // 创建平面几何体
      const geometry = new THREE.PlaneGeometry(5, 5)

      // 加载图片纹理
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load(
        this.originImage ? this.originImage : 'https://p3-pc.douyinpic.com/aweme/1080x1080/aweme-avatar/mosaic-legacy_2e7480001384708367aa1.jpeg',
        () => {
          this.renderer.render(this.scene, this.camera) // 确保纹理加载完成后进行首次渲染
        },
      )

      // 创建材质并将图片纹理应用到材质上
      const material = new THREE.MeshBasicMaterial({ map: texture })

      // 创建网格并应用几何体和材质
      const plane = new THREE.Mesh(geometry, material)

      plane.rotation.y = THREE.MathUtils.degToRad(30)

      // 添加平面到场景
      this.scene.add(plane)

      // 开始渲染循环
      this.animate()
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera) // 渲染场景
    },
    onWindowResize() {
      // 窗口大小调整时更新渲染器和相机
      const canvasContainer = this.$refs.canvasContainer
      this.camera.aspect =
        canvasContainer.offsetWidth / canvasContainer.offsetHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(
        canvasContainer.offsetWidth,
        canvasContainer.offsetHeight,
      )
    },
    download() {
      // console.log(this.renderer.domElement)
      this.renderer.render(this.scene, this.camera);
      this.downImg = this.renderer.domElement.toDataURL('image/png', 1)
      if (window.navigator.msSaveBlob) {
        var blobObject = new Blob([data])
        window.navigator.msSaveBlob(blobObject, 'demo.png')
      } else {
        this.$nextTick(() => {
          this.$refs.downloadDom.click()
        })
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize) // 移除监听器
  },
}
</script>

<style>
.canvas-container {
  display: block;
}
</style>
