// ==========================================
// MOTOR DE ALIMENTOS, DIÁRIO POR DATA E LOCALSTORAGE
// ==========================================
let foodsDB = [];

// Injeta as metas dinâmicas baseadas no biotipo do usuário vindo do profile.js
let META_DIARIA = (typeof calculateDynamicMetas === 'function') ? calculateDynamicMetas() : { kcal: 2306, prot: 129, carb: 303, fat: 64, fib: 38, sug: 87, sod: 2300 };

function getDefaultMacros() {
    // Atualiza caso o usuário mude no perfil durante a sessão
    META_DIARIA = (typeof calculateDynamicMetas === 'function') ? calculateDynamicMetas() : META_DIARIA;
    return {
        kcalRest: META_DIARIA.kcal, protRest: META_DIARIA.prot, carbRest: META_DIARIA.carb, gordRest: META_DIARIA.fat,
        fibRest: META_DIARIA.fib, sugRest: META_DIARIA.sug, sodRest: META_DIARIA.sod
    };
}

// 1. ESTADO DINÂMICO (Baseado no dia que o usuário clicar)
let consumedFoods = [];
let dashMacros = getDefaultMacros();
let currentSelectedDate = '';

// Gera formato YYYY-MM-DD
function getFormattedDate(dateObj) {
    return dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
}

// 2. CARREGA OS DADOS DO DIA CLICADO NO CALENDÁRIO
function loadDayData(dateStr) {
    currentSelectedDate = dateStr;
    const savedData = JSON.parse(localStorage.getItem('diet_' + dateStr));

    if (savedData) {
        consumedFoods = savedData.consumedFoods || [];
        // Se der algum erro nos dados salvos, ele puxa o molde correto
        dashMacros = savedData.dashMacros || getDefaultMacros();
    } else {
        // Se for um dia novo ou vazio, reseta usando o molde com os nomes "Rest"
        consumedFoods = [];
        dashMacros = getDefaultMacros();
    }

    updateDashboardUI();
    renderRecentFoods();
}

// 3. SALVA OS DADOS NO DIA ESPECÍFICO
function saveDayData() {
    localStorage.setItem('diet_' + currentSelectedDate, JSON.stringify({
        consumedFoods: consumedFoods,
        dashMacros: dashMacros
    }));
}

// Gatilho disparado pelo calendário no app.js
function changeSelectedDate(dateStr) {
    loadDayData(dateStr);
}

// MOTOR VETORIAL DE SVG
function setRingProgress(circleId, percent) {
    const circle = document.getElementById(circleId);
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const p = Math.min(Math.max(percent, 0), 100);
    const offset = circumference - (p / 100) * circumference;

    circle.style.transition = 'none';
    circle.style.strokeDashoffset = circumference;
    circle.getBoundingClientRect();

    circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    circle.style.strokeDashoffset = offset;
}

async function loadFoods() {
    try {
        const res = await fetch('data/alimentos.json');
        foodsDB = await res.json();

        renderDailySuggestions();

    } catch (e) {
        console.log("Erro ao carregar alimentos.json", e);
    }
}

function searchMainDatabase() {
    const query = document.getElementById('main-food-search').value.toLowerCase();
    const list = document.getElementById('main-food-results');
    list.innerHTML = '';

    if (query.length < 2) {
        list.innerHTML = `<div class="empty-state-search"><span style="font-size: 48px; display: block; text-align: center; margin-top: 40px;">🥗</span><p class="placeholder-text" style="margin-top: 16px;" data-i18n="diet_empty_msg">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['diet_empty_msg'] || 'Consulte calorias, macros, sódio e muito mais em nosso banco de dados.' : 'Consulte calorias, macros, sódio e muito mais em nosso banco de dados.')}</p></div>`;
        return;
    }

    const results = foodsDB.filter(f => f.nome.toLowerCase().includes(query) || f.marca.toLowerCase().includes(query));

    if (results.length === 0) {
        list.innerHTML = `<p class="placeholder-text" style="margin-top: 40px;">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['search_not_found'] || 'Nenhum alimento encontrado.' : 'Nenhum alimento encontrado.')}</p>`;
        return;
    }

    results.forEach(food => {
        const card = document.createElement('div');
        card.className = 'food-result-card';
        card.onclick = () => openFoodDetail(food);
        card.innerHTML = `
            <div class="food-res-info">
                <span class="food-res-name">${food.nome}</span>
                <span class="food-res-detail">${food.marca} • ${food.porcao}</span>
            </div>
            <svg class="btn-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        `;
        list.appendChild(card);
    });
}

