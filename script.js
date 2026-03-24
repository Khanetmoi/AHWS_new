// Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBPSk2oiYTdpg2zzmtIYMTDXKsoILKkzeg",
            authDomain: "centralappliancerepair.firebaseapp.com",
            projectId: "centralappliancerepair",
            storageBucket: "centralappliancerepair.firebasestorage.app",
            messagingSenderId: "148347576448",
            appId: "1:148347576448:web:779caa6e8e5b8c181d0665",
            measurementId: "G-986J260NQZ"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Initialize Lucide icons
        lucide.createIcons();

        // ========== UI HELPERS ==========
        function initCalculator() {
            const content = document.getElementById('calc-content');
            const event = document.getElementById('calc-event');
            const total = document.getElementById('calc-total');
            function update() {
                const sum = (parseInt(content.value) || 0) + (parseInt(event.value) || 0);
                total.textContent = '$' + sum.toLocaleString();
            }
            content.addEventListener('change', update);
            event.addEventListener('change', update);
            update();
        }

        function initScrollReveal() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        }

        function initNavbar() {
            const nav = document.getElementById('navbar');
            const trustBar = document.querySelector('.fixed.top-\\[72px\\]');
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.scrollY;
                if (currentScroll > 50) nav.classList.add('shadow-sm');
                else nav.classList.remove('shadow-sm');
                if (window.innerWidth < 768) {
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        nav.classList.add('nav-hidden');
                        if (trustBar) trustBar.classList.add('nav-hidden');
                    } else {
                        nav.classList.remove('nav-hidden');
                        if (trustBar) trustBar.classList.remove('nav-hidden');
                    }
                }
                lastScroll = currentScroll;
            }, { passive: true });
        }

        function toggleFaq(button) {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('[data-lucide="chevron-down"]');
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                answer.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0)';
            }
            lucide.createIcons();
        }

        function showToast(message, isError = false) {
            const toast = document.getElementById('toast');
            if (!toast) return;
            
            const toastIcon = toast.querySelector('[data-lucide="check-circle"]');
            const toastMessage = document.getElementById('toast-message');
            
            if (!toastMessage) return;
            
            toastMessage.textContent = message;
            
            // Update icon based on error/success
            if (toastIcon) {
                const iconName = isError ? 'alert-circle' : 'check-circle';
                toastIcon.setAttribute('data-lucide', iconName);
            }
            
            // Update background color
            if (isError) {
                toast.classList.remove('bg-stone-900');
                toast.classList.add('bg-red-600');
            } else {
                toast.classList.remove('bg-red-600');
                toast.classList.add('bg-stone-900');
            }
            
            // Re-render icons
            lucide.createIcons();
            
            // Show toast
            toast.classList.remove('translate-y-20', 'opacity-0');
            
            // Hide after 4 seconds
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 4000);
        }

        // Modal functions
        window.openModal = function(type) {
            const modal = document.getElementById('modal');
            modal.classList.remove('hidden');
            
            // Allow browser to render display:block before starting opacity/transform transitions
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modal.children[0].classList.remove('opacity-0');
                    modal.children[1].classList.remove('opacity-0', 'scale-95');
                    modal.children[1].classList.add('scale-100');
                });
            });

            document.body.style.overflow = 'hidden';
            if (type) {
                const btn = document.querySelector(`[data-type="${type === 'restaurant' || type === 'hotel' ? 'commercial' : 'residential'}"]`);
                if (btn) btn.click();
            }
        };

        window.closeModal = function() {
            const modal = document.getElementById('modal');
            modal.children[0].classList.add('opacity-0');
            modal.children[1].classList.remove('scale-100');
            modal.children[1].classList.add('opacity-0', 'scale-95');
            
            // Wait for transition to complete before hiding
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Type selection
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.type-btn').forEach(b => {
                    b.classList.remove('border-stone-900', 'bg-stone-900', 'text-white');
                    b.classList.add('border-stone-300');
                });
                btn.classList.remove('border-stone-300');
                btn.classList.add('border-stone-900', 'bg-stone-900', 'text-white');
                document.getElementById('customerType').value = btn.getAttribute('data-type');
            });
        });

        // ========== GEOLOCATION LOGIC ==========
        window.bookingLat = null;
        window.bookingLng = null;
        window.detectGPS = function() {
            const addrInput = document.getElementById('address');
            if(!navigator.geolocation) {
                showToast('Geolocation is not supported by your browser', true);
                return;
            }
            addrInput.value = 'Locating...';
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                window.bookingLat = lat;
                window.bookingLng = lng;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    if(data && data.display_name) {
                        addrInput.value = data.display_name;
                        showToast('Location successfully detected!');
                    } else {
                        addrInput.value = `${lat}, ${lng}`;
                        showToast('Location fixed via coordinates.');
                    }
                } catch(e) {
                    addrInput.value = `${lat}, ${lng}`;
                    showToast('Coordinates retrieved', true);
                }
            }, (error) => {
                addrInput.value = '';
                showToast('Failed to get location. Please type manually.', true);
            });
        };

        // ========== FIREBASE FORM SUBMISSION WITH EMAIL FALLBACK ==========
        const bookingForm = document.getElementById('booking-form');
        
        // Email fallback function
        function sendEmailFallback(formData) {
            const {
                customerType, firstName, lastName, phone, 
                email, address, appliance, urgency
            } = formData;
            
            const subject = encodeURIComponent('New Service Request - Central Appliance Repair');
            const body = encodeURIComponent(
                `New Service Request\n\n` +
                `Customer Type: ${customerType}\n` +
                `Name: ${firstName} ${lastName}\n` +
                `Phone: ${phone}\n` +
                `Email: ${email}\n` +
                `Address: ${address}\n` +
                `Appliance: ${appliance}\n` +
                `Urgency: ${urgency}\n\n` +
                `Please contact this customer within 30 minutes.`
            );
            
            window.location.href = `mailto:service@centralappliancerepair.com?subject=${subject}&body=${body}`;
        }

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect form data
            const formData = {
                customerType: document.getElementById('customerType').value,
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('address').value.trim(),
                appliance: document.getElementById('appliance').value,
                urgency: document.getElementById('urgency').value,
                lat: window.bookingLat || null,
                lng: window.bookingLng || null
            };

            // Basic validation
            if (!formData.customerType || !formData.firstName || !formData.lastName || 
                !formData.phone || !formData.email || !formData.address || 
                !formData.appliance || !formData.urgency) {
                showToast('Please fill all fields', true);
                return;
            }

            // Phone validation (simple)
            if (!formData.phone.match(/^[\d\s\-\(\)]{10,}$/)) {
                showToast('Please enter a valid phone number', true);
                return;
            }

            // Email validation
            if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showToast('Please enter a valid email address', true);
                return;
            }

            // Show loading
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');

            try {
                // Try Firebase first
                try {
                    await db.collection('bookings').add({
                        ...formData,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'new',
                        source: 'website'
                    });
                    
                    // Success with Firebase
                    closeModal();
                    showToast('Thank you! We will call you within 30 minutes.');
                    bookingForm.reset();
                    
                    // Reset type buttons
                    document.querySelectorAll('.type-btn').forEach(b => {
                        b.classList.remove('border-stone-900', 'bg-stone-900', 'text-white');
                        b.classList.add('border-stone-300');
                    });
                    document.getElementById('customerType').value = '';
                    
                } catch (firebaseError) {
                    console.log('Firebase error, using email fallback:', firebaseError);
                    
                    // Use email fallback
                    sendEmailFallback(formData);
                    
                    closeModal();
                    showToast('Request sent via email. We\'ll contact you soon!');
                    bookingForm.reset();
                    
                    // Reset type buttons
                    document.querySelectorAll('.type-btn').forEach(b => {
                        b.classList.remove('border-stone-900', 'bg-stone-900', 'text-white');
                        b.classList.add('border-stone-300');
                    });
                    document.getElementById('customerType').value = '';
                }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showToast('Unable to submit. Please call us directly.', true);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75');
            }
        });

        // Add direct phone call fallback
        window.callNow = function() {
            window.location.href = 'tel:+12409236628';
        };

        // ========== NEW REAL-TIME FIREBASE FUNCTIONS ==========
        
        // Real-time data listeners
        function setupLiveDataListeners() {
            // Listen for stats updates
            db.collection('stats').doc('live').onSnapshot((doc) => {
                if (doc.exists) {
                    const stats = doc.data();
                    
                    // Update repairs completed today
                    const repairsElement = document.getElementById('todayRepairs');
                    if (repairsElement) {
                        repairsElement.textContent = `${stats.todayRepairs || 3} repairs completed today`;
                    }
                    
                    // Update businesses protected
                    const businessesElement = document.getElementById('commercialProtected');
                    if (businessesElement) {
                        businessesElement.textContent = stats.businessesProtected || 47;
                    }
                    
                    // Update average response time
                    const responseElement = document.getElementById('commercialResponse');
                    if (responseElement) {
                        responseElement.textContent = stats.avgResponse || 23;
                    }
                }
            });

            // Listen for promotion updates
            db.collection('promotions').doc('current').onSnapshot((doc) => {
                const banner = document.getElementById('promoBanner');
                if (!banner) return;
                
                if (doc.exists) {
                    const promo = doc.data();
                    if (promo.active) {
                        // Update first-time offer banner
                        const title = document.getElementById('promoTitle');
                        const details = document.getElementById('promoDetails');
                        
                        if (title) title.textContent = promo.text || 'First-time customer special';
                        if (details) details.textContent = promo.details || '$65 service call (normally $85)';
                        
                        banner.classList.remove('hidden');
                    } else {
                        // Hide banner if not active
                        banner.classList.add('hidden');
                    }
                }
            });

            // Listen for technician status (for "Technician on call" message)
            db.collection('technicians').where('status', '==', 'online').limit(1).onSnapshot((snapshot) => {
                const techStatusElement = document.getElementById('techStatus');
                if (techStatusElement) {
                    if (!snapshot.empty) {
                        // Technician online
                        techStatusElement.innerHTML = `
                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Technician on call - 12 min response time</span>
                        `;
                    } else {
                        // All techs busy/offline
                        techStatusElement.innerHTML = `
                            <span class="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                            <span>Technicians busy - 30 min response time</span>
                        `;
                    }
                }
            });
        }

        // Initialize chat functionality on main site
        function initCustomerChat() {
            // Add chat widget button
            const chatButton = document.createElement('div');
            chatButton.className = 'fixed bottom-20 right-4 z-40 md:bottom-4';
            chatButton.innerHTML = `
                <button onclick="openChat()" class="bg-stone-900 text-white p-4 rounded-full shadow-lg hover:bg-stone-800 transition-colors chat-button">
                    <i data-lucide="message-circle" class="w-6 h-6"></i>
                </button>
            `;
            document.body.appendChild(chatButton);

            // Create chat modal
            const chatModal = document.createElement('div');
            chatModal.id = 'chatModal';
            chatModal.className = 'fixed inset-0 z-50 hidden';
            chatModal.innerHTML = `
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeChat()"></div>
                <div class="absolute bottom-20 right-4 md:bottom-4 md:right-4 w-full max-w-sm bg-white rounded-lg shadow-2xl">
                    <div class="p-4 border-b border-stone-200 flex justify-between items-center">
                        <h3 class="font-semibold">Chat with Technician</h3>
                        <button onclick="closeChat()" class="p-1 hover:bg-stone-100 rounded">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="h-96 flex flex-col">
                        <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chatMessages">
                            <div class="text-center text-sm text-stone-500">
                                Welcome! How can we help you today?
                            </div>
                        </div>
                        <div class="p-4 border-t border-stone-200">
                            <form id="customerChatForm" class="flex space-x-2">
                                <input type="text" id="customerChatInput" placeholder="Type your message..." 
                                       class="flex-1 border border-stone-300 rounded px-3 py-2 text-sm focus:border-stone-900 focus:outline-none">
                                <button type="submit" class="bg-stone-900 text-white px-4 py-2 rounded text-sm hover:bg-stone-800">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(chatModal);

            // Chat state
            let chatId = null;
            let customerName = null;
            let awaitingName = true;

            window.openChat = async function() {
                document.getElementById('chatModal').classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                // Create or get existing chat
                if (!chatId) {
                    try {
                        // Create chat in Firebase
                        const chatRef = await db.collection('chats').add({
                            customerName: 'Anonymous',
                            status: 'waiting',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                            unread: true
                        });
                        chatId = chatRef.id;
                        window.currentCustomerChatId = chatId;
                        
                        // Add automated first question
                        await db.collection('chats').doc(chatId).collection('messages').add({
                            message: "Welcome! To get started, what is your name?",
                            sender: 'agent',
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        
                        // Listen for messages
                        db.collection('chats').doc(chatId).collection('messages')
                            .orderBy('timestamp')
                            .onSnapshot((snapshot) => {
                                const messagesDiv = document.getElementById('chatMessages');
                                if (!messagesDiv) return;
                                
                                messagesDiv.innerHTML = '';
                                
                                snapshot.forEach(doc => {
                                    const msg = doc.data();
                                    const isCustomer = msg.sender === 'customer';
                                    
                                    messagesDiv.innerHTML += `
                                        <div class="flex ${isCustomer ? 'justify-end' : 'justify-start'}">
                                            <div class="max-w-[80%] ${isCustomer ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-900'} rounded-lg px-4 py-2">
                                                <p class="text-sm">${msg.message}</p>
                                                <p class="text-xs ${isCustomer ? 'text-stone-400' : 'text-stone-500'} mt-1">
                                                    ${msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                </p>
                                            </div>
                                        </div>
                                    `;
                                });
                                
                                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                            });
                    } catch (error) {
                        console.error('Error creating chat:', error);
                        showToast('Unable to start chat. Please call us instead.', true);
                        closeChat();
                    }
                }
                
                // Re-render icons
                lucide.createIcons();
            };

            window.closeChat = function() {
                const modal = document.getElementById('chatModal');
                if (modal) {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            };

            // Handle message submission
            const chatForm = document.getElementById('customerChatForm');
            if (chatForm) {
                chatForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const input = document.getElementById('customerChatInput');
                    const message = input.value.trim();
                    
                    if (!message || !chatId) return;
                    
                    input.value = '';
                    
                    try {
                        // Add customer message
                        await db.collection('chats').doc(chatId).collection('messages').add({
                            message,
                            sender: 'customer',
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        
                        if (awaitingName) {
                            customerName = message;
                            awaitingName = false;
                            
                            // Update chat with real name
                            await db.collection('chats').doc(chatId).update({
                                customerName: customerName,
                                lastMessage: message,
                                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                                unread: true
                            });
                            
                            // Send auto-response greeting
                            await db.collection('chats').doc(chatId).collection('messages').add({
                                message: `Thanks, ${customerName}! How can we help you today?`,
                                sender: 'agent',
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        } else {
                            // Normal chat update
                            await db.collection('chats').doc(chatId).update({
                                lastMessage: message,
                                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                                unread: true
                            });
                        }
                    } catch (error) {
                        console.error('Error sending message:', error);
                        showToast('Failed to send message', true);
                    }
                });
            }

            // Re-render icons
            lucide.createIcons();
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initCalculator();
            initScrollReveal();
            initNavbar();
            
            // Add live data listeners
            setupLiveDataListeners();
            
            // Add chat widget
            initCustomerChat();
            
            lucide.createIcons();
            
            // Real-time form validation
            const inputs = ['firstName', 'lastName', 'phone', 'email', 'address'].map(id => document.getElementById(id));
            inputs.forEach(input => {
                if(input) {
                    input.addEventListener('blur', function() {
                        if (!this.value.trim()) {
                            this.classList.add('border-red-500');
                            this.classList.remove('border-stone-300');
                        }
                    });
                    input.addEventListener('input', function() {
                        this.classList.remove('border-red-500');
                        this.classList.add('border-stone-300');
                    });
                }
            });
            
            // Show Firebase setup instructions in console (but don't error)
            console.log(`
                🔧 TO ENABLE FIREBASE DATABASE:
                1. Go to https://console.firebase.google.com/project/centralappliancerepair/firestore
                2. Click "Create database" (if not exists)
                3. Start in test mode
                4. Choose a location
                5. Click "Done"
                
                ⚡ The form will work NOW with email fallback!
                📧 Bookings will be sent to service@centralappliancerepair.com
            `);
        });


        // Advanced DOM Theme Swapper
        let currentThemeColor = 'stone'; // default from HTML
        function applyAdminTheme(newColor) {
            if (!newColor || newColor === currentThemeColor) return;
            
            const elements = document.querySelectorAll(`[class*="${currentThemeColor}-"]`);
            elements.forEach(el => {
                const classes = Array.from(el.classList);
                classes.forEach(cls => {
                    if (cls.includes(currentThemeColor)) {
                        const newCls = cls.replace(currentThemeColor, newColor);
                        el.classList.replace(cls, newCls);
                    }
                });
            });
            currentThemeColor = newColor;
        }
        
        // ========== CMS HYDRATION ==========
        db.collection('content').doc('global').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                // Hydrate Hero
                if(data.heroText && document.getElementById('cmsHero')) document.getElementById('cmsHero').innerHTML = data.heroText;
                
                // Hydrate Global Contact & Hours
                if(data.phone) {
                    if(document.getElementById('cmsPhone')) {
                        document.getElementById('cmsPhone').textContent = data.phone;
                        document.getElementById('cmsPhone').href = `tel:${data.phone.replace(/\D/g,'')}`;
                    }
                    if(document.getElementById('cmsContactPhone')) document.getElementById('cmsContactPhone').textContent = data.phone;
                }
                if(data.email && document.getElementById('cmsEmail')) {
                    document.getElementById('cmsEmail').textContent = data.email;
                    document.getElementById('cmsEmail').href = `mailto:${data.email}`;
                }
                if(data.hours1 && document.getElementById('cmsHours1')) document.getElementById('cmsHours1').textContent = data.hours1;
                if(data.hours2 && document.getElementById('cmsHours2')) document.getElementById('cmsHours2').textContent = data.hours2;

                if(data.theme) {
                    applyAdminTheme(data.theme);
                }

                // Hydrate Prices & Strikes
                if(data.price1 && document.getElementById('cmsPrice1')) document.getElementById('cmsPrice1').textContent = data.price1;
                if(data.price2 && document.getElementById('cmsPrice2')) document.getElementById('cmsPrice2').textContent = data.price2;
                if(data.price3 && document.getElementById('cmsPrice3')) document.getElementById('cmsPrice3').textContent = data.price3;
                
                if(document.getElementById('cmsStrike1')) {
                    if(data.strike1) {
                        document.getElementById('cmsStrike1').textContent = data.strike1;
                        document.getElementById('cmsStrike1').classList.remove('hidden');
                    } else {
                        document.getElementById('cmsStrike1').classList.add('hidden');
                    }
                }
                if(document.getElementById('cmsStrike2')) {
                    if(data.strike2) {
                        document.getElementById('cmsStrike2').textContent = data.strike2;
                        document.getElementById('cmsStrike2').classList.remove('hidden');
                    } else {
                        document.getElementById('cmsStrike2').classList.add('hidden');
                    }
                }
                if(document.getElementById('cmsStrike3')) {
                    if(data.strike3) {
                        document.getElementById('cmsStrike3').textContent = data.strike3;
                        document.getElementById('cmsStrike3').classList.remove('hidden');
                    } else {
                        document.getElementById('cmsStrike3').classList.add('hidden');
                    }
                }
            }
        });


// ========== CLIENT PORTAL LOGIC ==========
window.openPortalAuth = function() {
    const m = document.getElementById('portalAuthModal');
    m.classList.remove('hidden');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            m.children[0].classList.remove('opacity-0');
            m.children[1].classList.remove('opacity-0', 'scale-95');
            m.children[1].classList.add('scale-100');
        });
    });
    document.body.style.overflow = 'hidden';
}

window.closePortalAuth = function() {
    const m = document.getElementById('portalAuthModal');
    m.children[0].classList.add('opacity-0');
    m.children[1].classList.remove('scale-100');
    m.children[1].classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        m.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

window.closeClientDashboard = function() {
    const m = document.getElementById('clientDashboardModal');
    m.children[0].classList.add('opacity-0');
    m.children[1].classList.remove('scale-100');
    m.children[1].classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        m.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('portalAuthForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('authName').value.trim();
        const email = document.getElementById('authEmail').value.trim();
        
        const btn = e.target.querySelector('button');
        const origText = btn.textContent;
        btn.innerHTML = '<span class="spinner"></span> Authenticating...';
        btn.disabled = true;
        
        try {
            const snap = await db.collection('bookings').where('email', '==', email).where('firstName', '==', name).orderBy('createdAt', 'desc').get();
            if(snap.empty) {
                showToast('No service records found. Check spelling or book a new service.', true);
                btn.textContent = origText;
                btn.disabled = false;
                return;
            }
            
            // Success! Build dashboard
            document.getElementById('dashClientName').textContent = name;
            const listContainer = document.getElementById('dashBookingList');
            listContainer.innerHTML = '';
            
            snap.forEach(doc => {
                const b = doc.data();
                const dateStr = b.createdAt ? new Date(b.createdAt.toDate()).toLocaleDateString() : 'Recent';
                
                let statusBadge = '';
                if(b.status === 'new') statusBadge = '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold shadow-sm border border-blue-200 uppercase tracking-widest"><i data-lucide="clock" class="w-3 h-3 inline mr-1"></i>Under Review</span>';
                else if(b.status === 'contacted') statusBadge = '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold shadow-sm border border-yellow-200 uppercase tracking-widest"><i data-lucide="phone-call" class="w-3 h-3 inline mr-1"></i>Contacted</span>';
                else if(b.status === 'enroute') statusBadge = '<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold shadow-sm border border-purple-200 uppercase tracking-widest"><i data-lucide="truck" class="w-3 h-3 inline mr-1 animate-bounce"></i>Tech Dispatched</span>';
                else if(b.status === 'completed') statusBadge = '<span class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold shadow-sm border border-emerald-200 uppercase tracking-widest"><i data-lucide="check-circle" class="w-3 h-3 inline mr-1"></i>Completed</span>';
                else statusBadge = '<span class="bg-slate-200 text-slate-800 px-2 py-1 rounded text-xs font-bold shadow-sm uppercase tracking-widest">' + (b.status||'Unknown') + '</span>';
                
                const card = document.createElement('div');
                card.className = "bg-white p-5 rounded-xl shadow-md border border-stone-200 mb-4 hover:shadow-lg transition";
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4 pb-4 border-b border-stone-100">
                        <div>
                            <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Service Requested</p>
                            <h4 class="text-lg font-[800] text-stone-900">${b.appliance || 'General Repair'}</h4>
                            <p class="text-sm text-stone-500 mt-1">${dateStr} &bull; ${b.address}</p>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                    ${b.status === 'enroute' ? `
                    <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-2">
                        <h5 class="text-indigo-900 font-bold text-sm mb-1 flex items-center"><i data-lucide="radar" class="w-4 h-4 mr-2 text-indigo-500"></i>Live Technician Tracking</h5>
                        <p class="text-indigo-700 text-xs">A technician is actively routed to your location. Keep your phone nearby.</p>
                    </div>
                    ` : ''}
                `;
                listContainer.appendChild(card);
            });
            
            closePortalAuth();
            
            // Open Dashboard
            const m = document.getElementById('clientDashboardModal');
            m.classList.remove('hidden');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    m.children[0].classList.remove('opacity-0');
                    m.children[1].classList.remove('opacity-0', 'scale-95');
                    m.children[1].classList.add('scale-100');
                });
            });
            lucide.createIcons();
            document.body.style.overflow = 'hidden';
            
        } catch(err) {
            showToast('Authentication error', true);
            console.error(err);
        } finally {
            btn.textContent = origText;
            btn.disabled = false;
        }
    });
});
