document.addEventListener('DOMContentLoaded', () => {
    // Remove loading screen
    document.querySelector('.loading-screen').remove();
    document.querySelector('.app-container').classList.remove('hidden');

    // Initialize app
    const studyHub = new StudyHub();
});

class StudyHub {
    constructor() {
        this.currentUser = null;
        this.content = [];
        this.initAuth();
        this.initUI();
        this.loadContent();
    }

    initAuth() {
        // Check localStorage for user
        this.currentUser = JSON.parse(localStorage.getItem('studyhub-user'));
        this.toggleAuthState();

        // Auth form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Registration toggle
        document.getElementById('showRegister').addEventListener('click', () => {
            this.toggleAuthForm(true);
        });
    }

    initUI() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Upload button
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.toggleModal('uploadModal', true);
        });

        // Search functionality
        document.querySelector('.global-search').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Close modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleModal(btn.closest('.modal-overlay').id, false);
            });
        });
    }

    toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('studyhub-theme', isDark ? 'light' : 'dark');
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) return;
        
        this.currentUser = { email, name: "Demo User" };
        localStorage.setItem('studyhub-user', JSON.stringify(this.currentUser));
        this.toggleAuthState();
        this.toggleModal('auth-modal', false);
    }

    toggleAuthState() {
        const authBtn = document.getElementById('userMenu');
        if (this.currentUser) {
            authBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
            document.querySelector('.auth-modal').classList.add('hidden');
        } else {
            authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            this.toggleModal('auth-modal', true);
        }
    }

    loadContent() {
        // Load from localStorage
        this.content = JSON.parse(localStorage.getItem('studyhub-content')) || [];
        this.renderContent();
    }

    renderContent() {
        const container = document.querySelector('.content-grid-container');
        container.innerHTML = '';
        
        this.content.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                <div class="card-media">
                    ${item.type === 'video' ? 
                        `<video src="${item.previewURL}"></video>` : 
                        `<img src="${item.thumbnailURL}" alt="${item.title}">`
                    }
                </div>
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="card-actions">
                        <button class="download-btn" data-id="${item.id}">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="qr-btn" data-id="${item.id}">
                            <i class="fas fa-qrcode"></i>
                        </button>
                    </div>
                </div>
            `;
            
            card.querySelector('.download-btn').addEventListener('click', (e) => {
                this.handleDownload(item.id);
            });
            
            card.querySelector('.qr-btn').addEventListener('click', (e) => {
                this.showQRCode(item.downloadURL);
            });

            container.appendChild(card);
        });
    }

    handleDownload(contentId) {
        const content = this.content.find(c => c.id === contentId);
        if (content) {
            const link = document.createElement('a');
            link.href = content.downloadURL;
            link.download = content.title;
            link.click();
        }
    }

    showQRCode(url) {
        const qrContainer = document.querySelector('#previewModal .qr-container');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: url,
            width: 128,
            height: 128
        });
        this.toggleModal('previewModal', true);
    }

    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        modal.classList.toggle('hidden', !show);
    }
}

// Initialize demo content if empty
if (!localStorage.getItem('studyhub-content')) {
    localStorage.setItem('studyhub-content', JSON.stringify([
        {
            id: '1',
            title: 'Sample Physics Notes',
            type: 'notes',
            description: 'Comprehensive physics study material',
            downloadURL: '#',
            thumbnailURL: 'https://via.placeholder.com/300',
            rating: 4.5
        }
    ]));
}
