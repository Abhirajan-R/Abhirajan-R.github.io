
const root = document.documentElement;
const menu = document.querySelector('#menu');
const links = document.querySelector('#links');
const themeToggle = document.querySelector('#themeToggle');

const savedTheme = localStorage.getItem('abhirajan-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  root.dataset.theme = savedTheme;
} else {
  root.dataset.theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function updateThemeButton() {
  const light = root.dataset.theme === 'light';
  themeToggle.textContent = light ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
}
updateThemeButton();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('abhirajan-theme', root.dataset.theme);
  updateThemeButton();
});

menu.addEventListener('click', () => {
  links.classList.toggle('show');
  menu.setAttribute('aria-label', links.classList.contains('show') ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('#links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth < 901) links.classList.remove('show');
  });
});
