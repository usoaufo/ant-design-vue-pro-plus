<template>
  <div class="student-list">
    <a-card :bordered="false">
      <h-table-search :fields="fields" v-model="queryParam" @search="restSearch"/>
    </a-card>
    <a-card :bordered="false" style="margin-top: 24px;" >
      <!--<a-row
        :gutter="24"
        type="flex"
        justify="space-between"
        align="middle"
        style="margin-bottom: 24px; padding: 0 24px;"
      >
        <a-col >
          <h-button-group v-bind="{ options: buttonOptions, selectedRowKeys, selectedRows }"/>
        </a-col>
      </a-row>-->
      <h-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :buttonOptions="{ options: buttonOptions, selectedRowKeys, selectedRows }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <template slot="action" slot-scope="text, record, index">
          <h-table-column-action
            v-bind="{text,record,index}"
            :actionOptions="tableColumnActionOptions"
            @search="search"
          />
        </template>
      </h-table>
    </a-card>
  </div>
</template>

<script>
  import TablePageMixin from '@/utils/mixins/TablePageMixin'
  const statusMap = {
    0: {
      status: 'default',
      text: '关闭'
    },
    1: {
      status: 'processing',
      text: '运行中'
    },
    2: {
      status: 'success',
      text: '已上线'
    },
    3: {
      status: 'error',
      text: '异常'
    }
  }
  export default {
    name: 'StudentList',

    mixins: [TablePageMixin],

    components: {},

    props: {},

    data () {
      return {
        queryParam: {},
        fields: [
          {
            key: 'name',
            component: 'input',
            label: '学员名称'
          },
          {
            key: 'phone',
            component: 'input',
            label: '手机号码'
          },
          {
            key: 'status',
            component: 'select',
            label: '状态',
            options: [
              { value: '', label: '请选择' },
              { value: '1', label: '正常' },
              { value: '2', label: '错误' }
            ]
          },
          {
            key: 'aaa',
            component: 'select',
            label: '是否运行中',
            options: [
              { value: '', label: '请选择' },
              { value: '1', label: '是' },
              { value: '0', label: '否' }
            ]
          }
        ],
        buttonOptions: [
          {
            text: '添加',
            click: () => {
              this.$message.success('开发中，请不要着急！')
            }
          },
          {
            text: '批量导入',
            click: () => {
              this.$message.success('开发中，请不要着急！')
            }
          },
          {
            text: '导出当前结果',
            click: () => {
              this.$message.success('开发中，请不要着急！')
            }
          },
          {
            mode: 'tableBatchBtn',
            text: '批量删除',
            click: () => {
              this.$message.success('开发中，请不要着急！')
            }
          }
        ],
        columns: [
          {
            title: '#',
            dataIndex: 'serial',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '规则编号',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description',
            scopedSlots: { customRender: 'description' }
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 160,
            scopedSlots: { customRender: 'action' }
          }
        ],
        tableColumnActionOptions: [
          {
            text: '详情',
            click: (text, record, index) => {
              this.$message.success('开发中，请不要着急！')
            }
          },
          {
            text: '编辑',
            click: (text, record, index) => {
              // this.$refs.createStudentModal.edit({ id: record.id })
              this.$message.success('开发中，请不要着急！')
            }
          },
          {
            text: '删除',
            click: (text, record, index) => {
              this.$message.success('开发中，请不要着急！')
            },
            modeType: 'confirm',
            option: {
              title: '删除',
              content: '确认删除？'
            }
          }
        ]
      }
    },

    computed: {},

    watch: {},
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    created () {
    },

    mounted () {
    },

    methods: {
    }
  }
</script>

<style scoped lang="less">
  .student-list {
  }
</style>
