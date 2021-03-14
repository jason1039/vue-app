import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: "Home",
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Customer',
    name: 'Customer',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Customer.vue'),
    redirect: "/Customer/Query",
    children: [{
      path: 'Query',
      name: 'QueryCustomer',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/QueryCustomer.vue')
    },
    {
      path: 'Add',
      name: 'AddCustomer',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/AddCustomer.vue')
    },
    {
      path: 'Edit/:customerid',
      name: 'EditCustomer',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/EditCustomer.vue')
    }]
  },
  {
    path: '/Product',
    name: "Product",
    component: () => import(/* webpackChunkName: "about" */ '../views/Product.vue'),
    redirect: "/Product/Add",
    children: [
      {
        path: "Add",
        name: "AddProduct",
        component: () => import(/* webpackChunkName: "about" */ '../views/AddProduct.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
