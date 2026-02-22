// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, update, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Ваша конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyBa3MKrLHcRPauIyzxgxfNpLUphmehJAkg",
    authDomain: "moon-logistik.firebaseapp.com",
    databaseURL: "https://moon-logistik-default-rtdb.firebaseio.com",
    projectId: "moon-logistik",
    storageBucket: "moon-logistik.firebasestorage.app",
    messagingSenderId: "335239459996",
    appId: "1:335239459996:web:98a3cd3508767cfde6a959",
    measurementId: "G-N3GHR5KS7Q"
};

// Инициализация приложения
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Экспортируем функции, которые понадобятся в главном скрипте
export { db, ref, set, push, update, get, child };