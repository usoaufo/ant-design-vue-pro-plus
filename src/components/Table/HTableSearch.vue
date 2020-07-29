<template>
  <div class="table-search table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col
          :md="itemMd"
          :style="itemMd * fields.length + 3 > 24 ? { marginBottom: '24px' } : ''"
          :sm="24"
          v-for="(item, index) in fields"
          :key="index"
        >
          <a-form-item :label="item.label" style="margin-bottom: 0">
            <table-search-item :item="item" v-model="search[item.key]" style="width:100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="btnMd" :sm="24">
          <span class="table-page-search-submitButtons" style="margin-bottom: 0">
            <a-button type="primary" @click="emitSearch()">
              查询
            </a-button>
            <a-button style="margin-left: 8px;" @click="restQueryParams()"> 重置 </a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import TableSearchItem from '@/components/Table/HTableSearchItem'

export default {
  name: 'HTableSearch',

  components: {
    TableSearchItem
  },

  props: {
    value: Object,
    fields: Array,
    itemMd: {
      type: Number,
      default: 5
    },
    btnMd: {
      type: Number,
      default: 3
    }
  },

  data () {
    return {
      search: {},
      queryParams: {},
      localFields: []
    }
  },

  computed: {},

  watch: {
    value (val) {
      this.queryParams = val
    },
    fields (val) {
      this.localFields = val
    },
    search: {
      deep: true,
      handler (newVal, oldVal) {
        this.$set(this.queryParams, 'search', Object.assign({}, this.queryParams.search, newVal))
        this.$emit('input', this.queryParams)
      }
    }
  },

  created () {
    this.localFields = this.fields
    this.queryParams = this.value
  },

  mounted () {},

  methods: {
    emitSearch () {
      // console.log('emitSearch=>click')
      this.$emit('search')
    },
    restQueryParams () {
      this.search = {}
      this.emitSearch()
      // this.$delete(this.queryParams, 'search')
    }
  }
}
</script>

<style scoped lang="less">
.table-search {
}
</style>
