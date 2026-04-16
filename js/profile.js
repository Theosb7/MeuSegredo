// ==========================================
// MOTOR DE CÁLCULO METABÓLICO, PERFIL E EDITORES VISUAIS
// ==========================================

function getUserProfile() {
    return {
        age: parseInt(localStorage.getItem('fitguide_user_age')) || 25,
        weight: parseFloat(localStorage.getItem('fitguide_user_weight')) || 70,
        height: parseInt(localStorage.getItem('fitguide_user_height')) || 170,
        gender: localStorage.getItem('fitguide_user_gender') || 'masculino',
        objective: localStorage.getItem('fitguide_user_objective') || 'manter',
        routine: localStorage.getItem('fitguide_user_routine') || 'moderate'
    };
}

// 2. Fórmulas de Nutrição baseada na Ciência
function calculateDynamicMetas() {
    const p = getUserProfile();
    let bmr = 0;
    
    // Equação de Mifflin-St Jeor (Adaptado pra português do Onboarding)
    let gender = p.gender.toLowerCase();
    if (gender === 'masculino' || gender === 'male' || gender === 'h') {
        bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age) + 5;
    } else {
        bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age) - 161;
    }

    // Fator de Atividade (TDEE)
    let tdee = bmr * 1.55; 
    let r = p.routine.toLowerCase();
    if (r.includes('sedentary') || r.includes('sedentário')) tdee = bmr * 1.2;
    if (r.includes('light') || r.includes('leve')) tdee = bmr * 1.375;
    if (r.includes('moderate') || r.includes('moderado')) tdee = bmr * 1.55;
    if (r.includes('intense') || r.includes('intenso') || r.includes('atleta') || r.includes('active')) tdee = bmr * 1.725;

    // Fator de Objetivo (Déficit ou Superávit)
    let targetKcal = tdee;
    let obj = p.objective.toLowerCase();
    if (obj.includes('lose') || obj.includes('perder')) targetKcal -= 500;
    if (obj.includes('gain') || obj.includes('ganhar')) targetKcal += 300;

    // Pisos de Segurança (Minimum Intake)
    if (gender === 'feminino' && targetKcal < 1200) targetKcal = 1200;
    if (gender !== 'feminino' && targetKcal < 1500) targetKcal = 1500;

    let proteinMultiplier = (obj.includes('maintain') || obj.includes('manter')) ? 1.8 : 2.0;
    if (obj.includes('lose')) proteinMultiplier = 2.2; 
    let proteinGrams = p.weight * proteinMultiplier;
    
    let fatGrams = (targetKcal * 0.25) / 9;
    let carbGrams = (targetKcal - (proteinGrams * 4) - (fatGrams * 9)) / 4;

    return {
        kcal: Math.round(targetKcal),
        prot: Math.round(proteinGrams),
        carb: Math.round(carbGrams),
        fat: Math.round(fatGrams),
        fib: 30, 
        sug: 50,
        sod: 2000
    };
}

function renderProfileDetails() {
    const p = getUserProfile();

    const weightVal = document.getElementById('display-current-weight');
    const heightVal = document.getElementById('display-current-height');
    
    const pdWeight = document.getElementById('pd-val-weight');
    const pdHeight = document.getElementById('pd-val-height');
    const pdAge = document.getElementById('pd-val-age');
    const pdGender = document.getElementById('pd-val-gender');
    const pdGoal = document.getElementById('pd-val-goal');

    if(weightVal) weightVal.textContent = p.weight + ' kg';
    if(heightVal) heightVal.textContent = p.height + ' cm';
    if(pdWeight) pdWeight.textContent = p.weight + ' kg';
    if(pdHeight) pdHeight.textContent = p.height + ' cm';
    if(pdAge) pdAge.textContent = p.age + ' anos';
    
    let genderDisplay = p.gender;
    if (p.gender === 'masculino') genderDisplay = 'Masculino';
    else if (p.gender === 'feminino') genderDisplay = 'Feminino';
    else genderDisplay = 'Outro';
    if(pdGender) pdGender.textContent = genderDisplay;
    
    let objDisplay = 'Manter peso';
    if(p.objective === 'perder') objDisplay = 'Perder peso';
    if(p.objective === 'ganhar') objDisplay = 'Ganhar massa';
    if(p.objective === 'performance') objDisplay = 'Performance';
    if(pdGoal) pdGoal.textContent = objDisplay;
}

