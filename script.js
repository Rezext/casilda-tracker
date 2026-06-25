import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjylARNYWbJONlOK44QMF_1CBPcZGP2wc",
  authDomain: "pembagian-kelompok-mpi23b.firebaseapp.com",
  projectId: "pembagian-kelompok-mpi23b",
  storageBucket: "pembagian-kelompok-mpi23b.firebasestorage.app",
  messagingSenderId: "13739269373",
  appId: "1:13739269373:web:8a694d8309ebfa716cf294"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Navigation & Theme (Sama kayak sebelumnya)
const burger = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page');

burger.addEventListener('click', () => sidebar.classList.toggle('active'));

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(link.dataset.target).classList.add('active');
        if(window.innerWidth < 768) sidebar.classList.remove('active');
    });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// --- FITUR BARU: GENERATE GRID 31 HARI ---
const habitHeader = document.getElementById('habit-header');
for(let i = 1; i <= 31; i++) {
    let th = document.createElement('th');
    th.innerText = i;
    habitHeader.appendChild(th);
}

const moodList = document.getElementById('mood-list');
for(let i = 1; i <= 31; i++) {
    let tr = document.createElement('tr');
    let tdDay = document.createElement('td');
    tdDay.innerText = i;
    tr.appendChild(tdDay);
    for(let j = 0; j < 12; j++) {
        let tdMonth = document.createElement('td');
        tdMonth.style.cursor = "pointer";
        tdMonth.addEventListener('click', () => {
            if(currentMoodColor) tdMonth.style.background = currentMoodColor;
        });
        tr.appendChild(tdMonth);
    }
    moodList.appendChild(tr);
}

// 2. Load Data dari Firebase pas Refresh!
async function loadHabits() {
    const listHabit = document.getElementById('habit-list');
    listHabit.innerHTML = ''; 
    const querySnapshot = await getDocs(collection(db, "habits"));
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        appendHabitToGrid(data.name);
    });
}

function appendHabitToGrid(name) {
    const listHabit = document.getElementById('habit-list');
    let tr = document.createElement('tr');
    
    let tdName = document.createElement('td');
    tdName.innerHTML = `<strong>${name}</strong>`;
    tr.appendChild(tdName);

    for(let i = 1; i <= 31; i++) {
        let td = document.createElement('td');
        let circle = document.createElement('span');
        circle.className = 'habit-cell';
        circle.addEventListener('click', () => circle.classList.toggle('done'));
        td.appendChild(circle);
        tr.appendChild(td);
    }
    listHabit.appendChild(tr);
}

// Panggil fungsi load pas web kebuka
loadHabits();

// 3. Tambah Habit ke Firebase
document.getElementById('add-habit-btn').addEventListener('click', async () => {
    let name = document.getElementById('habit-name').value;
    if(!name) return alert('Isi nama habitnya dulu yaaa!');
    
    appendHabitToGrid(name);
    document.getElementById('habit-name').value = '';

    try {
        await addDoc(collection(db, "habits"), { name: name });
    } catch (e) {
        console.error("Gagal simpan: ", e);
    }
});

// 4. Mood Tracker logic
let currentMoodColor = '';
const moodBtns = document.querySelectorAll('.mood-btn');
moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.style.opacity = '0.5');
        btn.style.opacity = '1';
        currentMoodColor = btn.style.background;
    });
});

// 5. Time Tracker Grid
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
        box.className = `time-box ${timeColors[nextIndex]}`;
        box.dataset.colorIndex = nextIndex;
    });
    timeGrid.appendChild(box);
}
