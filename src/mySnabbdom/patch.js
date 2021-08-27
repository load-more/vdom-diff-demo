import vnode from './vnode'
import createElement from './createElement'
import patchVnode from './patchVnode'

export default function(oldVnode, newVnode) {
  // 判断 oldVnode 是 DOM 节点还是虚拟节点
  if (!oldVnode.sel) {
    // 如果是 DOM 节点，则需要包装为虚拟节点
    console.log('情况1：oldVnode 是真实DOM，将其转换为虚拟节点')
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }

  // 判断 oldVnode 和 newVnode 是否是同一个节点
  if (oldVnode.sel === newVnode.sel && oldVnode.key === newVnode.key) { // 是同一个节点
    patchVnode(oldVnode, newVnode)
  } else { // 不是同一个节点，插入新节点，然后删除旧节点
    console.log('情况2：oldVnode 和 newVnode 不是相同节点，暴力删除旧节点，插入新节点')
    // 1. 创建新的 DOM 节点（真实DOM）
    const newVnodeElm = createElement(newVnode) // 根据新节点，创建真实 DOM（孤儿节点）
    // 2. 将孤儿节点插入 DOM 树，将其插入到旧节点的 DOM 结构之前
    //    注意 .elm 属性对应的是虚拟节点的真实 DOM
    oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    // 3. 删除旧的 DOM 节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}