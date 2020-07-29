import Vue from 'vue'
import service from './modular/service'
const modules = {
  service
}
Vue.prototype.$https = {}
Object.keys(modules).forEach((item) => {
  Vue.prototype.$https[`${item}`] = modules[item]
})
