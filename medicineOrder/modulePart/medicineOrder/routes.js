// 导出该模块路由
export default [
  {
    title: '药品订单管理',
    name: 'medicineOrderMg',
    path: 'medicineOrderMg',
    component: () => import(/* webpackChunkName: "routes/workTablePage/modulePart1" */'./medicineOrderMg.vue'),
  },
  {
    title: '药品订单详情',
    name: 'orderDetail',
    path: 'orderDetail',
    component: () => import(/* webpackChunkName: "routes/workTablePage/modulePart1" */'./part/orderDetail.vue'),
  },
  {
    title: '物流信息',
    name: 'deliveryInfo',
    path: 'deliveryInfo',
    component: () => import(/* webpackChunkName: "routes/workTablePage/modulePart1" */'./part/deliveryInfo.vue'),
  },
]
