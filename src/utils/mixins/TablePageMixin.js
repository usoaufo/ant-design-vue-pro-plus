import { HTable, HTableSearch, Ellipsis, HTableColumnAction, HButtonGroup } from '@/components'
export default {
  components: {
    HTable,
    Ellipsis,
    HTableSearch,
    HTableColumnAction,
    HButtonGroup
  },

  props: {},

  data () {
    return {
      dynamicComponent: null,
      dynamicComponentProps: {},
      dynamicComponentOn: {},
      dynamicComponentVisible: true,
      modular: this.$route.meta.modular,
      result: [],
      queryParam: {},
      columns: [],
      loadData: (parameter) => {
        return this.$https[this.modular].gets(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log(res)
          this.result = res
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },

  computed: {
    resultTotal: function () {
      return (this.result && this.result.meta && this.result.meta.pagination && this.result.meta.pagination.total) || 0
    }
  },

  watch: {},

  created () {},

  mounted () {
    console.log('TablePageMixin:route', this.$route)
  },

  methods: {
    restSearch () {
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
        this.restSelectedRow()
      })
    },
    search () {
      this.$nextTick(() => {
        this.$refs.table.refresh()
        this.restSelectedRow()
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      const rows =
        this.selectedRows && this.selectedRows.length > 0 ? [...selectedRows, ...this.selectedRows] : selectedRows
      const t = []
      for (let i = 0; i < rows.length; i++) {
        t[rows[i].id] = rows[i]
      }
      this.selectedRows = t.filter((item) => {
        return item && selectedRowKeys.includes(item.id)
      })
      console.log(this.selectedRowKeys, this.selectedRows)
    },
    restSelectedRow () {
      if (this.selectedRowKeys) {
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    }
  }
}
