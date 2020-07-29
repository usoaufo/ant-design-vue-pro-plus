const Item = {
  components: {},

  props: {
    text: [Object, Array, String, Number, Boolean],
    record: [Object, Array, String, Number, Boolean],
    index: [Number],
    item: [Array, Object]
  },

  data () {
    return {
      localItem: {}
    }
  },

  computed: {},

  watch: {
    actionOptions (val) {
      this.localActionOptions = val
    }
  },

  created () {
    this.localActionOptions = this.actionOptions
  },

  mounted () {},

  methods: {
    confirmClick () {
      this[`$${this.item.modeType}`](
        Object.assign(
          {},
          { ...this.item.option },
          {
            onOk: async () => {
              await this.item.click(this.text, this.record, this.index)
            }
          }
        )
      )
    },
    async localClick () {
      await this.item.click(this.text, this.record, this.index)
    }
  },

  render (h) {
    return h('a', { on: { click: this.item.modeType ? this.confirmClick : this.localClick } }, [this.item.text])
  }
}

const HTableColumnAction = {
  components: { Item },

  props: {
    actionOptions: Array,
    text: [Object, Array, String, Number, Boolean],
    record: [Object, Array, String, Number, Boolean],
    index: [String, Number]
  },

  data () {
    return {
      localActionOptions: []
    }
  },

  computed: {},

  watch: {
    actionOptions (val) {
      this.localActionOptions = val
    }
  },

  created () {
    this.localActionOptions = this.actionOptions
  },

  mounted () {},

  methods: {
    renderDivider () {
      return <a-divider type="vertical" />
    },
    renderAButton (createElement, item) {
      return createElement('Item', { props: { item, ...this.$props } }, [item.text])
    },
    renderItem (createElement, item, index) {
      return (
        <span>
          { item !== '' ? this.renderAButton(createElement, item) : '' }
          { item !== '' && (index + 1) !== this.localActionOptions.length ? this.renderDivider() : null}
        </span>
      )
    }
  },

  render (h) {
    return (
      <div class="h-button-group">
        {this.localActionOptions.map((item, index) => {
          return this.renderItem(h, item, index)
        })}
      </div>
    )
  }
}

export default HTableColumnAction
