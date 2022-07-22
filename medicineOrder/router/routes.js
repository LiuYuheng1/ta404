import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import medicineOrderMg from '../modulePart/medicineOrder/routes'

const innerRoutes = [
  ...medicineOrderMg
]
// 导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })
    ),
  }
]
