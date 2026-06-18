/* ============================================================
   shared.js — used by tiktok.html, fesnuk.html, instagram.html
   ============================================================ */

// ======= THEME =======
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function setTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light');
        themeIcon.className = 'bx bx-sun';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light');
        themeIcon.className = 'bx bx-moon';
        localStorage.setItem('theme', 'dark');
    }
}

setTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
});

// ======= BURGER MENU =======
const burgerBtn   = document.getElementById('burgerBtn');
const sideMenu    = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenu');

function openMenu()  { sideMenu.classList.add('open'); menuOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeMenu() { sideMenu.classList.remove('open'); menuOverlay.classList.remove('active'); document.body.style.overflow = ''; }

burgerBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ======= SHARED UI HELPERS =======
function showLoading(contentEl) {
    contentEl.innerHTML = `
        <div class="loading">
            <div class="loading-label">Processing</div>
            <div class="loading-bar-wrap"><div class="loading-bar"></div></div>
            <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>`;
}

function showError(contentEl, message, instructionsHTML) {
    contentEl.innerHTML = `
        <div style="width:100%">
            <div class="messageError"><i class='bx bx-error-circle'></i><span>${message}</span></div>
            ${instructionsHTML}
        </div>`;
}

async function directDownload(url, filename) {
    try {
        const res  = await fetch(url);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    } catch {
        alert('Download failed. Please try right-click → "Save as"');
    }
}

function createDownloadButton(url, filename, icon, text, extraClass = '') {
    const id = `btn-${Math.random().toString(36).substr(2, 9)}`;
    setTimeout(() => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', e => { e.preventDefault(); directDownload(url, filename); });
    }, 100);
    return `<button id="${id}" class="btn ${extraClass}"><i class='bx ${icon}'></i>${text}</button>`;
}
