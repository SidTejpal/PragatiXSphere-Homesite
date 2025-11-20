// Blog Detail Page Functionality
let currentBlog = null;
let allBlogs = [];

// Get slug from URL
function getSlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug') || urlParams.get('id');
}

// Load blog data
async function loadBlogDetail() {
    try {
        const response = await fetch('data/blogs.json');
        const data = await response.json();
        allBlogs = data.blogs;
        
        const slug = getSlugFromURL();
        
        if (!slug) {
            showNotFound();
            return;
        }
        
        // Find blog by slug or id
        currentBlog = allBlogs.find(blog => 
            blog.slug === slug || blog.id === parseInt(slug)
        );
        
        if (!currentBlog) {
            showNotFound();
            return;
        }
        
        renderBlogDetail();
        loadRelatedArticles();
        updateSEO();
        
    } catch (error) {
        console.error('Error loading blog:', error);
        showNotFound();
    }
}

// Render blog detail
function renderBlogDetail() {
    // Hide loading, show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('blogDetail').style.display = 'block';
    
    // Set breadcrumb
    document.getElementById('breadcrumbCategory').textContent = currentBlog.category;
    
    // Set hero meta
    const categoryElement = document.getElementById('heroCategory');
    categoryElement.textContent = currentBlog.category;
    categoryElement.className = `blog-category ${getCategoryClass(currentBlog.category)}`;
    
    document.getElementById('heroDate').textContent = formatDate(currentBlog.date);
    document.getElementById('heroReadTime').textContent = currentBlog.readTime;
    
    // Set title
    document.getElementById('heroTitle').textContent = currentBlog.title;
    
    // Set author
    const authorInitial = currentBlog.author.charAt(0).toUpperCase();
    document.getElementById('authorInitial').textContent = authorInitial;
    document.getElementById('authorName').textContent = currentBlog.author;
    
    // Set hero image
    const heroImage = document.getElementById('heroImage');
    heroImage.src = currentBlog.image;
    heroImage.alt = currentBlog.title;
    
    // Set content
    document.getElementById('blogContent').innerHTML = currentBlog.content;
    
    // Set tags
    const tagsContainer = document.getElementById('blogTags');
    tagsContainer.innerHTML = currentBlog.tags
        .map(tag => `<span class="blog-tag">${tag}</span>`)
        .join('');
}

// Load related articles
function loadRelatedArticles() {
    const relatedArticles = allBlogs
        .filter(blog => 
            blog.id !== currentBlog.id && 
            (blog.category === currentBlog.category || 
             blog.tags.some(tag => currentBlog.tags.includes(tag)))
        )
        .slice(0, 3);
    
    const container = document.getElementById('relatedArticles');
    container.innerHTML = '';
    
    relatedArticles.forEach((blog, index) => {
        const card = createBlogCard(blog, index);
        container.appendChild(card);
    });
}

// Create blog card
function createBlogCard(blog, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const categoryClass = getCategoryClass(blog.category);
    
    card.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}" class="blog-card-image" loading="lazy">
        <div class="blog-card-content">
            <div class="blog-card-meta">
                <span class="blog-category ${categoryClass}">${blog.category}</span>
                <span>•</span>
                <span>${formatDate(blog.date)}</span>
            </div>
            <h3 class="blog-card-title">${blog.title}</h3>
            <p class="blog-card-excerpt">${blog.excerpt}</p>
            <div class="blog-tags">
                ${blog.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
            <div class="blog-card-footer">
                <div class="blog-author">
                    <span>👤</span>
                    <span>${blog.author}</span>
                </div>
                <span class="blog-read-time">${blog.readTime}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `blog-detail.html?slug=${blog.slug}`;
    });
    
    return card;
}

// Get category class
function getCategoryClass(category) {
    if (category === 'Cloud') return 'cloud';
    if (category === 'Web Development') return 'web';
    if (category === 'DevOps') return 'devops';
    return '';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update SEO meta tags
function updateSEO() {
    document.getElementById('pageTitle').textContent = `${currentBlog.title} | PragatiXSphere Blog`;
    document.getElementById('metaDescription').content = currentBlog.excerpt;
    document.getElementById('metaKeywords').content = currentBlog.tags.join(', ');
    
    document.getElementById('ogTitle').content = currentBlog.title;
    document.getElementById('ogDescription').content = currentBlog.excerpt;
    document.getElementById('ogImage').content = currentBlog.image;
}

// Show not found
function showNotFound() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('notFoundState').style.display = 'block';
}

// Social sharing functions
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(currentBlog.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = event.target.closest('.share-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Copied!';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Newsletter subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    // TODO: Implement newsletter subscription
    alert('Thanks for subscribing! We\'ll keep you updated with the latest tech insights.');
    document.getElementById('newsletterEmail').value = '';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogDetail();
});
