// Blog page functionality
let allBlogs = [];
let currentPage = 1;
let currentCategory = 'all';
const blogsPerPage = 6;

// Load blogs from JSON
async function loadBlogs() {
    try {
        showLoading();
        const response = await fetch('data/blogs.json');
        const data = await response.json();
        allBlogs = data.blogs;
        hideLoading();
        renderBlogs();
        setupFilters();
    } catch (error) {
        console.error('Error loading blogs:', error);
        hideLoading();
        showEmptyState();
    }
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('blogGrid').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('blogGrid').style.display = 'grid';
}

// Show empty state
function showEmptyState() {
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('blogGrid').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
}

// Hide empty state
function hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('blogGrid').style.display = 'grid';
    document.getElementById('pagination').style.display = 'flex';
}

// Filter blogs by category
function filterBlogs() {
    if (currentCategory === 'all') {
        return allBlogs;
    }
    return allBlogs.filter(blog => blog.category === currentCategory);
}

// Get paginated blogs
function getPaginatedBlogs() {
    const filteredBlogs = filterBlogs();
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return filteredBlogs.slice(startIndex, endIndex);
}

// Render blogs
function renderBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    const filteredBlogs = filterBlogs();
    
    if (filteredBlogs.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    const paginatedBlogs = getPaginatedBlogs();
    
    // Clear and fade out
    blogGrid.style.opacity = '0';
    
    setTimeout(() => {
        blogGrid.innerHTML = '';
        
        paginatedBlogs.forEach((blog, index) => {
            const blogCard = createBlogCard(blog, index);
            blogGrid.appendChild(blogCard);
        });
        
        // Fade in
        blogGrid.style.opacity = '1';
        
        // Render pagination
        renderPagination(filteredBlogs.length);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
}

// Create blog card element
function createBlogCard(blog, index) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Determine category class
    let categoryClass = '';
    if (blog.category === 'Cloud') categoryClass = 'cloud';
    else if (blog.category === 'Web Development') categoryClass = 'web';
    else if (blog.category === 'DevOps') categoryClass = 'devops';
    
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
    
    // Add click handler to navigate to blog detail page
    card.addEventListener('click', () => {
        const slug = blog.slug || blog.id;
        window.location.href = `blog-detail.html?slug=${slug}`;
    });
    
    return card;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Render pagination
function renderPagination(totalBlogs) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pagination.innerHTML = '';
    
    // Previous button
    const prevBtn = createPaginationButton('← Prev', currentPage - 1, currentPage === 1);
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbers = getPageNumbers(currentPage, totalPages);
    pageNumbers.forEach(pageNum => {
        if (pageNum === '...') {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        } else {
            const pageBtn = createPaginationButton(pageNum, pageNum, false, pageNum === currentPage);
            pagination.appendChild(pageBtn);
        }
    });
    
    // Next button
    const nextBtn = createPaginationButton('Next →', currentPage + 1, currentPage === totalPages);
    pagination.appendChild(nextBtn);
}

// Create pagination button
function createPaginationButton(text, page, disabled = false, active = false) {
    const button = document.createElement('button');
    button.className = 'pagination-btn';
    button.textContent = text;
    button.disabled = disabled;
    
    if (active) {
        button.classList.add('active');
    }
    
    if (!disabled) {
        button.addEventListener('click', () => {
            currentPage = page;
            renderBlogs();
        });
    }
    
    return button;
}

// Get page numbers to display
function getPageNumbers(current, total) {
    const pages = [];
    
    if (total <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);
        
        if (current > 3) {
            pages.push('...');
        }
        
        // Show pages around current
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i);
        }
        
        if (current < total - 2) {
            pages.push('...');
        }
        
        // Always show last page
        pages.push(total);
    }
    
    return pages;
}

// Setup category filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current category and reset to page 1
            currentCategory = btn.dataset.category;
            currentPage = 1;
            
            // Re-render blogs
            renderBlogs();
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
});
