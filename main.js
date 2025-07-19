// Highland Restoration - Interactive Features with PhotoSwipe Gallery

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar Background on Scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(44, 44, 44, 0.98)';
        } else {
            navbar.style.background = 'rgba(44, 44, 44, 0.95)';
        }
    });

    // Gallery Modal Functionality
    const modal = document.getElementById('gallery-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGallery = document.getElementById('modal-gallery');
    const closeBtn = document.querySelector('.close');

    // Load gallery data
    let galleryData = {};

    // Load gallery data from JSON file
    fetch('galleries/gallery_data.json')
        .then(response => response.json())
        .then(data => {
            galleryData = {
                stone_work: {
                    title: 'Stone Work Gallery',
                    images: getGalleryImages(data.stone_work)
                },
                tile_installation: {
                    title: 'Tile Installation Gallery',
                    images: getGalleryImages(data.tile_installation)
                },
                kitchen_bathroom: {
                    title: 'Kitchen & Bathroom Gallery',
                    images: getGalleryImages(data.kitchen_bathroom)
                },
                exterior_work: {
                    title: 'Exterior Work Gallery',
                    images: getGalleryImages(data.exterior_work)
                },
                interior_finishes: {
                    title: 'Interior Finishes Gallery',
                    images: getGalleryImages(data.interior_finishes)
                },
                construction_renovation: {
                    title: 'Construction & Renovation Gallery',
                    images: getGalleryImages(data.construction_renovation)
                },
                tools_equipment: {
                    title: 'Tools & Equipment Gallery',
                    images: getGalleryImages(data.tools_equipment)
                },
                architectural_features: {
                    title: 'Architectural Features Gallery',
                    images: getGalleryImages(data.architectural_features)
                },
                rope_access: {
                    title: 'Rope Access Restoration Gallery',
                    images: getRopeAccessImages(data)
                }
            };
        })
        .catch(error => {
            console.error('Error loading gallery data:', error);
            // Fallback to empty galleries if data can't be loaded
            galleryData = {
                stone_work: { title: 'Stone Work Gallery', images: [] },
                tile_installation: { title: 'Tile Installation Gallery', images: [] },
                kitchen_bathroom: { title: 'Kitchen & Bathroom Gallery', images: [] },
                exterior_work: { title: 'Exterior Work Gallery', images: [] },
                interior_finishes: { title: 'Interior Finishes Gallery', images: [] },
                construction_renovation: { title: 'Construction & Renovation Gallery', images: [] },
                tools_equipment: { title: 'Tools & Equipment Gallery', images: [] },
                architectural_features: { title: 'Architectural Features Gallery', images: [] },
                rope_access: { title: 'Rope Access Restoration Gallery', images: [] }
            };
        });

    // View Gallery Button Click Handlers
    document.querySelectorAll('.view-gallery-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const category = this.getAttribute('data-category');
            openGallery(category);
        });
    });

    // Highlight Card Click Handlers
    document.querySelectorAll('.highlight-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            openGallery(category);
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close Modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function openGallery(category) {
        const data = galleryData[category];
        if (data) {
            modalTitle.textContent = data.title;
            modalGallery.innerHTML = '';
            
            if (data.images.length === 0) {
                modalGallery.innerHTML = '<p style="text-align: center; color: #ccc; padding: 40px;">Gallery images loading...</p>';
                return;
            }
            
            // Create gallery grid
            data.images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${image}" alt="Gallery Image" class="gallery-thumbnail" data-index="${index}">
                `;
                modalGallery.appendChild(galleryItem);
            });
            
            modal.style.display = 'block';
            
            // Initialize fallback gallery
            initializeFallbackGallery(modalGallery, category);
        }
    }

    function initializeFallbackGallery(container, category) {
        // Simple fallback gallery without PhotoSwipe
        const images = container.querySelectorAll('img');
        images.forEach((img, index) => {
            img.addEventListener('click', function() {
                openFallbackImage(this.src, index, images);
            });
        });
    }

    function openFallbackImage(src, index, images) {
        // Create a simple full-screen image viewer
        const overlay = document.createElement('div');
        overlay.className = 'fallback-overlay';
        overlay.innerHTML = `
            <div class="fallback-container">
                <button class="fallback-close">&times;</button>
                <button class="fallback-nav fallback-prev">&lt;</button>
                <button class="fallback-nav fallback-next">&gt;</button>
                <img src="${src}" class="fallback-image">
                <div class="fallback-counter">${index + 1} / ${images.length}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Close button
        overlay.querySelector('.fallback-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        // Navigation
        overlay.querySelector('.fallback-prev').addEventListener('click', () => {
            const prevIndex = index > 0 ? index - 1 : images.length - 1;
            const prevSrc = images[prevIndex].src;
            document.body.removeChild(overlay);
            openFallbackImage(prevSrc, prevIndex, images);
        });
        
        overlay.querySelector('.fallback-next').addEventListener('click', () => {
            const nextIndex = index < images.length - 1 ? index + 1 : 0;
            const nextSrc = images[nextIndex].src;
            document.body.removeChild(overlay);
            openFallbackImage(nextSrc, nextIndex, images);
        });
        
        // Keyboard navigation
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'ArrowLeft') {
                overlay.querySelector('.fallback-prev').click();
            } else if (e.key === 'ArrowRight') {
                overlay.querySelector('.fallback-next').click();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    function getGalleryImages(categoryData) {
        if (!categoryData || !categoryData.images) {
            return [];
        }
        
        const images = [];
        
        for (let i = 0; i < categoryData.images.length; i++) {
            const imageData = categoryData.images[i];
            const imagePath = `galleries/${getCategoryFolderName(categoryData.name)}/${imageData.filename}`;
            images.push(imagePath);
        }
        
        return images;
    }

    function getRopeAccessImages(data) {
        const ropeAccessImages = [];
        
        // Search through all galleries for rope access related images
        const allGalleries = [
            data.stone_work,
            data.tile_installation, 
            data.kitchen_bathroom,
            data.exterior_work,
            data.interior_finishes,
            data.construction_renovation,
            data.tools_equipment,
            data.architectural_features
        ];
        
        allGalleries.forEach(gallery => {
            if (gallery && gallery.images) {
                gallery.images.forEach(imageData => {
                    // Check if image has rope access related tags
                    const tags = imageData.tags || [];
                    const ropeAccessKeywords = [
                        'safety harness', 'ropes', 'climbing gear', 'working at height',
                        'rooftop', 'high-rise building', 'building maintenance',
                        'steeplejack', 'rope access', 'abseil', 'repel'
                    ];
                    
                    const hasRopeAccessTags = ropeAccessKeywords.some(keyword => 
                        tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
                    );
                    
                    if (hasRopeAccessTags) {
                        // Determine the source gallery folder
                        const sourceGallery = getCategoryFolderName(gallery.name);
                        const imagePath = `galleries/${sourceGallery}/${imageData.filename}`;
                        ropeAccessImages.push(imagePath);
                    }
                });
            }
        });
        
        return ropeAccessImages;
    }

    function getCategoryFolderName(categoryName) {
        const folderMap = {
            'Stone Work': 'stone_work',
            'Tile Installation': 'tile_installation',
            'Kitchen & Bathroom': 'kitchen_bathroom',
            'Exterior Work': 'exterior_work',
            'Interior Finishes': 'interior_finishes',
            'Construction & Renovation': 'construction_renovation',
            'Tools & Equipment': 'tools_equipment',
            'Architectural Features': 'architectural_features',
            'Rope Access Restoration': 'rope_access'
        };
        return folderMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '_');
    }

    // Form Submission Handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .highlight-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}); 