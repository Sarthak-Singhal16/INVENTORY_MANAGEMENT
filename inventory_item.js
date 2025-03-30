const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemQuantity: { type: Number, required: true },
  itemPrice: { type: Number, required: true },
  status: { type: String, default: 'available' },
  image: { type: String, default: 'item.jpg' },
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
