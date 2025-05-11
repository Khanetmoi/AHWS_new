 // Navbar scroll effect
 window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const backdrop = document.querySelector('.backdrop');
const body = document.body;
hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.classList.toggle('active');
    backdrop.classList.toggle('active');
    body.classList.toggle('no-scroll');
    hamburger.classList.toggle('menu-open');
    hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    // Reset dropdowns when opening/closing menu
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Close menu on backdrop click
backdrop.addEventListener('click', () => {
    navLinks.classList.remove('active');
    backdrop.classList.remove('active');
    body.classList.remove('no-scroll');
    hamburger.classList.remove('menu-open');
    hamburger.textContent = '☰';
    // Reset dropdowns
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Mobile dropdown toggle
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('a');
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const isActive = dropdownContent.classList.contains('active');
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
            if (!isActive) {
                dropdownContent.classList.add('active');
                dropdown.classList.add('active');
            }
        }
    });
});

// Active link highlighting based on scroll
const sections = document.querySelectorAll('section');
const navLinksA = document.querySelectorAll('.nav-links a:not(.cta-button)');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    navLinksA.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                dropdown.querySelector('a').classList.add('active');
            }
        }
    });
});

// Click-based highlighting and close mobile menu
navLinksA.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth > 768 || link.closest('.dropdown-content') || !link.closest('.dropdown')) {
            navLinksA.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                dropdown.querySelector('a').classList.add('active');
            }
            navLinks.classList.remove('active');
            backdrop.classList.remove('active');
            body.classList.remove('no-scroll');
            hamburger.classList.remove('menu-open');
            hamburger.textContent = '☰';
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Ensure CTA button closes mobile menu
document.querySelector('.cta-button').addEventListener('click', () => {
    navLinks.classList.remove('active');
    backdrop.classList.remove('active');
    body.classList.remove('no-scroll');
    hamburger.classList.remove('menu-open');
    hamburger.textContent = '☰';
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Pricing toggle functionality
const pricingToggle = document.querySelector('#pricing-toggle');
const priceMains = document.querySelectorAll('.price-main');
const priceSubs = document.querySelectorAll('.price-sub');

document.querySelectorAll('#pricing .card').forEach(card => {
    card.style.opacity = '1';
    card.style.visibility = 'visible';
});

pricingToggle.addEventListener('change', () => {
    const isMonthly = pricingToggle.checked;
    priceMains.forEach(main => {
        if (main.closest('.card.one-time')) return;
        main.textContent = isMonthly ? main.dataset.monthly : main.dataset.yearly;
    });
    priceSubs.forEach(sub => {
        if (sub.closest('.card.one-time')) return;
        sub.textContent = isMonthly ? sub.dataset.monthly : sub.dataset.yearly;
    });
    document.querySelectorAll('#pricing .card').forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
});

// Popup functionality
const signupButtons = document.querySelectorAll('.signup-button');
const popup = document.getElementById('signup-popup');
const closeBtn = document.querySelector('.close-btn');
const signupForm = document.getElementById('signup-form');

signupButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const plan = button.getAttribute('data-plan');
        document.querySelector('#signup-form').setAttribute('data-plan', plan);
        popup.style.display = 'flex';
    });
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    const plan = signupForm.getAttribute('data-plan');
    formData.append('plan', plan);
    formData.append('timestamp', new Date().toISOString());

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxfu8524PxQzZs3ETLE2hLCG9QOqpj7hT2-i5EAVLmOuKQyJLfke0Kgc-CjcWAOBJQh/exec', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Data submitted successfully! A representative will verify your payment.');
            popup.style.display = 'none';
            signupForm.reset();
        } else {
            alert('Error submitting data. Please try again.');
        }
    } catch (error) {
        alert('Error submitting data. Please try again.');
        console.error('Error:', error);
    }
});


// geolocation functionality

