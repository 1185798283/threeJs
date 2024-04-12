<!--
 * @Description: LOGIN THREE
 * @author: 丁艺伟
-->
<template>
  <div id="login_three"></div>
  <!-- <img :src="groundImg" /> -->
</template>

<script setup name="loging">
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import _ from 'lodash'
import { id } from 'element-plus/es/locale/index.mjs'
import TWEEN from '@tweenjs/tween.js'

//容器
let loginThree
// 场景
let scene
// 天空图片
let skyImg = new URL('../assets/images/sky.png', import.meta.url).href
let earthBgImg = new URL('../assets/images/earth_bg.png', import.meta.url).href
let starflake1Img = new URL('../assets/images/starflake1.png', import.meta.url).href
let starflake2Img = new URL('../assets/images/starflake2.png', import.meta.url).href
let cloudImg = new URL('../assets/images/cloud.png', import.meta.url).href
let groundImg = new URL('../assets/images/ground.png', import.meta.url).href
let loginHumanImg = new URL('../assets/images/login_human.png', import.meta.url).href
let width
let height
let depth = 1400
// 相机在Z轴的位置
let zAxis
// 渲染器
let renderer
// 轨道控制器
let controls
// 相机
let camera
// 球体网格
let sphereMesh
// 宇航员网格
let manGroundMesh
// 点的初始参数
let parameters
// 材质
let materials = []
// 星星初始位置
let starPosition
// 声明点1在z轴上的移动位置
let zprogress
// 声明点2在z轴上的移动位置
let zprogress_second
// 声明点1
let partticles_first
let partticles_second
// 星云的mesh对象
let cloud_mesh_first
let cloud_mesh_second
// 星云运动的渲染函数
let render_cloud_fun_first
let render_cloud_fun_second
// 宇航员浮动数值
let man_float_num = 0

onMounted(() => {
  loginThree = document.getElementById('login_three')
  width = window.innerWidth
  height = window.innerHeight

  initScene()
  initBG()
  initCamera()
  initSphereGeometry()
  initLight()
  // 定义星星的初始位置
  starPosition = -zAxis - depth / 2
  zprogress = starPosition
  zprogress_second = starPosition * 2
  partticles_first = initStarScene(starPosition)
  partticles_second = initStarScene(zprogress_second)
  cloud_mesh_first = initCloud(400, 200)
  cloud_mesh_second = initCloud(200, 100)
  render_cloud_fun_first = initCloudMove(
    cloud_mesh_first,
    [
      new THREE.Vector3(-width / 10, 0, -depth / 2 - 1000),
      new THREE.Vector3(-width / 4, height / 8, 0),
      new THREE.Vector3(-width / 4, 0, zAxis)
    ],
    0.002
  )
  render_cloud_fun_second = initCloudMove(
    cloud_mesh_second,
    [
      new THREE.Vector3(width / 8, height / 8, -depth / 2 - 1000),
      new THREE.Vector3(width / 8, height / 8, zAxis)
    ],
    0.008
  )
  initGround()
  initSpaceman()
  initRenderer()
  initOrbitControls()
  animate()
})

// 初始化场景
const initScene = () => {
  scene = new THREE.Scene()
  // 添加雾
  scene.fog = new THREE.Fog(0x000000, 0, 15000)
}
// 添加背景
const initBG = () => {
  // 创建纹理
  new THREE.TextureLoader().load(skyImg, (texture) => {
    //创建立方体
    const geometry = new THREE.BoxGeometry(width, height, depth)
    // 材质
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    })
    // 网格
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  })
}
// 初始化相机
const initCamera = () => {
  // 视野夹角
  const fov = 15
  // 相机到物体的距离, 此时看到的是立方体的正中心
  const near = width / 2 / Math.tan((Math.PI / 180) * fov)
  // 此时看到的是立方体的背面
  zAxis = Math.floor(near - 1400 / 2)
  // 创建相机
  camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000)
  camera.position.set(0, 0, zAxis)
  // 相机看向原点
  camera.lookAt(0, 0, 0)
}
// 初始化球体
const initSphereGeometry = () => {
  const geometry = new THREE.SphereGeometry(50, 64, 32)
  // 创建纹理
  const texture = new THREE.TextureLoader().load(earthBgImg)
  const material = new THREE.MeshPhongMaterial({ map: texture })
  sphereMesh = new THREE.Mesh(geometry, material)
  sphereMesh.position.set(-400, 200, -200)
  scene.add(sphereMesh)
}
// 星球自转
const renderSphereRotate = () => {
  sphereMesh.rotateY(0.001)
}

