import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import HButtonGroup from '@/components/Button/HButtonGroup'
import { changeListReturnList, changeTreeReturnList } from '@/utils/common/commonFn'

export default {
  components: { HButtonGroup },
  data () {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],
      localColumns: [],
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      localSize: this.size || 'default',
      localBordered: this.bordered,
      localScroll: this.scorll,
      /* 列选择 */
      selectedCheckedBoxKeys: [],
      TableColumnsAllChecked: false,
      TableColumnsAllCheckIndeterminate: false,
      isFullScreen: false

    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'key'
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
    bordered: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
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
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    buttonOptions: {
      type: Object,
      default: () => {
        return { options: [], selectedRowKeys: [], selectedRows: [] }
      }
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
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
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
    },
    size (val) {
      if (val) {
        this.localSize = val
      }
    },
    columns (val) {
      this.localColumns = val
    },
    localColumns (val) {
      this.selectedCheckedBoxKeys = changeTreeReturnList(val, (item) => {
        return item.dataIndex || item.key
      })
      this.TableColumnsAllCheckIndeterminate = !!this.selectedCheckedBoxKeys.length && this.selectedCheckedBoxKeys.length < this.columns.length
      this.TableColumnsAllChecked = this.selectedCheckedBoxKeys.length === this.columns.length
    }
  },
  created () {
    const { pageNo } = this.$route.params
    const localPageNum = (this.pageURI && (pageNo && parseInt(pageNo))) || this.pageNum
    this.localPagination =
      (['auto', true].includes(this.showPagination) &&
        Object.assign({}, this.localPagination, {
          current: localPageNum,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          showQuickJumper: this.showQuickJumper
        })) ||
      false
    // console.log('this.localPagination', this.localPagination)
    this.needTotalList = this.initTotalList(this.columns)
    this.localColumns = this.filterHidden(this.columns)
    this.selectedCheckedBoxKeys = changeTreeReturnList(this.localColumns, (item) => {
      return item.dataIndex || item.key
    })
    this.TableColumnsAllChecked = this.selectedCheckedBoxKeys.length === this.columns.length
    this.TableColumnsAllCheckIndeterminate = this.selectedCheckedBoxKeys && this.selectedCheckedBoxKeys.length < this.columns.length
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
      const parameter = Object.assign({
          pageNo: (pagination && pagination.current) ||
            this.showPagination && this.localPagination.current || this.pageNum,
          pageSize: (pagination && pagination.pageSize) ||
            this.showPagination && this.localPagination.pageSize || this.pageSize
        },
        (sorter && sorter.field && {
          sortField: sorter.field
        }) || {},
        (sorter && sorter.order && {
          sortOrder: sorter.order
        }) || {}, {
          ...filters
        }
      )
      // console.log('parameter', parameter)
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          this.localPagination =
            (this.showPagination &&
              Object.assign({}, this.localPagination, {
                current: r.pageNo, // 返回结果中的当前分页数
                total: r.totalCount, // 返回结果中的总记录数
                showSizeChanger: this.showSizeChanger,
                pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize
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
    },
    initTotalList (columns) {
      const totalList = []
      columns &&
      columns instanceof Array &&
      columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /* 修改columns数据 */
    changeColumns (columns) {
      const C = changeListReturnList(columns, (item) => {
        return Object.assign({}, item, { label: item.title, value: item.dataIndex || item.key })
      })
      return C
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a
          style="margin-left: 24px"
          onClick={() => {
            callback()
            this.clearSelected()
          }}
        >
          清空
        </a>
      )
    },
    renderAlert () {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map(item => {
        return (
          <span style="margin-right: 12px">
            {item.title}总计{' '}
            <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
        )
      })

      // 绘制 清空 按钮
      const clearItem =
        typeof this.alert.clear === 'boolean' && this.alert.clear
          ? this.renderClear(this.clearSelected)
          : this.alert !== null && typeof this.alert.clear === 'function'
            ? this.renderClear(this.alert.clear)
            : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">
              已选择: <a style="font-weight: 600">{this.selectedRows.length}</a>
            </span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    RenderToolbarTableBorder () {
      return (<a-tooltip placement="top">
        <template slot="title">
          <span>边框</span>
        </template>
        <a-button
          onClick={() => {
            this.localBordered = !this.localBordered
          } }
        > <a-icon type={this.localBordered ? 'table' : 'menu'} /></a-button>
      </a-tooltip>)
    },
    RenderToolbarTableSize () {
      const tableSize = [this.localSize]
      const S = (
        <a-dropdown>
          <a-tooltip placement="top">
            <template slot="title">
              <span>密度</span>
            </template>
            <a-button><a-icon type="column-height" /></a-button>
          </a-tooltip>
          <a-menu slot="overlay" selectedKeys={tableSize}>
            <a-menu-item key="default" onClick={() => { this.localSize = 'default' }}>
              默认
            </a-menu-item>
            <a-menu-item key="middle" onClick={() => { this.localSize = 'middle' }}>
             中等
            </a-menu-item>
            <a-menu-item key="small" onClick={() => { this.localSize = 'small' }}>
              紧凑
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      )
      return S
    },
    RenderToolbarRefresh () {
      return (
        <a-tooltip placement="top">
          <template slot="title">
            <span>刷新</span>
          </template>
          <a-button
            onClick={() => {
              this.refresh()
            } }
          > <a-icon type="sync" /></a-button>
        </a-tooltip>
      )
    },
    RenderFullScreen () {
      return (
        <a-tooltip placement="top">
          <template slot="title">
            <span>全屏</span>
          </template>
          <a-button
            onClick={this.changeScreen}
          > <a-icon type={this.isFullScreen ? 'fullscreen-exit' : 'fullscreen'} /></a-button>
        </a-tooltip>
      )
    },
    changeScreen () {
      // console.log(this.isFullScreen)
      if (this.isFullScreen) {

      } else {
      }
    },
    RenderTableColumnSettings () {
      /*
      visible={true}
       */
      const setting = (
        <a-popover placement="bottomRight" >
          <a-tooltip placement="top">
            <template slot="title">
              <span>列设置</span>
            </template>
            <a-button ><a-icon type="setting" /></a-button>
          </a-tooltip>
          <div slot="content" >
            <a-row>
              <a-col span={19}><a-checkbox
                onChange={this.onCheckAllChange}
                indeterminate={this.TableColumnsAllCheckIndeterminate}
                checked={this.TableColumnsAllChecked}
              >列展示</a-checkbox></a-col>
              <a-col span={5}><a onClick={this.localeColumnsRest} >重置</a></a-col>
            </a-row>
            <a-divider style="margin:8px 0"/>
            <a-checkbox-group vModel={this.selectedCheckedBoxKeys} onChange={this.changeLocaleColumns} >
              <div style="width:160px">
                {this.columns.map((item) => {
                  return (
                    <ColumnsCheckedBoxItem item={item}>
                    </ColumnsCheckedBoxItem>
                  )
                })}
              </div>
            </a-checkbox-group>
          </div>
        </a-popover>
      )

      return setting

      // 列设置
    },

    changeLocaleColumns (checkedList) {
      const tempColumns = changeListReturnList(this.columns, (item) => {
        if (checkedList.includes(item.dataIndex) || checkedList.includes(item.key)) {
          return item
        }
      })
      this.localColumns = tempColumns
    },
    onCheckAllChange (e) {
      // console.log(e)
      if (e.target.checked) {
        this.localColumns = this.columns
      } else {
        this.localColumns = []
      }
    },
    localeColumnsRest () {
      this.localColumns = this.filterHidden(this.columns)
    },
    filterHidden (columns) {
      return changeListReturnList(columns, (item) => {
        if (!item.hidden) return item
      })
    },
    RenderToolbar () {
      // 绘制表操作
      return (
        <a-row >
          <a-col md={18} >
            {this.buttonOptions.options.length > 0 ? this.renderButtonGroup() : null}
          </a-col>
          <a-col md={6} style="text-align :right">
            <a-button-group style="margin-bottom :16px">
              {this.RenderToolbarTableBorder()}
              {this.RenderToolbarTableSize()}
              {this.RenderToolbarRefresh()}
              {this.RenderTableColumnSettings()}
            </a-button-group>
          </a-col>
        </a-row>
      )
    },
    renderButtonGroup () {
      return (
        <h-button-group
          options={this.buttonOptions.options}
          selectedRowKeys={this.buttonOptions.selectedRowKeys}
          selectedRows={this.buttonOptions.selectedRows}
        />
      )
    }
  },

  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert =
      (typeof this.alert === 'object' &&
        this.alert !== null &&
        this.alert.show &&
        typeof this.rowSelection.selectedRowKeys !== 'undefined') ||
      this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      // console.log('Object.keys(T.props)', localKey, localKeys)
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          // console.log('this.rowSelection', this.rowSelection)
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    // const PROPS = Object.assign(props, this.tableProps)
    // console.log('HTable', ' props==>', props, 'PROPS==>', PROPS)
    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}>
        {Object.keys(this.$slots).map(name => (
          <template slot={name}>{this.$slots[name]}</template>
        ))}
      </a-table>
    )

    return (
      <div class="table-wrapper">
        {showAlert ? this.renderAlert() : null}
        {this.showToolbar ? this.RenderToolbar() : null}
        {table}
      </div>
    )
  }
}
const ColumnsCheckedBoxItem = {
  components: {},

  props: {
    item: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      isShow: false
    }
  },

  computed: {},

  watch: {},

  created () {},

  mounted () {},

  methods: {
    mouseover () {
      // this.isShow = false
    },
    mouseout () {
      // this.isShow = false
    }
  },

  render () {
    /* this.isShow ? 19 : */
    const item = (
      <a-row gutter={0} style="margin: 6px 0" >
        <a-col span={ 24} onMouseover={this.mouseover} onMouseout={this.mouseout}>
          <a-checkbox value={ this.item.dataIndex || this.item.key}>{this.item.title}</a-checkbox>
        </a-col>
        <a-col span={5} v-show={this.isShow} style="position: absolute;right: 0;">
          <div style="display: flex;align-items: center;justify-content: space-between;height: 21px">
            <a-icon type="pushpin" rotate={265}/>
            <a-icon type="pushpin" />
          </div>
        </a-col>
      </a-row>
    )
    return item
  }
}
