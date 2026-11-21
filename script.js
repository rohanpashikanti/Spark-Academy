const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  primaryNav.classList.toggle('open', open);
});
document.querySelectorAll('.primary-nav a').forEach(link => link.addEventListener('click', () => {
  primaryNav.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false');
}));

const courseCatalogue = Array.isArray(window.sparkCourses) ? window.sparkCourses : [];
const trendingCourseIds = ['railway', 'police-si-constable', 'eamcet-eapcet', 'neet'];
const courseSelect = document.querySelector('#preferred-course');

function courseCard(course) {
  return `<article class="course-card" data-course-id="${course.id}">
    <span class="card-kicker">${course.category}</span>
    <h3>${course.title}</h3>
    <p>${course.description}</p>
    <div class="course-exams"><strong>Exams</strong><span>${course.exams.join(' · ')}</span></div>
    <div class="tag-row">${course.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    <div class="course-actions"><button class="button button-secondary" type="button" data-course-details="${course.id}">View details</button><button class="button button-primary" type="button" data-course-enquire="${course.id}">Enquire now</button></div>
  </article>`;
}

function renderCourses(target, courses) {
  if (target) target.innerHTML = courses.map(courseCard).join('');
}

function populateCourseSelect() {
  if (!courseSelect) return;
  courseSelect.insertAdjacentHTML('beforeend', courseCatalogue.map(course => `<option value="${course.id}">${course.title}</option>`).join(''));
}

function showCourseDetails(courseId) {
  const course = courseCatalogue.find(item => item.id === courseId);
  if (!course) return;
  let dialog = document.querySelector('#course-details-dialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'course-details-dialog';
    dialog.className = 'course-dialog';
    document.body.append(dialog);
  }
  dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="Close course details">×</button><span class="card-kicker">${course.category}</span><h2>${course.title}</h2><p class="dialog-lede">${course.description}</p><div class="dialog-grid"><div><h3>Relevant examinations</h3><ul>${course.exams.map(item => `<li>${item}</li>`).join('')}</ul></div><div><h3>Subjects & preparation</h3><ul>${course.subjects.map(item => `<li>${item}</li>`).join('')}</ul></div><div><h3>Teaching approach</h3><p>${course.approach}</p></div><div><h3>Learning support</h3><p>${course.support}</p></div></div><button class="button button-primary" type="button" data-course-enquire="${course.id}">Enquire now</button>`;
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
}

function enquireForCourse(courseId) {
  const pageContact = document.querySelector('#contact');
  if (courseSelect && pageContact) {
    courseSelect.value = courseId;
    pageContact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => courseSelect.focus({ preventScroll: true }), 450);
    return;
  }
  window.location.href = `index.html?course=${encodeURIComponent(courseId)}#contact`;
}

renderCourses(document.querySelector('#trending-courses'), courseCatalogue.filter(course => trendingCourseIds.includes(course.id)));
renderCourses(document.querySelector('#all-courses'), courseCatalogue);
populateCourseSelect();

document.addEventListener('click', event => {
  const detailButton = event.target.closest('[data-course-details]');
  const enquireButton = event.target.closest('[data-course-enquire]');
  if (detailButton) showCourseDetails(detailButton.dataset.courseDetails);
  if (enquireButton) { const dialog = enquireButton.closest('dialog'); if (dialog) dialog.close(); enquireForCourse(enquireButton.dataset.courseEnquire); }
});

document.querySelectorAll('.course-filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.course-filter').forEach(item => item.classList.toggle('active', item === button));
  const category = button.dataset.courseFilter;
  renderCourses(document.querySelector('#all-courses'), category === 'all' ? courseCatalogue : courseCatalogue.filter(course => course.category === category));
}));

const selectedCourse = new URLSearchParams(window.location.search).get('course');
if (selectedCourse && courseSelect && courseCatalogue.some(course => course.id === selectedCourse)) courseSelect.value = selectedCourse;

const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -58% 0px' });
  sections.forEach(section => observer.observe(section));
}

function setGalleryFilter(filter) {
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  document.querySelectorAll('.gallery-item').forEach(item => {
    const matches = filter === 'all' || item.dataset.category === filter;
    item.hidden = !matches;
  });
}

document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    setGalleryFilter(button.dataset.filter);
  });
});