function openFoodDetail(food) {
    const content = document.getElementById('food-detail-content');
    const fibrasMock = (Math.random() * 5).toFixed(1);
    const sodioMock = Math.floor(Math.random() * 200);

    content.innerHTML = `
        <div class="detail-hero">
            <div class="detail-title-block">
                <span class="detail-name">${food.nome}</span>
                <span class="detail-brand">${food.marca} • Porção: ${food.porcao}</span>
            </div>
            <div class="detail-cal-block">
                <span class="detail-cal-val">${Math.round(food.kcal)}</span>
                <span class="detail-cal-lbl">kcal</span>
            </div>
        </div>

        <div class="detail-macro-grid">
            <div class="dm-card"><span class="dm-val">${Math.round(food.c)}g</span><span class="dm-lbl">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['macro_carbs'] || 'Carboidratos' : 'Carboidratos')}</span></div>
            <div class="dm-card"><span class="dm-val">${Math.round(food.p)}g</span><span class="dm-lbl">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['macro_protein'] || 'Proteínas' : 'Proteínas')}</span></div>
            <div class="dm-card"><span class="dm-val">${Math.round(food.g)}g</span><span class="dm-lbl">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['macro_fats'] || 'Gorduras' : 'Gorduras')}</span></div>
        </div>

        <div class="micro-list">
            <div class="micro-row"><span class="micro-lbl">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['macro_fiber'] || 'Fibras Alimentares' : 'Fibras Alimentares')}</span><span class="micro-val">${Math.round(fibrasMock)}g</span></div>
            <div class="micro-row"><span class="micro-lbl">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['macro_sodium'] || 'Sódio' : 'Sódio')}</span><span class="micro-val">${Math.round(sodioMock)}mg</span></div>
        </div>
    `;

    const btnReg = document.getElementById('btn-register-food');
    btnReg.onclick = () => registerFood(food.id);

    document.getElementById('food-detail-modal').classList.add('show');
}

function closeFoodDetail() {
    document.getElementById('food-detail-modal').classList.remove('show');
}

function registerFood(foodId) {
    const food = foodsDB.find(f => f.id === foodId);
    if (!food) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    consumedFoods.unshift({ ...food, time: timeNow });

    dashMacros.kcalRest -= food.kcal;
    dashMacros.protRest -= food.p;
    dashMacros.carbRest -= food.c;
    dashMacros.gordRest -= food.g;

    dashMacros.fibRest -= (Math.random() * 5);
    dashMacros.sugRest -= (Math.random() * 10);
    dashMacros.sodRest -= (Math.random() * 200);

    if (dashMacros.kcalRest < 0) dashMacros.kcalRest = 0;
    if (dashMacros.protRest < 0) dashMacros.protRest = 0;
    if (dashMacros.carbRest < 0) dashMacros.carbRest = 0;
    if (dashMacros.gordRest < 0) dashMacros.gordRest = 0;
    if (dashMacros.fibRest < 0) dashMacros.fibRest = 0;
    if (dashMacros.sugRest < 0) dashMacros.sugRest = 0;
    if (dashMacros.sodRest < 0) dashMacros.sodRest = 0;

    // GRAVA AS ALTERAÇÕES APENAS NO DIA ATUALMENTE SELECIONADO
    saveDayData();

    updateDashboardUI();
    renderRecentFoods();
    closeFoodDetail();

    switchTab('tab-recentes', null);
}

