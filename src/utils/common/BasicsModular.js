import Vue from 'vue'
export default class BasicsModular {
  constructor (key, label) {
    this.keyName = key || 'id'
    this.labelName = label || 'name'
    // select搜索字段
    this.ServerSelectSearch = {
      keyword: null
    }
    // 添加编辑用的字段
    this.createField = []
  }
  // 异步组件
  asyncComponent () {
    Vue.$message.success('不要着急……开发中……')
  }
  // 转换至select组件
  toSelect (arr) {
    if (arr && arr.length) {
      return arr.map((item) => {
        return Object.assign({}, { ...item }, { value: item[`${this.keyName}`], label: item[`${this.labelName}`] })
      })
    }
  }
}
