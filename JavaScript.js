function nextStep(targetId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Para os cards do quiz
    const optionCards = document.querySelectorAll('.option-card:not(.alert-card)');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const input = this.querySelector('input[type="radio"]');
            if(input) {
                const groupName = input.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    radio.closest('.option-card').classList.remove('selected');
                });
                this.classList.add('selected');
                input.checked = true;
            }
        });
    });

    // Para os cards do Modal de Planos (Paywall)
    const planCards = document.querySelectorAll('.plan-option');
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            const input = this.querySelector('input[type="radio"]');
            if(input) {
                const groupName = input.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    radio.closest('.plan-option').classList.remove('selected');
                });
                this.classList.add('selected');
                input.checked = true;
            }
        });
    });
});

const translations = {
    pt: { 
        lang_badge: "🇧🇷 PT", example_plan: "EXEMPLO DE PLANO", welcome_title: "Bem-vindo ao<br>FitGuide", welcome_subtitle: "Seu guia simples para comer melhor e treinar sem complicação", btn_start: "Começar", already_have_account: "Já tem conta?", login: "Entrar", btn_continue: "Continuar",
        quiz_age_title: "Qual é a sua idade?", quiz_age_subtitle: "Isso nos ajuda a calcular suas necessidades calóricas diárias.",
        quiz_weight_title: "Qual é o seu peso atual?", quiz_weight_subtitle: "Usaremos para calcular suas porções ideais e ajustar seu plano de treino.",
        quiz_height_title: "Qual é a sua altura?", quiz_height_subtitle: "Usaremos para calcular suas porções ideais e ajustar seu plano de treino.",
        quiz_gender_title: "Qual é o seu gênero?", quiz_gender_subtitle: "Ajuda a personalizar suas necessidades nutricionais e plano de treino.",
        gender_male: "Masculino", gender_female: "Feminino", gender_other: "Prefiro não dizer",
        quiz_objective_title: "Qual é o seu objetivo?", quiz_objective_subtitle: "Vamos criar um plano focado no seu resultado.",
        obj_lose: "Perder peso", obj_gain: "Ganhar massa muscular", obj_maintain: "Manter peso", obj_perform: "Melhorar performance",
        quiz_routine_title: "Como está sua rotina hoje?", quiz_routine_subtitle: "Isso define quantas calorias você precisa.",
        routine_sedentary: "Sedentário", routine_sedentary_desc: "Pouco ou nenhum exercício",
        routine_light: "Levemente ativo", routine_light_desc: "Exercício leve 1-3 dias/sem",
        routine_moderate: "Moderadamente ativo", routine_moderate_desc: "Esportes 3-5 dias/sem",
        routine_active: "Muito ativo", routine_active_desc: "Exercício pesado 6-7 dias/sem",
        quiz_workouts_title: "Quantas vezes por semana você consegue treinar?", quiz_workouts_subtitle: "Considere o que é realista para você.",
        workouts_1_2: "1–2 vezes", workouts_3: "3 vezes", workouts_4_5: "4–5 vezes", workouts_0: "Não treino atualmente",
        quiz_diet_title: "Como é sua alimentação hoje?", quiz_diet_subtitle: "Não existe resposta certa.",
        diet_irregular: "Irregular", diet_balanced: "Balanceada na maior parte do tempo", diet_structured: "Estruturada", diet_none: "Não sigo nenhum padrão",
        quiz_side_effects_title: "Qual efeito colateral você tem mais receio?", quiz_side_effects_subtitle: "Essas informações ajudam a prevenir desconfortos.",
        side_effects_nausea: "Náusea", side_effects_fatigue: "Fadiga", side_effects_constipation: "Constipação", side_effects_diarrhea: "Diarreia", side_effects_headache: "Dor de cabeça", side_effects_reflux: "Refluxo", side_effects_loss_of_appetite: "Perda de apetite", side_effects_none: "Nenhum em específico",
        quiz_motivation_title: "O que está te levando a iniciar esse processo?", quiz_motivation_subtitle: "Selecione o principal motivo.",
        mot_body_relation: "Melhorar a relação com meu corpo", mot_energy: "Ter mais energia no dia a dia", mot_health: "Cuidar da saúde", mot_new_beginning: "Um novo começo", mot_specific_event: "Um evento específico", mot_other: "Outro motivo pessoal",
        quiz_pace_title: "Qual ritmo você considera adequado?", quiz_pace_subtitle: "Resultados consistentes tendem a ser progressivos.",
        pace_gradual: "Gradual e sustentável", pace_moderate: "Moderado", pace_unknown: "Não sei informar",
        quiz_restrictions_title: "Você tem restrições alimentares?", quiz_restrictions_subtitle: "Selecione a opção que melhor te descreve.",
        rest_none: "Nenhuma restrição", rest_vegetarian: "Vegetariano", rest_vegan: "Vegano", rest_allergies: "Tenho alergias",
        rest_allergies_placeholder: "Quais alergias? Ex: Amendoim, Camarão, Intolerância à lactose...", rest_allergies_warning: "ESSES ALIMENTOS SERÃO COMPLETAMENTE REMOVIDOS DO SEU PLANO.",
        
        // Traduções Paywall e Planos
        paywall_title: "Monitore diariamente cada dose", price_value: "R$ 12,49 /mês", price_weekly: "(R$ 3,12/semana)", view_plans: "VER OS PLANOS", terms: "Termos", privacy: "Privacidade", restore: "Restaurar",
        save_50: "ECONOMIZE 50%", plan_annual: "Plano anual", plan_monthly: "Plano mensal", price_annual_monthly: "R$ 12,49", price_monthly_monthly: "R$ 24,90", per_month: "por mês", btn_start_journey_lock: "COMEÇAR MINHA JORNADA 🔒"
    },
    en: { 
        lang_badge: "🇺🇸 EN", example_plan: "SAMPLE PLAN", welcome_title: "Welcome to<br>FitGuide", welcome_subtitle: "Your simple guide to eating better and training without complications", btn_start: "Start", already_have_account: "Already have an account?", login: "Log in", btn_continue: "Continue",
        quiz_age_title: "What is your age?", quiz_age_subtitle: "This helps us calculate your daily caloric needs.",
        quiz_weight_title: "What is your current weight?", quiz_weight_subtitle: "We'll use this to calculate ideal portions and adjust your plan.",
        quiz_height_title: "What is your height?", quiz_height_subtitle: "We'll use this to calculate ideal portions and adjust your plan.",
        quiz_gender_title: "What is your gender?", quiz_gender_subtitle: "Helps personalize your nutritional needs and workout plan.",
        gender_male: "Male", gender_female: "Female", gender_other: "Prefer not to say",
        quiz_objective_title: "What is your goal?", quiz_objective_subtitle: "Let's create a plan focused on your results.",
        obj_lose: "Lose weight", obj_gain: "Build muscle", obj_maintain: "Maintain weight", obj_perform: "Improve performance",
        quiz_routine_title: "How is your routine today?", quiz_routine_subtitle: "This defines how many calories you need.",
        routine_sedentary: "Sedentary", routine_sedentary_desc: "Little or no exercise",
        routine_light: "Lightly active", routine_light_desc: "Light exercise 1-3 days/wk",
        routine_moderate: "Moderately active", routine_moderate_desc: "Sports 3-5 days/wk",
        routine_active: "Very active", routine_active_desc: "Heavy exercise 6-7 days/wk",
        quiz_workouts_title: "How many times a week can you train?", quiz_workouts_subtitle: "Consider what is realistic for you.",
        workouts_1_2: "1–2 times", workouts_3: "3 times", workouts_4_5: "4–5 times", workouts_0: "I don't train currently",
        quiz_diet_title: "How is your diet today?", quiz_diet_subtitle: "There is no right answer.",
        diet_irregular: "Irregular", diet_balanced: "Balanced most of the time", diet_structured: "Structured", diet_none: "I don't follow any pattern",
        quiz_side_effects_title: "What side effect do you fear most?", quiz_side_effects_subtitle: "This information helps prevent discomfort.",
        side_effects_nausea: "Nausea", side_effects_fatigue: "Fatigue", side_effects_constipation: "Constipation", side_effects_diarrhea: "Diarrhea", side_effects_headache: "Headache", side_effects_reflux: "Reflux", side_effects_loss_of_appetite: "Loss of appetite", side_effects_none: "None specifically",
        quiz_motivation_title: "What is leading you to start this process?", quiz_motivation_subtitle: "Select the main reason.",
        mot_body_relation: "Improve relationship with my body", mot_energy: "Have more daily energy", mot_health: "Take care of my health", mot_new_beginning: "A fresh start", mot_specific_event: "A specific event", mot_other: "Other personal reason",
        quiz_pace_title: "What pace do you consider appropriate?", quiz_pace_subtitle: "Consistent results tend to be progressive.",
        pace_gradual: "Gradual and sustainable", pace_moderate: "Moderate", pace_unknown: "I don't know",
        quiz_restrictions_title: "Do you have dietary restrictions?", quiz_restrictions_subtitle: "Select the option that best describes you.",
        rest_none: "No restrictions", rest_vegetarian: "Vegetarian", rest_vegan: "Vegan", rest_allergies: "I have allergies",
        rest_allergies_placeholder: "Which allergies? E.g., Peanuts, Shrimp, Lactose intolerance...", rest_allergies_warning: "THESE FOODS WILL BE COMPLETELY REMOVED FROM YOUR PLAN.",
        
        // Traduções Paywall e Planos
        paywall_title: "Track every dose daily", price_value: "$ 1.95 /mo", price_weekly: "($ 0.48/week)", view_plans: "VIEW PLANS", terms: "Terms", privacy: "Privacy", restore: "Restore",
        save_50: "SAVE 50%", plan_annual: "Annual plan", plan_monthly: "Monthly plan", price_annual_monthly: "$ 1.95", price_monthly_monthly: "$ 3.90", per_month: "per month", btn_start_journey_lock: "START MY JOURNEY 🔒"
    },
    es: { 
        lang_badge: "🇪🇸 ES", example_plan: "EJEMPLO DE PLAN", welcome_title: "Bienvenido a<br>FitGuide", welcome_subtitle: "Tu guía sencilla para comer mejor y entrenar sin complicaciones", btn_start: "Empezar", already_have_account: "¿Ya tienes cuenta?", login: "Entrar", btn_continue: "Continuar",
        quiz_age_title: "¿Cuál es tu edad?", quiz_age_subtitle: "Esto nos ayuda a calcular tus necesidades calóricas diarias.",
        quiz_weight_title: "¿Cuál es tu peso actual?", quiz_weight_subtitle: "Lo usaremos para calcular tus porciones ideales y ajustar tu plan.",
        quiz_height_title: "¿Cuál es tu altura?", quiz_height_subtitle: "Lo usaremos para calcular tus porciones ideales y ajustar tu plan.",
        quiz_gender_title: "¿Cuál es tu género?", quiz_gender_subtitle: "Ayuda a personalizar tus necesidades nutricionales y plan de entrenamiento.",
        gender_male: "Masculino", gender_female: "Femenino", gender_other: "Prefiero no decirlo",
        quiz_objective_title: "¿Cuál es tu objetivo?", quiz_objective_subtitle: "Vamos a crear un plan enfocado en tu resultado.",
        obj_lose: "Perder peso", obj_gain: "Ganhar masa muscular", obj_maintain: "Mantener peso", obj_perform: "Mejorar rendimiento",
        quiz_routine_title: "¿Cómo es tu rutina hoy?", quiz_routine_subtitle: "Esto define cuántas calorías necesitas.",
        routine_sedentary: "Sedentario", routine_sedentary_desc: "Poco o ningún ejercicio",
        routine_light: "Ligeramente activo", routine_light_desc: "Ejercicio ligero 1-3 días/sem",
        routine_moderate: "Moderadamente activo", routine_moderate_desc: "Deportes 3-5 días/sem",
        routine_active: "Muy activo", routine_active_desc: "Ejercicio pesado 6-7 días/sem",
        quiz_workouts_title: "¿Cuántas veces a la semana puedes entrenar?", quiz_workouts_subtitle: "Considera lo que es realista para ti.",
        workouts_1_2: "1–2 veces", workouts_3: "3 veces", workouts_4_5: "4–5 veces", workouts_0: "No entreno actualmente",
        quiz_diet_title: "¿Cómo es tu alimentación hoy?", quiz_diet_subtitle: "No hay respuesta correcta.",
        diet_irregular: "Irregular", diet_balanced: "Equilibrada la mayor parte del tiempo", diet_structured: "Estructurada", diet_none: "No sigo ningún patrón",
        quiz_side_effects_title: "¿Qué efecto secundario temes más?", quiz_side_effects_subtitle: "Esta información ayuda a prevenir molestias.",
        side_effects_nausea: "Náusea", side_effects_fatigue: "Fatiga", side_effects_constipation: "Estreñimiento", side_effects_diarrhea: "Diarrea", side_effects_headache: "Dolor de cabeza", side_effects_reflux: "Reflujo", side_effects_loss_of_appetite: "Pérdida de apetito", side_effects_none: "Ninguno en específico",
        quiz_motivation_title: "¿Qué te lleva a iniciar este proceso?", quiz_motivation_subtitle: "Selecciona el motivo principal.",
        mot_body_relation: "Mejorar la relación con mi cuerpo", mot_energy: "Tener más energía en el día a día", mot_health: "Cuidar mi salud", mot_new_beginning: "Un nuevo comienzo", mot_specific_event: "Un evento específico", mot_other: "Otro motivo personal",
        quiz_pace_title: "¿Qué ritmo consideras adecuado?", quiz_pace_subtitle: "Los resultados consistentes tienden a ser progresivos.",
        pace_gradual: "Gradual y sostenible", pace_moderate: "Moderado", pace_unknown: "No sé informar",
        quiz_restrictions_title: "¿Tienes restricciones alimentarias?", quiz_restrictions_subtitle: "Selecciona la opción que mejor te describa.",
        rest_none: "Sin restricciones", rest_vegetarian: "Vegetariano", rest_vegan: "Vegano", rest_allergies: "Tengo alergias",
        rest_allergies_placeholder: "¿Qué alergias? Ej: Maní, Camarones, Intolerancia a la lactosa...", rest_allergies_warning: "ESTOS ALIMENTOS SERÁN ELIMINADOS COMPLETAMENTE DE TU PLAN.",
        
        // Traduções Paywall e Planos
        paywall_title: "Monitorea diariamente cada dosis", price_value: "1,95 € /mes", price_weekly: "(0,48 €/semana)", view_plans: "VER LOS PLANES", terms: "Términos", privacy: "Privacidad", restore: "Restaurar",
        save_50: "AHORRA 50%", plan_annual: "Plan anual", plan_monthly: "Plan mensual", price_annual_monthly: "1,95 €", price_monthly_monthly: "3,90 €", per_month: "por mes", btn_start_journey_lock: "COMENZAR MI VIAJE 🔒"
    }
};

