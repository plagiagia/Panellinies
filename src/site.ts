import '../prototype.css';
import './exercise';
import { auth } from './auth';

const header = document.querySelector('header');
if (header) {
  const link = document.createElement('a');
  link.href = '/account.html';
  link.className = 'account-link';
  link.textContent = 'Σύνδεση';
  link.addEventListener('click', () => {
    if (location.pathname !== '/account.html') sessionStorage.setItem('account-return', location.pathname + location.search + location.hash);
  });
  header.append(link);
  void auth().then(client => client.auth.getSession()).then(({ data }) => {
    if (data.session) link.textContent = 'Ο λογαριασμός μου';
  }).catch(() => {});
}

const navigation = document.querySelector('header nav');
if (navigation) {
  navigation.innerHTML = '<a href="/">Η μελέτη μου</a><a href="/topics.html">Εξερεύνηση ύλης</a><a href="/community.html">Κοινότητα</a>';
  navigation.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === location.pathname) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
  });
}
