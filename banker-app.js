// banker-app.js
// Импортируем базу данных из конфига
import { db, ref, set, push, update, get, child } from "./firebase-config.js";

// Вспомогательная функция для показа статусов
function showStatus(elementId, message, isError = false) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = isError ? 'status error' : 'status success';
    setTimeout(() => { el.style.display = 'none'; }, 3000); // Скрыть через 3 сек
}

// === 1. ФУНКЦИЯ ПОПОЛНЕНИЯ СЧЕТА ===
document.getElementById('btnDeposit').addEventListener('click', async () => {
    const userId = document.getElementById('depositUserId').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);

    if (!userId || !amount) return showStatus('statusDeposit', 'Заполните все поля!', true);

    const userBalanceRef = ref(db, 'users/' + userId);

    try {
        // Сначала получаем текущий баланс
        const snapshot = await get(child(ref(db), `users/${userId}/balance`));
        let currentBalance = 0;
        
        if (snapshot.exists()) {
            currentBalance = parseFloat(snapshot.val());
        }

        const newBalance = currentBalance + amount;

        // Обновляем баланс
        await update(userBalanceRef, {
            balance: newBalance
        });

        // Записываем историю транзакции
        const historyRef = ref(db, `users/${userId}/history`);
        const newTxRef = push(historyRef);
        await set(newTxRef, {
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString(),
            by: 'banker'
        });

        showStatus('statusDeposit', `Счет пополнен! Баланс: ${newBalance}`);
        document.getElementById('depositAmount').value = '';
    } catch (error) {
        console.error(error);
        showStatus('statusDeposit', 'Ошибка базы данных: ' + error.message, true);
    }
});

// === 2. ФУНКЦИЯ ВЫДАЧИ КРЕДИТА ===
document.getElementById('btnCredit').addEventListener('click', async () => {
    const userId = document.getElementById('creditUserId').value;
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const rate = document.getElementById('creditRate').value;
    const reason = document.getElementById('creditReason').value;

    if (!userId || !amount) return showStatus('statusCredit', 'Заполните ID и Сумму!', true);

    try {
        // Создаем запись о кредите в профиле пользователя
        const creditsRef = ref(db, `users/${userId}/credits`);
        const newCreditRef = push(creditsRef);
        
        await set(newCreditRef, {
            amount: amount,
            remainingAmount: amount, // Сколько осталось выплатить
            rate: rate,
            reason: reason,
            startDate: new Date().toISOString(),
            status: 'active'
        });

        // Также начисляем деньги клиенту на счет (выдача кредита)
        // Получаем текущий баланс
        const snapshot = await get(child(ref(db), `users/${userId}/balance`));
        let currentBalance = 0;
        if (snapshot.exists()) currentBalance = parseFloat(snapshot.val());
        
        await update(ref(db, `users/${userId}`), {
            balance: currentBalance + amount
        });

        showStatus('statusCredit', 'Кредит оформлен и средства зачислены!');
    } catch (error) {
        console.error(error);
        showStatus('statusCredit', 'Ошибка: ' + error.message, true);
    }
});

// === 3. ФУНКЦИЯ ДОБАВЛЕНИЯ УСЛУГИ ===
document.getElementById('btnService').addEventListener('click', async () => {
    const name = document.getElementById('serviceName').value;
    const cost = parseFloat(document.getElementById('serviceCost').value);

    if (!name || !cost) return showStatus('statusService', 'Заполните название и цену!', true);

    try {
        // Добавляем в общий список услуг банка
        const servicesRef = ref(db, 'bank_services');
        const newServiceRef = push(servicesRef);
        
        await set(newServiceRef, {
            name: name,
            cost: cost,
            createdAt: new Date().toISOString()
        });

        showStatus('statusService', 'Услуга успешно добавлена в каталог!');
        document.getElementById('serviceName').value = '';
        document.getElementById('serviceCost').value = '';
    } catch (error) {
        showStatus('statusService', 'Ошибка: ' + error.message, true);
    }
});