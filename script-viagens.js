const distanceMatrix = {
    "Amnwater": { "Crimmor": 98, "Keczulla": 93, "Minsor Vale": 72 },
    "Amphail": { "Rassalantar": 28, "Red Larch": 83 },
    "Aris": { "Hluthvar": 152 },
    "Asbravn": { "Hluthvar": 93, "Iriaebor": 55 },
    "Ascore": { "Auvandell": 252, "Citadel Adbar": 117, "Citadel Felbarr": 265, "Deadsnows": 143, "Newfort": 189, "Sundabar": 230 },
    "Athkatla": { "Crimmor": 73 },
    "Auvandell": { "Ascore": 252, "Citadel Adbar": 218, "Citadel Felbarr": 96, "Deadsnows": 143, "Newfort": 81, "Hawk's Nest": 47, "Sundabar": 46 },
    "Baldur's Gate": { "Boareskyr Bridge": 301, "Elturel": 267, "Friendly Arm Inn": 77, "Soubar": 287, "Way Inn": 376 },
    "Bargewright Inn": { "Red Larch": 66, "Womford": 14 },
    "Beliard": { "Calling Horns": 156, "Westbridge": 71, "Womford": 98 },
    "Berdusk": { "Elturel": 196, "Fendarl's Gate": 108, "Greenest": 192, "Scornubel": 105 },
    "Beregost": { "Candlekeep": 55, "Nashkel": 147, "Friendly Arm Inn": 91 },
    "Boareskyr Bridge": { "Baldur's Gate": 302, "Elturel": 187, "Soubar": 40, "Way Inn": 315 },
    "Brost": { "Gambiton": 110, "Trademeet": 125, "Trailstone": 158 },
    "Bryn Shander": { "Hundelstone": 54 },
    "Calling Horns": { "Beliard": 156, "Everlund": 144, "Noanar's Hold": 46, "Olostin's Hold": 110, "Yartar": 95 },
    "Candlekeep": { "Friendly Arm Inn": 103, "Beregost": 55 },
    "Citadel Adbar": { "Ascore": 117, "Auvandell": 218, "Citadel Felbarr": 232, "Deadsnows": 109, "Newfort": 155, "Sundabar": 197 },
    "Citadel Felbarr": { "Ascore": 265, "Auvandell": 96, "Citadel Adbar": 232, "Deadsnows": 157, "Newfort": 95, "Sundabar": 75 },
    "Corm Orp": { "Hill's Edge": 41, "Hluthvar": 62 },
    "Crimmor": { "Amnwater": 98, "Athkatla": 73, "Minsor Vale": 41, "Nashkel": 69, "Purskul": 13 },
    "Daggerford": { "Way Inn": 80, "Waterdeep": 113 },
    "Deadsnows": { "Ascore": 143, "Auvandell": 143, "Citadel Adbar": 109, "Citadel Felbarr": 157, "Newfort": 82, "Sundabar": 121 },
    "Easting": { "Iriaebor": 52 },
    "Elturel": { "Baldur's Gate": 267, "Berdusk": 196, "Boareskyr Bridge": 186, "Fendarl's Gate": 276, "Greenest": 359, "Scornubel": 121, "Soubar": 171, "Triel": 71, "Way Inn": 681 },
    "Esford": { "Gambiton": 58, "Imnescar": 104 },
    "Eshpurta": { "Iriaebor": 210, "Keczulla": 114, "Trollford": 38 },
    "Esmeltaran": { "Gambiton": 35, "Keczulla": 69 },
    "Everlund": { "Calling Horns": 144, "Jalanthar": 89, "Noanar's Hold": 147, "Olostin's Hold": 54, "Silverymoon": 44 },
    "Fendarl's Gate": { "Berdusk": 108, "Elturel": 276, "Iriaebor": 33, "Greenest": 255, "Scornubel": 185 },
    "Fireshear": { "Hundelstone": 55, "Ironmaster": 74, "Luskan": 160 },
    "Friendly Arm Inn": { "Baldur's Gate": 77, "Beregost": 91, "Candlekeep": 103 },
    "Gambiton": { "Brost": 110, "Esford": 58, "Esmeltaran": 35, "Imnescar": 137 },
    "Goldenfields": { "Waterdeep": 82 },
    "Greenest": { "Berdusk": 192, "Elturel": 359, "Fendarl's Gate": 255, "Nashkel": 203, "Scornubel": 268 },
    "Hardbuckler": { "Hill's Edge": 70, "Triel": 100 },
    "Hawk's Nest": { "Auvandell": 47, "Khelb": 38 },
    "Hill's Edge": { "Corm Orp": 41, "Hardbuckler": 70 },
    "Hillfort Keshla": { "Riatavin": 170, "Toralth": 168, "Trailstone": 126, "Trollford": 64 },
    "Hluthvar": { "Aris": 152, "Asbravn": 93, "Corm Orp": 62, "Scornubel": 121 },
    "Hundelstone": { "Bryn Shander": 54, "Fireshear": 55, "Ironmaster": 72, "Luskan": 140 },
    "Imnescar": { "Esford": 104, "Gambiton": 137, "Purskul": 68, "Trademeet": 69 },
    "Iriaebor": { "Asbravn": 55, "Easting": 52, "Eshpurta": 210, "Fendarl's Gate": 33 },
    "Ironmaster": { "Fireshear": 74, "Hundelstone": 72, "Luskan": 179 },
    "Jalanthar": { "Everlund": 89 },
    "Julkoun": { "Secomber": 59 },
    "Keczulla": { "Amnwater": 93, "Eshpurta": 114, "Esmeltaran": 69 },
    "Khelb": { "Hawk's Nest": 38, "Silverymoon": 22 },
    "Kheldell": { "Red Larch": 52 },
    "Leilon": { "Neverwinter": 134, "Phandalin": 103, "Thornhold": 114, "Triboar": 223 },
    "Longsaddle": { "Triboar": 96, "Xantharls Keep": 97 },
    "Loudwater": { "Parnast": 246, "Secomber": 155 },
    "Luskan": { "Fireshear": 160, "Hundelstone": 140, "Ironmaster": 179, "Mirabar": 150, "Neverwinter": 133 },
    "Minsor Vale": { "Amnwater": 72, "Crimmor": 41 },
    "Mirabar": { "Luskan": 150, "Xantharls Keep": 70 },
    "Mornbryn's Shield": { "Yartar": 90 },
    "Mosstone": { "Trademeet": 131 },
    "Murann": { "Trademeet": 85 },
    "Nashkel": { "Beregost": 147, "Crimmor": 69, "Greenest": 203 },
    "Neverwinter": { "Leilon": 134, "Luskan": 133, "Phandalin": 146, "Triboar": 265 },
    "Newfort": { "Ascore": 189, "Auvandell": 81, "Citadel Adbar": 155, "Citadel Felbarr": 95, "Deadsnows": 82, "Sundabar": 60 },
    "Noanar's Hold": { "Calling Horns": 46, "Everlund": 147, "Olostin's Hold": 112 },
    "Olostin's Hold": { "Calling Horns": 110, "Everlund": 54, "Noanar's Hold": 112 },
    "Parnast": { "Loudwater": 246 },
    "Phandalin": { "Leilon": 103, "Neverwinter": 146, "Triboar": 173 },
    "Purskul": { "Crimmor": 13, "Imnescar": 68 },
    "Rassalantar": { "Amphail": 28, "Thornhold": 155, "Waterdeep": 42 },
    "Red Larch": { "Amphail": 83, "Bargewright Inn": 66, "Kheldell": 52, "Westbridge": 71 },
    "Riatavin": { "Hillfort Keshla": 170, "Toralth": 153, "Trailstone": 109 },
    "Scornubel": { "Berdusk": 105, "Elturel": 121, "Fendarl's Gate": 185, "Greenest": 269, "Hluthvar": 121, "Triel": 59 },
    "Secomber": { "Julkoun": 59, "Loudwater": 155, "Uluvin": 66 },
    "Silverymoon": { "Everlund": 44, "Khelb": 22 },
    "Soubar": { "Baldur's Gate": 287, "Boareskyr Bridge": 39, "Elturel": 186, "Triel": 59 },
    "Sundabar": { "Ascore": 230, "Auvandell": 46, "Citadel Adbar": 197, "Citadel Felbarr": 75, "Deadsnows": 121, "Newfort": 60 },
    "Thornhold": { "Leilon": 114, "Rassalantar": 155, "Waterdeep": 145 },
    "Toralth": { "Hillfort Keshla": 168, "Riatavin": 153, "Trailstone": 59 },
    "Trademeet": { "Brost": 125, "Imnescar": 69, "Mosstone": 131, "Murann": 85 },
    "Trailstone": { "Brost": 158, "Hillfort Keshla": 126, "Toralth": 59, "Riatavin": 109 },
    "Triboar": { "Leilon": 223, "Longsaddle": 96, "Neverwinter": 265, "Phandalin": 173, "Westbridge": 67, "Yartar": 59 },
    "Triel": { "Elturel": 71, "Hardbuckler": 100, "Scornubel": 59, "Soubar": 138 },
    "Trollford": { "Eshpurta": 38, "Hillfort Keshla": 64 },
    "Uluvin": { "Secomber": 66, "Womford": 133 },
    "Waterdeep": { "Daggerford": 113, "Goldenfields": 82, "Rassalantar": 42, "Thornhold": 145 },
    "Way Inn": { "Baldur's Gate": 376, "Boareskyr Bridge": 314, "Daggerford": 80 },
    "Westbridge": { "Beliard": 71, "Red Larch": 71, "Triboar": 67 },
    "Womford": { "Beliard": 98, "Bargewright Inn": 14, "Uluvin": 133 },
    "Xantharls Keep": { "Longsaddle": 97, "Mirabar": 70 },
    "Yartar": { "Calling Horns": 95, "Mornbryn's Shield": 90, "Triboar": 59 }
};