function applyTranslations(lang) {
    const dict = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerHTML = dict[key]; 
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key]; 
    });

    const langBtn = document.getElementById('lang-btn');
    if(langBtn) langBtn.innerHTML = dict.lang_badge;
}

function setLanguage(lang) {
    applyTranslations(lang);
    localStorage.setItem('fitguide_user_lang', lang);
    document.getElementById('lang-menu').classList.add('hidden');
    document.getElementById('lang-btn').classList.remove('glow-effect');
}

function toggleLangMenu() {
    document.getElementById('lang-menu').classList.toggle('hidden');
    document.getElementById('lang-btn').classList.remove('glow-effect'); 
}

document.addEventListener('click', (e) => {
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector && !langSelector.contains(e.target)) {
        const menu = document.getElementById('lang-menu');
        if(menu) menu.classList.add('hidden');
    }
});

window.onload = () => {
    const savedLang = localStorage.getItem('fitguide_user_lang');
    if (!savedLang) {
        applyTranslations('pt'); 
        const btn = document.getElementById('lang-btn');
        if(btn) btn.classList.add('glow-effect');
    } else {
        applyTranslations(savedLang);
    }

    initAgePicker(); 
    initWeightPicker(); 
    initHeightPicker(); 
};

/* --- IDADE --- */
let selectedAge = 27; 
function initAgePicker() {
    const picker = document.getElementById('age-picker');
    if(!picker) return;
    for(let i = 16; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'picker-item';
        div.textContent = i;
        div.dataset.value = i;
        picker.appendChild(div);
    }
    const items = picker.querySelectorAll('.picker-item');
    const itemHeight = 70; 
    picker.addEventListener('scroll', () => {
        const centerIndex = Math.round(picker.scrollTop / itemHeight);
        items.forEach((item, index) => {
            if (index === centerIndex) {
                item.classList.add('active');
                selectedAge = item.dataset.value;
            } else { item.classList.remove('active'); }
        });
    });
    setTimeout(() => {
        const startIndex = 27 - 16; 
        picker.scrollTo({ top: startIndex * itemHeight, behavior: 'auto' });
    }, 50);
}
function saveAgeAndNext() {
    localStorage.setItem('fitguide_user_age', selectedAge);
    nextStep('step-quiz-weight');
}

