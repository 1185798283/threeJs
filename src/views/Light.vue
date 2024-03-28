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

// 创建相机
const camera = new THREE.PerspectiveCamera()
camera.position.z = 10
camera.position.y = 5

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)
//添加  高光材质
const material = new THREE.MeshPhongMaterial({
  color: 0x0099ff,
  shininess: 1000
})

// 网格,   将内容和材质添加进去
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, 0)
// 物体接收光源
cube.receiveShadow = true
// 物体投射光源
cube.castShadow = true
// 局部缩放
// cube.scale.set(2, 1, 1)
scene.add(cube)

// 添加环境光
const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 200, 100, 2)
pointLight.position.set(5, 3, 5)
pointLight.castShadow = true
scene.add(pointLight)

// 利用平面缓冲几何体，创建地面
const meshFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshPhongMaterial({ color: 0x1b5e20 })
)
meshFloor.rotation.x -= Math.PI / 2
// 地面接收光源
meshFloor.receiveShadow = true
// 地面投射光源
meshFloor.castShadow = true
scene.add(meshFloor)

// 添加网格地面
const gritHelper = new THREE.GridHelper(10, 10)
scene.add(gritHelper)

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5)
// axesHelper.position.y = 3
scene.add(axesHelper)

onMounted(() => {
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 调整渲染器窗口大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 渲染器渲染灯光效果
  renderer.shadowMap.enabled = true

  // 将GUI添加进页面
  document.getElementById('container').appendChild(f.domElement)

  // 将渲染器添加进页面
  document.getElementById('container').appendChild(renderer.domElement)

  // 添加轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)

  // 设置动画效果
  function animate() {
    requestAnimationFrame(animate)
    // cube.material.color = new THREE.Color(controlData.color)
    // material.wireframe = controlData.wireframe
    // 轨道控制器更新
    controls.update()
    // 进行渲染，
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<template>
  <div id="container"></div>
</template>

<style>
#gui {
  position: absolute;
  width: 300px;
  right: 0;
}
</style>
