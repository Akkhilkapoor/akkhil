/* =========================================================
   SUPABASE CONFIGURATION (Replace with your actual keys)
========================================================= */
const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";

/* =========================================================
   DOM ELEMENTS & MOBILE MENU TOGGLE
========================================================= */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// Close mobile menu on link click
document.querySelectorAll('header nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
        }
    });
});

/* =========================================================
   REVIEW MODAL LOGIC
========================================================= */
const openReviewBtn = document.getElementById('openReviewBtn');
const closeReviewBtn = document.getElementById('closeReviewBtn');
const reviewModal = document.getElementById('reviewModal');
const reviewForm = document.getElementById('reviewForm');
const reviewsContainer = document.getElementById('reviewsContainer');
const reviewMessage = document.getElementById('reviewMessage');

if (openReviewBtn && reviewModal) {
    openReviewBtn.addEventListener('click', () => {
        reviewModal.style.display = 'flex';
    });
}

if (closeReviewBtn && reviewModal) {
    closeReviewBtn.addEventListener('click', () => {
        reviewModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
        reviewModal.style.display = 'none';
    }
});

/* =========================================================
   XSS PROTECTION HELPER
========================================================= */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/* =========================================================
   LOAD APPROVED REVIEWS WITH READ MORE
========================================================= */
async function fetchReviews() {
    if (!reviewsContainer) return;
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/student_reviews?Approved=eq.true&select=Name,Rating,Review&order=Created_at.desc`,
            {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load reviews");
        }

        const data = await response.json();
        reviewsContainer.innerHTML = "";

        if (!data || data.length === 0) {
            reviewsContainer.innerHTML = `
                <p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
                    No reviews available yet. Be the first to write one!
                </p>
            `;
            return;
        }

        data.forEach(function(item) {
            const reviewCard = document.createElement("div");
            reviewCard.className = "review-card";

            const rating = parseInt(item.Rating) || 5;
            const ratingStars = "⭐".repeat(rating);
            const reviewContent = escapeHTML(item.Review);

            reviewCard.innerHTML = `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 5px;">
                        <strong>${escapeHTML(item.Name)}</strong>
                        <span style="font-size: 0.85em;">${ratingStars}</span>
                    </div>
                    <p class="review-text">"${reviewContent}"</p>
                    <button class="read-more-btn" onclick="toggleReadMore(this)">Read More</button>
                </div>
            `;

            reviewsContainer.appendChild(reviewCard);

            // Dynamically show Read More button only if review text is long
            const textElem = reviewCard.querySelector('.review-text');
            const btnElem = reviewCard.querySelector('.read-more-btn');
            
            if (item.Review && item.Review.length > 150) {
                btnElem.style.display = 'block';
            }
        });
    } catch (error) {
        console.error("Error loading reviews:", error);
        reviewsContainer.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: red;">
                Failed to load reviews. Please check your Supabase configurations.
            </p>
        `;
    }
}

/* =========================================================
   TOGGLE READ MORE / READ LESS
========================================================= */
function toggleReadMore(button) {
    const textElement = button.previousElementSibling;
    
    if (textElement.classList.contains('expanded')) {
        textElement.classList.remove('expanded');
        button.textContent = 'Read More';
    } else {
        textElement.classList.add('expanded');
        button.textContent = 'Read Less';
    }
}

/* =========================================================
   SUBMIT REVIEW FORM HANDLER
========================================================= */
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitReviewBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        reviewMessage.textContent = '';

        const formData = {
            Name: document.getElementById('reviewName').value,
            Rating: parseInt(document.getElementById('reviewRating').value),
            Review: document.getElementById('reviewText').value
        };

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/student_reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');

            reviewMessage.style.color = 'green';
            reviewMessage.textContent = 'Review submitted successfully! Pending approval.';
            reviewForm.reset();
            
            setTimeout(() => {
                reviewModal.style.display = 'none';
                reviewMessage.textContent = '';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
                fetchReviews(); // Refresh review list
            }, 2000);
        } catch (err) {
            console.error(err);
            reviewMessage.style.color = 'red';
            reviewMessage.textContent = 'Failed to submit review. Try again later.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

// Initial Call on Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchReviews();
});
