const runas = [
    { nombre: "Fehu", simbolo: "", significado: "Riqueza, prosperidad, nuevos comienzos materiales" },
    { nombre: "Uruz", simbolo: "", significado: "Fuerza, resistencia, potencial salvaje, salud" },
    { nombre: "Thurisaz", simbolo: "", significado: "Protección, conflicto, desafío, fuerza defensiva" },
    { nombre: "Ansuz", simbolo: "", significado: "Comunicación, sabiduría, mensajes divinos, palabra" },
    { nombre: "Raidho", simbolo: "", significado: "Viaje físico o espiritual, movimiento, ritmo" },
    { nombre: "Kenaz", simbolo: "", significado: "Antorcha, transformación, creatividad, luz interior" },
    { nombre: "Gebo", simbolo: "", significado: "Regalo, intercambio, sociedad, generosidad, equilibrio" },
    { nombre: "Wunjo", simbolo: "", significado: "Alegría, armonía, éxito, alineación, plenitud emocional" },
    { nombre: "Hagalaz", simbolo: "", significado: "Disrupción, crisis, poder de la naturaleza, cambio involuntario" },
    { nombre: "Nauthiz", simbolo: "", significado: "Necesidad, limitación, angustia, superación con paciencia" },
    { nombre: "Isa", simbolo: "", significado: "Hielo, quietud, estancamiento, tiempo de reflexión" },
    { nombre: "Jera", simbolo: "", significado: "Cosecha, ciclo, recompensa por trabajo, paciencia" },
    { nombre: "Eihwaz", simbolo: "", significado: "Transición, transformación, muerte/renacimiento, resistencia" },
    { nombre: "Perthro", simbolo: "", significado: "Misterio, destino, azar, conocimiento oculto" },
    { nombre: "Algiz", simbolo: "", significado: "Protección, conexión espiritual, alerta, guía superior" },
    { nombre: "Sowilo", simbolo: "", significado: "Sol, éxito, totalidad, fuerza vital, victoria" },
    { nombre: "Teiwaz", simbolo: "", significado: "Sacrificio, honor, coraje, voluntad, justicia" },
    { nombre: "Berkano", simbolo: "", significado: "Abedul, nacimiento, fertilidad, nuevos comienzos, crianza" },
    { nombre: "Ehwaz", simbolo: "", significado: "Caballo, movimiento, trabajo en equipo, progreso" },
    { nombre: "Mannaz", simbolo: "", significado: "Humanidad, el ser, orden social, potencial personal" },
    { nombre: "Laguz", simbolo: "", significado: "Agua, intuición, flujo, emociones, el inconsciente" },
    { nombre: "Ingwaz", simbolo: "", significado: "Semilla, gestación, crecimiento interno, ciclo completado" },
    { nombre: "Dagaz", simbolo: "", significado: "Día, amanecer, avance, transformación, iluminación" },
    { nombre: "Othala", simbolo: "", significado: "Herencia, ascendencia, hogar, propiedad duradera" }
];

const runasSimetricas = ["Gebo", "Isa", "Jera", "Eihwaz", "Algiz", "Sowilo", "Ingwaz", "Dagaz"];

const diario = [];

document.getElementById("sacar-runas").addEventListener("click", () => {
    const runa = runas[Math.floor(Math.random() * runas.length)];
    const modal = document.createElement("div");
    modal.innerHTML = `
        <h2>${runa.nombre}</h2>
        <p>Simbolo: ${runa.simbolo}</p>
        <p>Significado: ${runa.significado}</p>
    `;
    document.body.appendChild(modal);
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.padding = "20px";
    modal.style.border = "1px solid #ddd";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    modal.style.zIndex = "1";
    const cerrar = document.createElement("button");
    cerrar.textContent = "Cerrar";
    cerrar.style.position = "absolute";
    cerrar.style.top = "10px";
    cerrar.style.right = "10px";
    cerrar.addEventListener("click", () => {
        modal.remove();
    });
    modal.appendChild(cerrar);
});

