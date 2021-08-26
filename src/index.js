import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
} from "snabbdom";
// 自定义的h函数
import h from './mySnabbdom/h'

// 创建出 patch 函数
const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

// 获取容器节点
const container = document.getElementById("container");

// 创建虚拟节点
const vnode1 = h('ul', {}, [
  h('li', {}, '猫'),
  h('li', {}, '狗'),
  h('li', {}, h('a', {
    props: {
      href: 'http://www.baidu.com',
      target: '_blank'
    }
  }, '百度一下')),
  h('li', {}, [
    h('div', {}, '你好'),
    h('div', {}, '世界'),
    h('span', {}, '哈哈哈哈')
  ])
])
console.log(vnode1)

// 将虚拟节点加入容器（加入 DOM 树）
patch(container, vnode1)