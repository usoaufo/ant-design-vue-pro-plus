import Vue from 'vue'

const modules = {

}

Vue.prototype.$modular = {}
Object.keys(modules).forEach((item) => {
  Vue.prototype.$modular[`${item}`] = modules[item]
})
