// Navigation controls
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle-button'); // inside navbar
    const navbarLinks = document.querySelector('.navbar-links');
    const navbar = document.querySelector('.navbar');
    const menuButton = document.querySelector('.sidebar-toggle-btn'); // the floating menu button
    const sidebar = document.querySelector('.sidebar');

    // safe guards
    const safe = el => !!el;

    // show/hide helpers
    const showNavbar = () => {
        if (!safe(navbar)) return;
        navbar.classList.remove('navbar-hidden');
        navbar.classList.add('active');
        if (safe(navbarLinks)) {
            navbarLinks.classList.add('active');
            navbarLinks.setAttribute('aria-hidden', 'false');
        }
        // hide floating menu button while navbar visible
        if (safe(menuButton)) {
            menuButton.classList.add('hidden');
        }
        // close sidebar if open
        if (safe(sidebar)) sidebar.classList.remove('sidebar-open');
    };

    const hideNavbar = () => {
        if (!safe(navbar)) return;
        navbar.classList.add('navbar-hidden');
        navbar.classList.remove('active');
        if (safe(navbarLinks)) {
            navbarLinks.classList.remove('active');
            navbarLinks.setAttribute('aria-hidden', 'true');
        }
        // show floating menu button when navbar hidden
        if (safe(menuButton)) {
            menuButton.classList.remove('hidden');
        }
    };

    // Toggle floating menu button click => show/hide navbar (instead of opening sidebar)
    menuButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!safe(navbar)) return;
        const isHidden = navbar.classList.contains('navbar-hidden') || !navbar.classList.contains('active');
        if (isHidden) {
            showNavbar();
        } else {
            hideNavbar();
        }
    });

    // Navbar internal toggle-button toggles navbar-links only (mobile)
    toggleButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!safe(navbarLinks) || !safe(navbar)) return;
        const open = navbarLinks.classList.toggle('active');
        navbar.classList.toggle('active', open);
        navbarLinks.setAttribute('aria-hidden', (!open).toString());
        // when navbar opened via toggle, hide floating menu button
        if (open && safe(menuButton)) menuButton.classList.add('hidden');
        if (!open && safe(menuButton)) menuButton.classList.remove('hidden');
    });

    // Click outside navbar closes navbar (and reveals menu button)
    document.addEventListener('click', (e) => {
        if (!safe(navbar)) return;
        if (!navbar.contains(e.target) && navbar.classList.contains('active')) {
            hideNavbar();
        }
    });

    // Scroll: hide navbar when scrolling down, show when scrolling up; only if not explicitly opened
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (!safe(navbar)) return;
        // do not auto-hide if navbar currently opened by user interaction (class 'active' and navbarLinks open)
        const userOpened = navbar.classList.contains('active') && safe(navbarLinks) && navbarLinks.classList.contains('active');
        if (userOpened) { lastY = y; return; }

        if (y > lastY && y > 100) {
            // scrolling down -> hide navbar, show menu button
            hideNavbar();
        } else if (y < lastY) {
            // scrolling up -> show navbar briefly
            showNavbar();
            // then hide after short delay to avoid permanently covering content
            setTimeout(() => {
                hideNavbar();
            }, 1600);
        }
        lastY = y;
    });

    // On resize ensure states are consistent
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // show navbar in desktop by default and hide floating button
            if (safe(navbar)) {
                navbar.classList.remove('navbar-hidden');
                navbar.classList.remove('active');
            }
            if (safe(menuButton)) menuButton.classList.add('hidden');
            if (safe(navbarLinks)) {
                navbarLinks.classList.remove('active');
                navbarLinks.setAttribute('aria-hidden', 'false');
            }
            if (safe(sidebar)) sidebar.classList.remove('sidebar-open');
        } else {
            // mobile: ensure menuButton is visible
            if (safe(menuButton)) menuButton.classList.remove('hidden');
        }
    });

    // Initial state: hide navbar on mobile, keep menuButton visible
    if (window.innerWidth <= 768) {
        hideNavbar();
        if (safe(menuButton)) menuButton.classList.remove('hidden');
    } else {
        // desktop: show navbar and hide floating button
        if (safe(navbar)) navbar.classList.remove('navbar-hidden');
        if (safe(menuButton)) menuButton.classList.add('hidden');
    }
});
