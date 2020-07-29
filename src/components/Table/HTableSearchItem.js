import HServerSelect from '@/components/Select/HServerSelect'
import { HRangePicker } from '@/components'
export default {
  name: 'TableSearchItem',
  components: {
    HRangePicker,
    HServerSelect
  },
  props: {
    value: [String, Number, Array, Object],
    item: Object
  },
  data () {
    return {
      localValue: '',
      localItem: {},
      queryParams: {
        limit: 99
      },
      localOptions: [{ value: '', label: '请选择' }]
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    },
    localValue (val) {
      this.$emit('input', val)
    },
    item (val) {
      this.localItem = val
    }
  },
  created () {
    this.localValue = this.value
    this.localItem = this.item
  },
  methods: {
    localChange (e) {
      console.log(e)
    }
  },
  render () {
    if (this.item.component === 'select') {
      return (
        <a-select
          vModel={this.localValue}
          placeholder={this.item.placeholder || '请选择' + this.item.label}
          options={this.item.options}
        />
      )
    } else if (this.item.component === 'serverSelect') {
      return (
        <h-server-select
          vModel={this.localValue}
          placeholder={this.item.placeholder || '请选择' + this.item.label}
          modular={this.item.modular}
        />
      )
    } else if (this.item.component === 'input') {
      return <a-input vModel={this.localValue} placeholder={this.item.placeholder || '请输入' + this.item.label} />
    } else if (this.item.component === 'rangePicker') {
      return (
        <h-range-picker vModel={this.localValue} />
        /* placeholder={this.item.placeholder || '请输入' + this.item.label} */
      )
    }
  }
}