/* --- PESO --- */
let selectedWeight = 70;
let currentWeightUnit = 'kg';

function initWeightPicker() {
    const picker = document.getElementById('weight-picker');
    if(!picker) return;
    picker.innerHTML = ''; 
    const minWeight = currentWeightUnit === 'kg' ? 30 : 60;
    const maxWeight = currentWeightUnit === 'kg' ? 200 : 400;
    
    for(let i = minWeight; i <= maxWeight; i++) {
        const div = document.createElement('div');
        div.className = 'ruler-mark';
        div.dataset.value = i;
        const span = document.createElement('span');
        span.textContent = i;
        div.appendChild(span);
        picker.appendChild(div);
    }
    const items = picker.querySelectorAll('.ruler-mark');
    const itemWidth = 100; 

    picker.addEventListener('scroll', () => {
        const centerIndex = Math.round(picker.scrollLeft / itemWidth);
        const displayValue = document.getElementById('weight-value');
        items.forEach((item, index) => {
            if (index === centerIndex) {
                item.classList.add('active');
                selectedWeight = item.dataset.value;
                if(displayValue) displayValue.textContent = selectedWeight;
            } else { item.classList.remove('active'); }
        });
    });
    setTimeout(() => {
        const defaultWeight = currentWeightUnit === 'kg' ? 70 : 150;
        const startIndex = defaultWeight - minWeight;
        picker.scrollTo({ left: startIndex * itemWidth, behavior: 'auto' });
    }, 50);
}

