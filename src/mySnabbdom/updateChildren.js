import createElement from "./createElement"
import patchVnode from "./patchVnode"

export default function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0, // 旧前指针
      newStartIdx = 0, // 新前指针
      oldEndIdx = oldCh.length - 1, // 旧后指针
      newEndIdx = newCh.length - 1, // 新后指针
      oldStartVnode = oldCh[oldStartIdx], // 旧前节点
      newStartVnode = newCh[newStartIdx], // 新前节点
      oldEndVnode = oldCh[oldEndIdx], // 旧后节点
      newEndVnode = newCh[newEndIdx],  // 新后节点
      keyMap = null // 缓存表
  
  // 判断两个 vnode 是否相同
  function isSameVnode(vnode1, vnode2) {
    return (vnode1.sel === vnode2.sel && vnode1.key === vnode2.key)
  }

  // 
  function isUndef(vnode) {
    return vnode === undefined
  }
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    console.log('========= 循环 =========')
    // 首先需要判断节点是否是 undefined，是的话就跳过该节点
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (isUndef(newStartVnode)) {
      newStartVnode = newCh[++newStartIdx]
    } else if (isUndef(newEndVnode)) {
      newEndVnode = newCh[--newEndIdx]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 旧前、新前相同
      console.log('1.旧前、新前相同')
      // 精细化比较两个节点，完成之后旧节点和新节点变成一样
      patchVnode(oldStartVnode, newStartVnode)
      // 移动指针并改变节点
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 旧后、新后相同
      console.log('2.旧后、新后相同')
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 旧前、新后相同
      console.log('3.旧前、新后相同')
      // 当旧前、新后命中时，需要移动节点；
      // 将旧前节点移动到旧后节点的后面即可；
      // 只要插入一个已经在 DOM 树上的节点，该节点就会被移动。
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 旧后、新前相同
      console.log('4.旧后、新前相同')
      patchVnode(oldEndVnode, newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 以上四种情况都没有命中
      console.log('四种情况都没有命中')
      // 使用映射表将旧节点的 key 和索引映射关系缓存起来
      if (!keyMap) {
        keyMap = {}
        for (let i = oldStartVnode; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if (key !== undefined) {
            keyMap[key] = i
          }
        }
      }
      const index = keyMap[newStartVnode.key]
      if (index !== undefined) {
        // 如果有值，说明新节点在旧节点中存在，将节点移动即可
        console.log('旧节点中找到新节点，移动旧节点')
        // 获取要移动的旧节点
        const elmToMove = oldCh[index]
        // 将新节点的差异修补到要移动的旧节点上
        patchVnode(elmToMove, newStartVnode)
        // 将旧的虚拟节点设置为 undefined，表示处理完该项
        oldCh[index] = undefined
        // 将修补后的 DOM 节点插入到 oldStartVnode 之前
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      } else {
        console.log('旧节点中没有找到新节点，插入新节点')
        // 如果无值，说明是全新的虚拟节点，直接插入该节点即可（注意要转换成 DOM 节点）
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }
      // 最后移动指针并修改新前节点即可
      newStartVnode = newCh[++newStartIdx]
    }
  }

  // 循环结束
  if (newStartIdx <= newEndIdx) {
    // 说明 newVnode 还有剩余节点没有处理，需要添加这些未被处理的节点
    console.log('添加未处理的新节点')
    const fragment = document.createDocumentFragment()
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // 把所有未处理的新节点添加到文档片段中
      fragment.appendChild(createElement(newCh[i]))
    }
    // 然后把文档片段整个插入到旧后节点之后
    parentElm.insertBefore(fragment, oldCh[oldEndIdx].nextSibling)
  } else if (oldStartIdx <= oldEndIdx) {
    // 说明 oldVnode 还有剩余节点未处理，直接删除这些节点
    console.log('删除未处理的旧节点')
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}