/**
 * 联系页面入口文件
 */

import { loadAllComponents, setupMenuEvents } from './components.js';

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                submitForm();
            }
        });

        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    }
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();

    field.classList.remove('error');

    switch(fieldName) {
        case 'name':
            if (fieldValue.length < 2) {
                field.classList.add('error');
                return false;
            }
            break;

        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(fieldValue)) {
                field.classList.add('error');
                return false;
            }
            break;

        case 'subject':
            if (fieldValue.length < 3) {
                field.classList.add('error');
                return false;
            }
            break;

        case 'message':
            if (fieldValue.length < 10) {
                field.classList.add('error');
                return false;
            }
            break;
    }

    return true;
}

function validateForm() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitForm() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '发送中...';

    setTimeout(() => {
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        showSuccessMessage();
    }, 1500);
}

function showSuccessMessage() {
    let successMessage = document.querySelector('.form-success');

    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>消息发送成功！我们会尽快回复您。</span>
        `;

        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.appendChild(successMessage);
    }

    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

async function initializeContactPage() {
    await loadAllComponents();
    setupMenuEvents();
    setupContactForm();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactPage);
} else {
    initializeContactPage();
}