// ==========================================
// CONTROLADORES DOS EDITORES VISUAIS NATIVOS
// ==========================================

let editSelectedAge = 25;
let editSelectedWeight = 70;
let editWeightUnit = 'kg';
let editSelectedHeight = 170;
let editHeightUnit = 'cm';

function updateProfilePrompt(field) {
    const p = getUserProfile();
    
    if (field === 'age') {
        editSelectedAge = p.age;
        initEditAgePicker();
    } else if (field === 'weight') {
        editSelectedWeight = p.weight;
        editWeightUnit = localStorage.getItem('fitguide_user_weight_unit') || 'kg';
        setEditWeightUnit(editWeightUnit);
    } else if (field === 'height') {
        editSelectedHeight = p.height;
        editHeightUnit = localStorage.getItem('fitguide_user_height_unit') || 'cm';
        setEditHeightUnit(editHeightUnit);
    } else if (field === 'gender') {
        const rads = document.querySelectorAll('input[name="edit_gender"]');
        rads.forEach(r => {
            if(r.value === p.gender || r.value === 'other' && !['masculino','feminino'].includes(p.gender)) r.checked = true;
        });
    } else if (field === 'objective') {
        const rads = document.querySelectorAll('input[name="edit_objective"]');
        rads.forEach(r => {
            if(r.value === p.objective) r.checked = true;
        });
    }

    if(typeof switchTab === 'function') {
        switchTab('screen-edit-' + field, null);
    }
}

function saveProfileEdit(field) {
    if (field === 'age') {
        localStorage.setItem('fitguide_user_age', editSelectedAge);
    } else if (field === 'weight') {
        localStorage.setItem('fitguide_user_weight', editSelectedWeight);
        localStorage.setItem('fitguide_user_weight_unit', editWeightUnit);
    } else if (field === 'height') {
        localStorage.setItem('fitguide_user_height', editSelectedHeight);
        localStorage.setItem('fitguide_user_height_unit', editHeightUnit);
    } else if (field === 'gender') {
        const rad = document.querySelector('input[name="edit_gender"]:checked');
        if(rad) {
            let val = rad.value;
            if(val === 'male') val = 'masculino';
            if(val === 'female') val = 'feminino';
            localStorage.setItem('fitguide_user_gender', val);
        }
    } else if (field === 'objective') {
        const rad = document.querySelector('input[name="edit_objective"]:checked');
        if(rad) localStorage.setItem('fitguide_user_objective', rad.value);
    }

    renderProfileDetails();
    if(typeof initializeAlimentosDaily === 'function') {
        initializeAlimentosDaily(); 
    }
    
    // Volta suave e recarregando para o dash atualizar limites visuais globais
    switchTab('screen-personal-details', null);
    setTimeout(() => {
        window.location.reload();
    }, 150);
}

// --- IDADE PICKER --- //
function initEditAgePicker() {
    const picker = document.getElementById('edit-age-picker');
    if(!picker) return;
    if(picker.children.length === 0) {
        for(let i = 16; i <= 100; i++) {
            const div = document.createElement('div');
            div.className = 'picker-item';
            div.textContent = i;
            div.dataset.value = i;
            picker.appendChild(div);
        }
    }
    
    const items = picker.querySelectorAll('.picker-item');
    const itemHeight = 70; 
    picker.addEventListener('scroll', () => {
        const centerIndex = Math.round(picker.scrollTop / itemHeight);
        items.forEach((item, index) => {
            if (index === centerIndex) {
                item.classList.add('active');
                editSelectedAge = item.dataset.value;
            } else { item.classList.remove('active'); }
        });
    });
    setTimeout(() => {
        const startIndex = editSelectedAge - 16; 
        picker.scrollTo({ top: startIndex * itemHeight, behavior: 'auto' });
    }, 100);
}

