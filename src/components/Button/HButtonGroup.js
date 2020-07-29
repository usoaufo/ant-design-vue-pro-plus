const HButtonGroupItem = {
  name: 'HButtonGroupItem',

  components: {},

  props: {
    options: Array,
    context: Object,
    selectedRowKeys: Array,
    selectedRows: Array,
    parameter: [Object, Array, String, Number, Boolean]
  },

  data () {
    return {
      localContext: []
    }
  },

  computed: {},

  watch: {
    options (val) {
      this.localContext = val
    }
  },

  created () {
    this.localContext = this.context
  },

  mounted () {},

  methods: {
    batchClick () {
      const { selectedRowKeys, localContext } = this
      if (selectedRowKeys) {
        if (selectedRowKeys.length > 0) {
          this.$confirm({
            title: '警告',
            content: `真的要 ${localContext.text} 这些数据吗?`,
            okText: localContext.text,
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              console.log('ok')
              localContext.click(this.parameter)
            },
            onCancel () {}
          })
        } else {
          this.$message.warn(`请选择需要 ${localContext.text} 的数据`)
        }
      } else {
        console.error('请传入‘selectedRowKeys’')
      }
    },
    async localClick () {
      await this.context.click(this.parameter)
    }
  },

  render (h) {
    return h(
      'a-button',
      {
        on: {
          click:
            this.localContext.mode && this.localContext.mode === 'tableBatchBtn' ? this.batchClick : this.localClick
        },
        props: { icon: this.localContext.icon || '', type: this.localContext.type || '' }
      },
      [this.localContext.text]
    )
  }
}

export default {
  name: 'HButtonGroup',

  components: { HButtonGroupItem },

  props: {
    options: Array,
    selectedRowKeys: Array,
    selectedRows: Array,
    parameter: [Object, Array, String, Number, Boolean]
  },

  data () {
    return {
      localOptions: []
    }
  },

  computed: {},

  watch: {
    options (val) {
      this.localOptions = val
    }
  },

  created () {
    this.localOptions = this.options
  },

  mounted () {},

  methods: {
    renderButton (createElement, context) {
      const props = Object.assign({}, this.$props, { context })
      return <h-button-group-item {...{ props }} />
    }
  },

  render (h) {
    return (
      <div class="h-button-group">
        {this.localOptions.map((item) => {
          return this.renderButton(h, item)
        })}
      </div>
    )
  }
}