// 初始化灯光
const initLight = () => {
  //环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  // 添加点光源
  const pointLight = new THREE.PointLight(0x0655fd, 1000000, 0)
  pointLight.position.set(0, 200, -100)
  scene.add(pointLight)
}
// 初始化星星效果
const initStarScene = (zPosition) => {
  const geometry = new THREE.BufferGeometry()
  // 星星位置的坐标
  const vertices = []
  // 创建纹理
  const textureLoader = new THREE.TextureLoader()
  const flake1 = textureLoader.load(starflake1Img)
  const flake2 = textureLoader.load(starflake2Img)
  // 星星数组
  let pointsGeometry = []
  // 声明点的参数
  parameters = [
    [[0.6, 100, 0.75], flake1, 100],
    [[0, 0, 1], flake2, 40]
  ]
  // 创建1500个
  for (let i = 0; i < 1500; i++) {
    const x = THREE.MathUtils.randFloatSpread(width)
    const y = _.random(0, height / 2)
    const z = _.random(-depth / 2, zAxis)
    vertices.push(x, y, z)
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  // 创建两种不同的材质
  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0]
    const sprite = parameters[i][1]
    const size = parameters[i][2]
    materials[i] = new THREE.PointsMaterial({
      size: size,
      map: sprite,
      blending: THREE.AdditiveBlending, // 混合模式
      transparent: true, // 背景透明
      depthTest: true // 深度测试
    })

    materials[i].color.setHSL(...color)
    // 创建物体
    const particles = new THREE.Points(geometry, materials[i])
    particles.position.z = zPosition

    particles.rotation.x = Math.random() * 0.2 - 0.15
    particles.rotation.y = Math.random() * 0.2 - 0.15
    particles.rotation.z = Math.random() * 0.2 - 0.15
    pointsGeometry.push(particles)
    scene.add(particles)
  }
  return pointsGeometry
}

// 渲染星星的运动/ 闪烁效果
const renderStarMove = () => {
  // 闪烁效果
  const time = Date.now() * 0.00005
  for (let i = 0; i < parameters.length; i++) {
    const color = parameters[i][0]
    const h = ((360 * (color[0] + time)) % 360) / 360
    // 必须解析为浮点数
    materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)))
  }
  // 星星的运动
  zprogress += 5
  zprogress_second += 5
  if (zprogress >= zAxis + depth / 2) {
    zprogress = starPosition
  } else {
    partticles_first.forEach((item) => {
      item.position.z = zprogress
    })
  }
  if (zprogress_second >= zAxis + depth / 2) {
    zprogress_second = starPosition
  } else {
    partticles_second.forEach((item) => {
      item.position.z = zprogress_second
    })
  }
}
// 渲染星云的效果
const initCloud = (width, height) => {
  const geometry = new THREE.PlaneGeometry(width, height)
  // 创建背景
  const textureLoader = new THREE.TextureLoader()
  const cloudTexture = textureLoader.load(cloudImg)
  // 材质
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    blending: THREE.AdditiveBlending,
    transparent: true, // 背景透明
    depthTest: false // 深度测试
  })
  const cloudMesh = new THREE.Mesh(geometry, cloudMaterial)
  scene.add(cloudMesh)
  return cloudMesh
}

/**
 * @author: 丁艺伟
 * @description: 星云的运动
 * @param {*} cloud  星云Mesh对象
 * @param {*} route  星云的轨迹数组
 * @param {*} speed  星云运动速度
 * @return {*}
 */
const initCloudMove = (cloud, route, speed) => {
  // 记录星云的位置
  let cloudProgress = 0
  // 创建运动的轨迹， 三维曲线
  const curve = new THREE.CatmullRomCurve3(route)
  // 需要重复用到初始位置，所以用闭包
  return () => {
    if (cloudProgress >= 1) {
      cloudProgress = 0
    } else {
      cloudProgress += speed
      // 获取当前位置
      const point = curve.getPoint(cloudProgress)
      if (point && point.x) {
        cloud.position.set(point.x, point.y, point.z)
      }
    }
  }
}
// 添加月球
const initGround = () => {
  // 创建平面缓冲几何体
  const geometry = new THREE.PlaneGeometry(width, height / 3)
  // 创建背景
  const textureLoader = new THREE.TextureLoader()
  const cloudTexture = textureLoader.load(groundImg)
  const groundMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true, // 背景透明
    depthTest: false // 深度测试
  })
  const groundMesh = new THREE.Mesh(geometry, groundMaterial)
  groundMesh.position.y = -height / 3
  scene.add(groundMesh)
}
// 添加宇航员
const initSpaceman = () => {
  // 创建平面缓冲几何体
  const geometry = new THREE.PlaneGeometry(200, 280)
  // 创建背景
  const textureLoader = new THREE.TextureLoader().load(loginHumanImg)
  // 添加材质
  const groundMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader,
    transparent: true, // 背景透明
    depthTest: false, // 深度测试
    side: THREE.DoubleSide
  })
  manGroundMesh = new THREE.Mesh(geometry, groundMaterial)
  manGroundMesh.position.y = -height / 10
  manGroundMesh.position.x = width / 15
  scene.add(manGroundMesh)
}
// 宇航员浮动效果
const renderSphereRotateManGroundMesh = () => {
  const now = Date.now()
  // Math.sin接受一个以弧度为单位的角度作为参数，并返回该角度的正弦值。正弦值的范围是从 -1 到 1
  manGroundMesh.position.y = Math.sin(now * 0.001) * 20 + 5
}
// 渲染器
const initRenderer = () => {
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  loginThree.appendChild(renderer.domElement)
}
// 轨道控制器
const initOrbitControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enabled = true
  controls.update()
}

const animate = () => {
  TWEEN.update() //tween更新
  requestAnimationFrame(animate)

  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update()
  renderSphereRotate()
  renderStarMove()
  renderSphereRotateManGroundMesh()
  render_cloud_fun_first()
  render_cloud_fun_second()
  renderer.render(scene, camera)
}
</script>

<style lang="less">
#login_three {
  width: 100%;
  height: 100vh;
}
</style>
