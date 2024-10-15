const {
  addToCartController,
  getCartItemsController,
  updateCartItemController,
  deleteCartItemController,
  emptyCartController,
} = require('../controllers/cart-controller');

const addToCart = async (req, res) => {
  try {
    const cartData = req.body;
    const response = await addToCartController(cartData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const response = await getCartItemsController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cartData = req.body;
    const response = await updateCartItemController(cartData, id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCartItemController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    const response = await emptyCartController();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
  emptyCart,
};
