// vnode 函数非常简单，只是把传入的参数组成对象返回即可
export default function(sel, data, children, text, elm) {
  return {
    sel, data, children, text, elm
  }
}