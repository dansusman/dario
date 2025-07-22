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

    // Track if user has started scrolling
    let userHasScrolled = false;
    let scrollTimeout;
    
    // Function to find the currently active heading based on scroll position
    function findActiveHeading() {
        // If there's a hash in the URL and user hasn't scrolled yet, prioritize that
        const currentHash = window.location.hash;
        if (currentHash && !userHasScrolled) {
            const hashTarget = document.getElementById(currentHash.substring(1));
            if (hashTarget) {
                return hashTarget;
            }
        }

        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // If we're at the very bottom of the page, activate the last heading
        if (scrollPosition + viewportHeight >= documentHeight - 10) {
            const headingsWithIds = Array.from(headings).filter(h => h.id && headingToLink.has(h.id));
            if (headingsWithIds.length > 0) {
                return headingsWithIds[headingsWithIds.length - 1];
            }
        }
        
        // Find the heading that's currently most visible
        // We want the heading that's closest to being at the top 20% of viewport
        const targetPosition = scrollPosition + viewportHeight * 0.2;
        
        let activeHeading = null;
        let smallestDistance = Infinity;
        
        headings.forEach(heading => {
            if (heading.id && headingToLink.has(heading.id)) {
                const headingTop = heading.offsetTop;
                
                // If heading is above the target position, it's a candidate
                if (headingTop <= targetPosition) {
                    const distance = targetPosition - headingTop;
                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        activeHeading = heading;
                    }
                }
            }
        });
        
        // If no heading is above the target position, use the first one
        if (!activeHeading && headings.length > 0) {
            const firstHeading = Array.from(headings).find(h => h.id && headingToLink.has(h.id));
            if (firstHeading) {
                activeHeading = firstHeading;
            }
        }
        
        return activeHeading;
    }
    
    // Function to update TOC highlighting based on scroll position
    function updateTocHighlight() {
        const activeHeading = findActiveHeading();
        if (activeHeading) {
            setActiveLink(activeHeading);
        }
    }
    
    // Listen for scroll events
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        // Immediately clear the hash override when user starts scrolling
        userHasScrolled = true;
        clearTimeout(scrollTimeout);
        
        // Use requestAnimationFrame for smooth updates
        if (!isScrolling) {
            requestAnimationFrame(() => {
                updateTocHighlight();
                isScrolling = false;
            });
            isScrolling = true;
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

    // Set initial active link based on URL hash or scroll position
    function setInitialActiveLink() {
        updateTocHighlight();
    }

    // Listen for URL hash changes
    function handleHashChange() {
        userHasScrolled = false; // Reset scroll tracking for hash changes
        updateTocHighlight();
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