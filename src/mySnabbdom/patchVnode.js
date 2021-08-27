import updateChildren from "./updateChildren"
import createElement from "./createElement"

// 两个虚拟节点相同，进行精细化比较
export default function patchVnode(oldVnode, newVnode) {
  // 如果 oldVnode 和 newVnode 是同一个对象，不做任何处理（patch(vnode, vnode)）
  if (oldVnode === newVnode) {
    console.log('情况3：新旧节点相同 && 完全一样')
    return
  }
  
  // 如果 newVnode 有 text，且没有 children
  if (newVnode.text && (!newVnode.children || !newVnode.children.length)) {
    // 如果 newVnode 和 oldVnode 的 text 不同，那么直接让新的 text 写入旧节点的 elm 即可，
    // 如果旧节点的 elm 中有 children，那么会立即消失
    if (newVnode.text !== oldVnode.text) {
      console.log('情况5：新旧节点相同 && 新旧节点的 text 不同')
      // oldVnode.elm.innerText = newVnode.text
      oldVnode.elm.innerHTML = newVnode.text
      return
    }
    console.log('情况4：新旧节点相同 && 新节点有 text 且和旧节点的 text 一样')
  } else { // 如果 newVnode 没有 text，但有 children
    // 如果 oldVnode 也有 children（最复杂的情况）
    if (oldVnode.children && oldVnode.children.length) {
      console.log('情况7：新旧节点相同 && 新旧节点都有 children')
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else { // 如果 oldVnode 没有 children
      console.log('情况6：新旧节点相同 && 新节点有 children 但旧节点没有 children')
      // 清空 oldVnode 的内容
      oldVnode.elm.innerHTML = ''
      // 将 newVnode 的节点添加到 oldVnode 中
      for (let i = 0, len = newVnode.children.length; i < len; i++) {
        // 创建一个真实 DOM（孤儿节点）
        const newVnodeElm = createElement(newVnode.children[i])
        // 将 DOM 添加到 oldVnode 的 DOM 结构中
        oldVnode.elm.appendChild(newVnodeElm)
      }
    }
  }
}