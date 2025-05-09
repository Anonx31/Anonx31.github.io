(function () {
  "use strict";

  /*Easy selector helper function*/
  const select = (el, all = false) => {
      el = el.trim()
      if (all) {
          return [...document.querySelectorAll(el)]
      } else {
          return document.querySelector(el)
      }
  }

  /*Easy event listener function*/
  const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
          if (all) {
              selectEl.forEach(e => e.addEventListener(type, listener))
          } else {
              selectEl.addEventListener(type, listener)
          }
      }
  }

  /*Easy on scroll event listener*/
  const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
  }

  /*Navbar links active state on scroll*/
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
          if (!navbarlink.hash) return
          let section = select(navbarlink.hash)
          if (!section) return
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
              navbarlink.classList.add('active')
          } else {
              navbarlink.classList.remove('active')
          }
      })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /*Scrolls to an element with header offset*/
  const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight

      if (!header.classList.contains('header-scrolled')) {
          offset -= 16
      }

      let elementPos = select(el).offsetTop
      window.scrollTo({
          top: elementPos - offset,
          behavior: 'smooth'
      })
  }

  /*Toggle .header-scrolled class to #header when page is scrolled*/
  let selectHeader = select('#header')
  if (selectHeader) {
      const headerScrolled = () => {
          if (window.scrollY > 100) {
              selectHeader.classList.add('header-scrolled')
          } else {
              selectHeader.classList.remove('header-scrolled')
          }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
  }

  /*Back to top button*/
  let backtotop = select('.back-to-top')
  if (backtotop) {
      const toggleBacktotop = () => {
          if (window.scrollY > 100) {
              backtotop.classList.add('active')
          } else {
              backtotop.classList.remove('active')
          }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
  }

  /*Mobile nav toggle*/
  on('click', '.mobile-nav-toggle', function (e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
  })

  /*Mobile nav dropdowns activate*/
  on('click', '.navbar .dropdown > a', function (e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
          e.preventDefault()
          this.nextElementSibling.classList.toggle('dropdown-active')
      }
  }, true)

  /*Scrool with ofset on links with a class name .scrollto*/
  on('click', '.scrollto', function (e) {
      if (select(this.hash)) {
          e.preventDefault()

          let navbar = select('#navbar')
          if (navbar.classList.contains('navbar-mobile')) {
              navbar.classList.remove('navbar-mobile')
              let navbarToggle = select('.mobile-nav-toggle')
              navbarToggle.classList.toggle('bi-list')
              navbarToggle.classList.toggle('bi-x')
          }
          scrollto(this.hash)
      }
  }, true)

  /*Scroll with ofset on page load with hash links in the url*/
  window.addEventListener('load', () => {
      if (window.location.hash) {
          if (select(window.location.hash)) {
              scrollto(window.location.hash)
          }
      }
  });

  

  /*Initiate portfolio lightbox*/
  const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
  });

  /*Initiate Pure Counter*/
  new PureCounter();

})()


// Function to open the modal
function openModal1(blogId) {
  const modal = document.getElementById('modal');
  const blog = blogs[blogId]; // Access the blog data from the external blogs.js file

  document.getElementById('modal-title').textContent = blog.title;
  document.getElementById('modal-date').textContent = blog.date;
  document.getElementById('modal-body').innerHTML = blog.content;

  modal.style.display = "flex";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = "none";
}

// Close modal if user clicks outside the modal content
window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
};

// TextScramble


class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

// Example

const phrases = [
  'a programmer,',
  'cybersecurity enthusiast,',
  'an open source learner,',
  'a web developer,',
  'a problem handler,',
  'a computer geek.',
]

const el = document.querySelector('.text')
const fx = new TextScramble(el)

let counter = 0
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800)
  })
  counter = (counter + 1) % phrases.length
}
// Certificate Images
const certificateImages = {
  cisco: 'assets/images/cisco.png',
ehe: 'assets/images/ehe.png',
nde: 'assets/images/nde.png',
tcs: 'assets/images/tcs.png',
mastercard: 'assets/images/mastercard.png',
freecodecamp: 'assets/images/freecodecamp.png',
css: 'assets/images/css.png',
sql: 'assets/images/sql.png',
wogleTech: 'assets/images/wogleTech.png'

};

// Open Modal Function
function openModal(certId) {
  const modal = document.getElementById('modal');
  const img = document.getElementById('modal-img');
  img.src = certificateImages[certId];
  modal.style.display = "flex";
}

// Close Modal Function
function closeModal() {
  document.getElementById('modal').style.display = "none";
}

// Close modal if user clicks outside the content
window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) closeModal();
};

next()

