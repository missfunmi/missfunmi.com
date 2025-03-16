function persistThemeSelection() {
  let toggleThemeCheckbox = document.getElementById("toggle-theme");
  localStorage.setItem("toggleTheme", toggleThemeCheckbox.checked);
}
