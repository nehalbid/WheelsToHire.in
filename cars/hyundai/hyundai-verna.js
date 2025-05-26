// Image gallery functionality
function changeImage(src) {
    document.getElementById('mainImage').src = src;
    // Update active state of thumbnails
    document.querySelectorAll('.thumbnail-container img').forEach(img => {
        img.classList.remove('active');
        if (img.src === src) {
            img.classList.add('active');
        }
    });
}

// Calculate total price based on selected dates
function calculateTotal() {
    const pickupDate = new Date(document.getElementById('pickup-date').value);
    const returnDate = new Date(document.getElementById('return-date').value);
    
    if (pickupDate && returnDate && returnDate >= pickupDate) {
        const days = Math.max(1, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)));
        const total = days * 1999;
        document.getElementById('totalPrice').textContent = `Rs ${total}`;
    } else {
        document.getElementById('totalPrice').textContent = `Rs 1999`;
    }
}

// Set minimum date to today for both inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('pickup-date').min = today;
document.getElementById('return-date').min = today;

// Add event listeners for date inputs
document.getElementById('pickup-date').addEventListener('change', calculateTotal);
document.getElementById('return-date').addEventListener('change', calculateTotal);

// Handle rent now button click
function handleRentNow() {
    const pickupDate = document.getElementById('pickup-date').value;
    const returnDate = document.getElementById('return-date').value;
    
    if (!pickupDate || !returnDate) {
        alert('Please select both pickup and return dates');
        return;
    }
    
    if (new Date(returnDate) < new Date(pickupDate)) {
        alert('Return date must be after pickup date');
        return;
    }
    
    // Calculate total price based on selected dates
    const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * 1999;
    
    // Redirect to the rental form page with query parameters
    const car = "Hyundai Verna";
    const bookingUrl = `../../booking/rentalform.html?car=${encodeURIComponent(car)}&pickupDate=${encodeURIComponent(pickupDate)}&returnDate=${encodeURIComponent(returnDate)}&totalPrice=${encodeURIComponent('Rs ' + totalPrice)}`;
    window.location.href = bookingUrl;
}

// Account dropdown functionality
const accountBtn = document.getElementById('account-btn');
const accountMenu = document.getElementById('account-menu');

accountBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    accountMenu.style.display = accountMenu.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', function(e) {
    if (!accountBtn.contains(e.target) && !accountMenu.contains(e.target)) {
        accountMenu.style.display = 'none';
    }
});

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Add your logout logic here
        window.location.href = '../../login/login.html';
    });
}

// Initialize total price
calculateTotal();