// --- PESO PICKER --- //
function initEditWeightPicker() {
    const picker = document.getElementById('edit-weight-picker');
    if(!picker) return;
    picker.innerHTML = ''; 
    const minWeight = editWeightUnit === 'kg' ? 30 : 60;
    const maxWeight = editWeightUnit === 'kg' ? 200 : 400;
    
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

    const scrollHandler = () => {
        const centerIndex = Math.round(picker.scrollLeft / itemWidth);
        const displayValue = document.getElementById('edit-weight-value');
        items.forEach((item, index) => {
            if (index === centerIndex) {
                item.classList.add('active');
                editSelectedWeight = item.dataset.value;
                if(displayValue) displayValue.textContent = editSelectedWeight;
            } else { item.classList.remove('active'); }
        });
    };
    picker.removeEventListener('scroll', scrollHandler);
    picker.addEventListener('scroll', scrollHandler);

    setTimeout(() => {
        const startIndex = Math.max(0, editSelectedWeight - minWeight);
        picker.scrollTo({ left: startIndex * itemWidth, behavior: 'auto' });
    }, 100);
}

function setEditWeightUnit(unit) {
    editWeightUnit = unit;
    document.getElementById('edit-weight-unit-label').textContent = unit;
    document.getElementById('btn-edit-weight-kg').classList.toggle('active', unit === 'kg');
    document.getElementById('btn-edit-weight-lbs').classList.toggle('active', unit === 'lbs');
    initEditWeightPicker(); 
}

// --- ALTURA PICKER --- //
function initEditHeightPicker() {
    const picker = document.getElementById('edit-height-picker');
    if(!picker) return;
    picker.innerHTML = ''; 
    const minHeight = editHeightUnit === 'cm' ? 120 : 48;
    const maxHeight = editHeightUnit === 'cm' ? 220 : 84;
    
    for(let i = maxHeight; i >= minHeight; i--) {
        const div = document.createElement('div');
        div.className = 'v-ruler-mark';
        div.dataset.value = i;
        const span = document.createElement('span');
        
        if (editHeightUnit === 'cm') {
            if (i % 10 === 0) {
                div.classList.add('major');span.textContent = i;
            }
        } else {
            if (i % 12 === 0) { 
                div.classList.add('major');span.textContent = Math.floor(i / 12) + "'"; 
            }
        }
        div.appendChild(span);
        picker.appendChild(div);
    }

    const items = picker.querySelectorAll('.v-ruler-mark');
    const itemHeight = 12; 

    const scrollHandler = () => {
        const centerIndex = Math.round(picker.scrollTop / itemHeight);
        const displayValue = document.getElementById('edit-height-value');
        const activeItem = items[centerIndex];
        
        if (activeItem) {
            items.forEach(item => item.classList.remove('active'));
            activeItem.classList.add('active');
            editSelectedHeight = activeItem.dataset.value;
            
            if(displayValue) {
                if(editHeightUnit === 'cm') {
                    displayValue.textContent = editSelectedHeight;
                } else {
                    const feet = Math.floor(editSelectedHeight / 12);
                    const inches = editSelectedHeight % 12;
                    displayValue.textContent = `${feet}'${inches}"`;
                }
            }
        }
    };
    picker.removeEventListener('scroll', scrollHandler);
    picker.addEventListener('scroll', scrollHandler);

    setTimeout(() => {
        const startIndex = Math.max(0, maxHeight - editSelectedHeight); 
        picker.scrollTo({ top: startIndex * itemHeight, behavior: 'auto' });
    }, 100);
}

function setEditHeightUnit(unit) {
    editHeightUnit = unit;
    document.getElementById('edit-height-unit-label').textContent = unit;
    document.getElementById('btn-edit-height-cm').classList.toggle('active', unit === 'cm');
    document.getElementById('btn-edit-height-ft').classList.toggle('active', unit === 'ft');
    initEditHeightPicker(); 
}

document.addEventListener('DOMContentLoaded', renderProfileDetails);
