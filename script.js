// Elementos del DOM
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const shiftInput = document.getElementById('shift');
const modeSelect = document.getElementById('mode');
const charModeSelect = document.getElementById('charMode');
const historyList = document.getElementById('historyList');
const actionBtn = document.getElementById('actionBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const themeBtn = document.getElementById('themeBtn');

// Estado inicial
let isEncryptMode = true;

// Botones
actionBtn.addEventListener('click', processText);
toggleModeBtn.addEventListener('click', toggleMode);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('clearBtn').addEventListener('click', clearFields);
document.getElementById('saveBtn').addEventListener('click', saveResult);
themeBtn.addEventListener('click', toggleTheme);

// Actualizar clases del botón de acción
function updateActionButton() {
    actionBtn.className = isEncryptMode ? 'encrypt' : 'decrypt';
    actionBtn.textContent = isEncryptMode ? 'Encriptar' : 'Desencriptar';
    toggleModeBtn.textContent = isEncryptMode ? 'Cambiar a Desencriptar' : 'Cambiar a Encriptar';
}

// Función principal de cifrado/descifrado
function processText() {
    console.log("Botón clicado, procesando texto...");
    const text = inputText.value.trim();
    if (!text) {
        console.log("Texto vacío, no se procesa.");
        return;
    }

    const shift = Math.min(Math.max(parseInt(shiftInput.value) || 3, 1), 25);
    const mode = modeSelect.value;
    const charMode = charModeSelect.value;
    console.log("Texto:", text);
    console.log("Desplazamiento:", shift);
    console.log("Modo:", mode);
    console.log("CharMode:", charMode);
    console.log("Es encriptar:", isEncryptMode);

    const result = applyCaesarCipher(text, shift, !isEncryptMode, mode, charMode);
    console.log("Resultado:", result);
    
    outputText.style.animation = 'none'; // Resetear animación
    setTimeout(() => outputText.style.animation = 'fadeIn 0.3s ease forwards', 10);
    outputText.value = result;
    addToHistory(`${isEncryptMode ? 'Cifrado' : 'Descifrado'} (${mode}): ${result}`);
}

// Cambiar modo
function toggleMode() {
    isEncryptMode = !isEncryptMode;
    updateActionButton();
}

// Lógica del cifrado César
function applyCaesarCipher(text, shift, isDecrypt, mode, charMode) {
    let finalShift = isDecrypt ? -shift : shift;
    console.log("Shift final:", finalShift);

    return text.split('').map(char => {
        if (charMode === 'letters' && /[a-zA-Z]/.test(char)) {
            const base = char === char.toUpperCase() ? 65 : 97;
            const code = char.charCodeAt(0);
            const newCode = (code - base + finalShift + 26) % 26 + base;
            console.log(`${char} -> ${String.fromCharCode(newCode)}`);
            return String.fromCharCode(newCode);
        }
        return char; // Si no es letra o charMode no es 'letters', no cambia
    }).join('');
}

// Copiar al portapapeles
function copyToClipboard() {
    const text = outputText.value;
    if (text) {
        navigator.clipboard.writeText(text);
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.classList.add('copied');
        copyBtn.textContent = '¡Copiado!';
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.textContent = 'Copiar';
        }, 1000);
    }
}

// Limpiar campos
function clearFields() {
    inputText.value = '';
    outputText.value = '';
    shiftInput.value = '3';
    modeSelect.value = 'normal';
    charModeSelect.value = 'letters';
    isEncryptMode = true;
    updateActionButton();
}

// Guardar como archivo
function saveResult() {
    const text = outputText.value;
    if (!text) return;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultado_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Añadir al historial
function addToHistory(entry) {
    const li = document.createElement('li');
    li.textContent = `${new Date().toLocaleTimeString()} - ${entry}`;
    li.addEventListener('click', () => {
        outputText.value = entry.split(': ')[1];
        navigator.clipboard.writeText(entry.split(': ')[1]);
        alert('Texto copiado al portapapeles y cargado en el resultado');
    });
    historyList.insertBefore(li, historyList.firstChild);
    
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Alternar tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
}

// Inicializar
updateActionButton();