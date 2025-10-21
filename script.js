document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const menuToggle = document.getElementById('menu-toggle');

    const showSection = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;
        sections.forEach(section => section.classList.remove('active'));
        targetSection.classList.add('active');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            showSection(targetId);
            if (window.innerWidth <= 768) menuToggle.checked = false;
        });
    });

    // ---------------- Menu Tabs ----------------
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ---------------- Cart ----------------
    const prices = {
        'Cheeseburger Clássico': 21.90,
        'Hambúrguer apimentado de BBQ': 19.90,
        'Hambúrguer Vegano': 25.90,
        'Milkshake de Chocolate': 12.00,
        'Brownie': 10.00
    };
    let cart = {};
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.menu-item');
            const productTitle = productCard.querySelector('h3').textContent;
            if (cart[productTitle]) cart[productTitle]++;
            else cart[productTitle] = 1;
            updatePaymentSection();
        });
    });

    function updatePaymentSection() {
        const orderSummaryList = document.querySelector('.order-summary ul');
        const totalSpan = document.querySelector('.order-summary .text-xl.font-bold span:last-child');
        let total = 0;
        orderSummaryList.innerHTML = '';
        for (const [title, quantity] of Object.entries(cart)) {
            const itemPrice = prices[title];
            const itemTotal = itemPrice * quantity;
            total += itemTotal;
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center text-lg';
            listItem.innerHTML = `<span>${title} (x${quantity})</span><span class="font-semibold">R$${itemTotal.toFixed(2)}</span>`;
            orderSummaryList.appendChild(listItem);
        }
        totalSpan.textContent = `R$${total.toFixed(2)}`;
    }

});

// ---------------- Menu Tabs Filter ----------------
const menuTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ---------------- Navigation Fix ----------------
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page-section');
const menuToggle = document.getElementById('menu-toggle');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.target;
        sections.forEach(sec => sec.classList.remove('active'));
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
        if (window.innerWidth <= 768) menuToggle.checked = false;
    });
});


// ---------------- Form Submission Handlers ----------------
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login efetuado com sucesso! (funcionalidade de backend não implementada)');
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! (funcionalidade de backend não implementada)');
    e.target.reset();
});

function copyCoupon(couponCode) {
    navigator.clipboard.writeText(couponCode).then(() => {
        alert('Cupom copiado: ' + couponCode);
    }).catch(err => {
        alert('Não foi possível copiar o cupom.');
        console.error(err);
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');

        // Hide all non-hero pages
        document.querySelectorAll('.page-section').forEach(section => {
            if (section.id !== "hero") {
                section.classList.remove('active');
                section.style.display = "none";
            }
        });

        // Special case: if target is hero (Home)
        if (target === "hero") {
            document.getElementById("hero").style.display = "block";
            document.getElementById("hero").classList.add("active");
        } else {
            // Hide hero
            document.getElementById("hero").style.display = "none";
            document.getElementById("hero").classList.remove("active");

            // Show requested page
            const section = document.getElementById(target);
            if (section) {
                section.style.display = "block";
                section.classList.add("active");
            }
        }
    });
});

// Show the correct tab content based on the active button
function showProfileTab() {
    document.getElementById('profileTab').classList.add('bg-gray-900');
    document.getElementById('loginTab').classList.remove('bg-gray-900');
    document.getElementById('registerTab').classList.remove('bg-gray-900');
    document.getElementById('profileContent').classList.remove('hidden');
    document.getElementById('loginContent').classList.add('hidden');
    document.getElementById('registerContent').classList.add('hidden');
}

function showLoginTab() {
    document.getElementById('loginTab').classList.add('bg-gray-900');
    document.getElementById('profileTab').classList.remove('bg-gray-900');
    document.getElementById('registerTab').classList.remove('bg-gray-900');
    document.getElementById('loginContent').classList.remove('hidden');
    document.getElementById('profileContent').classList.add('hidden');
    document.getElementById('registerContent').classList.add('hidden');
}

function showRegisterTab() {
    document.getElementById('registerTab').classList.add('bg-gray-900');
    document.getElementById('loginTab').classList.remove('bg-gray-900');
    document.getElementById('profileTab').classList.remove('bg-gray-900');
    document.getElementById('registerContent').classList.remove('hidden');
    document.getElementById('loginContent').classList.add('hidden');
    document.getElementById('profileContent').classList.add('hidden');
}

// Default to the Profile tab
showProfileTab();

