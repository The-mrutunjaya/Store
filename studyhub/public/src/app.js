import { auth, db, storage } from './firebase.js';
import { 
    onAuthStateChanged, 
    signInWithPopup, 
    signOut 
} from 'firebase/auth';
import { 
    collection, 
    query, 
    where, 
    getDocs,
    addDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class StudyHub {
    constructor() {
        this.initApp();
        this.initAuth();
        this.initContent();
        this.initUI();
    }

    initApp() {
        // Initialize all app components
        window.addEventListener('DOMContentLoaded', () => {
            document.querySelector('.loading-screen').remove();
            document.querySelector('.app-container').classList.remove('hidden');
        });
    }

    initAuth() {
        // Auth state listener
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.handleUserLogin(user);
            } else {
                this.handleUserLogout();
            }
        });
    }

    initContent() {
        // Content loading logic
        this.loadContent();
    }

    initUI() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme',
                document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            );
        });

        // Search functionality
        document.querySelector('.global-search').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }

    async loadContent() {
        try {
            const q = query(collection(db, "content"));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                this.renderContentCard(doc.data());
            });
        } catch (error) {
            console.error("Error loading content:", error);
        }
    }

    renderContentCard(content) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="card-media">
                ${content.type === 'video' ? 
                    `<video src="${content.previewURL}"></video>` : 
                    `<img src="${content.thumbnailURL}" alt="${content.title}">`
                }
            </div>
            <div class="card-body">
                <h3>${content.title}</h3>
                <p>${content.description}</p>
                <div class="card-actions">
                    <button class="download-btn">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                    <button class="qr-btn">
                        <i class="fas fa-qrcode"></i>
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.content-grid-container').appendChild(card);
    }

    // Add remaining methods for auth, upload, QR, etc.
}

// Initialize Application
const studyHub = new StudyHub();
