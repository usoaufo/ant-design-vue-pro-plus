import S from 'ant-design-vue/es/select/index'

import DeepClone from 'lodash.clonedeep'
import { Debounce } from '@/utils/FnUtils'

export default {
  name: 'HModularServerSelect',

  components: {},

  props: Object.assign({}, S.props, {
    value: [String, Number, Array],
    modular: {
      type: String,
      required: true
    },
    remoteSearch: {
      type: Boolean,
      default: false
    },
    searchJoin: {
      type: String,
      default: () => {
        return 'or'
      }
    },
    getData: Function,
    selectOptionRender: Function
  }),

  data () {
    return {
      selectValue: '',
      queryParam: {
        limit: 99,
        searchJoin: this.searchJoin
      },
      localOptions: [],
      aSpinLoading: false,
      aSpinTip: '',
      beforeSearchData: []
    }
  },

  computed: {},

  watch: {
    value (val) {
      if (val) {
        this.selectValue = typeof (val * 1) === 'number' ? val * 1 : val
      } else {
        this.selectValue = val
      }
    }
  },

  created () {
    if (this.value) {
      this.selectValue = typeof (this.value * 1) === 'number' ? this.value * 1 : this.value
    } else {
      this.selectValue = this.value
    }
    if (this.remoteSearch) {
      this.queryParam = Object.assign({}, this.queryParam, this.$modular[this.modular].ServerSelectSearch)
    }
  },

  mounted () {
    if (this.modular) {
      this.httpsGet()
    }
  },

  methods: {
    debounceGets: Debounce(async function () {
      this.httpsGet()
    }, 500),
    async httpsGet () {
      const res = this.getData
        ? await this.getData(this.queryParam)
        : await this.$https[this.modular].gets(this.queryParam)
      this.aSpinLoading = false
      if (res) {
        // const o = handleResponse[this.modular].changeToSelect(res.data)
        const o = this.$modular[this.modular].changeToSelect(res.data)
        this.localOptions = [{ value: '', label: '请选择' }, ...o]
      } else {
        this.localOptions = []
      }
    },
    myChange (value, option) {
      this.selectValue = value
      this.$emit(
        'change',
        value,
        this.localOptions.filter((item) => {
          return item.value === value
        })[0],
        this.localOptions
      )
      this.$emit('input', value)
    },
    mySearch (value) {
      // console.log(value)
      if (value) {
        this.aSpinLoading = true
        this.aSpinTip = '搜索中...'
        // this.beforeSearchData = DeepClone(this.localOptions)
        this.localOptions = []
        if (!this.queryParam.search || typeof this.queryParam.search === 'string') {
          // this.$set(this.queryParam, 'search', SEARCH_CONFIG[this.modular].search)
          this.$set(this.queryParam, 'search', this.$modular[this.modular].ServerSelectSearch.search)
        }
        // SEARCH_CONFIG[this.modular].
        Object.keys(this.$modular[this.modular].ServerSelectSearch.search).map((item) => {
          this.$set(this.queryParam.search, item, value)
        })
        this.debounceGets()
      } else {
        this.aSpinTip = '重新加载...'
        this.$set(this.queryParam, 'search', {})
        this.debounceGets()
      }
    },
    refresh () {
      this.queryParam.search = {}
      this.aSpinLoading = true
      this.aSpinTip = '重新加载...'
      this.debounceGets()
    }
  },
  render (h) {
    const props = DeepClone(this.$props)
    // const localKeys = Object.keys(this.$data)
    Object.keys(props).forEach((k) => {
      if (k === 'options') {
        // props[k] = this.localOptions
        delete props[k]
      } else if (!props[k] && k !== 'value') {
        delete props[k]
      }
    })
    if (this.remoteSearch) {
      props.showSearch = true
      props.filterOption = null
      props.allowClear = true
    }
    return (
      <a-select
        {...{ props, scopedSlots: { ...this.$scopedSlots } }}
        onChange={this.myChange}
        onSearch={this.mySearch}
        style="width:100%"
        class="h-server-select"
      >
        {this.aSpinLoading ? (
          <div style="text-align: center;" slot="notFoundContent">
            <a-spin size="small" tip={this.aSpinTip} />
          </div>
        ) : null}
        <a-tooltip placement="top" slot="clearIcon">
          <template slot="title">
            <span>重置数据</span>
          </template>
          <a-icon color="#999" type="reload" onClick={this.refresh} />
        </a-tooltip>
        {Object.keys(this.$slots).map((name) => (
          <template slot={name}>{this.$slots[name]}</template>
        ))}
        {this.localOptions.map((item) => {
          return (
            <a-select-option value={item.value}>
              {this.selectOptionRender ? this.selectOptionRender(h, item) : <slot name="label">{item.label} </slot>}
            </a-select-option>
          )
        })}
      </a-select>
    )
  }
}
