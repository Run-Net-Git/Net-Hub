// កូដសម្រាប់ទំព័រដើម (Home Page)
const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const isLight = document.body.classList.contains("light-mode");
    themeToggleBtn.textContent = isLight ? "🌙 Mode" : "☀️ Mode";
  });
}
