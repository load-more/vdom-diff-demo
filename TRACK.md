## 环境搭建

### snabbdom简介

- snabbdom 是一个瑞典语单词，意为 “速度”；
- snabbdom 是著名的虚拟 DOM 库，是 diff 算法的鼻祖，Vue 源码借鉴了 snabbdom；
- 官方 git：https://github.com/snabbdom/snabbdom
- github 上的 snabbdom 源码是用 TypeScript 写的，git 上并不提供编译好的 JavaScript 版本；
- 如果要直接使用 build 出来的 JavaScript 版的 snabbdom 库，可以从 npm 上下载：`npm install -S snabbdom`；
- 由于 snabbdom 是 DOM 库，不能在 nodejs 环境下运行，所以需要搭建 webpack 和 webpack-dev-server 开发环境，而且不需要安装任何 loader；
- 需要注意的是，**必须安装最新版 webpack@5，不能安装 webpack@4**，这是因为 webpack4 没有读取身份证中 exports 的能力，建议安装：`npm install -D webpack@5 webpack-cli@3 webpack-dev-server@3`；

### 配置webpack

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    // 虚拟打包路径，文件夹不会真正生成，而是在8090端口虚拟生成
    publicPath: 'dist',
    // 打包生成的文件名
    filename: 'bundle.js'
  },
  devServer: {
    port: 8090, // 端口号
    contentBase: 'www' // 静态资源文件夹
  }
}
```



## 虚拟DOM

### 定义

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826164636.png)

**虚拟DOM：用 JavaScript 对象描述DOM的层次结构。DOM中的一切属性都在虚拟DOM中有对应的属性。**

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826164357.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826164736.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826164813.png)

## h函数

### 定义

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826164933.png)

### 图解

![](https://gitee.com/gainmore/imglib/raw/master/img/h.png)

**vnode节点参数：**

```js
{
    sel: 'div',		// 选择器，或标签名
    data: {},		// 节点的属性、样式
   	children: [], 	// 子节点（数组）
    text: 'xxx',	// 文本内容
    elm: undefined,	// 对应的真实DOM结构
    key: undefined  // 节点唯一标识
}
```



### 实现h函数

`vnode.js`

```js
// vnode 函数非常简单，只是把传入的参数组成对象返回即可
export default function(sel, data, children, text, elm) {
  return {
    sel, data, children, text, elm
  }
}
```

`h.js`

```js
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
```



## patch函数

### 定义

patch 意为 `补丁、修补`。

patch 函数的作用就是比较新的虚拟节点和旧的虚拟节点的差异，然后把差异补充到旧的虚拟节点对应的真实 DOM 上。即可以理解为给旧虚拟节点打补丁。

### 流程图

![](https://gitee.com/gainmore/imglib/raw/master/img/diff.png)

以上七种情况如下：

```js
// 情况1：旧节点为真实 DOM
const container = document.getElementById("container");
const newVnode = h('ul', {}, 'xxx')
// 将虚拟节点加入容器（加入 DOM 树）
patch(container, newVnode)

