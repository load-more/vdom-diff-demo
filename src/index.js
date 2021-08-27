import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h
} from "snabbdom";
// 自定义的h函数
// import h from './mySnabbdom/h'
// 自定义的patch函数
import patch from './mySnabbdom/patch'

// 创建出 patch 函数
// const patch = init([
//   // Init patch function with chosen modules
//   classModule, // makes it easy to toggle classes
//   propsModule, // for setting properties on DOM elements
//   styleModule, // handles styling on elements with support for animations
//   eventListenersModule, // attaches event listeners
// ]);

// 获取容器节点
const container1 = document.getElementById('container1')
const container2 = document.getElementById('container2')
const container3 = document.getElementById('container3')
const container4 = document.getElementById('container4')
const container5 = document.getElementById('container5')
const container6 = document.getElementById('container6')
const container7 = document.getElementById('container7')
// 获取按钮
const init2 = document.getElementById('init2')
const init3 = document.getElementById('init3')
const init4 = document.getElementById('init4')
const init5 = document.getElementById('init5')
const init6 = document.getElementById('init6')
const init7 = document.getElementById('init7')
const patch1 = document.getElementById('patch1')
const patch2 = document.getElementById('patch2')
const patch3 = document.getElementById('patch3')
const patch4 = document.getElementById('patch4')
const patch5 = document.getElementById('patch5')
const patch6 = document.getElementById('patch6')
const patch7 = document.getElementById('patch7')

// 情况1：oldVnode 为真实 DOM
const vnode1 = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
patch1.onclick = () => {
  // 将虚拟节点加入容器（加入 DOM 树）
  patch(container1, vnode1)
}


// 情况2：新旧节点不相同
const vnode21 = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
const vnode22 = h('ol', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
init2.onclick = () => {
  patch(container2, vnode21)
}
patch2.onclick = () => {
  patch(vnode21, vnode22)
}

// 情况3：新旧节点相同 && 完全一样
const vnode31 = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
init3.onclick = () => {
  patch(container3, vnode31)
}
patch3.onclick = () => {
  patch(vnode31, vnode31)
}

// 情况4：新旧节点相同 && 新节点有 text 且和旧节点的 text 一样
const vnode41 = h('span', {}, 'Hello')
const vnode42 = h('span', {}, 'Hello')
init4.onclick = () => {
  patch(container4, vnode41)
}
patch4.onclick = () => {
  patch(vnode41, vnode42)
}

// 情况5：新旧节点相同 && 新旧节点的 text 不同
const vnode51 = h('p', {}, 'Hello')
const vnode52 = h('p', {}, 'World')
init5.onclick = () => {
  patch(container5, vnode51)
}
patch5.onclick = () => {
  patch(vnode51, vnode52)
}

// 情况6：新旧节点相同 && 新节点有 children 但旧节点没有 children
const vnode61 = h('ul', {}, 'Hello')
const vnode62 = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
init6.onclick = () => {
  patch(container6, vnode61)
}
patch6.onclick = () => {
  patch(vnode61, vnode62)
}

// 情况7：新旧节点相同 && 新旧节点都有 children
const vnode71 = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c'),
])
const vnode72 = h('ul', {}, [
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'd' }, 'c'),
  h('li', { key: 'a' }, 'a'),
  // h('li', { key: 'a' }, 'a')
])
init7.onclick = () => {
  patch(container7, vnode71)
}
patch7.onclick = () => {
  patch(vnode71, vnode72)
}


// 创建虚拟节点
// const vnode1 = h('ul', {}, [
//   h('li', {}, '猫'),
//   h('li', {}, '狗'),
//   h('li', {}, h('a', {
//     props: {
//       href: 'http://www.baidu.com',
//       target: '_blank'
//     }
//   }, '百度一下')),
//   h('li', {}, [
//     h('div', {}, '你好'),
//     h('div', {}, '世界'),
//     h('span', {}, '哈哈哈哈')
//   ])
// ])
// console.log(vnode1)
