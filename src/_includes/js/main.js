function persistThemeSelection() {
  let toggleThemeCheckbox = document.getElementById("toggle-theme");
  localStorage.setItem("toggleTheme", toggleThemeCheckbox.checked);
}

// Copy button functionality for code blocks
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      const pre = button.nextElementSibling;
      const code = pre.querySelector('code') || pre;
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
});
