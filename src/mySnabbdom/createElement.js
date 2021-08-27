// 真正创建节点，将 vnode 创建为 DOM
export default function createElement(vnode) {
  // 创建一个 DOM 节点，此时它还是孤儿节点
  const node = document.createElement(vnode.sel)
  // 如果 vnode 只有文本节点，没有子节点
  if (vnode.text && (!vnode.children || !vnode.children.length)) {
    node.innerText = vnode.text
  } else if (Array.isArray(vnode.children) && vnode.children.length) {
    // 如果子节点是个非空数组，则递归这些子节点
    for (let i = 0, len = vnode.children.length; i < len; i++) {
      node.appendChild(createElement(vnode.children[i]))
    }
  }
  vnode.elm = node // 将创建出的真实 DOM 添加到虚拟节点的 elm 中
  return node // 返回真实 DOM
}