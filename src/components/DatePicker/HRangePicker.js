import moment from 'moment'
import D from 'ant-design-vue/es/date-picker/index'
export default {
  name: 'HRangePicker',

  components: {},

  props: Object.assign({}, D.props, {
    // eslint-disable-next-line vue/require-default-prop
    value: Array,
    format: {
      type: [String, Array],
      default: 'YYYY-MM-DD'
    },
    showTime: {
      type: Boolean,
      default: true
    },
    showToday: {
      type: Boolean,
      default: true
    },
    returnMode: {
      type: String,
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['string', 'array'].indexOf(value) !== -1
      },
      default: 'array'
    }
  }),

  data () {
    return {
      moment,
      time: undefined
    }
  },

  computed: {},

  watch: {
    value (val) {
      console.log('watch=>val', val)
      if (val && val !== '' && typeof val === 'string') {
        this.time = [moment(val[0]), moment(val[1])]
      } else if (val && val !== '' && typeof val === 'string') {
      } else {
        this.time = undefined
      }
    }
  },

  created () {},

  mounted () {},

  methods: {
    myChange (dates, dateStrings) {
      console.log('myChange', dates, dateStrings)
      // eslint-disable-next-line no-constant-condition
      this.$emit('change', dateStrings)
      this.$emit('input', dateStrings)
    },
    setTime (date) {
      this.time = [moment(date[0]), moment(date[1])]
    },
    getTime () {
      return this.time
    }
  },
  render () {
    const props = JSON.parse(JSON.stringify(this.$props))
    // console.log('HDataPicker  this.$props', this.$props)
    Object.keys(props).forEach((k) => {
      if (k === 'value' && typeof k === 'string' && props[k].length > 0) {
        props.value = [moment(props.value[0]), moment(props.value[1])]
      } else if (!props[k] || JSON.stringify(props[k]).length === 2) {
        delete props[k]
      }
    })

    return (
      <div class="h-date-picker">
        <a-range-picker {...{ props }} vModel={this.time} style="width:100%" onChange={this.myChange} />
      </div>
    )
  }
}
