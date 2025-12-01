document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const resultBox = document.getElementById("formResult");
    const successPopup = document.getElementById("successPopup");

    const fields = {
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address"),
        q1: document.getElementById("q1"),
        q2: document.getElementById("q2"),
        q3: document.getElementById("q3"),
    };

    // VALIDATORIAI
    const validators = {
        firstName: v => /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž-]+$/.test(v),
        lastName: v => /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž-]+$/.test(v),
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        address: v => v.length > 0,
        q1: v => v >= 1 && v <= 10,
        q2: v => v >= 1 && v <= 10,
        q3: v => v >= 1 && v <= 10,
    };

    // REAL-TIME VALIDACIJA
    Object.keys(fields).forEach(key => {
        if (key === "phone") return; // telefonas turi savo logiką

        fields[key].addEventListener("input", () => {
            validateField(fields[key], validators[key]);
            checkFormStatus();
        });
    });

    // TELEFONO FORMATAVIMAS
    fields.phone.addEventListener("input", () => {
        let digits = fields.phone.value.replace(/\D/g, "");
        digits = digits.substring(0, 11);

        let formatted = "+370";

        if (digits.length > 3) formatted += " " + digits[3];
        if (digits.length > 4) formatted += digits[4] + digits[5] || "";
        if (digits.length > 6) formatted += " " + digits.substring(6);

        fields.phone.value = formatted;

        checkFormStatus();
    });

    function validateField(input, validatorFn) {
        const value = input.value.trim();
        const valid = validatorFn(value);

        removeError(input);

        if (!valid) {
            input.classList.add("input-error");
            const err = document.createElement("div");
            err.classList.add("error-msg");
            err.innerText = "Neteisingai įvestas laukas";
            input.insertAdjacentElement("afterend", err);
        }
    }

    function removeError(input) {
        input.classList.remove("input-error");
        if (input.nextElementSibling?.classList.contains("error-msg")) {
            input.nextElementSibling.remove();
        }
    }

    // SUBMIT MYGTUKO VALDYMAS
    function checkFormStatus() {
        const anyEmpty = Object.values(fields).some(input => input.value.trim() === "");
        const anyErrors = document.querySelectorAll(".input-error").length > 0;

        submitBtn.disabled = anyEmpty || anyErrors;
    }

    checkFormStatus(); // pradžioje išjungiam

    // SUBMIT ĮVYKIS
    form.addEventListener("submit", function (event) {
    event.preventDefault();

    // SURINKTI DUOMENIS Į OBJEKTĄ
    const formData = {
        firstName: fields.firstName.value,
        lastName: fields.lastName.value,
        email: fields.email.value,
        phone: fields.phone.value,
        address: fields.address.value,
        ratings: {
            q1: Number(fields.q1.value),
            q2: Number(fields.q2.value),
            q3: Number(fields.q3.value)
        }
    };

    // 4.1 ✔ IŠVESTI OBJEKTĄ Į KONSOLĘ
    console.log("Formos duomenys:", formData);

    // VIDURKIS
    const avg =
        ((formData.ratings.q1 +
          formData.ratings.q2 +
          formData.ratings.q3) / 3).toFixed(1);

    // ATVAIZDAVIMAS PO FORMA
    resultBox.innerHTML = `
        <h3>Jūsų pateikti duomenys:</h3>
        <p><strong>Vardas:</strong> ${formData.firstName}</p>
        <p><strong>Pavardė:</strong> ${formData.lastName}</p>
        <p><strong>El. paštas:</strong> ${formData.email}</p>
        <p><strong>Telefonas:</strong> ${formData.phone}</p>
        <p><strong>Adresas:</strong> ${formData.address}</p>

        <h4>Vidurkis:</h4>
        <p><strong>${formData.firstName} ${formData.lastName}: ${avg}</strong></p>
    `;

    // POP-UP
    successPopup.style.display = "block";
    setTimeout(() => successPopup.style.display = "none", 2500);
});

});
