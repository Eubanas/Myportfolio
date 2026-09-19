const navToggle=document.querySelector('.nav-toggle');
const navMenu=document.querySelector('.nav-menu');
const navLinks=document.querySelectorAll('.nav-link');

if(navToggle&&navMenu){
  navToggle.addEventListener('click',()=>{
    const open=navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open',open);
    navToggle.setAttribute('aria-expanded',String(open));
  });

  navLinks.forEach(link=>link.addEventListener('click',()=>{
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded','false');
  }));
}

const sections=document.querySelectorAll('main section[id]');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    });
  },{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(section=>observer.observe(section));
}
