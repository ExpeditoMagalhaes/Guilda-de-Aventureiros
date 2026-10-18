// =========================================================
// VARIÁVEIS DE ESTADO
// =========================================================
let routePath = []; 
let travelerIndexCounter = 0; 
const container = document.getElementById('steps-container');
const charactersContainer = document.getElementById('characters-container');
const transportSelect = document.getElementById('transportMode');
const encountersSelect = document.getElementById('encounters');
const downtimeInput = document.getElementById('downtimeDays');
const summaryBox = document.getElementById('summary-box');
const summaryContent = document.getElementById('summary-content');
const discordText = document.getElementById('discordText');
const copyBtn = document.getElementById('copyBtn');
const addTravelerBtn = document.getElementById('addTravelerBtn');

// Mapa
const mapModal = document.getElementById('mapModal');
const openMapBtn = document.getElementById('openMapBtn');
const closeMapBtn = document.getElementById('closeMapBtn');
const mapContainer = document.getElementById('mapContainer');
const mapImage = document.getElementById('mapImage');

let mapScale = 1;
let isPanning = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

// =========================================================
// OUVINTES GLOBAIS
// =========================================================
transportSelect.addEventListener('change', () => { refreshAllCharactersUI(); resetBuilder(); });
encountersSelect.addEventListener('change', updateSummary);
downtimeInput.addEventListener('input', updateSummary);
copyBtn.addEventListener('click', copyToClipboard);
addTravelerBtn.addEventListener('click', addTraveler);

// =========================================================
// 1. SISTEMA DINÂMICO DE PERSONAGENS
// =========================================================
function addTraveler() {
    travelerIndexCounter++;
    const cardId = `char-${travelerIndexCounter}`;
    const globalRule = transportRules[transportSelect.value];
    
    // O primeiro membro nunca terá botão de excluir
    const isFirstMember = charactersContainer.children.length === 0;
    const removeBtnHtml = isFirstMember ? '' : `<button class="btn-remove" onclick="removeTraveler('${cardId}')">Remover</button>`;

    const card = document.createElement('div');
    card.className = 'char-card';
    card.id = cardId;
    
    let mountOptionsHtml = '';
    if (globalRule.isCollective) {
        const forbid = globalRule.forbidMounts ? 'disabled' : '';
        mountOptionsHtml = `
            <select class="char-mount" ${forbid}>
                <option value="none">Sem montaria</option>
                ${!globalRule.forbidMounts ? '<option value="has_mount">Levando Montaria Extra</option>' : ''}
            </select>
        `;
    } else {
        mountOptionsHtml = `
            <select class="char-mount">
                <option value="ape">${globalRule.modes['ape'].name}</option>
                <option value="cavalo_carga">${globalRule.modes['cavalo_carga'].name}</option>
                <option value="cavalo_rapido">${globalRule.modes['cavalo_rapido'].name}</option>
            </select>
        `;
    }

    card.innerHTML = `
        <div class="char-header">
            <span class="char-card-title">Membro da Comitiva</span>
            ${removeBtnHtml}
        </div>
        <div class="char-grid">
            <div class="input-group">
                <label>Nome:</label>
                <input type="text" class="char-name" placeholder="@Guerreiro" value="Personagem ${travelerIndexCounter}">
            </div>
            <div class="input-group">
                <label>Modo/Montaria:</label>
                ${mountOptionsHtml}
            </div>
            <div class="input-group" style="grid-column: span 2;">
                <label>Provisões da Viagem:</label>
                <select class="char-provision">
                    <option value="paga">Compradas (Nenhuma Magia)</option>
                    <option value="magia_comida">Magia (Somente Comida)</option>
                    <option value="magia_agua">Magia (Somente Água)</option>
                    <option value="magia_tudo">Magia (Comida e Água)</option>
                </select>
            </div>
        </div>
    `;
    
    card.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateSummary));
    charactersContainer.appendChild(card);
    updateSummary();
}

function removeTraveler(cardId) {
    document.getElementById(cardId).remove();
    updateSummary();
}

function refreshAllCharactersUI() {
    const currentCount = charactersContainer.children.length;
    charactersContainer.innerHTML = '';
    travelerIndexCounter = 0;
    let countToRender = currentCount === 0 ? 1 : currentCount;
    for (let i = 0; i < countToRender; i++) addTraveler();
}

// =========================================================
// 2. CONSTRUTOR DE ROTAS
// =========================================================
function resetBuilder() {
    routePath = [];
    container.innerHTML = '';
    summaryBox.classList.add('hidden');
    renderStep(0);
}

