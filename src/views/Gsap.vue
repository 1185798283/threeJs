<!--
 * @Description: 练习 GSAP 动画库
 * @author: 丁艺伟
-->
<template>
  <div id="boxDiv">
    <button @click="moveDiv">开始运动-to</button>
    <button @click="moveDivFrom">开始运动-from</button>
    <button @click="moveDivFromTo">开始运动-fromTo</button>
    <button @click="moveDivSet">开始运动-set</button>
    <button @click="moveDivSvg">开始运动-svg</button>
    <div class="boxA"></div>
    <br />
    <button @click="moveDivStagger">开始运动-stagger</button>
    <div :style="{ display: 'flex' }">
      <div class="box"></div>
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
      <div class="box box5"></div>
    </div>
    <br />
    <button @click="moveDivScrollTrigger">开始运动-ScrollTrigger</button>
    <div class="boxC boxC1"></div>
    <div class="boxC boxC2"></div>
    <br />
    <button @click="moveDivTimeline">开始运动-时间线</button>
    <button @click="moveDivTimeline2">开始运动-时间线晋级</button>
    <button @click="moveDivTimelineLabel">开始运动-label</button>
    <button @click="moveDivTimeKeyframes">关键帧</button>
    <button @click="moveDivTimeKeyframesObj">对象关键帧</button>
    <button @click="moveDivTimeKeyframesPercentage">百分比关键帧</button>

    <div class="boxB1 box1"></div>
    <div class="boxB2 box2"></div>
    <div class="boxB3 box3"></div>
    <div class="boxB4 box3"></div>
    <br />
    <button @click="moveDivStagger2">开始运动-stagger2</button>
    <div :style="{ display: 'flex', width: '550px', flexWrap: 'wrap' }">
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
      <div class="box25"></div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

//注册
gsap.registerPlugin(ScrollTrigger)
onMounted(() => {})

const moveDivTimeKeyframesPercentage = () => {
  gsap.to('.boxB3', {
    keyframes: {
      '0%': { x: 100, y: 100 },
      '75%': { x: 0, y: 0, ease: 'sine.out' }, // finetune with individual eases
      '100%': { x: 50, y: 50 },
      easeEach: 'expo.inOut' // ease between keyframes
    },
    ease: 'none', // ease the entire keyframe block
    duration: 2
  })
}

const moveDivTimeKeyframesObj = () => {
  gsap.to('.box1', {
    // 依次执行
    keyframes: [
      { x: 100, duration: 4, ease: 'sine.out' },
      { y: 200, duration: 3, delay: 0.5 },
      { rotation: 360, duration: 2, delay: -0.25 }
    ],
    ease: 'expo.inOut'
  })
}

const moveDivTimeKeyframes = () => {
  gsap.to('.box1', {
    keyframes: {
      x: [0, 100, 100, 0, 0],
      y: [0, 0, 100, 100, 0],
      ease: 'power1.inOut'
    },
    duration: 3
  })
}

const moveDivScrollTrigger = () => {
  gsap.to('.boxC1', {
    rotation: 360, // 旋转
    scale: 0.8, // 放大缩小
    backgroundColor: 'red',
    scrollTrigger: {
      trigger: '.boxC2', // 触发器元素， 可以不必是动画元素
      scrub: true, // 动画的进度直接和滚动条绑定
      markers: true, // 帮助我们在开发时更好的观察动画触发时机
      start: 'top 30%',
      end: 'center 10%',
      pin: true, // 动画开始到结束期间， 触发器元素位置固定
      pinSpacing: false, // 取消pin 底部或者右侧添加的默认padding
      scroller: '#boxDiv' // 滚动条元素
    }
  })
}

