document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth Scroll for nav links (optional, modern browsers might do this)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if it's a main page anchor, not a dropdown sub-item placeholder
            if (this.getAttribute('href').length > 1 && document.querySelector(this.getAttribute('href'))) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    const navHeight = document.querySelector('header')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });


    // --- "Unique" Scroll Animation for Sections ---
    const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before element fully hits bottom of viewport (50px earlier)
        threshold: 0.05 // Triggers when even a tiny bit (5%) is visible
    };

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Uncomment if you want one-time animation
            } else {
                // Optional: For re-animation on scroll out and back in
                // entry.target.classList.remove('visible');
            }
        });
    };

    if (sectionsToAnimate.length > 0) { // Check if there are elements to animate
        const sectionObserver = new IntersectionObserver(revealSection, observerOptions);
        sectionsToAnimate.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    // Firebase Comment: Dynamic content loading and event handlers
    // Example for Store items (if they were interactive on this page)
    // document.querySelectorAll('.store-item-buy-button').forEach(button => {
    //     button.addEventListener('click', (event) => {
    //         const itemId = event.target.dataset.itemId;
    //         // Firebase.analytics().logEvent('add_to_cart', { item_id: itemId });
    //         // Potentially open a modal or redirect to a checkout page.
    //         console.log(`Attempting to buy item: ${itemId}`);
    //     });
    // });

    // Firebase Comment: Forum Link
    // const forumLink = document.querySelector('a[href="#forum"]');
    // if (forumLink) {
    //     forumLink.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         // Check auth state
    //         // const user = Firebase.auth().currentUser;
    //         // if (user) {
    //         //     window.location.href = '/forum-actual-page'; // Or initialize a forum SPA component
    //         // } else {
    //         //     // Prompt login or redirect to login page
    //         //     alert('Please log in to access the Vets Forum.');
    //         //     // window.location.href = '/login?redirect=/forum-actual-page';
    //         // }
    //         alert('Forum access would require login. (Functionality not implemented yet)');
    //     });
    // }

    // Firebase Comment: Bookings Link
    // const bookingLink = document.querySelector('a[href="#bookings"]');
    // if (bookingLink) {
    //     bookingLink.addEventListener('click', (e) => {
    //         // Might open a modal with booking options, or redirect to a booking page.
    //         // Could check user roles if certain bookings are restricted.
    //         // Firebase.analytics().logEvent('begin_booking_process');
    //         // For now, the dropdown handles it. If it were a direct link:
    //         // e.preventDefault();
    //         // alert('Booking system integration point. (Functionality not implemented yet)');
    //     });
    // }
});


// ... (existing script.js code: currentYear, smoothScroll, IntersectionObserver ...)

