import moment from 'moment'
import D from 'ant-design-vue/es/date-picker/index'
export default {
  name: 'HDatePicker',

  components: {},

  props: Object.assign({}, D.props, {
    // eslint-disable-next-line vue/require-default-prop
    value: String,
    format: {
      type: [String, Array],
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    mode: {
      type: String,
      default: 'date'
    },
    showTime: {
      type: Boolean,
      default: true
    },
    showToday: {
      type: Boolean,
      default: true
    }
  }),

  data () {
    return {
      moment,
      time: null
    }
  },

  computed: {},

  watch: {
    value (val) {
      console.log(val)
      if (val && val !== '' && typeof val === 'string') {
        this.time = moment(val)
      } else {
        this.time = null
      }
    }
  },

  created () {
    if (this.value && this.value !== '' && typeof this.value === 'string') {
      this.time = moment(this.value)
    } else {
      this.time = null
    }
  },

  mounted () {},

  methods: {
    myChange (date, dateString) {
      console.log(date, dateString)
      this.$emit('change', dateString)
      this.$emit('input', dateString)
    },
    setTime (date) {
      this.time = moment(date)
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
        props.value = moment(props.value)
      } else if (!props[k] || JSON.stringify(props[k]).length === 2) {
        delete props[k]
      }
    })

    return (
      <div class="h-date-picker">
        <a-date-picker {...{ props }} vModel={this.time} style="width:100%" onChange={this.myChange} />
      </div>
    )
  }
}
