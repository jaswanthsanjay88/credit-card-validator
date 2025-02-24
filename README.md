# 💳 Advanced Credit Card Validator Pro

A state-of-the-art credit card validation system with real-time detection and enterprise-grade security features.

![Security](https://img.shields.io/badge/security-enterprise-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

## 📚 Table of Contents
- [Advanced Features](#-advanced-features)
- [Security Implementation](#-security-implementation)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Production Usage](#-production-usage)
- [Contributing](#-contributing)
- [Future Roadmap](#-future-roadmap)
- [Author & Maintainer](#-author--maintainer)
- [License](#-license)
- [How the Validator Works](#-how-the-validator-works)

## 🌟 Advanced Features

### Security
- Rate limiting with cooldown periods
- Input sanitization and validation
- Protection against test card numbers
- XSS attack prevention
- Regex pattern security
- Maximum attempt restrictions

### Validation
- Luhn Algorithm implementation
- Real-time card type detection
- Length validation per card type
- Advanced error handling
- Secure input formatting

### UI/UX
- Modern glassmorphism design
- Interactive 3D animations
- Real-time feedback
- Responsive layout
- Cross-browser support
- Dark mode support

## 🔒 Security Implementation

```javascript
const SECURITY_CONFIG = {
    maxAttempts: 3,
    cooldownTime: 30000, // 30 seconds
    maxInputLength: 19,
    allowedCharacters: /^[0-9\s]*$/
};
```

## 🚀 Quick Start

```bash
git clone https://github.com/jaswanthsanjay88/credit-card-validator.git
cd credit-card-validator
# Open index.html in your browser
```

## 📚 Documentation

### Supported Card Types
- Visa: `4xxx xxxx xxxx xxxx`
- MasterCard: `5[1-5]xx xxxx xxxx xxxx`
- American Express: `3[47]x xxxx xxxx xxx`
- Discover: `6011 xxxx xxxx xxxx`
- Diners Club: `3[068]xx xxxx xxxx`
- JCB: `35xx xxxx xxxx xxxx`
- Maestro: `5018|5020|5038|6304|6759|6761|6763`

### Security Measures
1. Rate Limiting
2. Input Validation
3. Length Checks
4. Character Restrictions
5. Test Number Detection
6. XSS Prevention

## 🛡️ Production Usage

For production deployment, ensure:
1. HTTPS implementation
2. Regular security updates
3. Monitoring system
4. Error logging
5. Performance tracking

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📈 Future Roadmap

- [ ] API Integration
- [ ] Blockchain Validation
- [ ] Machine Learning Detection
- [ ] Multi-language Support
- [ ] PWA Implementation

## 👨‍💻 Author & Maintainer

**JASWANTHSANJAY NEKKKANTI**
- 🌐 [Portfolio](https://jaswanthsanjay.free.nf)
- 💼 [LinkedIn](https://linkedin.com/in/jaswanthsanjay-nekkanti-3a84a5316/)
- 🐙 [GitHub](https://github.com/jaswanthsanjay88)

## 📄 License

MIT License - Copyright (c) 2024 JASWANTHSANJAY NEKKKANTI

[Full License](LICENSE)

## 🧮 How the Validator Works

### The Luhn Algorithm Explained
The credit card validation uses the Luhn algorithm (also known as "modulus 10"):

1. Starting from rightmost digit, double every second digit
2. If doubling results in a two-digit number, add those digits together
3. Add all digits (both doubled and undoubled) together
4. If total is divisible by 10, the number is valid

Example:
```
Card: 4532 7153 3790 1241

Step 1: Double every second digit from right
1   2   9   3   5   7   3   4
↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
1  (4)  9  (6)  5  (14) 3  (8)

Step 2: Sum digits of doubled numbers
4, 6, 14(1+4=5), 8

Step 3: Add all numbers
1 + 4 + 9 + 6 + 5 + 5 + 3 + 8 = 41

Step 4: Check if sum is divisible by 10
41 % 10 = 1 (Invalid card number)
```

### Java Implementation
```java
public class CreditCardValidator {
    public static boolean isValid(String cardNumber) {
        // Remove spaces and non-digits
        String number = cardNumber.replaceAll("\\D", "");
        
        int sum = 0;
        boolean alternate = false;
        
        // Loop from right to left
        for (int i = number.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(number.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return (sum % 10 == 0);
    }
    
    // Example card type detection
    public static String getCardType(String number) {
        if (number.matches("^4[0-9]{12}(?:[0-9]{3})?$")) return "Visa";
        if (number.matches("^5[1-5][0-9]{14}$")) return "MasterCard";
        if (number.matches("^3[47][0-9]{13}$")) return "American Express";
        return "Unknown";
    }
    
    public static void main(String[] args) {
        String cardNumber = "4532715337901241";
        boolean isValid = isValid(cardNumber);
        String type = getCardType(cardNumber);
        
        System.out.println("Card Type: " + type);
        System.out.println("Is Valid: " + isValid);
    }
}
```

### Security Features
- Rate limiting: Maximum 3 attempts per 30 seconds
- Input sanitization: Removes non-numeric characters
- Length validation: 13-19 digits depending on card type
- Test number detection: Blocks known test numbers
- XSS prevention: Sanitizes all user input

---
⭐ Star this repository if you find it helpful!
