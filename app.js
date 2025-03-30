document.getElementById('addItemBtn').addEventListener('click', function() {
    document.getElementById('addItemForm').style.display = 'block';
  });
  
  function closeAddItemForm() {
    document.getElementById('addItemForm').style.display = 'none';
  }
  
  document.getElementById('newItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemStatus = document.getElementById('itemStatus').value;
    const itemImage = document.getElementById('itemImage').value;
  
    fetch('/addItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName,
        itemQuantity,
        itemPrice,
        status: itemStatus,
        image: itemImage
      })
    })
    .then(response => response.json())
    .then(newItem => {
      location.reload();
    })
    .catch(error => console.error('Error:', error));
  });
  
  function editItem(itemId) {
    const itemName = prompt("Enter new item name:");
    const itemQuantity = prompt("Enter new item quantity:");
    const itemPrice = prompt("Enter new item price:");
    const status = prompt("Enter new item status (available/unavailable):");
    const image = prompt("Enter new item image URL:");
  
    fetch(`/editItem/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName,
        itemQuantity,
        itemPrice,
        status,
        image,
      }),
    })
    .then(response => response.json())
    .then(updatedItem => {
      console.log(updatedItem);
      location.reload();
    })
    .catch(error => console.error('Error:', error));
  }
  
  function changeStatus(itemId, newStatus) {
    fetch(`/changeStatus/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
    .then(response => response.json())
    .then(updatedItem => {
      console.log(updatedItem);
      location.reload();
    })
    .catch(error => console.error('Error:', error));
  }
  