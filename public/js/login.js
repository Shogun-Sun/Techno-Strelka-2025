// Функция для отображения ошибок
function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    input.classList.add('invalid');
}

// Функция для скрытия ошибок
function hideError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
    input.classList.remove('invalid');
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// // Валидация пароля (минимум 6 символов, хотя бы одна цифра и одна буква)
// function validatePassword(password) {
//     const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;    
//     return re.test(password);
// }

// Валидация имени, фамилии, отчества (только буквы)
function validateName(name) {
    const re = /^[A-Za-zА-Яа-яЁё]$/;
    return re.test(name);
}

// Валидация формы входа
function validateLoginForm() {
    let isValid = true;
    
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    
    // Валидация email
    if (!loginInput.value.trim()) {
        showError(loginInput, 'Поле email обязательно для заполнения');
        isValid = false;
    } else if (!validateEmail(loginInput.value.trim())) {
        showError(loginInput, 'Пожалуйста, введите корректный email');
        isValid = false;
    } else {
        hideError(loginInput);
    }
    
    // Валидация пароля
    if (!passwordInput.value.trim()) {
        showError(passwordInput, 'Поле пароль обязательно для заполнения');
        isValid = false;
    } else {
        hideError(passwordInput);
    }
    
    return isValid;
}

// Валидация формы регистрации
function validateRegisterForm() {
    let isValid = true;
    
    const emailInput = document.getElementById('email');
    const surnameInput = document.getElementById('Surname');
    const nameInput = document.getElementById('Name');
    const patronimycInput = document.getElementById('Patronimyc');
    const passwordInput = document.getElementById('reg_password');
    const passwordConfirmInput = document.getElementById('reg_password_2');
    
    // Валидация email
    if (!emailInput.value.trim()) {
        showError(emailInput, 'Поле email обязательно для заполнения');
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Пожалуйста, введите корректный email');
        isValid = false;
    } else {
        hideError(emailInput);
    }
    
    // Валидация фамилии
    if (!surnameInput.value.trim()) {
        showError(surnameInput, 'Поле фамилия обязательно для заполнения');
        isValid = false;
    } else if (!validateName(surnameInput.value.trim())) {
        showError(surnameInput, 'Фамилия должна содержать только буквы и быть не короче 2 символов');
        isValid = false;
    } else {
        hideError(surnameInput);
    }
    
    // Валидация имени
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Поле имя обязательно для заполнения');
        isValid = false;
    } else if (!validateName(nameInput.value.trim())) {
        showError(nameInput, 'Имя должно содержать только буквы и быть не короче 2 символов');
        isValid = false;
    } else {
        hideError(nameInput);
    }
    
    // Валидация отчества (необязательное поле)
    if (patronimycInput.value.trim() && !validateName(patronimycInput.value.trim())) {
        showError(patronimycInput, 'Отчество должно содержать только буквы и быть не короче 2 символов');
        isValid = false;
    } else {
        hideError(patronimycInput);
    }
    
    // Валидация пароля
    if (!passwordInput.value.trim()) {
        showError(passwordInput, 'Поле пароль обязательно для заполнения');
        isValid = false;
    } else if (!validatePassword(passwordInput.value.trim())) {
        showError(passwordInput, 'Пароль должен содержать минимум 6 символов, включая хотя бы одну букву и одну цифру');
        isValid = false;
    } else {
        hideError(passwordInput);
    }
    
    // Подтверждение пароля
    if (!passwordConfirmInput.value.trim()) {
        showError(passwordConfirmInput, 'Пожалуйста, подтвердите пароль');
        isValid = false;
    } else if (passwordInput.value.trim() !== passwordConfirmInput.value.trim()) {
        showError(passwordConfirmInput, 'Пароли не совпадают');
        isValid = false;
    } else {
        hideError(passwordConfirmInput);
    }
    
    return isValid;
}

// Обработчики событий для формы входа
document.getElementById('login_btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (validateLoginForm()) {
        fetch( "/user/loginRes", {
            method:"Post",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:document.getElementById('login').value,
                password:document.getElementById('password').value
            })
        })
    }
});

// Обработчики событий для формы регистрации
document.getElementById('reg_btn').addEventListener('click', function(e) {
    e.preventDefault();
    if (validateRegisterForm()) {
        // Форма валидна, можно отправлять данные
        fetch("/user/register", {
            method:"Post",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:document.getElementById('email').value,
                surname:document.getElementById('Surname').value,
                name:document.getElementById('Name').value,
                patronimyc:document.getElementById('Patronimyc').value,
                password:document.getElementById('reg_password').value,
            })
        })
        .then(res=>res.json())
        .then((userOutMessage) => {
            console.log(userOutMessage)
            alert(userOutMessage.message)
        })
    }
});
modal.addEventListener('transitionend', function(e) {
    if (e.target === modal && modal.classList.contains('hidden')) {
        // Очищаем все ошибки в форме регистрации
        const errorMessages = document.querySelectorAll('#mainModal .error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.classList.add('hidden');
        });
        
        // Очищаем invalid-классы
        const invalidInputs = document.querySelectorAll('#mainModal input.invalid');
        invalidInputs.forEach(input => {
            input.classList.remove('invalid');
        });
        
        // Очищаем поля формы
        document.getElementById('email').value = '';
        document.getElementById('Surname').value = '';
        document.getElementById('Name').value = '';
        document.getElementById('Patronimyc').value = '';
        document.getElementById('reg_password').value = '';
        document.getElementById('reg_password_2').value = '';
    }
})