document.addEventListener('DOMContentLoaded', () => {
    // ... (all previous DOMContentLoaded code) ...

    // --- GALLERY PAGE SPECIFIC SCRIPT ---
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let galleryItems = []; // To store all items for lightbox navigation
    let currentImageIndex = -1;

    // Initialize Gallery if elements exist
    if (galleryGrid) {
        galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

        // Filter functionality
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Active button class
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const filterValue = button.getAttribute('data-filter');

                    galleryItems.forEach(item => {
                        // Using a timeout to allow CSS transition for opacity/transform to take effect
                        item.classList.add('hide'); // First hide all
                        setTimeout(() => {
                            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                                item.classList.remove('hide');
                            }
                        }, 50); // Short delay, sync with transition or a bit after
                    });
                });
            });
        }

        // Lightbox functionality
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const imgAlt = item.querySelector('img').alt;
                const title = item.querySelector('img').dataset.title || imgAlt;
                const description = item.querySelector('img').dataset.description || '';

                openLightbox(imgSrc, title, description, index);
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightbox) {
            // Close lightbox if clicked outside the image/content area
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) { // Clicked on the modal backdrop
                    closeLightbox();
                }
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.style.display === 'flex') { // 'flex' due to display: flex
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                }
            }
        });

    } // end if (galleryGrid)

    function openLightbox(src, title, description, index) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightbox.style.display = 'flex'; // Changed from 'block' to 'flex' for centering modal content vertically
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        currentImageIndex = index;
        updateLightboxNav();
    }

    function closeLightbox() {
        if (!lightbox) return;
        // Add fadeOut animation class (optional)
        // lightbox.style.animation = 'fadeOut 0.3s ease-in-out';
        // setTimeout(() => {
        //     lightbox.style.display = 'none';
        //     lightbox.style.animation = ''; // Reset animation
        //     document.body.style.overflow = 'auto';
        // }, 290);
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage(index) {
        if (index >= 0 && index < galleryItems.length) {
            const item = galleryItems[index];
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;
            const title = item.querySelector('img').dataset.title || imgAlt;
            const description = item.querySelector('img').dataset.description || '';
            
            // Optional: add a fade transition for the image itself
            lightboxImage.style.opacity = 0;
            setTimeout(() => {
                lightboxImage.src = imgSrc;
                lightboxTitle.textContent = title;
                lightboxDescription.textContent = description;
                lightboxImage.style.opacity = 1;
            }, 200); // match transition duration

            currentImageIndex = index;
            updateLightboxNav();
        }
    }

    function showPrevImage() {
        const visibleItems = galleryItems.filter(item => !item.classList.contains('hide'));
        if (visibleItems.length === 0) return;

        // Find current index among visible items
        let currentVisibleIndex = visibleItems.findIndex(item => galleryItems[currentImageIndex] === item);

        if (currentVisibleIndex > 0) {
            // Get the original index of the previous visible item
            const originalIndexOfPrev = galleryItems.indexOf(visibleItems[currentVisibleIndex - 1]);
            updateLightboxImage(originalIndexOfPrev);
        } else if (visibleItems.length > 1) { // Wrap around to last visible
            const originalIndexOfLast = galleryItems.indexOf(visibleItems[visibleItems.length - 1]);
            updateLightboxImage(originalIndexOfLast);
        }
    }

    function showNextImage() {
        const visibleItems = galleryItems.filter(item => !item.classList.contains('hide'));
        if (visibleItems.length === 0) return;
        
        let currentVisibleIndex = visibleItems.findIndex(item => galleryItems[currentImageIndex] === item);

        if (currentVisibleIndex < visibleItems.length - 1) {
            const originalIndexOfNext = galleryItems.indexOf(visibleItems[currentVisibleIndex + 1]);
            updateLightboxImage(originalIndexOfNext);
        } else if (visibleItems.length > 1) { // Wrap around to first visible
            const originalIndexOfFirst = galleryItems.indexOf(visibleItems[0]);
            updateLightboxImage(originalIndexOfFirst);
        }
    }
    
    function updateLightboxNav() {
        if (!lightboxPrev || !lightboxNext) return;
        const visibleItems = galleryItems.filter(item => !item.classList.contains('hide'));
        if (visibleItems.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'block';
            lightboxNext.style.display = 'block';
        }
    }

}); // End DOMContentLoaded