document.getElementById("realizar-tirada").addEventListener("click", () => {
    const tirada = document.getElementById("tirada").value;
    const runasTiradas = [];
    for (let i = 0; i < tirada; i++) {
        const runa = runas[Math.floor(Math.random() * runas.length)];
        if (!runasSimetricas.includes(runa.nombre)) {
            if (Math.random() < 0.3) {
                runa.simbolo = ` (${runa.simbolo})`;
            }
        }
        runasTiradas.push(runa);
    }
    const resultado = document.createElement("div");
    resultado.innerHTML = `
        <h2>Tirada de ${tirada} runas</h2>
        <ul>
            ${runasTiradas.map((runa) => `<li>${runa.nombre} - ${runa.significado}</li>`).join("")}
        </ul>
    `;
    document.body.appendChild(resultado);
    resultado.style.position = "fixed";
    resultado.style.top = "50%";
    resultado.style.left = "50%";
    resultado.style.transform = "translate(-50%, -50%)";
    resultado.style.background = "#fff";
    resultado.style.padding = "20px";
    resultado.style.border = "1px solid #ddd";
    resultado.style.borderRadius = "10px";
    resultado.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    resultado.style.zIndex = "1";
    const cerrar = document.createElement("button");
    cerrar.textContent = "Cerrar";
    cerrar.style.position = "absolute";
    cerrar.style.top = "10px";
    cerrar.style.right = "10px";
    cerrar.addEventListener("click", () => {
        resultado.remove();
    });
    resultado.appendChild(cerrar);
});

document.getElementById("runas-grid").addEventListener("click", (e) => {
    if (e.target.classList.contains("runa")) {
        const runa = runas.find((runa) => runa.nombre === e.target.textContent);
        const modal = document.createElement("div");
        modal.innerHTML = `
            <h2>${runa.nombre}</h2>
            <p>Simbolo: ${runa.simbolo}</p>
            <p>Significado: ${runa.significado}</p>
        `;
        document.body.appendChild(modal);
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.background = "#fff";
        modal.style.padding = "20px";
        modal.style.border = "1px solid #ddd";
        modal.style.borderRadius = "10px";
        modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
        modal.style.zIndex = "1";
        const cerrar = document.createElement("button");
        cerrar.textContent = "Cerrar";
        cerrar.style.position = "absolute";
        cerrar.style.top = "10px";
        cerrar.style.right = "10px";
        cerrar.addEventListener("click", () => {
            modal.remove();
        });
        modal.appendChild(cerrar);
    }
});

for (const runa of runas) {
    const runaElement = document.createElement("div");
    runaElement.classList.add("runa");
    runaElement.textContent = runa.nombre;
    document.getElementById("runas-grid").appendChild(runaElement);
}
// Agregar estilos a las runas
const runasGrid = document.getElementById("runas-grid");
runasGrid.style.display = "grid";
runasGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
runasGrid.style.gap = "10px";
runasGrid.style.padding = "20px";

// Agregar evento de hover a las runas
document.querySelectorAll(".runa").forEach((runa) => {
    runa.addEventListener("mouseover", () => {
        runa.style.background = "#f0f0f0";
        runa.style.borderRadius = "10px";
        runa.style.padding = "10px";
    });
    runa.addEventListener("mouseout", () => {
        runa.style.background = "";
        runa.style.borderRadius = "";
        runa.style.padding = "";
    });
});

// Agregar función para ordenar runas alfabéticamente
function ordenarRunas() {
    const runasGrid = document.getElementById("runas-grid");
    const runas = Array.from(runasGrid.children);
    runas.sort((a, b) => a.textContent.localeCompare(b.textContent));
    runasGrid.innerHTML = "";
    runas.forEach((runa) => runasGrid.appendChild(runa));
}

// Agregar botón para ordenar runas
const ordenarButton = document.createElement("button");
ordenarButton.textContent = "Ordenar alfabéticamente";
ordenarButton.style.position = "absolute";
ordenarButton.style.top = "10px";
ordenarButton.style.right = "10px";
ordenarButton.addEventListener("click", ordenarRunas);
document.body.appendChild(ordenarButton);