const moveDivTimelineLabel = () => {
  const t1 = gsap.timeline({ repeat: 1, yoyo: true })
  t1.to('.boxB1', {
    x: 600,
    duration: 2
  }).add('myLabel', 2)
  t1.to(
    '.boxB2',
    {
      x: 600,
      duration: 1
    },
    'myLabel-=1'
  )
}
const moveDivTimeline = () => {
  const t1 = gsap.timeline({ onComplete: handleComplete })

  t1.to('.boxB1', {
    x: 600,
    duration: 2,
    onComplete: () => handleComplete1('.boxB1')
    // onUpdate: handleUpdate
  })
  t1.to('.boxB2', {
    x: 600,
    duration: 1,
    repeat: 1,
    reversed: true,
    yoyo: true,
    onReverseComplete: handleReverseComplete
  })
  t1.to('.boxB3', {
    x: 600,
    duration: 1
  })
}
const handleReverseComplete = () => {
  console.log('ReverseComplete反转,配合 “reversed”使用')
}
const handleUpdate = () => {
  console.log('update')
}
const handleComplete = () => {
  console.log('complate函数调用, 所有动画执行完毕调用')
}
const handleComplete1 = (value) => {
  console.log(`complate函数调用,${value}执行完毕`)
}
const moveDivTimeline2 = () => {
  const t1 = gsap.timeline()

  t1.to('.boxB1', {
    x: 600,
    duration: 3
  })
  t1.to(
    '.boxB2',
    {
      x: 600,
      duration: 1
    },
    '+=2'
  ) // 在最后一个动画结束后2秒插入动画
  t1.to(
    '.boxB3',
    {
      x: 600,
      duration: 1
    },
    '<'
  ) // 在上个动画的开始插入动画
  t1.to(
    '.boxB4',
    {
      x: 600,
      duration: 1
    },
    1
  ) // 在1秒开始插入动画（绝对值）
}

const moveDivStagger2 = () => {
  gsap.to('.box25', {
    scale: 0.01,
    yoyo: true,
    repeat: 3,
    delay: 1,
    repeatDelay: 1,
    stagger: {
      amount: 1.5,
      grid: 'auto',
      from: 'center'
    }
  })
}

const moveDivStagger = () => {
  gsap.to('.box', {
    duration: 0.5,
    opacity: 0,
    y: -100,
    stagger: 0.1,
    ease: 'back.in'
  })
}
const moveDivSvg = () => {
  gsap.to('.boxA', {
    duration: 2,
    x: 700,
    yPercent: 100,
    backgroundColor: 'red',
    borderRadius: '50',
    rotation: 360,
    repeatDelay: 1,
    // yoyo 一般与repeat一起使用
    yoyo: true,
    repeat: 2,
    attr: {
      fill: '#8d3dae',
      rx: 50
    }
  })
}

const moveDiv = () => {
  gsap.to('.boxA', {
    x: 400,
    y: 50,
    rotation: 180,
    // 特殊属性
    duration: 3,
    yPercent: 50,
    repeat: 2
  })
}

const moveDivFrom = () => {
  gsap.from('.boxA', {
    x: 300
  })
}

const moveDivFromTo = () => {
  gsap.fromTo(
    '.boxA',
    {
      x: 0,
      y: 0
    },
    {
      y: 300,
      x: 200
    }
  )
}

const moveDivSet = () => {
  gsap.set('.boxA', {
    x: 400,
    y: 50
  })
}
</script>

<style scoped lang="less">
#boxDiv {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
.boxA,
.boxB1,
.boxB2,
.boxB3,
.boxB4,
.boxC,
.box {
  width: 200px;
  height: 200px;
  background-color: aquamarine;
  border-radius: 8%;
  margin-right: 5px;
}
.boxB1,
.boxB2,
.boxB3,
.boxB4 {
  width: 100px;
  height: 100px;
}
.box1 {
  background-color: fff8dc;
}
.box2,
.boxC1 {
  background-color: #dc143c;
}
.box3,
.boxC2 {
  background-color: #ffa500;
}
.box4 {
  background-color: #00bfff;
}
.box5 {
  background-color: #00ff7f;
}
.box25 {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-color: #00ff7f;
  margin: 0 10px 10px 0;
}
</style>