// ... (existing script.js code) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (all previous DOMContentLoaded code: currentYear, smoothScroll, IntersectionObserver, gallery scripts) ...

    // --- STORE PAGE SPECIFIC SCRIPT ---
    const categoryButtons = document.querySelectorAll('.store-categories .category-btn');
    const productItems = document.querySelectorAll('.product-grid-area .product-item');
    const productModal = document.getElementById('product-detail-modal');
    const modalCloseBtn = productModal ? productModal.querySelector('.modal-close-btn') : null;

    // Modal elements to populate
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalDescription = document.getElementById('modal-product-description');
    const modalSpecsList = document.getElementById('modal-product-specs');
    const modalPrice = document.getElementById('modal-product-price');
    const modalRequisitionBtn = productModal ? productModal.querySelector('.btn-add-requisition') : null;
    const modalQuoteBtn = productModal ? productModal.querySelector('.btn-request-quote') : null;
    const requisitionFeedback = document.getElementById('requisition-feedback');


    // Category Filtering
    if (categoryButtons.length > 0 && productItems.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterCategory = button.dataset.category;

                productItems.forEach(item => {
                    item.classList.add('hide'); // Start by hiding
                    setTimeout(() => { // Allow CSS transition to register 'hide'
                        if (filterCategory === 'all' || item.dataset.category === filterCategory) {
                            item.classList.remove('hide');
                        }
                    }, 50);
                });
            });
        });
    }

    // Product Detail Modal
    if (productModal && modalCloseBtn) {
        productItems.forEach(item => {
            const viewSpecsBtn = item.querySelector('.btn-view-specs');
            if (viewSpecsBtn) {
                viewSpecsBtn.addEventListener('click', () => {
                    const name = item.dataset.name;
                    const price = item.dataset.price;
                    const specs = JSON.parse(item.dataset.specs || '[]');
                    const description = item.dataset.description;
                    const image = item.dataset.image || item.querySelector('img').src; // Fallback to card image
                    const pid = item.dataset.pid;

                    populateAndOpenModal(name, price, specs, description, image, pid);
                });
            }
        });

        modalCloseBtn.addEventListener('click', closeModal);
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) { // Clicked on backdrop
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModal.style.display === 'block') {
                closeModal();
            }
        });

        if (modalRequisitionBtn) {
            modalRequisitionBtn.addEventListener('click', function() {
                const productId = this.dataset.pid;
                const quantity = productModal.querySelector('.quantity-input').value;
                // Firebase Comment: Actual logic to add to Firestore user's cart/requisition list
                console.log(`Adding ${quantity} of ${productId} to requisition list.`);
                showRequisitionFeedback(`Item "${productId}" (x${quantity}) added to requisition.`, 'success');
                // For demo, close modal after a delay
                setTimeout(closeModal, 2000);
            });
        }
         if (modalQuoteBtn) {
            modalQuoteBtn.addEventListener('click', function() {
                const productId = this.dataset.pid;
                console.log(`Requesting quote for ${productId}.`);
                showRequisitionFeedback(`Quote request for "${productId}" submitted. We will contact you.`, 'success');
                 setTimeout(closeModal, 2000);
            });
        }

    } // end if (productModal)

    function populateAndOpenModal(name, price, specs, description, image, pid) {
        modalImage.src = image;
        modalName.textContent = name;
        modalDescription.textContent = description;
        modalPrice.textContent = price;

        modalSpecsList.innerHTML = ''; // Clear previous specs
        specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            modalSpecsList.appendChild(li);
        });

        if (modalRequisitionBtn) modalRequisitionBtn.dataset.pid = pid;
        if (modalQuoteBtn) modalQuoteBtn.dataset.pid = pid;


        // Show/hide requisition or quote button based on price
        if (price.toLowerCase().includes('classified') || price.toLowerCase().includes('quote')) {
            if(modalRequisitionBtn) modalRequisitionBtn.style.display = 'none';
            if(modalQuoteBtn) modalQuoteBtn.style.display = 'inline-block';
        } else {
            if(modalRequisitionBtn) modalRequisitionBtn.style.display = 'inline-block';
            if(modalQuoteBtn) modalQuoteBtn.style.display = 'none';
        }


        productModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (requisitionFeedback) requisitionFeedback.style.display = 'none'; // Hide feedback on close
    }

    function showRequisitionFeedback(message, type = 'success') {
        if (!requisitionFeedback) return;
        requisitionFeedback.textContent = message;
        requisitionFeedback.className = `requisition-feedback-message ${type}`; // Add specific class for styling
        requisitionFeedback.style.display = 'block';
    }


}); // End DOMContentLoaded