function setWeightUnit(unit) {
    currentWeightUnit = unit;
    document.getElementById('weight-unit-label').textContent = unit;
    document.getElementById('btn-weight-kg').classList.toggle('active', unit === 'kg');
    document.getElementById('btn-weight-lbs').classList.toggle('active', unit === 'lbs');
    initWeightPicker(); 
}
function saveWeightAndNext() {
    localStorage.setItem('fitguide_user_weight', selectedWeight);
    localStorage.setItem('fitguide_user_weight_unit', currentWeightUnit);
    nextStep('step-quiz-height'); 
}

/* --- ALTURA --- */
let selectedHeight = 160;
let currentHeightUnit = 'cm';

function initHeightPicker() {
    const picker = document.getElementById('height-picker');
    if(!picker) return;
    picker.innerHTML = ''; 
    const minHeight = currentHeightUnit === 'cm' ? 120 : 48;
    const maxHeight = currentHeightUnit === 'cm' ? 220 : 84;
    
    for(let i = maxHeight; i >= minHeight; i--) {
        const div = document.createElement('div');
        div.className = 'v-ruler-mark';
        div.dataset.value = i;
        const span = document.createElement('span');
        
        if (currentHeightUnit === 'cm') {
            if (i % 10 === 0) {
                div.classList.add('major');
                span.textContent = i;
            }
        } else {
            if (i % 12 === 0) { 
                div.classList.add('major');
                span.textContent = Math.floor(i / 12) + "'"; 
            }
        }
        
        div.appendChild(span);
        picker.appendChild(div);
    }

    const items = picker.querySelectorAll('.v-ruler-mark');
    const itemHeight = 12; 

    picker.addEventListener('scroll', () => {
        const centerIndex = Math.round(picker.scrollTop / itemHeight);
        const displayValue = document.getElementById('height-value');
        const activeItem = items[centerIndex];
        
        if (activeItem) {
            items.forEach(item => item.classList.remove('active'));
            activeItem.classList.add('active');
            selectedHeight = activeItem.dataset.value;
            
            if(displayValue) {
                if(currentHeightUnit === 'cm') {
                    displayValue.textContent = selectedHeight;
                } else {
                    const feet = Math.floor(selectedHeight / 12);
                    const inches = selectedHeight % 12;
                    displayValue.textContent = `${feet}'${inches}"`;
                }
            }
        }
    });

    setTimeout(() => {
        const defaultHeight = currentHeightUnit === 'cm' ? 160 : 64; 
        const startIndex = maxHeight - defaultHeight; 
        picker.scrollTo({ top: startIndex * itemHeight, behavior: 'auto' });
    }, 50);
}

