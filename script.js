// ---------------- Navigation and Payment System----------------
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

    // ---------------- Carrinho ----------------
    let cart = {};
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Cria o modal de customização
    const customizationModal = document.createElement('div');
    customizationModal.id = 'customization-modal';
    customizationModal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden justify-center items-center';
    customizationModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-2xl font-bold mb-4">Personalize seu Burgão</h2>
            <div id="ingredient-options" class="space-y-2 mb-4">
                <label><input type="checkbox" value="extra queijo"> Extra Queijo (+R$2,00)</label><br>
                <label><input type="checkbox" value="bacon"> Bacon (+R$3,00)</label><br>
                <label><input type="checkbox" value="picles"> Picles (+R$1,00)</label><br>
                <label><input type="checkbox" value="sem cebola"> Sem cebola</label><br>
                <label><input type="checkbox" value="molho especial extra"> Molho Especial Extra (+R$1,50)</label>
            </div>
            <div class="flex justify-end space-x-4">
                <button id="cancel-customization" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                <button id="confirm-customization" class="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
            </div>
        </div>
    `;
    document.body.appendChild(customizationModal);

    let selectedBurger = null;
    let selectedBurgerPrice = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.menu-item');
            const category = productCard.dataset.category;
            const productTitle = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('span.text-2xl').textContent;
            const productPrice = parseFloat(productPriceText.replace('R$', '').replace(',', '.')) || 0;

            // Se for hambúrguer, abre o modal de customização
            if (category === 'burgers') {
                selectedBurger = productTitle;
                selectedBurgerPrice = productPrice;
                customizationModal.classList.remove('hidden');
                customizationModal.classList.add('flex');
            } else {
                addItemToCart(productTitle, productPrice);
            }
        });
    });

    // Confirmar customização
    document.getElementById('confirm-customization').addEventListener('click', () => {
        const selectedOptions = Array.from(customizationModal.querySelectorAll('input:checked')).map(opt => opt.value);
        let extraPrice = 0;
        if (selectedOptions.includes('extra queijo')) extraPrice += 2;
        if (selectedOptions.includes('bacon')) extraPrice += 3;
        if (selectedOptions.includes('picles')) extraPrice += 1;
        if (selectedOptions.includes('molho especial extra')) extraPrice += 1.5;

        const customName = selectedBurger + (selectedOptions.length > 0 ? ` (${selectedOptions.join(', ')})` : '');
        addItemToCart(customName, selectedBurgerPrice + extraPrice);

        customizationModal.classList.add('hidden');
        customizationModal.classList.remove('flex');
        customizationModal.querySelectorAll('input').forEach(i => (i.checked = false));
    });

    document.getElementById('cancel-customization').addEventListener('click', () => {
        customizationModal.classList.add('hidden');
        customizationModal.classList.remove('flex');
    });

    // Adicionar item ao carrinho
    function addItemToCart(title, price) {
        if (cart[title]) {
            cart[title].quantity++;
        } else {
            cart[title] = { quantity: 1, price };
        }
        updatePaymentSection();
    }

    // Atualizar seção de pagamento
    function updatePaymentSection() {
        const orderSummaryList = document.querySelector('.order-summary ul');
        const totalSpan = document.querySelector('.order-summary .text-xl.font-bold span:last-child');
        if (!orderSummaryList || !totalSpan) return;

        let total = 0;
        orderSummaryList.innerHTML = '';

        for (const [title, item] of Object.entries(cart)) {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center text-lg';
            listItem.innerHTML = `
                <span>${title} (x${item.quantity})</span>
                <div class="flex items-center space-x-2">
                    <button class="decrease bg-gray-300 px-2 rounded" data-item="${title}">-</button>
                    <button class="increase bg-gray-300 px-2 rounded" data-item="${title}">+</button>
                    <span class="font-semibold">R$${itemTotal.toFixed(2)}</span>
                </div>
            `;
            orderSummaryList.appendChild(listItem);
        }

        totalSpan.textContent = `R$${total.toFixed(2)}`;

        // Controle de quantidade
        orderSummaryList.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.dataset.item;
                cart[item].quantity++;
                updatePaymentSection();
            });
        });

        orderSummaryList.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.dataset.item;
                cart[item].quantity--;
                if (cart[item].quantity <= 0) delete cart[item];
                updatePaymentSection();
            });
        });
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
