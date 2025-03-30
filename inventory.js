const express = require('express');
const InventoryItem = require('./inventory_item');

const inventoryRouter = express.Router();

inventoryRouter.post('/add_item', async (req, res) => {
  const { itemName, itemQuantity, itemPrice } = req.body;
  try {
    const newItem = new InventoryItem({ itemName, itemQuantity, itemPrice });
    await newItem.save();
    res.status(201).json({ message: 'Item added to inventory successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to inventory' });
  }
});

inventoryRouter.get('/items', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory items' });
  }
});

inventoryRouter.put('/update_item/:id', async (req, res) => {
  const { itemName, itemQuantity, itemPrice } = req.body;
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, { itemName, itemQuantity, itemPrice }, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

inventoryRouter.delete('/delete_item/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted from inventory' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item from inventory' });
  }
});

module.exports = inventoryRouter;
