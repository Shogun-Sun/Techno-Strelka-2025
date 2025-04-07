document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    function toggleTheme() {
      if (localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        body.classList.remove('dark');
      } else {
        localStorage.setItem('theme', 'dark');
        body.classList.add('dark');
      }
    }

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      body.classList.add('dark');
    }

    toggleButton.addEventListener('click', toggleTheme);
  });