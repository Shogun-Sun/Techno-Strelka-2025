const inputs = document.querySelectorAll('.input_numb');
        
// Автоматически фокусируем первое редактируемое поле
document.addEventListener('DOMContentLoaded', () => {
    inputs[1].focus();
});

inputs.forEach((input, index) => {
    // Пропускаем первое поле (оно readonly)
    if (index === 0) return;
    
    // Обработка ввода
    input.addEventListener('input', function() {
        // Оставляем только цифры
        this.value = this.value.replace(/\D/g, '');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value == "") {
                inputs[i].focus()
                break
            }
        }
        
        if (this.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
        
        // Если это последнее поле и оно заполнено
        if (index === inputs.length - 1 && this.value.length === 1) {
            // Можно добавить обработку завершения ввода
            console.log('Номер полностью введён');
        }
    });

    // Обработка Backspace
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace') {
            if (this.value.length === 0 && index > 1) {
                // Если поле пустое - переходим к предыдущему
                inputs[index - 1].focus();
            } else if (this.value.length > 0) {
                // Если в поле есть текст - сначала очищаем его
                this.value = '';
            }
        }
    });
    
    // Обработка вставки из буфера обмена
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pasteData.length > 0) {
            // Заполняем текущее и следующие поля
            let remainingDigits = pasteData;
            for (let i = index; i < inputs.length && remainingDigits.length > 0; i++) {
                inputs[i].value = remainingDigits[0];
                remainingDigits = remainingDigits.slice(1);
            }
            
            // Фокусируем последнее заполненное поле
            const lastFilledIndex = Math.min(index + pasteData.length - 1, inputs.length - 1);
            inputs[lastFilledIndex].focus();
        }
    });
});


document.querySelector("#login_btn").addEventListener("click", () => {
    let pass = true
    phoneNumber = "+"
    inputs.forEach((input, index) => {
        if (input.value.length < 1) {
            alert("Неправельный номер телефона")
            pass = false
        } else {
            phoneNumber += input.value
        }
    })
    if (pass) {
        fetch("/user/login", {
            method:"Post",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                user_telephone: phoneNumber,
                user_password: document.querySelector("#password").value
            })
        })
        .then(res=> res.json())
        .then((userMessage) => {
            if (userMessage.user) {
                window.location.href = "/map"
            } else {
                alert(userMessage.message)
            }
        })
    }
})