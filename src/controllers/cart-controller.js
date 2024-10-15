const { Cart } = require('../db');

const addToCartController = async (cartData) => {
  try {
    const [cartItem, created] = await Cart.findOrCreate({
      where: {
        id: cartData.id,
        productId: cartData.productId,
      },
      defaults: {
        quantity: cartData.quantity,
      },
    });

    if (!created) {
      cartItem.quantity += cartData.quantity;
      await cartItem.save();
    }

    return cartItem;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw new Error(`Error adding product to cart: ${error.message}`);
  }
};

const getCartItemsController = async () => {
  try {
    const cartItems = await Cart.findAll();
    return cartItems;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw new Error(`Error fetching cart items: ${error.message}`);
  }
};

const updateCartItemController = async (cartData, id) => {
  try {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) throw new Error('Cart item not found');

    cartItem.quantity = cartData.quantity;
    await cartItem.save();

    return cartItem;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};

const deleteCartItemController = async (id) => {
  try {
    const deleted = await Cart.destroy({ where: { id } });
    if (!deleted) throw new Error('Cart item not found');
    return { message: 'Cart item deleted successfully' };
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw new Error(`Error deleting cart item: ${error.message}`);
  }
};

const emptyCartController = async () => {
  try {
    await Cart.destroy({ where: {}, truncate: true });
    return { message: 'Cart emptied successfully' };
  } catch (error) {
    console.error('Error emptying the cart:', error);
    throw new Error(`Error emptying the cart: ${error.message}`);
  }
};

module.exports = {
  addToCartController,
  getCartItemsController,
  updateCartItemController,
  deleteCartItemController,
  emptyCartController,
};