document.addEventListener('DOMContentLoaded', () => {
    const cities = document.querySelectorAll('.city');
    const toggleBtn = document.getElementById('toggle-map');
    const checkBtn = document.getElementById('check-location');
    const locationMessage = document.getElementById('location-message');
    const mapView = document.getElementById('map-view');
    const listView = document.getElementById('list-view');
    let isMapVisible = window.innerWidth > 768;

    // City coordinates (latitude, longitude)
    const cityCoords = {
        'Casablanca': { lat: 33.5731, lon: -7.5898 },
        'Rabat': { lat: 34.0209, lon: -6.8416 },
        'Marrakech': { lat: 31.6295, lon: -7.9811 },
        'Fez': { lat: 34.0181, lon: -5.0078 },
        'Tangier': { lat: 35.7595, lon: -5.8340 }
    };

    // Haversine formula to calculate distance between two points (in km)
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Check user's location
    checkBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationMessage.textContent = 'Geolocation is not supported by your browser.';
            return;
        }

        locationMessage.textContent = 'Checking your location...';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                let foundCity = null;
                const radius = 50; // 50 km radius

                // Reset previous highlights
                cities.forEach(city => city.classList.remove('user-location'));

                // Check proximity to each city
                for (const [city, coords] of Object.entries(cityCoords)) {
                    const distance = haversineDistance(userLat, userLon, coords.lat, coords.lon);
                    if (distance <= radius) {
                        foundCity = city;
                        break;
                    }
                }

                if (foundCity) {
                    locationMessage.textContent = `You are in ${foundCity}, which is part of our coverage area!`;
                    // Highlight the city on the map
                    const cityElements = document.querySelectorAll(`.city[data-name="${foundCity}"]`);
                    cityElements.forEach(el => el.classList.add('user-location'));
                } else {
                    locationMessage.textContent = 'You are not in one of our covered cities (Casablanca, Rabat, Marrakech, Fez, Tangier).';
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    locationMessage.textContent = 'Location access denied. Please allow location access to use this feature.';
                } else {
                    locationMessage.textContent = 'Unable to retrieve your location. Please try again.';
                }
            }
        );
    });

    // Toggle map/list visibility on mobile
    toggleBtn.addEventListener('click', () => {
        isMapVisible = !isMapVisible;
        if (isMapVisible) {
            mapView.style.display = 'block';
            listView.style.display = 'none';
            toggleBtn.textContent = 'Show List';
        } else {
            mapView.style.display = 'none';
            listView.style.display = 'block';
            toggleBtn.textContent = 'Show Map';
        }
    });

    // Initialize visibility based on screen size
    if (window.innerWidth <= 768) {
        mapView.style.display = 'none';
        listView.style.display = 'block';
        toggleBtn.textContent = 'Show Map';
    }

    // Handle hover and touch events
    cities.forEach(city => {
        city.addEventListener('mouseover', () => {
            if (!city.classList.contains('user-location')) {
                city.setAttribute('fill', '#34d399');
            }
        });
        city.addEventListener('mouseout', () => {
            if (!city.classList.contains('user-location')) {
                city.setAttribute('fill', '#d1d5db');
            }
        });

        city.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!city.classList.contains('user-location')) {
                city.classList.add('active');
            }
        });
        city.addEventListener('touchend', () => {
            if (!city.classList.contains('user-location')) {
                setTimeout(() => {
                    city.classList.remove('active');
                }, 500);
            }
        });
    });

    // Update visibility on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mapView.style.display = 'block';
            listView.style.display = 'block';
            isMapVisible = true;
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'block';
            if (isMapVisible) {
                mapView.style.display = 'block';
                listView.style.display = 'none';
            } else {
                mapView.style.display = 'none';
                listView.style.display = 'block';
            }
        }
    });
});


// FAQ functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = answer.classList.contains('active');

            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('active');
                item.style.maxHeight = '0';
            });
            document.querySelectorAll('.faq-question').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle the clicked answer
            if (!isActive) {
                answer.classList.add('active');
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});


// bg paterns

document.addEventListener('DOMContentLoaded', () => {
    const patternContainer = document.querySelector('.background-pattern');
    const gridSize = 150; // Distance between icons in pixels
    const iconSize = 50; // Base size of each icon
    const icons = [
        '<i class="fas fa-screwdriver" aria-hidden="true"></i>',
        '<i class="fas fa-wrench" aria-hidden="true"></i>',
        '<i class="fas fa-refrigerator" aria-hidden="true"></i>',
        '<i class="fas fa-fire-burner" aria-hidden="true"></i>'
    ];

    function createPattern() {
        patternContainer.innerHTML = ''; // Clear previous pattern
        const bodyWidth = document.body.clientWidth;
        const bodyHeight = document.body.clientHeight;
        const cols = Math.ceil(bodyWidth / gridSize) + 1;
        const rows = Math.ceil(bodyHeight / gridSize) + 1;

        let index = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const icon = document.createElement('div');
                icon.className = 'background-icon';
                const x = col * gridSize + (Math.random() * 20 - 10); // Slight random offset
                const y = row * gridSize + (Math.random() * 20 - 10); // Slight random offset
                const iconType = icons[index % icons.length];
                icon.style.left = `${x}px`;
                icon.style.top = `${y}px`;
                icon.style.width = `${iconSize}px`;
                icon.style.height = `${iconSize}px`;
                icon.style.opacity = 0.1;
                icon.innerHTML = iconType;
                patternContainer.appendChild(icon);
                index++;
            }
        }
    }

    createPattern();
    window.addEventListener('resize', createPattern);

    const navLinks = document.querySelector('.nav-links');
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

// map functionality

// Initialize map centered on Casablanca
const map = L.map('map').setView([33.5731, -7.5898], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

// Define locations with approximate coordinates
const locations = [
    { name: 'Aïn Chock', coords: [33.535, -7.582], address: '123 Example Street' },
    { name: 'Al Fida', coords: [33.566, -7.605], address: '456 Sample Road' },
    { name: 'Anfa', coords: [33.595, -7.667], address: '789 Coastal Avenue' },
    { name: 'Essoukhour Assawda', coords: [33.570, -7.570], address: '101 Market Lane' },
    { name: 'Hay Hassani', coords: [33.552, -7.652], address: '202 Park Street' },
    { name: 'Hay Mohammadi', coords: [33.585, -7.570], address: '303 Industrial Road' },
    { name: 'Maârif', coords: [33.582, -7.635], address: '404 Central Boulevard' }
];

// Add markers
locations.forEach(location => {
    L.marker(location.coords)
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>${location.address}<br><a href="#">Get Directions</a>`);
});

// payment form 

document.getElementById('next-button').addEventListener('click', function () {
    const requiredFields = ['name', 'address', 'phone', 'email'];
    let valid = true;

    requiredFields.forEach(id => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        input.focus();
        valid = false;
      }
    });

    if (!valid) return;

    // Hide Step 1 and show Payment Step
    document.getElementById('step-one').style.display = 'none';
    document.getElementById('payment').style.display = 'block';

    // Optional: scroll to payment step
    document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
  });