// 情况2：新旧节点不相同
const oldVnode = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
const newVnode = h('ol', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
patch(oldVnode, newVnode)

// 情况3：新旧节点相同 && 完全一样
const oldVnode = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
patch(oldVnode, oldVnode)

// 情况4：新旧节点相同 && 新节点有 text 且和旧节点的 text 一样
const oldVnode = h('span', {}, 'AAA')
const newVnode = h('span', {}, 'AAA')
patch(oldVnode, newVnode)

// 情况5：新旧节点相同 && 新旧节点的 text 不同
const oldVnode = h('span', {}, 'AAA')
const newVnode = h('span', {}, 'BBB')
patch(oldVnode, newVnode)

// 情况6：新旧节点相同 && 新节点有 children 但旧节点没有 children
const oldVnode = h('ul', {}, 'XXX')
const newVnode = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
patch(oldVnode, newVnode)

// 情况7：新旧节点相同 && 新旧节点都有 children
const oldVnode = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'c' }, 'c')
])
const newVnode = h('ul', {}, [
  h('li', { key: 'a' }, 'a'),
  h('li', { key: 'b' }, 'b'),
  h('li', { key: 'e' }, 'e'),
  h('li', { key: 'f' }, 'f'),
  h('li', { key: 'c' }, 'c')
])
patch(oldVnode, newVnode)
```

**其中第七种情况（新旧虚拟节点都有 children）是最复杂的情况，也是 diff 算法的核心。**

### 实现patch函数

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828181141.png)

其中 `patchVnode` 是处理虚拟节点相同的情况。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828181437.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828181557.png)

其中，情况7 的 `updateChildren` 是 `diff` 算法的核心部分。

## diff算法（核心）

### 三条性质

1. diff 算法可以实现最小量更新。通过给虚拟节点设置 key 值，key 是虚拟节点的唯一标识，它可以告诉 diff 算法，在更改前后节点是同一个 DOM 节点；
2. 只有同一个虚拟节点，才进行精细化比较，否则就是暴力删除旧节点，然后插入新节点。相同虚拟节点的条件：节点的 sel 和 key 都相同；
3. 只进行同层 diff 比较，不进行跨层比较。即使是同一片虚拟节点，但跨层了，也不会进行 diff 比较，而是暴力删除旧节点，然后插入新节点。

**由于第二、三种情况在实际 Vue 开发中很少遇见，所以这是合理的优化机制。**

### 五种情况

1. 不加 key 向后插入节点：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826212520.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826212728.png)

可以发现，前面的节点不会重新渲染。

2. 不加 key 随机插入节点：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826213038.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826213355.png)

可以发现，插入节点之前的节点没有重新渲染，但插入节点之后的所有节点都进行了重新渲染。

3. 加 key 后随机插入节点：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826214610.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826214547.png)

可以发现，加了 key 之后，diff 会进行最小量更新，相同节点都不会重新渲染。

4. 修改节点的标签名（sel）：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826214942.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826215147.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826215203.png)

可以发现，修改标签名后，所有节点都进行了重新渲染。因为 sel 变化，两个节点不相同，所以不会 diff 比较，而是暴力删除旧节点，插入新节点。

5. 同一片节点外加一层节点：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826215817.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826215842.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210826215858.png)

可以发现，这种情况下，所有节点也都重新渲染了。因为所有 li 外加了一层 li，原来的 li 组和当前的 li 组已经不在同一层了，所以不会进行 diff 比较，而是直接暴力删除旧节点，插入新节点。

### 实现流程

#### 循环查找

##### 1.旧前新前命中

- 若旧前节点和新前节点相同，则命中；若不同，则进入下一种情况；
- 命中后，`patchVnode(oldStartVnode, newStartVnode)`，将新前节点的差异修补到旧前节点上；
- 修补后，旧前节点和新前节点指针后移，而后进入下一次循环。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828185004.png)

```js
else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 旧前、新前相同
      console.log('1.旧前、新前相同')
      // 精细化比较两个节点，完成之后旧节点和新节点变成一样
      patchVnode(oldStartVnode, newStartVnode)
      // 移动指针并改变节点
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
```

##### 2.旧后新后命中

- 若旧后节点和新后节点相同，则命中；若不同，则进入下一种情况；
- 命中后，`patchVnode(oldEndVnode, newEndVnode)`，将新后节点的差异修补到旧后节点上；
- 修补后，旧后节点和新后节点指针前移，而后进入下一次循环。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828184613.png)

```js
else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 旧后、新后相同
      console.log('2.旧后、新后相同')
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
```

##### 3.旧前新后命中

- 若旧前节点和新后节点相同，则命中；若不同，则进入下一种情况；
- 命中后，`patchVnode(oldStartVnode, newEndVnode)`，将新后节点的差异修补到旧前节点上；
- 修补后，将旧前节点移动到旧后节点的下一个节点；
- 移动后，旧前节点指针后移，新后节点指针前移，而后进入下一次循环。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828190151.png)

```js
else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 旧前、新后相同
      console.log('3.旧前、新后相同')
      // 当旧前、新后命中时，需要移动节点；
      // 将旧前节点移动到旧后节点的后面即可；
      // 只要插入一个已经在 DOM 树上的节点，该节点就会被移动。
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
```

##### 4.旧后新前命中

- 若旧后节点和新前节点相同，则命中；若不同，则进入下一种情况；
- 命中后，`patchVnode(oldEndVnode, newStartVnode)`，将新前节点的差异修补到旧后节点上；
- 修补后，将旧后节点移动到旧前节点的上一个节点；
- 移动后，旧后节点指针前移，新前节点指针后移，而后进入下一次循环。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828191259.png)

```js
else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 旧后、新前相同
      console.log('4.旧后、新前相同')
      patchVnode(oldEndVnode, newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
```

##### 5.四种都未命中

- 若以上四种情况均未命中，遍历所有旧前和旧后指针之间的所有节点，得到一个 `key` 和 `索引` 的映射表 keyMap；
- 查找 keyMap 中是否存在新前节点的 key；
- 若存在，`patchVnode(elmToMove, newStartVnode)`，将新前节点的差异修补到映射的旧节点上；
- 修补后，将映射的旧节点设置为 undefined，表示处理完这项；
- 然后，把该节点移动到旧前节点的上一个节点；
- 最后，新前节点指针后移即可。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828194026.png)

- 若 keyMap 中不存在新前节点的 key，则直接使用 `createElement(newStartVnode)` 创建一个真实 DOM，并把它插入到旧前节点的上一个节点；
- 最后，新前节点指针后移即可。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828200624.png)

```js
else {
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
```

#### 循环结束

##### 1.若新节点有剩余

- 如果 `newStartIdx <= newEndIdx`，说明新节点有剩余；
- 可以遍历所有剩余的新节点，将它们添加到一个 `documentFragment` 中；
- 然后将整个 `documentFragment` 插入到旧后节点的下一个节点。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828201752.png)

##### 2.若旧节点有剩余

- 如果 `oldStartIdx <= oldEndIdx`，说明旧节点有剩余；
- 遍历所有剩余的旧节点，使用 `removeChild()` 将它们从 DOM 中删除即可。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210828202249.png)

```js
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
```



## 扩展

### 为什么v-for的key不能为index？

如果使用 index 作为 key，那么 key 和遍历得到的元素之间就不能对应起来。意味着元素的 key 永远都是 0，1，2，3......

假如通过 v-for 遍历一个数组，得到了 text 分别为 A、B、C 的三个元素，它们的 key 分别是 0、1、2；

假如这个数组前面插入了一个元素 D，此时 D、A、B、C 这四个元素的 key 分别为 0、1、2、3；

由于更新前后前三个元素的 key 相同，所以 diff 比较时就会命中旧前和新前节点相同的这个情况，因此会直接进行 patch，D patch 到 A，A patch 到 B，B patch C。因为这些元素的文本都不相同，所以会进行重新渲染，这样压根没有优化。

因此，将 key 设置为 index 和不设置 key（默认为 undefined）本质差不多。

### 为什么v-for的key不能为随机数？

如果 key 为随机数，那么数据更新之后，很大可能所有元素的 key 都不相同，这就会导致四种情况都不会命中，于是所有新节点都会直接插入，然后暴力删除所有旧节点。这样会导致性能很差。



## 参考资料

- https://www.bilibili.com/video/BV1v5411H7gZ?from=search&seid=326463084850277620
- https://blog.csdn.net/weixin_44972008/article/details/115620198

