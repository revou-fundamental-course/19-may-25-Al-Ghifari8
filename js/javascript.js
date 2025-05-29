// Ensures the script runs only after the entire HTML document has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Variable to track the current conversion direction.
    let isCelsiusToFahrenheit = true;

    // DOM Element Selections
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const dynamicInstruction = document.getElementById('dynamic-instruction');

    const celsiusToFahrenheitExplanationDiv = document.getElementById('celsius-to-fahrenheit-explanation');
    const fahrenheitToCelsiusExplanationDiv = document.getElementById('fahrenheit-to-celsius-explanation');

    // DOM Elements for dynamic conversion result explanations
    const cToFExplanationResultP = document.getElementById('cToFExplanationResult');
    const fToCExplanationResultP = document.getElementById('fToCExplanationResult');

    const convertBtn = document.getElementById('convertBtn');
    const reverseBtn = document.getElementById('reverseBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Store original/default explanation texts
    const defaultExplanationTexts = {
        cToF: "",
        fToC: ""
    };
    // Initialize default explanation texts
    const originalTexts = {
        instructionCelsius: "Masukkan suhu derajat Celsius (°C) ke kotak di bawah, lalu klik tombol Konversi untuk mendapatkan hasil konversi dalam bentuk Fahrenheit (°F).",
        instructionFahrenheit: "Masukkan suhu derajat Fahrenheit (°F) ke kotak di bawah, lalu klik tombol Konversi untuk mendapatkan hasil konversi dalam bentuk Celsius (°C).",
        label1Celsius: "Celsius (°C)",
        label2Fahrenheit: "Fahrenheit (°F)",
        label1Fahrenheit: "Fahrenheit (°F)",
        label2Celsius: "Celsius (°C)",
        placeholder1Celsius: "Masukkan suhu",
        placeholder2Fahrenheit: "Hasil konversi",
        placeholder1Fahrenheit: "Masukkan suhu",
        placeholder2Celsius: "Hasil konversi"
    };
    // function to get temperature color based on Celsius value
    function getTemperatureColor(celsius) {
        if (isNaN(celsius) || celsius === null || celsius === undefined) {
            return '';
        }
        if (celsius <= 0) return '#A0D2DB';
        else if (celsius <= 5) return '#89CFF0';
        else if (celsius <= 10) return '#BDE0FE';
        else if (celsius <= 15) return '#AFEEEE';
        else if (celsius <= 20) return '#98FB98';
        else if (celsius <= 25) return '#E0E7AF';
        else if (celsius < 30) return '#FAFAD2';
        else if (celsius < 35) return '#FFFFE0';
        else if (celsius < 40) return '#FFFACD';
        else if (celsius < 45) return '#FFD700';
        else if (celsius < 50) return '#FFA500';
        else if (celsius < 60) return '#FF8C00';
        else if (celsius < 70) return '#FF6347';
        else if (celsius < 80) return '#FF4500';
        else if (celsius < 90) return '#E0115F';
        else if (celsius < 100) return '#B81149';
        else return '#8B0000';
    }

    function updateInputColors(celsiusValue) {
        const color = getTemperatureColor(celsiusValue);
        input1.style.backgroundColor = color;
        input2.style.backgroundColor = color;

        if (color) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
            input1.style.color = textColor;
            input2.style.color = textColor;
        } else {
            input1.style.color = '';
            input2.style.color = '';
        }
    }

    // Function to reset explanation texts to their default static content
    function resetExplanationTexts() {
        if (cToFExplanationResultP) cToFExplanationResultP.textContent = defaultExplanationTexts.cToF;
        if (fToCExplanationResultP) fToCExplanationResultP.textContent = defaultExplanationTexts.fToC;
    }

    // Function to generate and update the dynamic conversion explanation string
    function updateConversionExplanation(originalValue, convertedValue, isInputCelsius) {
        if (isNaN(originalValue) || isNaN(convertedValue) || originalValue === null || convertedValue === null) {
            resetExplanationTexts(); // Revert to default if values are invalid
            return;
        }

        const originalFormatted = parseFloat(originalValue).toFixed(1);
        const convertedFormatted = parseFloat(convertedValue).toFixed(1);

        if (isInputCelsius) { // Input was Celsius, explaining C to F conversion
            // S°F = (S°C × 9/5) + 32
            const step1 = (parseFloat(originalValue) * 9/5).toFixed(1);
            if (cToFExplanationResultP) {
                cToFExplanationResultP.textContent = `Penjelasan: (${originalFormatted}°C × 9/5) + 32 = (${step1}) + 32 = ${convertedFormatted}°F`;
            }
            if (fToCExplanationResultP) fToCExplanationResultP.textContent = defaultExplanationTexts.fToC; // Reset the other one
        } else { // Input was Fahrenheit, explaining F to C conversion
            // S°C = (S°F - 32) × 5/9
            const step1 = (parseFloat(originalValue) - 32).toFixed(1);
            if (fToCExplanationResultP) {
                fToCExplanationResultP.textContent = `Penjelasan: (${originalFormatted}°F - 32) × 5/9 = (${step1}) × 5/9 = ${convertedFormatted}°C`;
            }
            if (cToFExplanationResultP) cToFExplanationResultP.textContent = defaultExplanationTexts.cToF; // Reset the other one
        }
    }

    // Function to update the UI based on the current conversion direction
    function updateUI() {
        let currentCelsiusValue = NaN;
        let activeInputValue = NaN;

        if (input1.value.trim() !== '') {
            activeInputValue = parseFloat(input1.value);
        }

        if (isCelsiusToFahrenheit) {
            if (dynamicInstruction) dynamicInstruction.textContent = originalTexts.instructionCelsius;
            label1.textContent = originalTexts.label1Celsius;
            input1.placeholder = originalTexts.placeholder1Celsius;
            input1.removeAttribute('readonly');
            label2.textContent = originalTexts.label2Fahrenheit;
            input2.placeholder = originalTexts.placeholder2Fahrenheit;
            input2.setAttribute('readonly', true);

            celsiusToFahrenheitExplanationDiv.style.display = 'block';
            fahrenheitToCelsiusExplanationDiv.style.display = 'none';

            if (!isNaN(activeInputValue)) currentCelsiusValue = activeInputValue;

        } else {
            if (dynamicInstruction) dynamicInstruction.textContent = originalTexts.instructionFahrenheit;
            label1.textContent = originalTexts.label1Fahrenheit;
            input1.placeholder = originalTexts.placeholder1Fahrenheit;
            input1.removeAttribute('readonly');
            label2.textContent = originalTexts.label2Celsius;
            input2.placeholder = originalTexts.placeholder2Celsius;
            input2.setAttribute('readonly', true);

            celsiusToFahrenheitExplanationDiv.style.display = 'none';
            fahrenheitToCelsiusExplanationDiv.style.display = 'block';

            if (!isNaN(activeInputValue)) {
                currentCelsiusValue = (activeInputValue - 32) * 5 / 9;
            }
        }

        if (input1.value.trim() === '' || isNaN(currentCelsiusValue)) {
            updateInputColors(NaN);
            resetExplanationTexts(); // Reset explanations if input is invalid/empty
        } else {
            updateInputColors(currentCelsiusValue);
            // Only update explanation fully after a conversion, not just on UI swap with old values.
            // So, we might reset it here or wait for convertTemperature.
            // For now, let's reset if input2 is empty, meaning no valid conversion result is shown.
            if (input2.value.trim() === '') {
                resetExplanationTexts();
            } else {
                // If both fields have values (e.g., after a reverse), show explanation for current input1
                updateConversionExplanation(input1.value, input2.value, isCelsiusToFahrenheit);
            }
        }
    }
    // function to handle validation 
    function convertTemperature() {
        if (input1.value.trim() === '') {
            alert("Kolom tidak boleh kosong");
            return;
        }
        const primaryInputValue = parseFloat(input1.value);

        if (isNaN(primaryInputValue)) {
            input2.value = '';
            updateInputColors(NaN);
            resetExplanationTexts(); // Reset explanations
            alert("Masukkan angka yang valid.");
            return;
        }

        let resultCelsius;
        let convertedValue; // This will be the value in input2

        if (isCelsiusToFahrenheit) {
            resultCelsius = primaryInputValue;
            convertedValue = (primaryInputValue * 9/5) + 32;
            input2.value = convertedValue.toFixed(2);
        } else {
            convertedValue = (primaryInputValue - 32) * 5/9;
            resultCelsius = convertedValue; // In this case, the result is Celsius
            input2.value = convertedValue.toFixed(2);
        }
        updateInputColors(resultCelsius);
        updateConversionExplanation(primaryInputValue, convertedValue, isCelsiusToFahrenheit); // Update explanation
    }
    // Function to reverse the inputs and labels
    function reverseInputs() {
        if (input1.value.trim() === '' && input2.value.trim() === '') {
            // Allow reversing fields and labels even if both are empty.
        } else if (input1.value.trim() === '') {
            alert("Kolom tidak boleh kosong");
            return;
        }

        const tempVal1 = input1.value;
        input1.value = input2.value;
        input2.value = tempVal1;

        isCelsiusToFahrenheit = !isCelsiusToFahrenheit;
        updateUI(); // This will call resetExplanationTexts or updateConversionExplanation via updateUI
    }
    // Function to reset both input fields and the conversion direction
    function resetFields() {
        if (input1.value.trim() === '' && input2.value.trim() === '') {
            // If both fields are already empty, no need for "Kolom tidak boleh kosong" alert for reset.
        } else if (input1.value.trim() === '') {
             alert("Kolom tidak boleh kosong");
             return;
        }

        input1.value = '';
        input2.value = '';
        if (!isCelsiusToFahrenheit) {
            isCelsiusToFahrenheit = true;
        }
        updateUI(); // This will call resetExplanationTexts via updateUI
    }

    input1.addEventListener('input', () => {
        const rawValue = input1.value;
        let celsiusEquivalent = NaN;

        if (rawValue.trim() === '') {
            input2.value = '';
            resetExplanationTexts(); // Reset explanation if input is cleared
        } else {
            const val = parseFloat(rawValue);
            if (!isNaN(val)) {
                if (isCelsiusToFahrenheit) {
                    celsiusEquivalent = val;
                } else {
                    celsiusEquivalent = (val - 32) * 5/9;
                }
            } else {
                 input2.value = '';
                 resetExplanationTexts(); // Reset explanation if input is invalid
            }
        }
        updateInputColors(celsiusEquivalent);
        // Explanation is best updated after a full conversion click, not live on every keystroke for full formula.
        // However, if input1 is cleared, we reset the explanation.
        if (input1.value.trim() === '') {
            resetExplanationTexts();
        }
    });
    // Add event listeners for buttons
    if (convertBtn) {
        convertBtn.addEventListener('click', convertTemperature);
    }
    if (reverseBtn) {
        reverseBtn.addEventListener('click', reverseInputs);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFields);
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    updateUI();
    input2.setAttribute('readonly', true);
});