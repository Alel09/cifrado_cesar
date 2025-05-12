// Diccionario Morse
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

// Creamos el diccionario inverso para desencriptar Morse
const reverseMorseCode = {};
for (let char in morseCode) {
    reverseMorseCode[morseCode[char]] = char;
}

// Elementos DOM - César
const caesarInput = document.getElementById('caesarInput');
const caesarOutput = document.getElementById('caesarOutput');
const shift = document.getElementById('shift');
const caesarMode = document.getElementById('caesarMode');
const charMode = document.getElementById('charMode');
const caesarActionBtn = document.getElementById('caesarActionBtn');
const caesarToggleBtn = document.getElementById('caesarToggleBtn');
const caesarCopyBtn = document.getElementById('caesarCopyBtn');
const caesarClearBtn = document.getElementById('caesarClearBtn');
const caesarSaveBtn = document.getElementById('caesarSaveBtn');

// Elementos DOM - Morse
const morseInput = document.getElementById('morseInput');
const morseOutput = document.getElementById('morseOutput');
const morseActionBtn = document.getElementById('morseActionBtn');
const morseToggleBtn = document.getElementById('morseToggleBtn');
const morseCopyBtn = document.getElementById('morseCopyBtn');
const morseClearBtn = document.getElementById('morseClearBtn');
const morseSaveBtn = document.getElementById('morseSaveBtn');

// Elementos DOM - Comunes
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const themeBtn = document.getElementById('themeBtn');
const notification = document.getElementById('notification');

// Estado inicial
let caesarEncryptMode = true;
let morseEncryptMode = true;

// Tabs funcionality
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        
        // Desactivar todas las pestañas y secciones
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Activar la pestaña y sección seleccionada
        tab.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// Actualizar textos del botón César
function updateCaesarButtons() {
    caesarActionBtn.className = caesarEncryptMode ? 'encrypt' : 'decrypt';
    caesarActionBtn.textContent = caesarEncryptMode ? 'Encriptar' : 'Desencriptar';
    caesarToggleBtn.textContent = caesarEncryptMode ? 'Cambiar a Desencriptar' : 'Cambiar a Encriptar';
}

// Actualizar textos del botón Morse
function updateMorseButtons() {
    morseActionBtn.className = morseEncryptMode ? 'encrypt' : 'decrypt';
    morseActionBtn.textContent = morseEncryptMode ? 'Encriptar a Morse' : 'Desencriptar a Texto';
    morseToggleBtn.textContent = morseEncryptMode ? 'Cambiar a Desencriptar' : 'Cambiar a Encriptar';
}

// FUNCIONES DEL CIFRADO CÉSAR

// Procesar texto con cifrado César
function processCaesarText() {
    const text = caesarInput.value.trim();
    const errorDiv = document.getElementById('caesarInputError');
    
    // Validar entrada
    if (!text) {
        showError(errorDiv, "El campo de texto no puede estar vacío");
        return;
    } else {
        errorDiv.style.display = "none";
    }

    // Validar desplazamiento
    const shiftValue = parseInt(shift.value);
    const shiftErrorDiv = document.getElementById('shiftError');
    
    if (isNaN(shiftValue) || shiftValue < 0 || shiftValue > 25) {
        showError(shiftErrorDiv, "El desplazamiento debe ser un número entre 0 y 25");
        shift.value = "3"; // Valor por defecto
        return;
    } else {
        shiftErrorDiv.style.display = "none";
    }

    const mode = caesarMode.value;
    const charModeValue = charMode.value;
    
    const result = applyCaesarCipher(text, shiftValue, !caesarEncryptMode, mode, charModeValue);
    
    animateOutput(caesarOutput, result);
    addToHistory(`César ${caesarEncryptMode ? 'Cifrado' : 'Descifrado'} (${mode}): ${result}`);
}

// Cifrado César mejorado
function applyCaesarCipher(text, shift, isDecrypt, mode, charModeValue) {
    let finalShift = isDecrypt ? -shift : shift;
    let result = "";
    
    // Aplicar diferentes modos
    if (mode === "reverse") {
        text = text.split('').reverse().join('');
    }
    
    // Procesar cada caracter
    for (let i = 0; i < text.length; i++) {
        result += processSingleChar(text[i], finalShift, charModeValue);
    }
    
    return result;
}

