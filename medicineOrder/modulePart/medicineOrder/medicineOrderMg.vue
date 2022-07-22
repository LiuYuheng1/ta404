<template>
  <div style="height: 100%;">
    <ta-border-layout layout-type="fixTop">
      <div slot="header" class="header">
        <ta-form layout="horizontal" :form-layout="true" :auto-form-create="form => this.form1 = form">
          <ta-row>
            <ta-col :span="6">
              <ta-form-item 
                label="处方号" 
                field-decorator-id="rxId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
                style="width: 100%;"
              >
                <ta-input allowClear style="width: 80%;" />
              </ta-form-item>
            </ta-col>
            <ta-col :span="6">
              <ta-form-item 
                label="客户姓名" 
                field-decorator-id="csrName"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
                style="width: 100%;"
              >
                <ta-input allowClear style="width: 80%;"/>
              </ta-form-item>
            </ta-col>
            <ta-col :span="2">
              <ta-button 
                type="primary" 
                style="float: right; margin-right: 10px;"
                @click="handleSearch"
              >
                查询
              </ta-button>
            </ta-col>
            <ta-col :span="10">
              <ta-search-panel id="complexForm" :form="complexForm" :width="500" :height="250" @search="handleSearch">
                <ta-button slot="target">
                  高级搜索
                </ta-button>
                <div slot="formPanel">
                  <ta-form :auto-form-create="(form)=>{this.complexForm = form}" :form-layout="true" :col="1" label-width="100px">
                    <ta-form-item label="订单号" field-decorator-id="orderId">
                      <ta-input />
                    </ta-form-item>
                    <ta-form-item label="订单状态" field-decorator-id="orderStatus">
                      <ta-select class="full-width" collection-type="ORDERSTATUS">
                      </ta-select>
                    </ta-form-item>
                    <ta-form-item label="日期选择" field-decorator-id="datePicker">
                      <ta-range-picker class="full-width" />
                    </ta-form-item>
                  </ta-form>
                </div>
              </ta-search-panel>
            </ta-col>
          </ta-row>
        </ta-form>
      </div>
      <ta-card title="全部订单">
        <ta-big-table
          border
          :data="tableData"
        >
          <ta-big-table-column type="seq" title="ID" width="50"></ta-big-table-column>
          <ta-big-table-column field="orderId" title="订单号" show-overflow></ta-big-table-column>
          <ta-big-table-column field="rxId" title="处方号" show-overflow></ta-big-table-column>
          <ta-big-table-column field="csrName" title="客户姓名"></ta-big-table-column>
          <ta-big-table-column field="orderAmount" title="订单金额"></ta-big-table-column>
          <ta-big-table-column field="paymentType" title="支付方式" collection-type="PAYMENTTYPE"></ta-big-table-column>
          <ta-big-table-column field="paymentTime" title="支付时间" show-overflow></ta-big-table-column>
          <ta-big-table-column field="orderOrigin" title="订单来源" collection-type="ORDERORIGN"></ta-big-table-column>
          <ta-big-table-column field="deliveryType" title="配送类型" collection-type="DELIVERYTYPE"></ta-big-table-column>
          <ta-big-table-column field="orderStatus" title="订单状态" width="80">
            <template v-slot="{ row }">
              <ta-tag-group 
                :color="colorList[row.orderStatus - 1] || 'gray'" 
                collection-type="ORDERSTATUS" 
                :collectionFilter="row.orderStatus + ','" 
                :reverseFilter="true"
              >
                {{ row.orderStatus }}
              </ta-tag-group>
            </template>
          </ta-big-table-column>
          <ta-big-table-column
            fixed="right"
            field="operate"
            title="操作"
            width="200">
            <span slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :rowInfo="rowInfo"/>
            </span>
          </ta-big-table-column>
          <template #bottomBar>
            <ta-pagination
              ref="gridPager"
              style="text-align: right;margin-top: 10px"
              :data-source.sync="tableData"
              url="medicineOrderMg/queryMedicineOrderInfoInfoPage"
              :params="pageParams"
            />
          </template>
        </ta-big-table>
      </ta-card>
    </ta-border-layout>
  </div>
</template>

<script>

export default {
  name: 'medicineOrderMg',
  data () {
    return {
      complexForm: null,
      tableData: [{id: 0}], // 表格数据
      // 操作列
			operateMenu: [
				{
					name: '查看订单',
          style: {
            border: '1px solid #DCDFE6',
            padding: '6px 15px',
            borderRadius: '4px',
          },
					onClick: (record, index) => {
            this.$router.push({
              name: 'orderDetail',
              query: {
                orderId: record.orderId
              }
            })
					},
				}
			],
      colorList: ['pink', 'red', 'green', 'orange'],
    }
  },
  mounted() {
    this.fnSearchList()
  },
  methods: {
    pageParams() {
      let formData = this.form1.getFieldsValue()
      if(this.complexForm) {
        let highFormData = this.complexForm.getFieldsValue()
        console.log(highFormData);
        highFormData.paymentTimeBefore =  highFormData.datePicker ? highFormData.datePicker[0].format('YYYY-MM-DD') : undefined
        highFormData.paymentTimeAfter =  highFormData.datePicker ? highFormData.datePicker[1].format('YYYY-MM-DD') : undefined
        formData = {
          ...formData,
          ...highFormData,
        }
      }
      return formData
    },

    fnSearchList() {
      this.$refs.gridPager.loadData()
    },

    // 普通查询
    handleSearch() {
      this.fnSearchList()
    },
  },
}
</script>

<style scoped type="text/less" lang="less">
.header {
  box-sizing: border-box;
  height: 70px;
  padding-top: 19px;
  overflow: hidden;
}

/deep/ .ant-card-head-title {
  color: #1b65b9;
}
</style>