function setHeightUnit(unit) {
    currentHeightUnit = unit;
    document.getElementById('height-unit-label').textContent = unit;
    document.getElementById('btn-height-cm').classList.toggle('active', unit === 'cm');
    document.getElementById('btn-height-ft').classList.toggle('active', unit === 'ft');
    initHeightPicker(); 
}

function saveHeightAndNext() {
    localStorage.setItem('fitguide_user_height', selectedHeight);
    localStorage.setItem('fitguide_user_height_unit', currentHeightUnit);
    nextStep('step-quiz-gender'); 
}

/* --- GÊNERO --- */
function saveGenderAndNext() {
    const selected = document.querySelector('input[name="gender"]:checked');
    if(selected) localStorage.setItem('fitguide_user_gender', selected.value);
    nextStep('step-quiz-objective'); 
}

/* --- OBJETIVO --- */
function saveObjectiveAndNext() {
    const selected = document.querySelector('input[name="objective"]:checked');
    if(selected) localStorage.setItem('fitguide_user_objective', selected.value);
    nextStep('step-quiz-routine'); 
}

/* --- ROTINA --- */
function saveRoutineAndNext() {
    const selected = document.querySelector('input[name="routine"]:checked');
    if(selected) localStorage.setItem('fitguide_user_routine', selected.value);
    nextStep('step-quiz-workouts'); 
}

