<template>
  <div class="student-list">
    <a-card :bordered="false">
      <h-table-search :fields="fields" v-model="queryParam" @search="restSearch"/>
    </a-card>
    <a-card :bordered="false" style="margin-top: 24px;" :bodyStyle="{ paddingLeft: '0', paddingRight: '0' }">
      <a-row
        :gutter="24"
        type="flex"
        justify="space-between"
        align="middle"
        style="margin-bottom: 24px; padding: 0 24px;"
      >
        <a-col> 当前共计：{{ resultTotal }} 名学员</a-col>
        <a-col style="text-align: right;">
          <h-button-group v-bind="{ options: buttonOptions, selectedRowKeys, selectedRows }"/>
        </a-col>
      </a-row>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="contacts" slot-scope="text"> {{ text[0].phone }} ( {{ text[0].relations }} )</template>
        <template slot="action" slot-scope="text, record, index">
          <h-table-column-action
            v-bind="{text,record,index}"
            :actionOptions="tableColumnActionOptions"
            @search="search"
          />
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
  import TablePageMixin from '@/utils/mixins/TablePageMixin'

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
            label: '学员状态',
            options: [
              { value: '', label: '请选择' },
              { value: '1', label: '在读中' },
              { value: '2', label: '已结课' },
              { value: '3', label: '未报名' }
            ]
          },
          {
            key: 'aaa',
            component: 'select',
            label: '是否关注公众号',
            options: [
              { value: '', label: '请选择' },
              { value: '1', label: '是' },
              { value: '0', label: '否' }
            ]
          }
        ],
        buttonOptions: [
          {
            text: '添加学员',
            click: () => {
              this.dynamicComponentProps = {
                args: { title: '添加学员' }
              }
              try {
                this.dynamicComponent = this.$modular.student.asyncComponent()
                this.dynamicComponentVisible = true
              } catch (e) {
                this.$message.error('失败请重试！')
              }
              // this.$refs.createStudentModal.add()
              // this.$modular.student.creatStudent()
            }
          },
          {
            text: '批量导入',
            click: () => {
              this.$message.success('成功')
            }
          },
          {
            text: '导出当前结果',
            click: () => {
              this.$message.success('成功')
            }
          },
          {
            mode: 'tableBatchBtn',
            text: '批量删除',
            click: () => {
              this.$message.success('成功')
            }
          }
        ],
        columns: [
          // {'checked'},
          {
            title: '学员姓名',
            dataIndex: 'name'
          },
          {
            title: '性别',
            dataIndex: 'gender'
          },
          {
            title: '手机号码',
            dataIndex: 'contacts',
            scopedSlots: { customRender: 'contacts' }
          },
          {
            title: '公众号关注',
            dataIndex: 'unview_users_count'
          },
          {
            title: '学员状态',
            dataIndex: 'status',
            customRender: function (text) {
              let status
              switch (text * 1) {
                case 1:
                  status = '在读'
                  break
                case 2:
                  status = '已结课'
                  break
                default:
                  status = '未报名'
              }
              return status
            }
          },
          {
            title: '课程数'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '220px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        tableColumnActionOptions: [
          {
            text: '报名',
            click: (text, record) => {
              this.$router.push({ name: 'RegistrationOrRenewal', params: { id: record.id } })
            }
          },
          {
            text: '详情',
            click: (text, record, index) => {
              this.$router.push({ name: 'StudentDetails', params: { id: record.id } })
            }
          },
          {
            text: '编辑',
            click: (text, record, index) => {
              // this.$refs.createStudentModal.edit({ id: record.id })
              this.dynamicComponentProps = {
                id: record.id
              }
              try {
                this.dynamicComponent = this.$modular.student.asyncComponent()
                this.dynamicComponentVisible = true
              } catch (e) {
                this.$message.error('失败请重试！')
              }
            }
          },
          {
            text: '删除',
            click: (text, record, index) => {
            },
            modeType: 'confirm',
            option: {
              title: '删除',
              content: '删除后与学员相关的记录都将删除，并且无法恢复，确定删除该学员？'
            }
          }
        ]
      }
    },

    computed: {},

    watch: {},

    created () {
    },

    mounted () {
    },

    methods: {
      handleApply () {
      },
      handleDetails () {
      },
      handleEdit () {
      },
      handleDelete () {
      }
    }
  }
</script>

<style scoped lang="less">
  .student-list {
  }
</style>