function updateDashboardUI() {
    const elements = {
        'dash-cal-val': Math.round(dashMacros.kcalRest),
        'dash-prot-val': Math.round(dashMacros.protRest) + 'g',
        'dash-carb-val': Math.round(dashMacros.carbRest) + 'g',
        'dash-fat-val': Math.round(dashMacros.gordRest) + 'g',
        'dash-fib-val': Math.round(dashMacros.fibRest) + 'g',
        'dash-sug-val': Math.round(dashMacros.sugRest) + 'g',
        'dash-sod-val': Math.round(dashMacros.sodRest) + 'mg',
        'recent-cal-val': Math.round(dashMacros.kcalRest),
        'recent-prot-val': Math.round(dashMacros.protRest) + 'g',
        'recent-carb-val': Math.round(dashMacros.carbRest) + 'g',
        'recent-fat-val': Math.round(dashMacros.gordRest) + 'g'
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    const pKcal = ((META_DIARIA.kcal - dashMacros.kcalRest) / META_DIARIA.kcal) * 100;
    const pProt = ((META_DIARIA.prot - dashMacros.protRest) / META_DIARIA.prot) * 100;
    const pCarb = ((META_DIARIA.carb - dashMacros.carbRest) / META_DIARIA.carb) * 100;
    const pFat = ((META_DIARIA.fat - dashMacros.gordRest) / META_DIARIA.fat) * 100;
    const pFib = ((META_DIARIA.fib - dashMacros.fibRest) / META_DIARIA.fib) * 100;
    const pSug = ((META_DIARIA.sug - dashMacros.sugRest) / META_DIARIA.sug) * 100;
    const pSod = ((META_DIARIA.sod - dashMacros.sodRest) / META_DIARIA.sod) * 100;

    setRingProgress('dash-cal-ring', pKcal);
    setRingProgress('dash-prot-ring', pProt);
    setRingProgress('dash-carb-ring', pCarb);
    setRingProgress('dash-fat-ring', pFat);

    setRingProgress('dash-fib-ring', pFib);
    setRingProgress('dash-sug-ring', pSug);
    setRingProgress('dash-sod-ring', pSod);

    setRingProgress('recent-cal-ring', pKcal);
    setRingProgress('recent-prot-ring', pProt);
    setRingProgress('recent-carb-ring', pCarb);
    setRingProgress('recent-fat-ring', pFat);
}

function renderRecentFoods() {
    const list = document.getElementById('recent-foods-list');
    list.innerHTML = '';

    if (consumedFoods.length === 0) {
        list.innerHTML = `<p class="placeholder-text" style="margin-top: 0;">${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['recent_no_food_day'] || 'Nenhum alimento registrado neste dia.' : 'Nenhum alimento registrado neste dia.')}</p>`;
        return;
    }

    consumedFoods.forEach(f => {
        const card = document.createElement('div');
        card.className = 'recent-food-card';
        card.innerHTML = `
            <div class="rf-img-box"></div>
            <div class="rf-content">
                <div class="rf-header">
                    <span class="rf-title">${f.nome}</span>
                    <span class="rf-time">${f.time}</span>
                </div>
                <div class="rf-cals-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>
                    ${Math.round(f.kcal)} ${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['calories_lower'] || 'calorias' : 'calorias')}
                </div>
                <div class="rf-macros">
                    <span>🍗 ${Math.round(f.p)}g</span>
                    <span>🌾 ${Math.round(f.c)}g</span>
                    <span>🥑 ${Math.round(f.g)}g</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadFoods();

    // Migração para não perder os testes de ontem
    if (!localStorage.getItem('migrated_to_dates_v1')) {
        const oldFoods = JSON.parse(localStorage.getItem('consumedFoods'));
        const oldMacros = JSON.parse(localStorage.getItem('dashMacros'));
        if (oldFoods && oldMacros) {
            const todayStr = getFormattedDate(new Date());
            localStorage.setItem('diet_' + todayStr, JSON.stringify({ consumedFoods: oldFoods, dashMacros: oldMacros }));
        }
        localStorage.setItem('migrated_to_dates_v1', 'true');
    }

    // Inicia carregando os dados exatamente de HOJE
    loadDayData(getFormattedDate(new Date()));
});

// ==========================================
// MOTOR DE SUGESTÕES DO DIA (SLIDE 1)
// ==========================================
let suggestionInterval = null;

function renderDailySuggestions() {
    const stackContainer = document.getElementById('suggestions-stack');
    if (!stackContainer || foodsDB.length === 0) return;

    // Embaralha o banco e pega 3 opções aleatórias diferentes
    let shuffled = [...foodsDB].sort(() => 0.5 - Math.random());
    let selectedFoods = shuffled.slice(0, 3);

    stackContainer.innerHTML = '';

    // Imagens genéricas bonitas para simular pratos reais
    const imagens = [
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80'
    ];

    selectedFoods.forEach((food, index) => {
        const card = document.createElement('div');
        card.className = `sug-card card-pos-${index + 1}`;
        // Reutiliza a sua função nativa de abrir detalhes!
        card.onclick = () => openFoodDetail(food);

        card.innerHTML = `
            <img src="${imagens[index]}" class="sug-img" alt="Refeição">
            <div class="sug-content">
                <h4 class="sug-title">${food.nome}</h4>
                <div class="sug-cals">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>
                    ${Math.round(food.kcal)} ${(typeof appTranslations !== 'undefined' ? (appTranslations[localStorage.getItem('fitguide_user_lang') || 'pt'] || appTranslations['pt'])['calories_capitalize'] || 'Calorias' : 'Calorias')}
                </div>
                <div class="sug-macros">
                    <span>🍗 ${Math.round(food.p)}g</span>
                    <span>🌾 ${Math.round(food.c)}g</span>
                    <span>🥑 ${Math.round(food.g)}g</span>
                </div>
            </div>
        `;
        stackContainer.appendChild(card);
    });

    // Rotação Automática (5 em 5 segundos)
    clearInterval(suggestionInterval);
    suggestionInterval = setInterval(() => {
        const cards = Array.from(stackContainer.children);
        const classes = cards.map(c => c.className.match(/card-pos-\d/)[0]);

        classes.unshift(classes.pop()); // Joga a carta da frente para trás

        cards.forEach((card, index) => {
            card.classList.remove('card-pos-1', 'card-pos-2', 'card-pos-3');
            card.classList.add(classes[index]);
        });
    }, 10000);
}