function renderStep(stepIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'step-wrapper';
    wrapper.dataset.index = stepIndex;

    if (stepIndex > 0) {
        const arrow = document.createElement('div');
        arrow.className = 'step-arrow';
        arrow.innerHTML = '&#8595;';
        wrapper.appendChild(arrow);
    }

    const row = document.createElement('div');
    row.className = 'step-row';

    const citySelect = document.createElement('select');
    citySelect.appendChild(new Option(stepIndex === 0 ? "Origem..." : "Destino...", ""));

    const activeRules = transportRules[transportSelect.value];
    const currentMatrix = activeRules.matrix;
    let availableCities = [];

    if (stepIndex === 0) {
        availableCities = Object.keys(currentMatrix);
    } else {
        const originCity = routePath[stepIndex - 1].city;
        const cityToExclude = stepIndex >= 2 ? routePath[stepIndex - 2].city : null;
        if (currentMatrix[originCity]) {
            availableCities = Object.keys(currentMatrix[originCity]).filter(city => city !== cityToExclude);
        }
    }

    if (activeRules.allowedCities) {
        availableCities = availableCities.filter(city => activeRules.allowedCities.includes(city));
    }
    availableCities.sort();

    if (stepIndex > 0 && availableCities.length === 0) {
        row.innerHTML = `<p style="color: #8b0000; font-style: italic; margin:0;">Fim da rota. Nenhuma conexão.</p>`;
        wrapper.appendChild(row);
        container.appendChild(wrapper);
        return;
    }

    availableCities.forEach(city => citySelect.appendChild(new Option(city, city)));
    row.appendChild(citySelect);

    let conditionSelect = null;
    if (stepIndex > 0 && activeRules.hasConditions) {
        conditionSelect = document.createElement('select');
        for (let key in activeRules.conditions) {
            conditionSelect.appendChild(new Option(activeRules.conditions[key], key));
        }
        row.appendChild(conditionSelect);
    }

    const handleChange = () => {
        const city = citySelect.value;
        const cond = conditionSelect ? conditionSelect.value : (activeRules.hasConditions ? Object.keys(activeRules.conditions)[0] : "normal");
        
        routePath = routePath.slice(0, stepIndex);
        container.querySelectorAll('.step-wrapper').forEach(w => {
            if (parseInt(w.dataset.index) > stepIndex) w.remove();
        });

        if (city !== "") {
            routePath[stepIndex] = { city: city, condition: cond };
            renderStep(stepIndex + 1);
        }
        updateSummary();
    };

    citySelect.addEventListener('change', handleChange);
    if (conditionSelect) conditionSelect.addEventListener('change', handleChange);

    wrapper.appendChild(row);
    container.appendChild(wrapper);
}

// =========================================================
// 3. MATEMÁTICA, CUSTOS E RESUMO
// =========================================================
function formatCurrencyFromCp(totalCp, isIndividual = false) {
    const gp = Math.floor(totalCp / 100);
    const sp = Math.floor((totalCp % 100) / 10);
    const cp = totalCp % 10;
    let res = [];
    if (gp > 0) res.push(`${gp} PO`);
    if (sp > 0) res.push(`${sp} PP`);
    if (cp > 0) res.push(`${cp} PC`);
    
    if (res.length === 0) {
        return isIndividual ? "0 PC" : "0 (Viagem Totalmente Mágica)";
    }
    return res.join(' e ');
}