// Procesar un solo caracter para el cifrado César
function processSingleChar(char, shift, charModeValue) {
    if (charModeValue === 'letters' && /[a-zA-Z]/.test(char)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        const code = char.charCodeAt(0);
        // Asegurarse de que el módulo siempre retorne positivo
        const newCode = ((code - base + shift) % 26 + 26) % 26 + base;
        return String.fromCharCode(newCode);
    } else if (charModeValue === 'all') {
        // Cifrar también números y caracteres especiales con ASCII
        if (/[\w\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(char)) {
            const code = char.charCodeAt(0);
            // Cifrar en el rango ASCII visible (32-126)
            const newCode = ((code - 32 + shift) % 95 + 95) % 95 + 32;
            return String.fromCharCode(newCode);
        }
    }
    return char; // Si no aplica ninguna condición, devolver el caracter sin cambios
}

// FUNCIONES DEL CÓDIGO MORSE

// Procesar texto con código Morse
function processMorseText() {
    const text = morseInput.value.trim();
    const errorDiv = document.getElementById('morseInputError');
    
    // Validar entrada
    if (!text) {
        showError(errorDiv, "El campo de texto no puede estar vacío");
        return;
    } else {
        errorDiv.style.display = "none";
    }
    
    let result;
    
    if (morseEncryptMode) {
        // Encriptar texto a Morse
        result = textToMorse(text);
    } else {
        // Desencriptar Morse a texto
        result = morseToText(text);
    }
    
    animateOutput(morseOutput, result);
    addToHistory(`Morse ${morseEncryptMode ? 'Cifrado' : 'Descifrado'}: ${result}`);
}

// Texto a código Morse
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || char;
    }).join(' ');
}

// Código Morse a texto
function morseToText(morse) {
    // Separamos por espacios (cada código Morse está separado por espacio)
    return morse.split(' ').map(code => {
        return reverseMorseCode[code] || code;
    }).join('');
}

// FUNCIONES COMUNES

// Mostrar errores
function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    setTimeout(() => {
        element.style.display = "none";
    }, 3000);
}

// Animación para los outputs
function animateOutput(element, text) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'fadeIn 0.3s ease forwards';
        element.value = text;
    }, 10);
}

// Función de copiado genérica
function copyToClipboard(text, button) {
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                button.classList.add('copied');
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.textContent = originalText;
                }, 1000);
                showNotification("Texto copiado al portapapeles");
            })
            .catch(err => {
                showNotification("Error al copiar: " + err, true);
            });
    }
}

// Función para mostrar notificaciones
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.background = isError ? '#dc3545' : '#28a745';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Añadir al historial
function addToHistory(entry) {
    const li = document.createElement('li');
    li.textContent = `${new Date().toLocaleTimeString()} - ${entry}`;
    
    // Tratar de extraer el resultado después de los dos puntos
    const parts = entry.split(': ');
    let result = "";
    
    if (parts.length > 1) {
        result = parts[1];
    } else {
        result = entry; // Si no hay ":", usar la entrada completa
    }
    
    li.addEventListener('click', () => {
        // Determinar qué pestaña está activa
        const activeSection = document.querySelector('.section.active').id;
        
        if (activeSection === 'caesar') {
            caesarOutput.value = result;
            copyToClipboard(result, caesarCopyBtn);
        } else {
            morseOutput.value = result;
            copyToClipboard(result, morseCopyBtn);
        }
    });
    
    historyList.insertBefore(li, historyList.firstChild);
    
    // Limitar historial a 10 elementos
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Guardar como archivo - Genérico
function saveResult(text) {
    if (!text) return;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Determinar qué tipo de cifrado estamos usando para el nombre del archivo
    const activeSection = document.querySelector('.section.active').id;
    a.download = `${activeSection}_${new Date().toISOString().slice(0,10)}.txt`;
    
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Archivo guardado correctamente");
}

// Alternar tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
}

// EVENT LISTENERS - CÉSAR
caesarActionBtn.addEventListener('click', processCaesarText);

caesarToggleBtn.addEventListener('click', () => {
    caesarEncryptMode = !caesarEncryptMode;
    updateCaesarButtons();
});

caesarCopyBtn.addEventListener('click', () => {
    copyToClipboard(caesarOutput.value, caesarCopyBtn);
});

caesarClearBtn.addEventListener('click', () => {
    caesarInput.value = '';
    caesarOutput.value = '';
    shift.value = '3';
    caesarMode.value = 'normal';
    charMode.value = 'letters';
    caesarEncryptMode = true;
    updateCaesarButtons();
    showNotification("Campos limpiados");
});

caesarSaveBtn.addEventListener('click', () => {
    saveResult(caesarOutput.value);
});

// EVENT LISTENERS - MORSE
morseActionBtn.addEventListener('click', processMorseText);

morseToggleBtn.addEventListener('click', () => {
    morseEncryptMode = !morseEncryptMode;
    updateMorseButtons();
});

morseCopyBtn.addEventListener('click', () => {
    copyToClipboard(morseOutput.value, morseCopyBtn);
});

morseClearBtn.addEventListener('click', () => {
    morseInput.value = '';
    morseOutput.value = '';
    morseEncryptMode = true;
    updateMorseButtons();
    showNotification("Campos limpiados");
});

morseSaveBtn.addEventListener('click', () => {
    saveResult(morseOutput.value);
});

// EVENT LISTENERS - COMUNES
clearHistoryBtn.addEventListener('click', () => {
    historyList.innerHTML = '';
    showNotification("Historial limpiado");
});

themeBtn.addEventListener('click', toggleTheme);

// Inicializar
updateCaesarButtons();
updateMorseButtons();