const container = document.getElementById('steps-container');
const summaryBox = document.getElementById('summary-box');
let routePath = []; // Armazena as cidades selecionadas na ordem

// Função principal que gera um novo <select>
function renderStep(stepIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = 'step-wrapper';
    wrapper.dataset.index = stepIndex;

    // Se não for o primeiro passo, adiciona uma seta apontando para baixo
    if (stepIndex > 0) {
        const arrow = document.createElement('div');
        arrow.className = 'step-arrow';
        arrow.innerHTML = '&#8595;'; // Seta para baixo
        wrapper.appendChild(arrow);
    }

    const select = document.createElement('select');
    
    // Opção padrão vazia
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = stepIndex === 0 ? "Escolha a Cidade de Origem..." : `Próxima parada...`;
    select.appendChild(defaultOption);

    let availableCities = [];

    if (stepIndex === 0) {
        // No primeiro passo, mostra TODAS as cidades disponíveis
        availableCities = Object.keys(distanceMatrix).sort();
    } else {
        // Nos próximos passos, mostra apenas os destinos conectados à cidade anterior
        const originCity = routePath[stepIndex - 1];
        
        // Descobre a cidade de onde viemos antes dessa (para não voltar)
        const cityToExclude = stepIndex >= 2 ? routePath[stepIndex - 2] : null;

        // Filtra as conexões disponíveis, removendo a cidade que acabamos de visitar
        availableCities = Object.keys(distanceMatrix[originCity])
            .filter(city => city !== cityToExclude)
            .sort();
    }

    // Se não houver cidades disponíveis (beco sem saída), não gera o select
    if (stepIndex > 0 && availableCities.length === 0) {
        const deadEnd = document.createElement('p');
        deadEnd.style.color = "#8b0000";
        deadEnd.style.fontStyle = "italic";
        deadEnd.textContent = "Fim da estrada (Sem outras conexões).";
        wrapper.appendChild(deadEnd);
        container.appendChild(wrapper);
        return;
    }

    // Adiciona as cidades filtradas ao select
    availableCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => handleSelection(stepIndex, e.target.value));

    wrapper.appendChild(select);
    container.appendChild(wrapper);
}

