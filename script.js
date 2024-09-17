document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.querySelector('.pwSection > div > input');
    const strengthIndicator = document.querySelector('.pwStrength > h1');
    const strengthDiv = document.querySelector('.pwStrength');
    const copyButton = document.querySelector('.copyButton');
    const generateButton = document.querySelector('.generateButton');
    const lengthSlider = document.querySelector('input[type="range"]');
    const lengthDisplay = document.querySelector('.lengthSection > div > h2');

    let passwordLength = parseInt(lengthSlider.value, 10);
    let passwordOptions = {
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: true
    };

    function generatePassword() {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        let characters = '';

        if (passwordOptions.uppercase) characters += uppercaseChars;
        if (passwordOptions.lowercase) characters += lowercaseChars;
        if (passwordOptions.numbers) characters += numberChars;
        if (passwordOptions.symbols) characters += symbolChars;

        if (characters.length === 0) return ''; // No characters selected

        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }

        return password;
    }

    function updatePassword() {
        const password = generatePassword();
        passwordInput.value = password;
        updateStrengthIndicator(password);
    }

    function updateStrengthIndicator(password) {
        const length = password.length;
        if (length === 0) {
            strengthIndicator.textContent = 'weak';
            strengthDiv.style.backgroundColor = 'red';
        } else if (length < 6) {
            strengthIndicator.textContent = 'weak';
            strengthDiv.style.backgroundColor = 'red';
        } else if (length < 12) {
            strengthIndicator.textContent = 'medium';
            strengthDiv.style.backgroundColor = 'orange';
        } else {
            strengthIndicator.textContent = 'strong';
            strengthDiv.style.backgroundColor = 'green';
        }
    }

    function copyPassword() {
        navigator.clipboard.writeText(passwordInput.value).then(() => {
            alert('Password copied to clipboard!');
        });
    }

    function onRangeChange(rangeElement, callback) {
        let oldValue = rangeElement.value;

        rangeElement.addEventListener('input', (e) => {
            const newValue = e.target.value;
            if (newValue !== oldValue) {
                callback(e);
                oldValue = newValue;
            }
        });

        rangeElement.addEventListener('change', (e) => {
            callback(e);
        });
    }

    onRangeChange(lengthSlider, (e) => {
        passwordLength = parseInt(e.target.value, 10);
        lengthDisplay.textContent = passwordLength;
        updatePassword();
    });

    document.querySelectorAll('.radioSection input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = e.target.nextElementSibling.textContent.trim().toLowerCase();
            passwordOptions = {
                uppercase: value === 'all' || value === 'easy to read',
                lowercase: value === 'all' || value === 'easy to say',
                numbers: value === 'all',
                symbols: value === 'all'
            };
            updatePassword();
        });
    });

    document.querySelectorAll('.checkboxSection input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const value = e.target.nextElementSibling.textContent.trim();
            switch (value) {
                case 'A-Z':
                    passwordOptions.uppercase = e.target.checked;
                    break;
                case 'a-z':
                    passwordOptions.lowercase = e.target.checked;
                    break;
                case '0-9':
                    passwordOptions.numbers = e.target.checked;
                    break;
                case '!@#$%^&*()':
                    passwordOptions.symbols = e.target.checked;
                    break;
            }
            updatePassword();
        });
    });

    passwordInput.addEventListener('input', () => {
        updateStrengthIndicator(passwordInput.value);
        lengthDisplay.textContent = passwordInput.value.length;
    });

    copyButton.addEventListener('click', copyPassword);
    generateButton.addEventListener('click', updatePassword);

    // Initialize the password and display settings on load
    updatePassword();
});
