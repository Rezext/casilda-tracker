// Import Firebase langsung via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Konfigurasi Firebase dari kamu
const firebaseConfig = {
  apiKey: "AIzaSyCjylARNYWbJONlOK44QMF_1CBPcZGP2wc",
  authDomain: "pembagian-kelompok-mpi23b.firebaseapp.com",
  projectId: "pembagian-kelompok-mpi23b",
  storageBucket: "pembagian-kelompok-mpi23b.firebasestorage.app",
  messagingSenderId: "13739269373",
  appId: "1:13739269373:web:8a694d8309ebfa716cf294"
};

// Inisialisasi Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Sidebar & Menu Logic
const burger = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page');

burger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        const target = link.getAttribute('data-target');
        pages.forEach(page => {
            page.classList.remove('active');
            if(page.id === target) page.classList.add('active');
        });

        if(window.innerWidth < 768) sidebar.classList.remove('active');
    });
});

// 2. Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
});

// 3. Time Tracker Logic (24 Jam)
const timeGrid = document.getElementById('time-grid');
const timeColors = ['grey', 'blue', 'red', 'pink', 'yellow', 'purple'];

for(let i = 0; i < 24; i++) {
    let box = document.createElement('div');
    box.className = 'time-box grey';
    box.innerText = `${i}:00`;
    box.dataset.colorIndex = 0;
    
    box.addEventListener('click', () => {
        let currentIndex = parseInt(box.dataset.colorIndex);
        let nextIndex = (currentIndex + 1) % timeColors.length;
        
        box.classList.remove(timeColors[currentIndex]);
        box.classList.add(timeColors[nextIndex]);
        box.dataset.colorIndex = nextIndex;
        
        box.innerHTML = `✔️<br>${i}:00`; 
    });
    timeGrid.appendChild(box);
}

// 4. Habit Tracker Logic
const btnHabit = document.getElementById('add-habit-btn');
const listHabit = document.getElementById('habit-list');

btnHabit.addEventListener('click', async () => {
    let name = document.getElementById('habit-name').value;
    let reward = document.getElementById('habit-reward').value;
    if(!name) return alert('Isi nama habitnya dulu yaaa!');

    // Tampilkan di UI
    let item = document.createElement('div');
    item.className = 'tracker-item';
    item.innerHTML = `
        <div>
            <strong>${name}</strong> <br>
            <small>🎁 Reward: ${reward}</small>
        </div>
        <button onclick="this.innerText = '✅ Done!'; this.style.background = '#bbded6';">Tandai Hari Ini</button>
    `;
    listHabit.appendChild(item);
    
    document.getElementById('home-habit-summary').innerText = `Ada habit baru: ${name}! Semangaaat!`;
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-reward').value = '';

    // Contoh save ke Firebase (Opsional, hapus/komen kalau belum butuh)
    try {
        await addDoc(collection(db, "habits"), { name: name, reward: reward });
    } catch (e) {
        console.error("Gagal simpan ke Firebase: ", e);
    }
});

// 5. Reading Tracker Logic
const btnRead = document.getElementById('add-book-btn');
const listRead = document.getElementById('book-list');

btnRead.addEventListener('click', () => {
    let title = document.getElementById('book-title').value;
    let total = document.getElementById('book-total').value;
    if(!title || !total) return alert('Isi lengkap data bukunya yaaa!');

    let item = document.createElement('div');
    item.className = 'tracker-item';
    item.innerHTML = `
        <div>
            <strong>📖 ${title}</strong> <br>
            <small>Progres: <span class="prog-val">0</span> / ${total} Halaman</small>
        </div>
        <button onclick="let v = this.previousElementSibling.querySelector('.prog-val'); let cur = parseInt(v.innerText) + 10; if(cur >= ${total}) { this.innerText = '🎉 DONE!'; v.innerText = ${total}; } else { v.innerText = cur; }">+10 Hal</button>
    `;
    listRead.appendChild(item);
    document.getElementById('book-title').value = '';
    document.getElementById('book-total').value = '';
});

// 6. Mood Tracker Logic
const moodBtns = document.querySelectorAll('.mood-btn');
let currentMood = '';

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.style.opacity = '0.5');
        btn.style.opacity = '1';
        currentMood = btn.innerText;
    });
});

document.getElementById('save-mood-btn').addEventListener('click', async () => {
    let reason = document.getElementById('mood-reason').value;
    if(!currentMood) return alert('Pilih moodnya dulu donggg!');
    
    let history = document.getElementById('mood-history');
    let item = document.createElement('div');
    item.className = 'tracker-item';
    item.innerHTML = `<strong>${currentMood}</strong><p>${reason}</p>`;
    history.prepend(item);
    
    document.getElementById('home-mood-summary').innerText = currentMood;
    document.getElementById('mood-reason').value = '';

    // Contoh save ke Firebase (Opsional, hapus/komen kalau belum butuh)
    try {
        await addDoc(collection(db, "moods"), { mood: currentMood, reason: reason });
    } catch (e) {
        console.error("Gagal simpan mood ke Firebase: ", e);
    }
});
