// =========================================================
// VARIÁVEIS DE ESTADO E ELEMENTOS DOM (Formulário e Rota)
// =========================================================
let routePath = []; 
const container = document.getElementById('steps-container');
const charactersContainer = document.getElementById('characters-container');
const transportSelect = document.getElementById('transportMode');
const travelersCountInput = document.getElementById('travelersCount');
const summaryBox = document.getElementById('summary-box');
const summaryContent = document.getElementById('summary-content');
const discordText = document.getElementById('discordText');
const copyBtn = document.getElementById('copyBtn');

// =========================================================
// VARIÁVEIS E ELEMENTOS DOM (Mapa Interativo)
// =========================================================
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
// OUVINTES DE EVENTOS PRINCIPAIS
// =========================================================
transportSelect.addEventListener('change', () => { renderCharacters(); resetBuilder(); });
travelersCountInput.addEventListener('input', renderCharacters);
copyBtn.addEventListener('click', copyToClipboard);

// --- 1. RENDERIZAÇÃO DOS PERSONAGENS ---
function renderCharacters() {
    const count = Math.max(1, parseInt(travelersCountInput.value) || 1);
    const globalRule = transportRules[transportSelect.value];
    charactersContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'char-card';
        
        let mountOptionsHtml = '';
        if (globalRule.isCollective) {
            const forbid = globalRule.forbidMounts ? 'disabled' : '';
            mountOptionsHtml = `
                <select class="char-mount" ${forbid}>
                    <option value="none">Sem montaria</option>
                    ${!globalRule.forbidMounts ? '<option value="has_mount">Levando Montaria</option>' : ''}
                </select>
            `;
        } else {
            mountOptionsHtml = `
                <select class="char-mount">
                    <option value="ape">A Pé (30 ft)</option>
                    <option value="cavalo_carga">Cavalo de Carga (40 ft)</option>
                    <option value="cavalo_rapido">Cavalo Rápido (60 ft)</option>
                </select>
            `;
        }

        card.innerHTML = `
            <span class="char-card-title">Membro ${i + 1}</span>
            <div class="char-grid">
                <div class="input-group">
                    <label>Nome:</label>
                    <input type="text" class="char-name" placeholder="Ex: @Guerreiro" value="Personagem ${i + 1}">
                </div>
                <div class="input-group">
                    <label>Transporte/Montaria:</label>
                    ${mountOptionsHtml}
                </div>
                <div style="grid-column: span 2; margin-top: 5px;">
                    <span style="font-size: 13px; font-weight: bold; color: var(--highlight); margin-bottom: 5px; display: block;">Provisões da Viagem:</span>
                    <div style="display: flex; gap: 15px;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px;">
                            <input type="radio" name="prov_${i}" class="char-provision" value="comprada" checked style="accent-color: var(--highlight); transform: scale(1.2);"> Compradas
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px;">
                            <input type="radio" name="prov_${i}" class="char-provision" value="magia" style="accent-color: var(--highlight); transform: scale(1.2);"> Magia
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        card.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateSummary));
        charactersContainer.appendChild(card);
    }
    updateSummary();
}

// --- 2. CONSTRUTOR DE ROTAS ---
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
        row.innerHTML = `<p style="color: #8b0000; font-style: italic; margin:0;">Fim da rota. Nenhuma conexão disponível.</p>`;
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

// --- 3. MATEMÁTICA E RESUMO ---
function formatCurrency(totalSp) {
    const gp = Math.floor(totalSp / 10);
    const sp = totalSp % 10;
    let res = [];
    if (gp > 0) res.push(`${gp} PO`);
    if (sp > 0) res.push(`${sp} PP`);
    return res.length === 0 ? "0 (Viagem 100% Mágica)" : res.join(' e ');
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
        pathLog.push(`${to} (${globalRule.conditions[condition] || "Mar Aberto"})`);
    }

    const totalDaysRounded = Math.ceil(totalFractionalDays);

    let dailyGroupCostSp = 0;
    let discordCharsLog = [];

    cards.forEach(card => {
        const name = card.querySelector('.char-name').value || "Desconhecido";
        const mountInput = card.querySelector('.char-mount').value;
        const provInput = card.querySelector('.char-provision:checked').value;

        let charDailySp = 0;
        let provText = provInput === 'magia' ? "(Magia)" : "(Pago)";
        let mountText = "";

        if (globalRule.isCollective) {
            charDailySp += globalRule.baseTravelerCostSp; 
            if (provInput === 'magia') charDailySp = Math.max(0, charDailySp - 5);
            
            if (mountInput === 'has_mount') {
                charDailySp += globalRule.mountCostSp;
                mountText = " c/ Montaria Extra";
            }
        } else {
            charDailySp += globalRule.baseTravelerCostSp; 
            if (provInput === 'magia') charDailySp = Math.max(0, charDailySp - 5);
            
            charDailySp += globalRule.modes[mountInput].mountCostSp; 
            mountText = ` [${globalRule.modes[mountInput].name}]`;
        }

        dailyGroupCostSp += charDailySp;
        discordCharsLog.push(`${name}${mountText} ${provText}`);
    });

    const finalTotalCostSp = dailyGroupCostSp * totalDaysRounded;
    const finalFormattedCost = formatCurrency(finalTotalCostSp);

    summaryContent.innerHTML = `
        <p><strong>Caminho:</strong> ${routePath[0].city} ➔ ${pathLog.join(' ➔ ')}</p>
        <p><strong>Distância Total:</strong> ${totalMiles} milhas</p>
        <p><strong>Dias de Viagem:</strong> ${totalDaysRounded} dia(s)</p>
        <p><strong>Custo Total do Grupo:</strong> <span class="cost-highlight">${finalFormattedCost}</span></p>
    `;

    discordText.textContent = `**Comitiva:** ${discordCharsLog.join(', ')}
**Partida:** ${routePath[0].city}
**Destino:** ${routePath[routePath.length - 1].city}

**Transporte Global:** ${transportSelect.options[transportSelect.selectedIndex].text}
**Trajeto(s):** ${pathLog.join(', ')}
**Custo Total (Grupo):** ${finalFormattedCost}
**Dias de Viagem:** 0 / ${totalDaysRounded}`;

    summaryBox.classList.remove('hidden');
}

function copyToClipboard() {
    navigator.clipboard.writeText(discordText.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "✅ Copiado!";
        copyBtn.classList.add("copied");
        setTimeout(() => { copyBtn.innerHTML = originalText; copyBtn.classList.remove("copied"); }, 2000);
    });
}

// --- 4. SISTEMA DE MAPA INTERATIVO (PAN & ZOOM) ---

// Abre o Modal e centraliza a imagem
if(openMapBtn) {
    openMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('hidden');
        mapScale = 0.5; // Começa menor para caber na tela
        translateX = 0; 
        translateY = 0;
        updateMapTransform();
    });
}

// Fecha o Modal
if(closeMapBtn) {
    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.add('hidden');
    });
}

// Aplica a matemática visual no CSS da imagem
function updateMapTransform() {
    if(mapImage) {
        mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${mapScale})`;
    }
}

// Zoom com o Scroll do Mouse
if(mapContainer) {
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        const zoomSpeed = 0.1;
        const direction = e.deltaY < 0 ? 1 : -1; 
        
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let newScale = mapScale + (direction * zoomSpeed);
        newScale = Math.min(Math.max(0.1, newScale), 5); // Limites de zoom

        const ratio = 1 - (newScale / mapScale);
        translateX += (mouseX - translateX) * ratio;
        translateY += (mouseY - translateY) * ratio;

        mapScale = newScale;
        updateMapTransform();
    });

    // Mover a imagem com o Clique (Pan)
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
}

// =========================================================
// INICIALIZAÇÃO DA PÁGINA
// =========================================================
renderCharacters();
resetBuilder();