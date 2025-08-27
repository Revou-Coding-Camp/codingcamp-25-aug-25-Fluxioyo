// Utility: qs
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Mobile nav toggle
(function navToggle(){
  const btn = $('.nav-toggle');
  const nav = $('.nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isVisible = nav.classList.contains('show');
    nav.classList.toggle('show');
    btn.setAttribute('aria-expanded', String(!isVisible));
  });
})();

// Welcome name persistence
(function welcomeName(){
  const title = $('#welcomeTitle');
  const form = $('#nameForm');
  const input = $('#displayName');
  const clearBtn = $('#clearName');
  if(!title || !form) return;

  function applyName(name){
    const trimmed = (name || '').trim();
    title.textContent = trimmed ? `Hi ${trimmed}, Welcome To Website` : 'Hi there, Welcome To Website';
  }

  // load from localStorage
  applyName(localStorage.getItem('rw:name'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if(name){
      localStorage.setItem('rw:name', name);
    }
    applyName(name);
  });
  clearBtn?.addEventListener('click', () => {
    localStorage.removeItem('rw:name');
    input.value = '';
    applyName('');
  });
})();

// Contact form validation and preview
(function contactForm(){
  const form = $('#contactForm');
  if(!form) return;
  const fields = {
    name: $('#name'),
    email: $('#email'),
    phone: $('#phone'),
    message: $('#message')
  };
  const errors = {
    name: $('[data-for="name"]'),
    email: $('[data-for="email"]'),
    phone: $('[data-for="phone"]'),
    message: $('[data-for="message"]')
  };

  const preview = {
    time: $('#pv-time'),
    name: $('#pv-name'),
    email: $('#pv-email'),
    phone: $('#pv-phone'),
    message: $('#pv-message')
  };

  function setError(key, msg){
    if(errors[key]) errors[key].textContent = msg || '';
    if(fields[key]) fields[key].setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function clearAll(){ Object.keys(errors).forEach(k => setError(k, '')); }

  function validate(){
    clearAll();
    let ok = true;
    // Name
    const name = fields.name.value.trim();
    if(!name){ setError('name', 'Please enter your name.'); ok = false; }
    // Email
    const email = fields.email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if(!email) { setError('email','Email is required.'); ok = false; }
    else if(!emailOk){ setError('email','Enter a valid email address.'); ok = false; }
    // Phone (digits, +, spaces, hyphens, parentheses)
    const phone = fields.phone.value.trim();
    const phoneOk = /^[+()\-\s\d]{8,20}$/.test(phone);
    if(!phone){ setError('phone','Phone number is required.'); ok = false; }
    else if(!phoneOk){ setError('phone','Enter a valid phone number.'); ok = false; }
    // Message
    const message = fields.message.value.trim();
    if(!message){ setError('message','Please type a message.'); ok = false; }

    return { ok, data: { name, email, phone, message } };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { ok, data } = validate();
    if(!ok) return;

    // Update preview
    const now = new Date();
    preview.time.textContent = now.toString();
    preview.name.textContent = data.name;
    preview.email.textContent = data.email;
    preview.phone.textContent = data.phone;
    preview.message.textContent = data.message;

    // Optional: provide quick feedback
    form.reset();
    alert('Thank you! Your message has been captured in the preview panel.');
  });
})();