/* --- FREQUÊNCIA DE TREINOS --- */
function saveWorkoutsAndNext() {
    const selected = document.querySelector('input[name="workouts"]:checked');
    if(selected) localStorage.setItem('fitguide_user_workouts', selected.value);
    nextStep('step-quiz-diet'); 
}

/* --- ALIMENTAÇÃO --- */
function saveDietAndNext() {
    const selected = document.querySelector('input[name="diet"]:checked');
    if(selected) localStorage.setItem('fitguide_user_diet', selected.value);
    nextStep('step-quiz-side-effects'); 
}

/* --- EFEITOS COLATERAIS --- */
function saveSideEffectsAndNext() {
    const selected = document.querySelector('input[name="side_effects"]:checked');
    if(selected) localStorage.setItem('fitguide_user_side_effects', selected.value);
    nextStep('step-quiz-motivation'); 
}

/* --- MOTIVAÇÃO --- */
function saveMotivationAndNext() {
    const selected = document.querySelector('input[name="motivation"]:checked');
    if(selected) localStorage.setItem('fitguide_user_motivation', selected.value);
    nextStep('step-quiz-pace'); 
}

/* --- RITMO --- */
function savePaceAndNext() {
    const selected = document.querySelector('input[name="pace"]:checked');
    if(selected) localStorage.setItem('fitguide_user_pace', selected.value);
    nextStep('step-quiz-restrictions'); 
}

/* --- RESTRIÇÕES E ALERGIAS --- */
function toggleAllergy() {
    const content = document.getElementById('allergy-content');
    const icon = document.getElementById('allergy-icon');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.textContent = '—'; 
    } else {
        content.classList.add('hidden');
        icon.textContent = '＋'; 
    }
}

function saveRestrictionsAndNext() {
    const selectedRadio = document.querySelector('input[name="restriction"]:checked');
    if(selectedRadio) {
        localStorage.setItem('fitguide_user_diet_restriction', selectedRadio.value);
    }
    
    const allergyContent = document.getElementById('allergy-content');
    const allergyText = document.getElementById('allergy-text').value;
    
    if (!allergyContent.classList.contains('hidden') && allergyText.trim() !== '') {
        localStorage.setItem('fitguide_user_allergies', allergyText.trim());
    } else {
        localStorage.removeItem('fitguide_user_allergies');
    }

    nextStep('step-paywall'); 
}

/* --- MODAL DE PLANOS (NOVO) --- */
function togglePlansModal() {
    const modal = document.getElementById('plans-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

