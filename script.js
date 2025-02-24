// Add security configurations
const SECURITY_CONFIG = {
    maxAttempts: 3,
    cooldownTime: 30000, // 30 seconds
    maxInputLength: 19,
    allowedCharacters: /^[0-9\s]*$/,
};

let validationAttempts = 0;
let lastAttemptTime = 0;

// New helper function to determine card type
function getCardType(number) {
    const patterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^(6011[0-9]{12}|65[0-9]{14}|64[4-9][0-9]{13}|622(?:1[2-9]|[2-8][0-9]|9[01])[0-9]{10})$/,
        diners: /^(36|38)[0-9]{12}$/,
        jcb: /^35[0-9]{14}$/,
        maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/,
        unionpay: /^62[0-9]{14,17}$/,
        mir: /^220[0-4][0-9]{12}$/,
        rupay: /^60[0-9]{14,17}$/  // added RuPay card pattern for Indian cards
    };
    for (let type in patterns) {
        if (patterns[type].test(number)) {
            return type;
        }
    }
    return 'unknown';
}

// New unified popup to show validation result and card type info
function showUnifiedPopup(isValid, cardNumber) {
    const cardType = getCardType(cardNumber);
    const cardEmojis = {
        visa: '💳 Visa',
        mastercard: '💳 MasterCard',
        amex: '💳 American Express',
        discover: '💳 Discover',
        diners: '💳 Diners Club',
        jcb: '💳 JCB',
        maestro: '💳 Maestro',
        unionpay: '💳 UnionPay',
        mir: '💳 MIR',
        rupay: '💳 RuPay',   // added RuPay label
        unknown: '💳 Card'
    };

    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';

    // Create unified popup element
    const popup = document.createElement('div');
    popup.className = `popup ${isValid ? 'valid' : 'invalid'}`;
    popup.innerHTML = `
        <div class="popup-icon">${isValid ? '✅' : '❌'}</div>
        <div class="popup-message">
            <strong>${isValid ? 'Valid Card' : 'Invalid Card'}</strong><br>
            ${isValid ? 'Card verification successful' : 'Please check the number and try again'}<br>
            Detected Card Type: <strong>${cardEmojis[cardType]}</strong>
        </div>
        <button class="popup-close">Close</button>
    `;

    // Append popup to container and then to body
    popupContainer.appendChild(popup);
    document.body.appendChild(popupContainer);

    // Force reflow then show popup
    popup.offsetHeight;
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    // Close button functionality
    popup.querySelector('.popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popupContainer.remove(), 300);
    });

    // Auto remove after 4 seconds if not closed manually
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popupContainer.remove(), 300);
    }, 4000);
}

// Changed submit event to use the unified popup
document.getElementById('creditCardForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Submit event fired'); // Debug log

    if (Date.now() - lastAttemptTime < SECURITY_CONFIG.cooldownTime && validationAttempts >= SECURITY_CONFIG.maxAttempts) {
        showSecurityAlert('Too many attempts. Please wait before trying again.');
        return;
    }

    const cardInput = document.getElementById('cardNumber');
    const cardNumber = cardInput.value;

    if (!validateInput(cardNumber)) {
        showSecurityAlert('Invalid input detected. Please enter only numbers.');
        return;
    }

    const sanitizedNumber = sanitizeInput(cardNumber);
    const button = document.querySelector('button');
    button.classList.add('active');

    validationAttempts++;
    lastAttemptTime = Date.now();

    setTimeout(() => {
        const isValid = validateCard(sanitizedNumber);
        showUnifiedPopup(isValid, sanitizedNumber);
        button.classList.remove('active');
    }, 500);
});

// Format card number input with spaces
document.getElementById('cardNumber').addEventListener('input', function(e) {
    // Prevent paste if it contains non-numeric characters
    if (e.inputType === 'insertFromPaste') {
        const pastedValue = e.target.value;
        if (!SECURITY_CONFIG.allowedCharacters.test(pastedValue)) {
            e.target.value = e.target.value.replace(/[^0-9\s]/g, '');
            showSecurityAlert('Invalid characters removed from input.');
        }
    }

    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/[^0-9]/g, '');
    
    // Format with spaces
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue;
    
    // Validate length based on card type remains if needed:
    const maxLengths = {
        visa: 16,
        mastercard: 16,
        amex: 15,
        discover: 16,
        diners: 14,
        jcb: 16,
        maestro: 19
    };
    // (Optional: you can remove inline length adjustment as well)
    // if (detectedType !== 'unknown' && value.length > maxLengths[detectedType]) {
    //     e.target.value = e.target.value.slice(0, -1);
    // }
});

function validateCard(number) {
    // Security checks
    if (!number || 
        !SECURITY_CONFIG.allowedCharacters.test(number) ||
        number.length < 13 ||
        number.length > 19) {
        return false;
    }

    // Check for common test numbers
    const testNumbers = ['4111111111111111', '4242424242424242'];
    if (testNumbers.includes(number)) {
        showSecurityAlert('Test card numbers are not allowed.');
        return false;
    }

    // Luhn Algorithm
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the right
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

// Add input security validation
function validateInput(input) {
    if (!input) return false;
    if (input.length > SECURITY_CONFIG.maxInputLength) return false;
    if (!SECURITY_CONFIG.allowedCharacters.test(input)) return false;
    return true;
}

// Add input sanitization
function sanitizeInput(input) {
    return input
        .replace(/\s/g, '')
        .replace(/[^0-9]/g, '')
        .slice(0, 16);
}

// Add security alert
function showSecurityAlert(message) {
    const popup = document.createElement('div');
    popup.className = 'popup security-alert';
    popup.innerHTML = `
        <div class="popup-icon">⚠️</div>
        <div class="popup-message">
            Security Alert
            <br>
            <span style="font-size: 14px; opacity: 0.8;">${message}</span>
        </div>
        <div class="popup-close">×</div>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}

// Add touch event handling
document.addEventListener('DOMContentLoaded', function() {
    // Detect if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add vibration feedback on validation (if supported)
        const vibrateOnAction = () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        };

        // Add vibration to button clicks
        document.querySelector('button').addEventListener('touchstart', vibrateOnAction);
        
        // Add haptic feedback on validation
        const originalShowUnifiedPopup = showUnifiedPopup;
        showUnifiedPopup = function(isValid, cardNumber) {
            vibrateOnAction();
            originalShowUnifiedPopup(isValid, cardNumber);
        };

        // Add autocomplete attributes for mobile keyboards
        const cardInput = document.getElementById('cardNumber');
        cardInput.setAttribute('autocomplete', 'cc-number');
        cardInput.setAttribute('inputmode', 'numeric');
        cardInput.setAttribute('pattern', '[0-9]*');
    }
});
