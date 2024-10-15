const { Router } = require('express');
const {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  emptyCart,
} = require('../handlers/cart-handler');

const cartRouter = Router();

cartRouter.post('/', addToCart);
cartRouter.get('/', getCartItems);
cartRouter.put('/:id', updateCartItem);
cartRouter.delete('/:id', deleteCartItem);
cartRouter.delete('/empty', emptyCart);

module.exports = cartRouter;
