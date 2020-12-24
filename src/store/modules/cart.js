import shop from '../../api/shop'
import { CART, PRODUCTS } from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
//提交状态
const state = {
  items: [],
  checkoutStatus: null
}

// getters
//设置getters
const getters = {
  cartProducts: (state, getters, rootState) => {
    //获取state中的item并且进行遍历
    return state.items.map(({ id, quantity }) => {
    //找到rootState 公共store中products的all 是否有items中的id 如果有就直接返回一个新的对象，包含title,price,quantity三个字段
      const product = rootState.products.all.find(product => product.id === id)
      return {
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },
  
  cartTotalPrice: (state, getters) => {
    //获取getters中cartProducts的数据并进行rescue方法计算总价格
    return getters.cartProducts.reduce((total, product) => {
      //单价乘数量
      return total + product.price * product.quantity
    }, 0)
  }
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
    //暂存item数据
    const savedCartItems = [...state.items]
    //首先清空已经有的state
    commit(CART.SET_CHECKOUT_STATUS, null)
    //直接清空state中的items
    commit(CART.SET_CART_ITEMS, { items: [] })
    //调用接口中的购买接口，传入成功的cb以及失败的cb
    //如果成功了直接清空购物车的items
    //如果失败了返回错误信息，并且将暂存的数据重新赋值给items
    shop.buyProducts(
      products,
      () => commit(CART.SET_CHECKOUT_STATUS, 'successful'),
      () => {
        commit(CART.SET_CHECKOUT_STATUS, 'failed')
        // rollback to the cart saved before sending the request
        commit(CART.SET_CART_ITEMS, { items: savedCartItems })
      }
    )
  },
  
  addProductToCart ({ state, commit }, product) {
    commit(CART.SET_CHECKOUT_STATUS, null)
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        commit(CART.PUSH_PRODUCT_TO_CART, { id: product.id })
      } else {
        commit(CART.INCREMENT_ITEM_QUANTITY, cartItem)
      }
      // remove 1 item from stock
      commit(`products/${PRODUCTS.DECREMENT_PRODUCT_INVENTORY}`, { id: product.id }, { root: true })
    }
  }
}

// mutations
const mutations = {
  [CART.PUSH_PRODUCT_TO_CART] (state, { id }) {
    state.items.push({
      id,
      quantity: 1
    })
  },

  [CART.INCREMENT_ITEM_QUANTITY] (state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity++
  },

  [CART.SET_CART_ITEMS] (state, { items }) {
    state.items = items
  },

  [CART.SET_CHECKOUT_STATUS] (state, status) {
    state.checkoutStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
