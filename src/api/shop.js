/**
 * Mocking client-server processing
 */
const _products = [
  {"id": 1, "title": "华为 Mate 40 pro", "price": 5999, "inventory": 2},
  {"id": 2, "title": "小米 10", "price": 5999, "inventory": 0},
  {"id": 3, "title": "荣耀V10", "price": 2999, "inventory": 5},
  {"id": 4, "title": "苹果X", "price":9999, "inventory":2 }
]

export default {
  getProducts (cb,errorCb) {
    setTimeout(() => cb(_products), 100)},

  buyProducts (products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      Math.random() > 0.5
        ? cb()
        : errorCb()
    }, 100)
  }
}