// ... (existing script.js code) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (all previous DOMContentLoaded code: currentYear, smoothScroll, IntersectionObserver, gallery, store scripts) ...

    // --- FORUM PAGE SPECIFIC SCRIPT ---
    const newThreadBtn = document.getElementById('new-thread-btn');
    const transmissionModal = document.getElementById('new-transmission-modal');
    const modalCloseBtnForum = transmissionModal ? transmissionModal.querySelector('.forum-modal-close') : null;
    const transmissionForm = document.getElementById('new-transmission-form');
    const transmissionFeedback = document.getElementById('transmission-feedback');

    // Open New Transmission Modal
    if (newThreadBtn) {
        newThreadBtn.addEventListener('click', () => {
            if (transmissionModal) {
                transmissionModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                 // Firebase Comment: Could check auth here before opening
                // const user = Firebase.auth().currentUser;
                // if (!user) { alert('Login required to post.'); return; }
            }
        });
    }

    // Close Modal
    if (modalCloseBtnForum) {
        modalCloseBtnForum.addEventListener('click', closeForumModal);
    }
    if (transmissionModal) {
        transmissionModal.addEventListener('click', (e) => {
            if (e.target === transmissionModal) { // Clicked on backdrop
                closeForumModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && transmissionModal.style.display === 'block') {
                closeForumModal();
            }
        });
    }

    // Handle Form Submission
    if (transmissionForm) {
        transmissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('transmission-title').value;
            const category = document.getElementById('transmission-category').value;
            const content = document.getElementById('transmission-content').value;

            // Firebase Comment:
            // const user = Firebase.auth().currentUser;
            // if (!user) { showTransmissionFeedback('Authentication error. Please login.', 'error'); return; }
            // Firebase.firestore().collection('forumThreads').add({
            //     title: title,
            //     category: category,
            //     content: content,
            //     authorId: user.uid,
            //     authorName: user.displayName || 'Anonymous Sentinel', // Or from user profile
            //     createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
            //     lastReplyAt: Firebase.firestore.FieldValue.serverTimestamp(),
            //     replyCount: 0
            // }).then(() => {
            //     showTransmissionFeedback('Transmission successful!', 'success');
            //     transmissionForm.reset();
            //     setTimeout(closeForumModal, 1500);
            // }).catch(error => {
            //     showTransmissionFeedback('Error: ' + error.message, 'error');
            // });

            // --- Demo ---
            console.log('Transmitting:', { title, category, content });
            showTransmissionFeedback('Transmission successful! (Demo)', 'success');
            transmissionForm.reset();
            setTimeout(closeForumModal, 1500);
            // --- End Demo ---
        });
    }

    function closeForumModal() {
        if (transmissionModal) {
            transmissionModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (transmissionFeedback) transmissionFeedback.style.display = 'none';
        }
    }

    function showTransmissionFeedback(message, type = 'success') {
        if (!transmissionFeedback) return;
        transmissionFeedback.textContent = message;
        transmissionFeedback.className = `transmission-feedback-message ${type}`;
        transmissionFeedback.style.display = 'block';
    }

    // Firebase Comment: Listener for real-time updates on categories, hot threads etc.
    // This would dynamically update thread counts, last post info.
    // For instance, listening to 'forumCategories' for changes.
    // Firebase.firestore().collection('forumCategories').onSnapshot(snapshot => {
    //   snapshot.docChanges().forEach(change => {
    //     if (change.type === "modified") {
    //       const categoryData = change.doc.data();
    //       const categoryId = change.doc.id;
    //       const categoryElement = document.querySelector(`.forum-category[data-category-id="${categoryId}"]`);
    //       if (categoryElement) {
    //         // Update .category-stats and .category-last-post children
    //       }
    //     }
    //   });
    // });

}); // End DOMContentLoaded


