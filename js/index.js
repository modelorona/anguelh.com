document.addEventListener('DOMContentLoaded', () => {
  
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
  
  const formModal = document.getElementById('form-modal');
  
  document.getElementById('toggle-form-modal').addEventListener('click', () => {
    formModal.classList.toggle('is-active');
  });
  
  document.getElementById('close-form-modal').addEventListener('click', () => {
    formModal.classList.toggle('is-active');
  });

  const navbarItems = document.querySelectorAll('a.navbar-item');
  const mainDivs = document.querySelectorAll('main.container > div');

  navbarItems.forEach(el => {
    el.addEventListener('click', () => {
      const divToShow = el.dataset.target;
      navbarItems.forEach(nI => nI.classList.remove('has-text-primary'));
      mainDivs.forEach(div => div.classList.add('is-hidden', 'is-invisible'));
      document.getElementById(divToShow).classList.remove('is-hidden', 'is-invisible');
      el.classList.add('has-text-primary');
    });
  });

  PDFObject.embed("../Anguel_Hristozov_Resume.pdf", "#resume-content");
});
