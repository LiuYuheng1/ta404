<template>
  <div style="height: 100%;">
    <ta-border-layout>
      <div style="padding: 20px;">
        <!-- 步骤条 -->
        <ta-steps :current="current" labelPlacement="vertical">
          <ta-step 
            v-for="item in steps" 
            :key="item.title" 
            :title="item.title" 
            :subTitle="item.subTitle"
          />
        </ta-steps>

        <!-- 订单状态 -->
        <div class="order-status">
          <h3 class="status">当前订单状态：
            <span 
              v-text="orderStatus === '待收货' ? orderStatus + '（自动确认收货倒计时：1天02小时32分钟23秒）' : orderStatus"
            >
            </span>
          </h3>
          <p v-if="orderStatus === '待发货'">客户已付款，等待商家发货</p>
          <p v-else-if="orderStatus === '已退款'">订单已退款</p>
          <p v-else-if="orderStatus === '已完成'">客户确认收货，订单完成</p>
          <p v-else-if="orderStatus === '待收货'">调配药师审核发药 ，等待客户确认收货</p>

          <div class="status-btns" v-if="orderStatus !== '已退款' && orderStatus !== '已完成'">
            <ta-button class="status-btn" type="danger">提交退款</ta-button>
            <ta-button class="status-btn" type="success" v-if="orderStatus !== '待收货'">立即发货</ta-button>
            <ta-button class="status-btn" type="primary" v-if="orderStatus !== '待收货'">打印发货单</ta-button>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="detail">
          <ta-card title="退款信息" :bordered="false" v-if="orderStatus === '已退款'">
            <p>订单编号：{{detailInfo.orderId}}</p>
            <p>退款时间：2020-02-10 15:32:20</p>
            <p>订单总金额：￥{{detailInfo.orderAmount.toFixed(2)}}</p>
            <p>退款原因：药品快递错误</p>
            <p>退款金额：￥{{detailInfo.orderAmount.toFixed(2)}}</p>
            <p>退款路径：原路返回</p>
          </ta-card>
          <ta-card title="物流信息" :bordered="false">
            <p>配送方式：{{deliveryType}}</p>
            <p>物流公司：<a href="javascript:;">{{detailInfo.deliveryInfoInfoVo && detailInfo.deliveryInfoInfoVo.logisticsCompany || '立即发货'}}</a></p>
            <p>运单号：{{detailInfo.deliveryInfoInfoVo && detailInfo.deliveryInfoInfoVo.waybillNo || '-----'}}</p>
            <div class="logistics-btn">
              <ta-button type="primary" @click="handleQueryDelivery">查看物流</ta-button>
            </div>
          </ta-card>
          <ta-card title="订单信息" :bordered="false" class="detail-card">
            <p>收获地址：{{detailInfo.csrName}} 18888888888 {{detailInfo.address}}</p>
            <p>客户备注：{{detailInfo.remarks}}</p>
            <p>交易流水号：{{detailInfo.paymentTime}}</p>
            <p>支付方式：{{paymentType}}</p>
          </ta-card>
          <ta-card title="药品清单" :bordered="false" class="detail-card">
            <ta-big-table
              :data="medicineList"
            >
              <ta-big-table-column field="medicineId" title="药品编码" show-overflow></ta-big-table-column>
              <ta-big-table-column field="medicineName" title="药品通用名" show-overflow></ta-big-table-column>
              <ta-big-table-column field="specifications" title="规格" show-overflow></ta-big-table-column>
              <ta-big-table-column field="dosageForm" title="剂型"></ta-big-table-column>
              <ta-big-table-column field="unit" title="单位"></ta-big-table-column>
              <ta-big-table-column field="num" title="数量"></ta-big-table-column>
              <ta-big-table-column field="stock" title="库存"></ta-big-table-column>
              <ta-big-table-column field="price" title="售价">
                <template v-slot="{ row }">
                  ￥{{row.price.toFixed(2)}}
                </template>
              </ta-big-table-column>
              <template #bottomBar>
                <div class="medicine-total">
                  <p>订单药品金额：￥{{fnGetMedicinePrice()}}</p>
                  <p>订单配送费：￥{{(detailInfo.orderAmount - fnGetMedicinePrice()).toFixed(2)}}</p>
                  <p>订单总金额：￥{{detailInfo.orderAmount && detailInfo.orderAmount.toFixed(2) || ''}}</p>
                </div>
              </template>
            </ta-big-table>
          </ta-card>
        </div>
      </div>
    </ta-border-layout>
  </div>
</template>

<script>
export default {
  name: 'orderDetail',
  data() {
    return {
      orderId: '',
      detailInfo: {}, // 详细信息
      orderStatus: '', // 订单状态
      deliveryType: '', // 配送类型
      paymentType: '', // 支付方式
      medicineList: [], // 药品清单
      current: 1,
      steps: [{
        title: '药店接收订单',
        subTitle: '2022-1-1'
      }, {
        title: '调配药师审药发药',
        subTitle: '2022-1-1'
      }, {
        title: '客户确认收货',
        subTitle: '2022-1-1'
      }],
    }
  },
  created() {
    this.orderId = this.$route.query.orderId || ''
    this.fnQueryDetail()
  },
  mounted() {
  },
  methods: {
    fnQueryDetail() {
      Base.submit(null, {
        url: 'medicineOrderMg/getOrderDetail',
        data: {
          orderId: this.orderId,
        }
      }).then(data => {
        let result = data.data
        this.detailInfo = result.medicineOrderDetail || []
        this.medicineList = result.medicineOrderDetail ? result.medicineOrderDetail.medicineOrderList : []
        // 获取类型数据
        this.Base.asyncGetCodeData('ORDERSTATUS').then(res => {
          this.orderStatus = this.Base.getCodeLabel(
            res, 
            this.detailInfo.orderStatus
          );
        })
        this.Base.asyncGetCodeData('DELIVERYTYPE').then(res => {
          this.deliveryType = this.Base.getCodeLabel(
            res, 
            this.detailInfo.deliveryType
          );
        })
        this.Base.asyncGetCodeData('PAYMENTTYPE').then(res => {
          this.paymentType = this.Base.getCodeLabel(
            res, 
            this.detailInfo.paymentType
          );
        })
      })
    },
    // 查看物流
    handleQueryDelivery() {
      let deliveryInfoInfoVo = this.detailInfo.deliveryInfoInfoVo
      let waybillNo = deliveryInfoInfoVo ? deliveryInfoInfoVo.waybillNo : ''
      if(!waybillNo) {
        message.warn('未查询到物流信息')
        return
      }
      this.$router.push({
        name: 'deliveryInfo',
        query: {
          waybillNo
        }
      })
    },
    fnGetMedicinePrice() {
      let price = 0
      if(this.medicineList.length) {
        this.medicineList.forEach(item => {
          price += Math.floor(item.num * item.price * 100 / 100)
        })  
      }
      return price.toFixed(2)
    }
  }
}
</script>

<style scoped type="text/less" lang="less">
.order-status {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #000;

  .status {
    color: red;
  }

  .status-btns {
    margin-top: 20px;

    .status-btn {
      margin-right: 30px;
    }
  }
}

.detail {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #000;

  .detail-card {
    margin-top: 30px;
  }
}

/deep/ .ant-card-head-title {
  color: #1b65b9;
}

/deep/ .ant-steps-item-title {
  width: 128px;
}
</style>