function updateSummary() {
    if (routePath.length < 2) {
        summaryBox.classList.add('hidden');
        return;
    }

    const globalRule = transportRules[transportSelect.value];
    const cards = Array.from(charactersContainer.querySelectorAll('.char-card'));
    
    let totalFractionalDays = 0;
    let totalMiles = 0;
    let pathLog = [];

    for (let i = 0; i < routePath.length - 1; i++) {
        const from = routePath[i].city;
        const to = routePath[i + 1].city;
        const condition = routePath[i + 1].condition; 
        const dist = globalRule.matrix[from][to];
        
        let stepPace = 999; 

        if (globalRule.isCollective) {
            stepPace = globalRule.mph[condition];
        } else {
            cards.forEach(card => {
                const charMount = card.querySelector('.char-mount').value;
                const charPace = globalRule.modes[charMount].mph[condition];
                if (charPace < stepPace) stepPace = charPace;
            });
        }

        totalFractionalDays += (dist / stepPace);
        totalMiles += dist;
        pathLog.push(`${to}`);
    }

    // Dias Totais da Viagem in-game
    const totalDaysInGame = Math.ceil(totalFractionalDays);
    
    // Matemática do Contador Discord (Começa em 1 + Downtime)
    const downtime = Math.max(0, parseInt(downtimeInput.value) || 0);
    const discordCurrentDay = 1 + downtime;

    let dailyGroupCostCp = 0;
    let discordCharsLog = [];

    // Cálculo Econômico por Personagem
    cards.forEach(card => {
        const name = card.querySelector('.char-name').value || "Viajante";
        const mountInput = card.querySelector('.char-mount').value;
        const provInput = card.querySelector('.char-provision').value;

        let charDailyCp = 0;
        let mountText = "";
        let hasMount = false;

        let foodCostCp = globalRule.baseTravelerCostSp * 10;
        let waterCostCp = gameEconomy.waterTravelerCostCp;

        if (provInput === 'magia_comida' || provInput === 'magia_tudo') foodCostCp = 0;
        if (provInput === 'magia_agua' || provInput === 'magia_tudo') waterCostCp = 0;

        charDailyCp += (foodCostCp + waterCostCp);

        if (globalRule.isCollective) {
            if (mountInput === 'has_mount') {
                hasMount = true;
                let mountFoodCp = globalRule.mountCostSp * 10;
                let mountWaterCp = gameEconomy.waterMountCostCp;
                
                if (provInput === 'magia_comida' || provInput === 'magia_tudo') mountFoodCp = 0;
                if (provInput === 'magia_agua' || provInput === 'magia_tudo') mountWaterCp = 0;
                
                charDailyCp += (mountFoodCp + mountWaterCp);
                mountText = " c/ Montaria";
            }
        } else {
            if (mountInput !== 'ape') hasMount = true;
            let mountFoodCp = globalRule.modes[mountInput].mountCostSp * 10;
            let mountWaterCp = hasMount ? gameEconomy.waterMountCostCp : 0;

            if (provInput === 'magia_comida' || provInput === 'magia_tudo') mountFoodCp = 0;
            if (provInput === 'magia_agua' || provInput === 'magia_tudo') mountWaterCp = 0;

            charDailyCp += (mountFoodCp + mountWaterCp);
            mountText = ` ${globalRule.modes[mountInput].discordTag}`;
        }

        dailyGroupCostCp += charDailyCp;
        
        // Formata o custo individual deste personagem para a viagem toda
        const totalCharCostCp = charDailyCp * totalDaysInGame;
        let individualCostString = formatCurrencyFromCp(totalCharCostCp, true);
        
        // Se a viagem for sustentada totalmente por magia e custo zerou
        if (totalCharCostCp === 0 && provInput !== 'paga') {
            individualCostString = "Sustentado por Magia";
        }

        discordCharsLog.push(`${name}${mountText} (${individualCostString})`);
    });

    const finalTotalCostCp = dailyGroupCostCp * totalDaysInGame;
    const finalFormattedCost = formatCurrencyFromCp(finalTotalCostCp);

    summaryContent.innerHTML = `
        <p><strong>Distância Total:</strong> ${totalMiles} milhas</p>
        <p><strong>Dias de Viagem:</strong> ${totalDaysInGame} dia(s)</p>
        <p><strong>Custo Final (Grupo):</strong> <span class="cost-highlight">${finalFormattedCost}</span></p>
    `;

    discordText.textContent = `**Comitiva:** ${discordCharsLog.join(', ')}
**Caminho:** ${routePath[0].city} ➔ ${pathLog.join(' ➔ ')}

**Transporte Global:** ${transportSelect.options[transportSelect.selectedIndex].text}
**Encontros:** ${encountersSelect.value}
**Custo Total (Grupo):** ${finalFormattedCost}
**Dias de Viagem:** ${discordCurrentDay} / ${totalDaysInGame} (${downtime} dia(s) de Downtime)`;

    summaryBox.classList.remove('hidden');
}

function copyToClipboard() {
    navigator.clipboard.writeText(discordText.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "📋 Copiado!";
        copyBtn.classList.add("copied");
        setTimeout(() => { copyBtn.innerHTML = originalText; copyBtn.classList.remove("copied"); }, 2000);
    });
}

// =========================================================
// 4. MAPA INTERATIVO (Pan & Zoom)
// =========================================================
if(openMapBtn) {
    openMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('hidden');
        mapScale = 0.5; translateX = 0; translateY = 0;
        updateMapTransform();
    });
}

if(closeMapBtn) {
    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.add('hidden');
    });
}

function updateMapTransform() {
    if(mapImage) mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${mapScale})`;
}

if(mapContainer) {
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        const zoomSpeed = 0.1;
        const direction = e.deltaY < 0 ? 1 : -1; 
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let newScale = mapScale + (direction * zoomSpeed);
        newScale = Math.min(Math.max(0.1, newScale), 5);

        const ratio = 1 - (newScale / mapScale);
        translateX += (mouseX - translateX) * ratio;
        translateY += (mouseY - translateY) * ratio;

        mapScale = newScale;
        updateMapTransform();
    });

    mapContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateMapTransform();
    });
    mapContainer.addEventListener('mouseup', () => isPanning = false);
    mapContainer.addEventListener('mouseleave', () => isPanning = false);

    mapContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isPanning = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });
    mapContainer.addEventListener('touchmove', (e) => {
        if (!isPanning || e.touches.length !== 1) return;
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateMapTransform();
    }, { passive: false });
    mapContainer.addEventListener('touchend', () => isPanning = false);
}

// INICIALIZAÇÃO
addTraveler(); 
resetBuilder();