// ... (existing script.js code) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (all previous DOMContentLoaded code: currentYear, smoothScroll, IntersectionObserver, gallery, store, forum scripts) ...

    // --- BOOKINGS PAGE SPECIFIC SCRIPT ---
    const bookingForm = document.getElementById('service-requisition-form');
    const serviceTypeRadios = bookingForm ? bookingForm.querySelectorAll('input[name="serviceType"]') : [];
    const detailsBodyguard = document.getElementById('service-details-bodyguard');
    const detailsDrone = document.getElementById('service-details-drone');
    const submitBookingBtn = document.getElementById('submit-booking-btn');
    const acknowledgeCheckbox = document.getElementById('acknowledge-terms');
    const requisitionStatusMessage = document.getElementById('requisition-status-message');
    const lastAuditDateSpan = document.getElementById('last-audit-date');

    // Update last audit date in footer (cosmetic)
    if (lastAuditDateSpan) {
        const today = new Date();
        const auditDay = String(today.getDate() - Math.floor(Math.random() * 5 + 1)).padStart(2, '0'); // Random day in last week
        const auditMonth = String(today.getMonth() + 1).padStart(2, '0');
        const auditYear = today.getFullYear();
        lastAuditDateSpan.textContent = `${auditYear}-${auditMonth}-${auditDay}`;
    }

    // Function to toggle conditional detail sections based on service type
    function toggleServiceDetails() {
        const selectedService = bookingForm.querySelector('input[name="serviceType"]:checked');
        if (!selectedService) {
            if (detailsBodyguard) detailsBodyguard.style.display = 'none';
            if (detailsDrone) detailsDrone.style.display = 'none';
            return;
        }

        const serviceValue = selectedService.value;

        if (detailsBodyguard) {
            detailsBodyguard.style.display = (serviceValue === 'bodyguard_services') ? 'block' : 'none';
        }
        if (detailsDrone) {
            detailsDrone.style.display = (serviceValue === 'drone_operations') ? 'block' : 'none';
        }
    }

    // Add event listeners to radio buttons
    if (serviceTypeRadios.length > 0) {
        serviceTypeRadios.forEach(radio => {
            radio.addEventListener('change', toggleServiceDetails);
        });
        // Initial call to set correct visibility if a radio is pre-selected (e.g. by URL hash)
        toggleServiceDetails();
    }

    // Handle anchor links in nav dropdown to pre-select service
    function checkHashForService() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1); // Remove #
            const targetRadio = document.getElementById(hash);
            if (targetRadio && targetRadio.type === 'radio') {
                targetRadio.checked = true;
                toggleServiceDetails(); // Update visible sections
                // Smooth scroll to the selection section (optional)
                const sectionToScroll = document.getElementById('service-selection-section');
                if (sectionToScroll) {
                     const navHeight = document.querySelector('header')?.offsetHeight || 0;
                     const elementPosition = sectionToScroll.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20; // Extra 20px padding
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        }
    }
    // Check hash on page load and on hash change (if nav items use #service-drone etc.)
    window.addEventListener('load', checkHashForService);
    window.addEventListener('hashchange', checkHashForService);


    // Form submission
    if (bookingForm && submitBookingBtn) {
        // Initially disable submit button until checkbox is checked
        submitBookingBtn.disabled = !acknowledgeCheckbox.checked;

        if(acknowledgeCheckbox) {
            acknowledgeCheckbox.addEventListener('change', function() {
                submitBookingBtn.disabled = !this.checked;
            });
        }

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!acknowledgeCheckbox.checked) {
                showBookingStatus("Acknowledgement of terms is mandatory.", "error");
                acknowledgeCheckbox.focus();
                return;
            }

            submitBookingBtn.disabled = true;
            submitBookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';

            const formData = new FormData(bookingForm);
            const dataObject = {};
            formData.forEach((value, key) => dataObject[key] = value);

            // Firebase Comment: Submit dataObject to Firestore 'serviceRequisitions'
            // Firebase.firestore().collection('serviceRequisitions').add({
            //     ...dataObject,
            //     submittedAt: Firebase.firestore.FieldValue.serverTimestamp(),
            //     status: 'pending_review',
            //     // userId: Firebase.auth().currentUser.uid // If user is authenticated
            // }).then(docRef => {
            //     showBookingStatus(`Requisition ID: ${docRef.id} submitted successfully. A coordinator will contact you.`, 'success');
            //     bookingForm.reset();
            //     toggleServiceDetails(); // Reset conditional fields visibility
            //     submitBookingBtn.disabled = false; // Re-enable after successful logic
            //     acknowledgeCheckbox.checked = false; // Uncheck
            //     submitBookingBtn.innerHTML = '<i class="fas fa-lock"></i> Transmit Secure Requisition';
            // }).catch(error => {
            //     showBookingStatus(`Error: ${error.message}. Please try again or contact support.`, 'error');
            //     submitBookingBtn.disabled = false;
            //     submitBookingBtn.innerHTML = '<i class="fas fa-lock"></i> Transmit Secure Requisition';
            // });

            // --- Demo Logic ---
            console.log('Service Requisition Data:', dataObject);
            setTimeout(() => { // Simulate network delay
                const demoId = "SR" + Math.random().toString(36).substr(2, 9).toUpperCase();
                showBookingStatus(`Requisition ID: ${demoId} submitted (Demo). A coordinator will contact you.`, 'success');
                bookingForm.reset();
                toggleServiceDetails();
                if(acknowledgeCheckbox) acknowledgeCheckbox.checked = false;
                submitBookingBtn.disabled = !acknowledgeCheckbox.checked;
                submitBookingBtn.innerHTML = '<i class="fas fa-lock"></i> Transmit Secure Requisition';
            }, 1500);
            // --- End Demo Logic ---
        });
    }

    function showBookingStatus(message, type = 'success') {
        if (!requisitionStatusMessage) return;
        requisitionStatusMessage.textContent = message;
        requisitionStatusMessage.className = `status-message ${type}`;
        requisitionStatusMessage.style.display = 'block';

        // Scroll to the message if it's off-screen
        requisitionStatusMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }


}); // End DOMContentLoaded


