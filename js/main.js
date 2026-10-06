// Mobile nav toggle
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Gallery click-to-play
document.querySelectorAll('.gallery-item[data-video]').forEach(item => {
  const video = item.querySelector('video');
  item.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      item.classList.add('playing');
    } else {
      video.pause();
      item.classList.remove('playing');
    }
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
  });
});

// Contact form (sent via Web3Forms, delivered to Lex's email)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status = document.getElementById('formStatus');
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;

  const show = (msg, ok) => {
    status.textContent = msg;
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.textContent = 'Sending...';
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const data = await res.json();
      if (res.ok && data.success) {
        show("Thanks! Your message was sent. I'll get back to you soon.", true);
        contactForm.reset();
      } else {
        show('Something went wrong. Please call or text 859-640-6825 instead.', false);
      }
    } catch (err) {
      show('Could not send right now. Please call or text 859-640-6825 instead.', false);
    }
    btn.textContent = original;
    btn.disabled = false;
  });
}
