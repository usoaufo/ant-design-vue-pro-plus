import L from 'ant-design-vue/es/list/index'

export default {
  data () {
    return {
      needTotalList: [],

      localSplit: this.split,

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination)
    }
  },
  props: Object.assign({}, L.props, {
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    showQuickJumper: {
      type: Boolean,
      default: true
    },
    split: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.pageURI &&
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNo: val
          })
        })
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created () {
    const { pageNo } = this.$route.params
    const localPageNum = (this.pageURI && pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination =
      (['auto', true].includes(this.showPagination) &&
        Object.assign({}, this.localPagination, {
          current: localPageNum,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          showQuickJumper: this.showQuickJumper,
          onChange: (page) => {
            this.localPagination.current = page
          },
          onShowSizeChange: (current, size) => {
            console.log(current, size)
          }
        })) ||
      false
    // console.log('this.localPagination', this.localPagination)
    // this.needTotalList = this.initTotalList(this.columns)
    this.loadData()
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign(
        {
          // *****************分页修改*****************
          page:
            (pagination && pagination.current) || (this.showPagination && this.localPagination.current) || this.pageNum,
          limit:
            (pagination && pagination.pageSize) ||
            (this.showPagination && this.localPagination.pageSize) ||
            this.pageSize
        },
        /*
       (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      } */
        // *****************排序修改   仅适用于服务端排序*****************
        (sorter &&
          sorter.field && {
            orderBy: sorter.field
          }) ||
          {},
        (sorter &&
          sorter.order && {
            orderType: sorter.order === 'ascend' ? 'asc' : 'desc'
          }) ||
          {},
        {
          ...filters
        }
      )
      // console.log('parameter', parameter)
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then((r) => {
          this.localPagination =
            (this.showPagination &&
              Object.assign({}, this.localPagination, {
                current: r.pageNo || r.meta.pagination.current_page, // 返回结果中的当前分页数
                total: r.totalCount || r.meta.pagination.total, // 返回结果中的总记录数
                showSizeChanger: this.showSizeChanger,
                pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize,
                showTotal: (total) => {
                  return `Total  ${total}`
                },
                onChange: (page, pageSize) => {
                  this.localPagination.current = page
                  this.localPagination.pageSize = pageSize
                  this.loadData()
                },
                onShowSizeChange: (current, size) => {
                  this.localPagination.current = current
                  this.localPagination.pageSize = size
                  this.loadData()
                }
              })) ||
            false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if (
              ['auto', true].includes(this.showPagination) &&
              r.totalCount <= r.pageNo * this.localPagination.pageSize
            ) {
              this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            this.localPagination = false
          }
          // console.log('loadData -> this.localPagination', this.localPagination)
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    }
    /* initTotalList(columns) {
      const totalList = []
      columns &&
        columns instanceof Array &&
        columns.forEach((column) => {
          if (column.needTotal) {
            totalList.push({
              ...column,
              total: 0
            })
          }
        })
      return totalList
    } */
  },

  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)
    // console.log(this.$props, localKeys)
    /*    const showAlert =
      (typeof this.alert === 'object' &&
        this.alert !== null &&
        this.alert.show &&
        typeof this.rowSelection.selectedRowKeys !== 'undefined') ||
      this.alert */

    Object.keys(L.props).forEach((k) => {
      // console.log(k)
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })

    const table = (
      <a-list {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}>
        {Object.keys(this.$slots).map((name) => (
          <template slot={name}>{this.$slots[name]}</template>
        ))}
      </a-list>
    )

    return <div class="list-wrapper">{table}</div>
  }
}
