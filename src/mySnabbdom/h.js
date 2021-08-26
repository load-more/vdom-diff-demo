import vnode from './vnode'

/* 
  编写一个简单的 h函数，这个函数必须接收三个参数，缺一不可（重载能力较弱），
  也就是说，调用的情形必须是下面三种情况：
  h('div', {}, 'xxx')
  h('div', {}, [])
  h('div', {}, h())
*/

export default function(sel, data, c) {
  // 检查参数个数
  if (arguments.length !== 3) {
    throw new Error('h函数必须传入3个函数')
  }
  // 检查参数c的类型
  if (typeof c === 'string' || typeof c === 'number') {
    // 参数：h('div', {}, 'xxx')
    return vnode(sel, data, undefined, c, undefined)
  } else if (Array.isArray(c)) {
    // 参数：h('div', {}, [])
    const children = []
    for (let i = 0; i < c.length; i++) {
      if (!(typeof c[i] === 'object' && c[i].hasOwnProperty('sel'))) {
        throw new Error('传入数组存在非h函数的项')
      }
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 参数：h('div', {}, h())
    return vnode(sel, data, [c], undefined, undefined)
  } else {
    throw new Error('第三个参数类型错误')
  }
}