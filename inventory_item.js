const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  Item_Name: { type: String, required: true },
  Item_Quantity: { type: Number, required: true },
  Item_Price: { type: Number, required: true },
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
