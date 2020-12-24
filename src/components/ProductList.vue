<template>
  <ul>
    <li
      v-for="product in products" :key="product.id">
      {{ product.title }} - {{ product.price }}
      //减少值
      <button
      :disabled="product.canAdd == 0"
      @click="disCanNumber(product.id)"
      >-</button>
      //增加值
      <button
      :disabled="product.canAdd == product.inventory"
      @click="addCanNumber(product.id)"
      >+</button>
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        加入购物车
      </button>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    products: state => state.products.all,
  }),
  // computed: {
  //   products(){
  //     return this.$store.state.products.all
  //   }
  // },
  methods: mapActions('cart', [
    'addProductToCart'
  ]),
  // methods: {
  //   addProductToCart(product){
  //     this.$store.dispatch('cart/addProductToCart', product)
  //   }
  // },
  created () {
    this.$store.dispatch('products/getAllProducts')
  }
}
</script>
