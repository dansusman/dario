// Table of Contents Active Section Highlighting
(function() {
    'use strict';

    // Get all headings and TOC links
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocLinks = document.querySelectorAll('.toc-sidebar a');
    
    if (headings.length === 0 || tocLinks.length === 0) {
        return;
    }

    // Create a map of heading IDs to TOC links
    const headingToLink = new Map();
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            headingToLink.set(id, link);
        }
    });

    // Function to remove active class from all TOC links
    function clearActiveLinks() {
        tocLinks.forEach(link => link.classList.remove('active'));
    }

    // Function to set active link
    function setActiveLink(heading) {
        clearActiveLinks();
        const link = headingToLink.get(heading.id);
        if (link) {
            link.classList.add('active');
        }
    }

    // Intersection Observer for tracking visible headings
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
    };

    // Track if user has started scrolling
    let userHasScrolled = false;
    let scrollTimeout;
    
    // Listen for scroll events to detect user scrolling
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            userHasScrolled = true;
        }, 100); // Small delay to avoid immediate triggering
    });

    const observer = new IntersectionObserver((entries) => {
        // If there's a hash in the URL and user hasn't scrolled yet, prioritize that
        const currentHash = window.location.hash;
        if (currentHash && !userHasScrolled) {
            const hashTarget = document.getElementById(currentHash.substring(1));
            if (hashTarget) {
                setActiveLink(hashTarget);
                return;
            }
        }
        
        let visibleHeadings = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target);

        if (visibleHeadings.length > 0) {
            // Get the topmost visible heading
            const topHeading = visibleHeadings.reduce((prev, current) => {
                return prev.offsetTop < current.offsetTop ? prev : current;
            });
            setActiveLink(topHeading);
        }
    }, observerOptions);

    // Observe all headings
    headings.forEach(heading => {
        if (heading.id) {
            observer.observe(heading);
        }
    });

    // Handle TOC link clicks for smooth scrolling
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.getElementById(href.substring(1));
                if (target) {
                    // Reset scroll tracking to prioritize URL again
                    userHasScrolled = false;
                    clearTimeout(scrollTimeout);
                    
                    // Immediately update the active link
                    setActiveLink(target);
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Set initial active link based on URL hash
    function setInitialActiveLink() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.getElementById(hash.substring(1));
            if (target) {
                setActiveLink(target);
            }
        } else if (headings.length > 0) {
            // Set first heading as active if no hash
            setActiveLink(headings[0]);
        }
    }

    // Listen for URL hash changes (second form of auth)
    function handleHashChange() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.getElementById(hash.substring(1));
            if (target) {
                setActiveLink(target);
            }
        }
    }

    // Listen for hash changes in URL
    window.addEventListener('hashchange', handleHashChange);
    
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleHashChange);

    // TOC toggle functionality
    const tocToggle = document.getElementById('toc-toggle');
    const tocContent = document.getElementById('toc-content');
    
    if (tocToggle && tocContent) {
        tocToggle.addEventListener('click', () => {
            tocContent.classList.toggle('collapsed');
        });
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setInitialActiveLink);
    } else {
        setInitialActiveLink();
    }

})();