function persistThemeSelection() {
  let toggleThemeCheckbox = document.getElementById("toggle-theme");
  localStorage.setItem("toggleTheme", toggleThemeCheckbox.checked);
}

document.addEventListener("DOMContentLoaded", () => {
  // Copy button for code blocks
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const pre = button.nextElementSibling;
      const code = pre.querySelector("code") || pre;
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.classList.add("copied");
        setTimeout(() => button.classList.remove("copied"), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  });

  // Table of contents for posts with headings
  const toc = document.getElementById("post-toc");
  if (!toc) return;
  const headings = document.querySelectorAll(
    ".page-content h2, .page-content h3",
  );
  if (headings.length < 2) return;

  const label = document.createElement("p");
  label.textContent = "On this page:";
  label.className = "post-toc-label";
  toc.appendChild(label);

  const nav = document.createElement("nav");
  headings.forEach((h) => {
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent.replace("#", "").trim();
    a.style.paddingLeft = h.tagName === "H3" ? "0.75rem" : "0";
    nav.appendChild(a);
  });

  const topLink = document.createElement('a');
  topLink.href = '#';
  topLink.textContent = '↑';
  topLink.title = 'back to top';
  topLink.style.paddingLeft = '0';
  topLink.style.marginTop = '8px';
  topLink.style.display = 'block';
  nav.appendChild(topLink);

  toc.appendChild(nav);

  const links = nav.querySelectorAll("a");
  let activeLink = null;
  window.addEventListener('scroll', () => {
    let closest = null;
    headings.forEach(h => {
      const top = h.getBoundingClientRect().top;
      console.log('heading: ', h.id, top);
      if (top <= 50) {
        if (closest === null || top > closest.getBoundingClientRect().top) {
          closest = h;
        }
      }
    });
    if (closest && closest !== activeLink) {
      activeLink = closest;
      links.forEach(l => l.classList.remove("active"));
      const active = nav.querySelector(`a[href="#${closest.id}"]`);
      if (active) active.classList.add("active");
    } else if (!closest && activeLink) {
      activeLink = null;
      links.forEach(l => l.classList.remove("active"));
    }
  }, { passive: true });
});
