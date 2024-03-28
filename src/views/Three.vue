<script setup>
import * as THREE from 'three'
import { FlyControls } from 'three/addons/controls/FlyControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted } from 'vue'
import dat from 'dat.gui'

//创建控制对象
const controlData = {
  rotationSpeed: 0.01,
  color: '#66ccff',
  wireframe: false,
  envMap: '无'
}
// 创建dat实例
const gui = new dat.GUI()
const f = gui.addFolder('配置')
f.add(controlData, 'rotationSpeed', 0.01, 0.1, 0.01)
// 颜色选择器
f.addColor(controlData, 'color')
// 下拉列表
// f.add(controlData, 'envMap', ['无', '全反射', '漫反射'])
f.add(controlData, 'wireframe')

f.domElement.id = 'gui'

f.open()

// Our Javascript will go here.
// 创建场景
const scene = new THREE.Scene()
// 添加背景颜色
// scene.background = new THREE.Color(0x666666)
// 创建立体纹理，图片顺序： 左右上下前后       !图片得是长宽相等的图片,
const cubeTexture = new THREE.CubeTextureLoader()
  .setPath('/textures/')
  .load(['04.jpg', '01.jpg', '05.jpg', '02.jpg', '06.jpg', '03.jpg'])
// 添加背景图片，也就是纹理
scene.background = cubeTexture
// 添加雾
// scene.fog = new THREE.Fog(0xcccccc, 10, 15)

// 创建相机
const camera = new THREE.PerspectiveCamera()
camera.position.z = 10
camera.position.y = 5

// 创建纹理
const texture = new THREE.TextureLoader().load('textures/01-map.jpg')

//  创建自定义UV像素的取值范围
const uv = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0])

// 创建立方体
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// //添加材质
// const material = new THREE.MeshBasicMaterial({
//   // color: 0x00ff00,
//   map: texture,
// })

// 创建球体
// const sphere = new THREE.SphereGeometry(1)
//添加材质
// const material = new THREE.MeshBasicMaterial({
//   // color: 0x00ff00,
//   envMap: cubeTexture
// })

// // 网格,   将内容和材质添加进去
// const cube = new THREE.Mesh(sphere, material)
// cube.position.set(0, 3, 0)
// scene.add(cube)

// 创建平面几何体
const geometry = new THREE.PlaneGeometry(1, 1)
geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, 0)
scene.add(cube)

// 使用BufferGeometry 创建平面几何体
// const geometry = new THREE.BufferGeometry()
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
//   // 1.0, 1.0, 1.0,
//   -1.0, 1.0, 1.0
//   // -1.0, -1.0, 1.0
// ])

// itemSize = 3 因为每个顶点都是一个三元组。
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

// 自定义绘制方法
// 确认几何体的顶点
// 利用索引来确定几何体的绘制方式
// const uint16 = new Uint16Array([0, 1, 2, 2, 3, 1])
// geometry.index = new THREE.BufferAttribute(uint16, 1)
// 默认是单面显示
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   side: THREE.DoubleSide,
//   wireframe: true
// })
// const cube = new THREE.Mesh(geometry, material)
// cube.position.set(0, 3, 0)
// scene.add(cube)

// 添加网格地面
const gritHelper = new THREE.GridHelper(10, 10)
scene.add(gritHelper)

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5)
// axesHelper.position.y = 3
scene.add(axesHelper)

const cameraMove = () => {
  camera.position.y = 15
  camera.position.z = 10
  camera.lookAt(0, 3, 0)
}
const cameraCube = () => {
  cube.position.set(3, 5, 0)
  camera.lookAt(cube.position)
}
onMounted(() => {
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 调整渲染器窗口大小
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 将GUI添加进页面
  document.getElementById('container').appendChild(f.domElement)

  // 将渲染器添加进页面
  document.getElementById('container').appendChild(renderer.domElement)

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)

  // 添加阻尼效果
  // controls.enableDamping = true
  // controls.dampingFactor = 0.01
  // 自动旋转
  // controls.autoRotate = true
  // controls.autoRotateSpeed = 0.5

  // 进行渲染，
  // renderer.render(scene, camera)

  // 设置动画效果
  function animate() {
    requestAnimationFrame(animate)
    // cube.rotation.x += controlData.rotationSpeed
    // cube.rotation.y += controlData.rotationSpeed
    cube.material.color = new THREE.Color(controlData.color)
    material.wireframe = controlData.wireframe
    // 轨道控制器更新
    controls.update()
    // 进行渲染，
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<template>
  <button @click="cameraMove">移动相机</button>
  <button @click="cameraCube">移动物体</button>
  <div id="container"></div>
</template>

<style>
#gui {
  position: absolute;
  width: 300px;
  right: 0;
}
</style>
