document.getElementById('login_btn').addEventListener('click', () => {
    window.location.href = '/auth/google';
  });
  
  const edit_btns = document.querySelectorAll('.edit_btn');
  edit_btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const options = e.target.nextElementSibling;
      options.style.display = options.style.display === 'none' ? 'flex' : 'none';
    });
  });
  
  const change_status_btns = document.querySelectorAll('.change_status');
  change_status_btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const status = e.target.closest('.inventory_cube').querySelector('.status');
      if (status.classList.contains('available')) {
        status.classList.remove('available');
        status.classList.add('unavailable');
        status.textContent = 'Unavailable';
      } else {
        status.classList.remove('unavailable');
        status.classList.add('available');
        status.textContent = 'Available';
      }
    });
  });
  
  const delete_btns = document.querySelectorAll('.delete_item');
  delete_btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cube = e.target.closest('.inventory_cube');
      cube.remove();
    });
  });
  