// Lida com a escolha do usuário
function handleSelection(stepIndex, selectedCity) {
    // 1. Corta o array da rota se o usuário alterar um passo anterior
    routePath = routePath.slice(0, stepIndex);

    // 2. Remove visualmente todos os selects que vieram depois deste passo
    const wrappers = container.querySelectorAll('.step-wrapper');
    wrappers.forEach(wrapper => {
        if (parseInt(wrapper.dataset.index) > stepIndex) {
            wrapper.remove();
        }
    });

    // 3. Se uma cidade válida foi selecionada, adiciona à rota e gera o próximo passo
    if (selectedCity !== "") {
        routePath[stepIndex] = selectedCity;
        renderStep(stepIndex + 1);
    }

    // 4. Atualiza o quadro de resumo
    updateSummary();
}

// Atualiza o quadro de cálculos finais
function updateSummary() {
    if (routePath.length < 2) {
        summaryBox.classList.add('hidden');
        return;
    }

    let totalMiles = 0;
    
    // Soma as distâncias entre cada nó do array
    for (let i = 0; i < routePath.length - 1; i++) {
        const from = routePath[i];
        const to = routePath[i + 1];
        totalMiles += distanceMatrix[from][to];
    }

    // Ritmo de viagem do D&D 5e: 24 milhas por dia
    const totalDays = Math.ceil(totalMiles / 24);

    summaryBox.innerHTML = `
        <p><strong>Caminho:</strong> <span class="route-path">${routePath.join(' ➔ ')}</span></p>
        <p><strong>Distância Total:</strong> ${totalMiles} milhas</p>
        <p><strong>Tempo Estimado:</strong> ${totalDays} dia(s) de viagem</p>
    `;
    
    summaryBox.classList.remove('hidden');
}

// Inicializa a aplicação criando o primeiro Select de Origem
renderStep(0);