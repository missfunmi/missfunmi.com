function persistThemeSelection() {
  let toggleThemeCheckbox = document.getElementById("toggle-theme");
  localStorage.setItem("toggleTheme", toggleThemeCheckbox.checked);
}

document.addEventListener("DOMContentLoaded", () => {
  // Position headings at the top of the page
  // const headerHeight = document.querySelector("header").offsetHeight;
  // document.querySelectorAll("h2, h3").forEach((h) => {
  //   h.style.scrollMarginTop = headerHeight + 16 + "px";
  // });

  console.log(document.querySelector("h2").style.scrollMarginTop);

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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = nav.querySelector(`a[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "0px 0px -80% 0px" },
  );

  headings.forEach((h) => observer.observe(h));
});
