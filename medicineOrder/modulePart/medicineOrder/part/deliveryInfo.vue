<template>
  <div style="height: 100%;">
    <ta-border-layout>
      <div class="content">
       <ta-card title="物流详情" :bordered="false">
        <ta-steps 
          :current="medicineOrderDetail.length" 
          direction="vertical" 
          progressDot 
          style="margin-top: 20px;"
        >
          <ta-step 
            v-for="item in medicineOrderDetail" 
            :key="item.deliveryDetailId" 
            :title="item.deliveryMatter" 
            :description="item.recordTime"
          />
        </ta-steps>
       </ta-card>
      </div>
    </ta-border-layout>
  </div>
</template>

<script>
export default {
  name: 'deliveryInfo',
  data() {
    return {
      waybillNo: '', // 物流单号
      medicineOrderDetail: [], // 物流详情列表
      current: 0,
    }
  },
  mounted() {
    this.waybillNo = this.$route.query.waybillNo
    console.log(this.waybillNo);
    this.fnQueryDeliveryInfo()
  },
  methods: {
    fnQueryDeliveryInfo() {
      Base.submit(null, {
        url: 'medicineOrderMg/getOrderDeliveryDetail',
        data: {
          waybillNo: this.waybillNo,
        }
      })
      .then(res => {
        let data = res.data
        this.medicineOrderDetail = data.medicineOrderDetail
      })
    }
  }
}
</script>

<style scoped type="text/less" lang="less">
.content {
  padding: 20px;
}

/deep/ .ant-card-head-title {
  color: #1b65b9;
}

/deep/ .ant-steps-item-content {
  width: 90% !important;
}
</style>