// ... (existing script.js code including IntersectionObserver etc.) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code for footer year, smooth scroll, gallery, store, forum, bookings) ...


    // --- BLOG PAGE (MODAL) SPECIFIC SCRIPT ---
    const blogPostCards = document.querySelectorAll('.blog-post-card');
    const blogPostModal = document.getElementById('blog-post-modal');
    const modalCloseBtnBlog = blogPostModal ? blogPostModal.querySelector('.blog-modal-close') : null;
    const modalBackBtnBlog = blogPostModal ? blogPostModal.querySelector('.modal-back-to-list') : null;

    // Elements inside the modal to populate
    const modalBlogTitle = document.getElementById('modal-blog-title');
    const modalBlogMeta = document.getElementById('modal-blog-meta');
    const modalBlogImage = document.getElementById('modal-blog-image');
    const modalBlogContentBody = document.getElementById('modal-blog-content-body');


    // Add event listeners to "Read Briefing" buttons (or the cards themselves)
    if (blogPostCards.length > 0 && blogPostModal) {
        blogPostCards.forEach(card => {
            const readMoreBtn = card.querySelector('.blog-read-more'); // Target the specific button

            if (readMoreBtn) {
                 readMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default link behavior

                    // Extract data from data- attributes on the parent card
                    const fullImageUrl = card.dataset.fullImageUrl;
                    const fullTitle = card.dataset.fullTitle;
                    const fullMetaHtml = card.dataset.fullMeta; // Meta as HTML string
                    const fullContentHtml = card.dataset.fullContent; // Full HTML content string
                    // const postId = card.dataset.postId; // Use this to fetch from Firebase

                    // --- Firebase Comment:
                    // Instead of getting full content from data-attributes (like this prototype),
                    // a real application would often fetch the full blog post content from Firestore here:
                    // Firebase.firestore().collection('blogPosts').doc(postId).get().then(doc => {
                    //     if (doc.exists) {
                    //         const postData = doc.data();
                    //         populateAndOpenBlogModal(postData.fullImageUrl, postData.title, postData.metaHtml, postData.contentHtml);
                    //         // You might still get title, image etc. from the list fetch result
                    //         // and only fetch the contentHtml field on click.
                    //     } else {
                    //         console.error("No such post found!");
                    //         // Optionally show an error message to the user
                    //     }
                    // }).catch(error => {
                    //     console.error("Error fetching post:", error);
                    //      // Optionally show an error message
                    // });
                    // --- End Firebase Comment

                    // --- Prototype using data-attributes ---
                    populateAndOpenBlogModal(fullImageUrl, fullTitle, fullMetaHtml, fullContentHtml);
                    // --- End Prototype ---

                 });
            }

            // Optional: Make the whole card clickable, but need to handle internal links then
            /*
             card.addEventListener('click', (e) => {
                 // Check if the click target is *not* an internal link (like category link)
                 if (!e.target.closest('a') && !e.target.closest('button')) {
                      e.preventDefault();
                     const fullImageUrl = card.dataset.fullImageUrl;
                    const fullTitle = card.dataset.fullTitle;
                    const fullMetaHtml = card.dataset.fullMeta; // Meta as HTML string
                    const fullContentHtml = card.dataset.fullContent; // Full HTML content string
                     populateAndOpenBlogModal(fullImageUrl, fullTitle, fullMetaHtml, fullContentHtml);
                 }
             });
            */
        });

        // Modal Close Events
        if (modalCloseBtnBlog) {
            modalCloseBtnBlog.addEventListener('click', closeBlogModal);
        }
         if (modalBackBtnBlog) {
             modalBackBtnBlog.addEventListener('click', closeBlogModal);
         }

        // Close if clicked outside content or press Escape
        blogPostModal.addEventListener('click', (e) => {
            // If the clicked element is the modal backdrop itself, not inside modal content
             if (e.target.classList.contains('blog-modal')) {
                 closeBlogModal();
             }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogPostModal.style.display === 'flex') { // Modal displayed using flex
                closeBlogModal();
            }
        });
    } // End if (blogPostCards...)

    function populateAndOpenBlogModal(imageUrl, title, metaHtml, contentHtml) {
        if (!blogPostModal || !modalBlogTitle || !modalBlogMeta || !modalBlogImage || !modalBlogContentBody) return;

        modalBlogTitle.textContent = title;
        modalBlogMeta.innerHTML = metaHtml; // Inject HTML string directly
        modalBlogImage.src = imageUrl;
        modalBlogContentBody.innerHTML = contentHtml; // Inject full HTML string directly

        blogPostModal.style.display = 'flex'; // Use flex to help center content
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Reset scroll to top of the modal content when opened
        if (blogPostModal.querySelector('.blog-modal-content')) {
            blogPostModal.querySelector('.blog-modal-content').scrollTop = 0;
        }

         // Optional: Add a brief delay/animation on image/content fade in for polish
        // modalBlogImage.style.opacity = 0; // Example Fade in
        // modalBlogContentBody.style.opacity = 0;
        // setTimeout(() => {
        //     modalBlogImage.style.opacity = 1;
        //      modalBlogContentBody.style.opacity = 1;
        // }, 50);

    }

    function closeBlogModal() {
        if (!blogPostModal) return;
        // Optional: add a fadeOut animation if desired via a class
        // blogPostModal.classList.add('fadeOut');
        // setTimeout(() => {
        //     blogPostModal.style.display = 'none';
        //     blogPostModal.classList.remove('fadeOut');
        //     document.body.style.overflow = 'auto';
        // }, 290); // Match fadeOut duration

        blogPostModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

}); // End DOMContentLoaded