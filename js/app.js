// ==========================================
// CONTROLE DA CÂMERA NATIVA (WEBRTC)
// ==========================================
let cameraStream = null;

async function startCamera() {
    const videoElement = document.getElementById('camera-stream');

    // Verifica se o navegador suporta e se está em um ambiente seguro (HTTPS ou localhost)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            videoElement.srcObject = cameraStream;
        } catch (err) {
            console.error("Erro ao acessar a câmera: ", err);
            alert("Acesso à câmera negado. Verifique as permissões do seu navegador.");
        }
    } else {
        alert("Câmera bloqueada. O navegador exige uma conexão segura (HTTPS) para ligar a câmera no celular.");
    }
}

function stopCamera() {
    if (cameraStream) {
        // Desliga a luzinha da câmera e corta o sinal
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// ==========================================
// MOTOR DE ROTEAMENTO (BOTTOM NAV)
// ==========================================

function switchTab(tabId, clickedButton) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetScreen = document.getElementById(tabId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.scrollTo(0, 0);
    }

    // A MÁGICA DE HARDWARE AQUI:
    if (tabId === 'tab-camera') {
        startCamera(); // Liga a câmera ao entrar na aba Scanner
    } else {
        stopCamera();  // Desliga a câmera ao ir para as outras abas (poupa bateria)
    }
}

// ==========================================
// CALENDÁRIO DINÂMICO (ÚLTIMOS 30 DIAS)
// ==========================================

function generateCalendar(containerId) {
    const scroller = document.getElementById(containerId);
    if (!scroller) return;

    scroller.innerHTML = '';

    const today = new Date();
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dayName = daysOfWeek[date.getDay()];
        const dayNumber = date.getDate();
        const isToday = (i === 0);

        // Cria a chave única da data (Ex: "2026-03-28")
        const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

        const dateItem = document.createElement('div');
        dateItem.className = `date-item ${isToday ? 'active' : ''}`;

        dateItem.onclick = () => {
            scroller.querySelectorAll('.date-item').forEach(el => el.classList.remove('active'));
            dateItem.classList.add('active');
            dateItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

            // A MÁGICA: Avisa o alimentos.js que o dia mudou!
            if (typeof changeSelectedDate === 'function') {
                changeSelectedDate(dateStr);
            }
        };

        dateItem.innerHTML = `
            <span class="day-name">${dayName}</span>
            <div class="day-circle">${dayNumber}</div>
        `;
        scroller.appendChild(dateItem);
    }

    setTimeout(() => {
        scroller.scrollLeft = scroller.scrollWidth;
    }, 100);
}

// ==========================================
// LÓGICA GERAL (CARROSSEIS E ÁGUA)
// ==========================================

function setupCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dots = document.querySelectorAll(`#${dotsId} .dot`);

    if (track && dots.length > 0) {
        track.addEventListener('scroll', () => {
            const slideWidth = track.offsetWidth;
            const scrollPosition = track.scrollLeft;
            const currentIndex = Math.round(scrollPosition / slideWidth);

            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar('date-scroller');
    generateCalendar('workout-date-scroller');

    setupCarousel('stats-carousel', 'carousel-dots');
    setupCarousel('workout-hero-carousel', 'workout-carousel-dots');
});

let currentWater = 0;
function updateWater(amount) {
    currentWater += amount;
    if (currentWater < 0) currentWater = 0;

    const waterDisplay = document.getElementById('water-amount');
    if (waterDisplay) {
        waterDisplay.textContent = currentWater + ' ml';
    }
}

// ==========================================
// MOTOR DE BASE DE DADOS (JSON) - TROCA DE EXERCÍCIOS
// ==========================================

let exercisesDB = [];
let currentSwapTarget = null;

async function loadExercises() {
    try {
        const res = await fetch('data/exercicios.json');
        exercisesDB = await res.json();
    } catch (e) {
        console.log("Erro ao carregar o ficheiro JSON.", e);
    }
}

function openSwapModal(btnElement, grupoMuscular) {
    currentSwapTarget = btnElement.closest('.exercise-card');
    const modal = document.getElementById('swap-modal');
    const listContainer = document.getElementById('alt-exercises-list');

    const alternativas = exercisesDB.filter(ex => ex.grupo_muscular === grupoMuscular);
    listContainer.innerHTML = '';

    if (alternativas.length === 0) {
        listContainer.innerHTML = '<p class="placeholder-text">Nenhuma alternativa encontrada na base de dados.</p>';
    } else {
        alternativas.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exercise-card alt-exercise-card';
            card.onclick = () => confirmSwap(ex);

            card.innerHTML = `
                <div class="ex-image-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11M6.5 17.5h11M5 4v16M19 4v16M9 9h6v6H9z"></path></svg>
                </div>
                <div class="ex-info">
                    <h4>${ex.nome}</h4>
                    <span class="alt-tag">${ex.equipamento}</span>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }
    modal.classList.add('show');
}

function closeSwapModal() {
    document.getElementById('swap-modal').classList.remove('show');
    currentSwapTarget = null;
}

function confirmSwap(exData) {
    if (!currentSwapTarget) return;
    const titleEl = currentSwapTarget.querySelector('h4');
    titleEl.textContent = exData.nome;
    const descEl = currentSwapTarget.querySelector('p');
    descEl.textContent = `Equipamento: ${exData.equipamento}`;
    closeSwapModal();
}

// ==========================================
// LÓGICA DE GERAR NOVO TREINO (NOVO)
// ==========================================

function openGenerateModal() {
    document.getElementById('generate-modal').classList.add('show');
}

function closeGenerateModal() {
    document.getElementById('generate-modal').classList.remove('show');
}

// Múltipla escolha (Pode selecionar vários dias)
function toggleDay(btn) {
    btn.classList.toggle('active');
}

// Escolha exclusiva (Se clica em "Com", apaga o "Sem" e vice versa)
function toggleEquip(btn) {
    const container = btn.parentElement;
    const isAlreadyActive = btn.classList.contains('active');

    // Remove o active de todos os botões desse container
    container.querySelectorAll('.equip-btn').forEach(b => b.classList.remove('active'));

    // Se não estava ativo antes de clicar, ativa ele (permite deixar nenhum ativo se quiser)
    if (!isAlreadyActive) {
        btn.classList.add('active');
    }
}

// Simula a geração do treino com a IA
function simulateGenerate() {
    const btn = document.querySelector('.btn-submit-gen');
    const originalText = btn.textContent;
    btn.textContent = 'Mapeando músculos...';

    setTimeout(() => {
        btn.textContent = originalText;
        closeGenerateModal();

        // Arrasta o carrossel de volta para o Card 1 automaticamente
        const track = document.getElementById('workout-hero-carousel');
        if (track) track.scrollTo({ left: 0, behavior: 'smooth' });

        // No futuro: Aqui você irá ler o BD e popular a tela com os novos exercícios gerados.
    }, 1200);
}

// ==========================================
// LÓGICA DO SCANNER IA (CÂMERA)
// ==========================================

function simulateScan() {
    const frame = document.querySelector('.focus-frame');
    const overlay = document.getElementById('analyzing-overlay');
    const resultModal = document.getElementById('scan-result-modal');

    // 1. Inicia o laser de escaneamento visual
    frame.classList.add('scanning');

    // 2. Após 1.5s, "tira a foto" e mostra a tela preta carregando
    setTimeout(() => {
        frame.classList.remove('scanning');
        overlay.classList.add('show');

        // 3. Após mais 2.5s (simulando resposta da API), mostra o resultado
        setTimeout(() => {
            overlay.classList.remove('show');
            resultModal.classList.add('show');
        }, 2500);

    }, 1500);
}

function closeScanResult() {
    document.getElementById('scan-result-modal').classList.remove('show');
}

function addToDiet() {
    // Fecha o modal e redireciona o usuário para a aba de Dieta com a refeição "cadastrada"
    closeScanResult();
    switchTab('tab-diet', document.getElementById('nav-diet'));
}

// ==========================================
// SPEED DIAL MENU (O BOTÃO +)
// ==========================================

function toggleFabMenu() {
    const overlay = document.getElementById('fab-overlay');
    const menu = document.getElementById('fab-menu');
    const fabBtn = document.getElementById('main-fab');

    overlay.classList.toggle('show');
    menu.classList.toggle('show');
    fabBtn.classList.toggle('open');
}

function handleFabAction(action) {
    toggleFabMenu();

    setTimeout(() => {
        if (action === 'camera') {
            switchTab('tab-camera', null);
        } else if (action === 'search') {
            switchTab('tab-diet', document.getElementById('nav-diet'));
            const searchInput = document.getElementById('main-food-search');
            if (searchInput) searchInput.focus();
        } else if (action === 'manual') {
            // Placeholder: Ação para registrar manualmente ao clicar no lápis
            // Pode abrir a aba de dieta ou um modal de novo alimento
            alert("Botão de registro manual clicado.");
        }
    }, 300);
}
// ==========================================
// TELA DE PROGRESSO (FILTROS DE TEMPO)
// ==========================================

function toggleProgTab(clickedBtn, groupId) {
    // Busca os botões apenas no mesmo "grupo" (linha) do botão clicado
    const container = clickedBtn.parentElement;
    container.querySelectorAll('.prog-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa o botão clicado
    clickedBtn.classList.add('active');
}

// Inicializador de UI e Treinos
document.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    applySavedTheme();
});

// ==========================================
// TEMA ESCURO
// ==========================================
function changeTheme(themeVal) {
    if (themeVal === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('fitguide_theme', 'dark');
    } else if (themeVal === 'light') {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('fitguide_theme', 'light');
    } else {
        localStorage.setItem('fitguide_theme', 'system');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

function applySavedTheme() {
    const saved = localStorage.getItem('fitguide_theme') || 'system';
    const select = document.getElementById('theme-select');

    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
        if (select) select.value = 'dark';
    } else if (saved === 'light') {
        document.body.classList.remove('dark-theme');
        if (select) select.value = 'light';
    } else {
        if (select) select.value = 'system';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// =====================================
// Suporte ao Scroll Horizontal no Computador
// =====================================
function initDesktopScroll() {
    const containers = document.querySelectorAll('.date-scroller, .carousel-track, .workout-carousel-track, .scroll-ruler, .week-selector-container');
    
    containers.forEach(container => {
        // Garantir que so aplica prevencao se houver overflow horizontal
        if (window.getComputedStyle(container).overflowX !== 'auto' && window.getComputedStyle(container).overflowX !== 'scroll') return;
        
        container.addEventListener('wheel', (evt) => {
            // Ignora se estiver pressionando Shift (navegação horizontal nativa já usa shift)
            if (evt.shiftKey) return; 

            if (evt.deltaY !== 0) {
                evt.preventDefault();
                container.scrollLeft += evt.deltaY;
            }
        }, { passive: false });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDesktopScroll);
} else {
    initDesktopScroll();
}