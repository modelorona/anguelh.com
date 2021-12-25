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

  const navAbout = document.getElementById('nav-about');
  const navProjects = document.getElementById('nav-projects');

  const aboutDiv = document.getElementById('about');
  const projectsDiv = document.getElementById('projects');

  // const navMenu = document.getElementById('nav-menu');

  // not good for more than 2 nav menu options, but will address that when/if the need arises
  function navClickHandler(clicked, current, toShow, toHide) {
    clicked.classList.add('has-text-primary');
    current.classList.remove('has-text-primary');
    toHide.classList.add('is-hidden', 'is-invisible');
    toShow.classList.remove('is-hidden', 'is-invisible');
    // navMenu.classList.toggle('is-active');
  }

  navAbout.addEventListener('click', () => {
    navClickHandler(navAbout, navProjects, aboutDiv, projectsDiv);
  });

  navProjects.addEventListener('click', () => {
    navClickHandler(navProjects, navAbout, projectsDiv, aboutDiv);
  });
  
});
