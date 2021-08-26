import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

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
const vnode1 = h('ul', {

},[
  h('a', {
    props: {
      href: 'http://www.baidu.com',
      target: '_blank'
    }
  }, '百度'),
  h('li', {}, 'test')
])
console.log(vnode1)

// 将虚拟节点加入容器（加入 DOM 树）
patch(container, vnode1)