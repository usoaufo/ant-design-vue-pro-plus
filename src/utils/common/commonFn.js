/*
* 操作 Tree 或 List 返回 新 Tree或List
* @params oldTree：需要改变的树； newTree: 返回的新树，itemOpFn：操作树叶子的方法
* @return newTree：新树
* */
export function changeTreeReturnTree (oldTree, newTree, itemOpFn) {
  // console.log('oldTree,newTree', oldTree, newTree,itemOpFn)
  // console.log(typeof itemOpFn)
  if (oldTree) {
    for (let i = 0; i < oldTree.length; i++) {
      const tempObj = itemOpFn(oldTree[i], i, oldTree.length)
      newTree.push(tempObj)
      if (oldTree[i].children) {
        changeTreeReturnTree(oldTree[i].children, (newTree[i].children = []), itemOpFn)
      }
    }
  }
  return newTree
}

/*
* 操作 Tree 或 List 返回 List
* @params tree：搜索树； newTree: 返回的新树，itemOpFn：操作树叶子的方法
* return List
* */
export function changeTreeReturnList (tree, itemOpFn) {
  const re = []

  function getId (t) {
    for (let i = 0; i < t.length; i++) {
      if (t[i] && t[i].children) {
        getId(t[i].children)
      }
      const temp = itemOpFn(t[i], i, t.length)
      if (temp) {
        re.push(temp)
      }
    }
  }
  if (tree && tree.length) {
    getId(tree)
  }
  return re
}

/*
* 操作 List 或 List 返回 List
* @params tree：搜索树； newTree: 返回的新树，itemOpFn：操作树叶子的方法
* return List
* */
export function changeListReturnList (list, itemOpFn) {
  const re = []

  function getId (t) {
    for (let i = 0; i < t.length; i++) {
      const temp = itemOpFn(t[i], i, t.length)
      if (temp) {
        re.push(temp)
      }
    }
  }
  if (list && list.length) {
    getId(list)
  }
  return re
}