const viewAllGalleryBtn = document.querySelector('.view-all-gallery');
if (viewAllGalleryBtn) {
  viewAllGalleryBtn.addEventListener('click', () => {
    setGalleryFilter('all');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.hidden = false;
    });
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const lightbox = document.querySelector('#lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
let lightboxIndex = 0;

function getVisibleGalleryItems() {
  return [...document.querySelectorAll('.gallery-item')].filter(item => !item.hidden);
}

function showLightbox(index) {
  const visible = getVisibleGalleryItems();
  if (!visible.length) return;
  lightboxIndex = (index + visible.length) % visible.length;
  const item = visible[lightboxIndex];
  if (lightboxImg) {
    lightboxImg.src = item.dataset.image;
    lightboxImg.alt = item.querySelector('img')?.alt || item.dataset.caption || 'Spark Academy Gallery';
  }
  if (lightboxCaption) {
    lightboxCaption.textContent = item.dataset.caption || '';
  }
  lightbox?.classList.add('open');
  lightbox?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

const galleryGrid = document.querySelector('.gallery-grid');
galleryGrid?.addEventListener('click', event => {
  const item = event.target.closest('.gallery-item');
  if (!item) return;
  const visible = getVisibleGalleryItems();
  const index = visible.indexOf(item);
  if (index !== -1) showLightbox(index);
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showLightbox(lightboxIndex - 1));
lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showLightbox(lightboxIndex + 1));
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
  if (event.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
});

const branchData = [
  {
    name: 'SPARK ACADEMY',
    address: '2nd Floor, Mayuri Mall, Opposite Vagdevi Degree College, Kishanpura, Hanamkonda, Telangana 506001',
    phone: '09705014444',
    phoneLink: 'tel:+919705014444',
    hours: '6:00 PM – 8:30 PM',
    facilities: 'Classroom Coaching, Entrance Exam Preparation & Guidance',
    map: '2nd Floor, Mayuri Mall, Hanamkonda',
    directions: 'https://maps.app.goo.gl/TscFoT3Ga7LkWBci8',
    mapQuery: 'SPARK ACADEMY, Mayuri Mall, Opposite Vagdevi Degree College, Kishanpura, Hanamkonda, Telangana 506001'
  },
  {
    name: 'SPARK SAINIK & NAVODAYA ACADEMY',
    address: 'Near: Lenskart, Lashkar Singaram, Naim Nagar, Hanamkonda, Telangana 506009',
    phone: '09705014444',
    phoneLink: 'tel:+919705014444',
    hours: '6:00 PM – 8:30 PM',
    facilities: 'Sainik & Navodaya Entrance Coaching & Academic Prep',
    map: 'Near Lenskart, Lashkar Singaram, Naim Nagar',
    directions: 'https://maps.app.goo.gl/YpjZ6mbHEwefvYYW9',
    mapQuery: 'Lenskart, Nayeem Nagar, Lashkar Singaram, Hanamkonda, Telangana 506009'
  }
];

document.querySelectorAll('.branch-tab').forEach(tab => tab.addEventListener('click', () => {
  const data = branchData[Number(tab.dataset.branch)];
  document.querySelectorAll('.branch-tab').forEach(other => {
    const active = other === tab;
    other.classList.toggle('active', active);
    other.setAttribute('aria-selected', String(active));
  });
  document.querySelector('#branch-panel')?.setAttribute('aria-labelledby', tab.id);
  document.querySelector('#branch-name').textContent = data.name;
  document.querySelector('#branch-address').textContent = data.address;
  document.querySelector('#branch-phone').textContent = data.phone;
  document.querySelector('#branch-hours').textContent = data.hours;
  document.querySelector('#branch-facilities').textContent = data.facilities;
  document.querySelector('#map-branch-name').textContent = data.name;
  document.querySelector('#map-branch-kicker').textContent = `BRANCH ${String(Number(tab.dataset.branch) + 1).padStart(2, '0')}`;
  document.querySelector('#map-address').textContent = data.map;
  const mapLink = document.querySelector('#map-link');
  if (mapLink) {
    mapLink.href = data.directions;
    mapLink.title = `Open ${data.name} in Google Maps`;
  }
  const map = document.querySelector('#branch-map');
  if (map) {
    map.src = `https://maps.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
    map.title = `Map for ${data.name}, Hanamkonda`;
  }
  document.querySelector('#directions-link').href = data.directions;
  document.querySelector('#branch-call-link').href = data.phoneLink;
}));

const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
const phoneField = form?.elements.phone;
const mobilePattern = /^(?:(?:\+91|91)[\s-]?)?[6-9]\d{9}$/;
phoneField?.addEventListener('input', () => { phoneField.setCustomValidity(''); });
form?.addEventListener('submit', async event => {
  event.preventDefault(); status.textContent = ''; status.classList.remove('success');
  phoneField.setCustomValidity(mobilePattern.test(phoneField.value.trim()) ? '' : 'Enter a valid 10-digit Indian mobile number.');
  if (!form.reportValidity()) return;
  const endpoint = document.querySelector('meta[name="enquiry-endpoint"]')?.content?.trim();
  if (!endpoint) {
    status.textContent = 'The enquiry form is ready, but the academy submission endpoint has not been configured. No details were sent.';
    return;
  }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true; button.querySelector('span').textContent = 'Sending…';
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (!response.ok) throw new Error(`Submission failed (${response.status})`);
    form.reset(); status.textContent = 'Thank you. Your enquiry has been sent.'; status.classList.add('success');
  } catch (error) {
    status.textContent = 'We couldn’t send your enquiry just now. Please try again later.';
  } finally {
    button.disabled = false; button.querySelector('span').textContent = 'Request a call back';
  }
});

const copyrightYear = document.querySelector('#copyright-year');
if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

// Lightweight section reveals keep scrolling calm and focused.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = [...document.querySelectorAll('main > section, .site-footer')]
    .filter(item => !item.classList.contains('hero'));
  document.body.classList.add('reveal-ready');
  revealItems.forEach(item => item.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: 0.1, rootMargin: '0px 0px -40px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
}
