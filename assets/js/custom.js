document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const resultBox = document.getElementById("formResult");
    const successPopup = document.getElementById("successPopup");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // sustabdom formos refresh

        // Surenkame duomenis
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;

        const q1 = Number(document.getElementById("q1").value);
        const q2 = Number(document.getElementById("q2").value);
        const q3 = Number(document.getElementById("q3").value);

        // Sukuriamas objektas
        const formData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            ratings: { q1, q2, q3 }
        };

        // 1. Išvedame į konsolę
        console.log("Formos duomenys:", formData);

        // 2. Apskaičiuojame vidurkį
        const average = ((q1 + q2 + q3) / 3).toFixed(1);

        // 3. Atvaizduojame duomenis po forma
        resultBox.innerHTML = `
            <h3>Jūsų pateikti duomenys:</h3>
            <p><strong>Vardas:</strong> ${firstName}</p>
            <p><strong>Pavardė:</strong> ${lastName}</p>
            <p><strong>El. paštas:</strong> ${email}</p>
            <p><strong>Telefonas:</strong> ${phone}</p>
            <p><strong>Adresas:</strong> ${address}</p>

            <h4>Įvertinimai:</h4>
            <p><strong>Klausimas 1:</strong> ${q1}</p>
            <p><strong>Klausimas 2:</strong> ${q2}</p>
            <p><strong>Klausimas 3:</strong> ${q3}</p>

            <h4>Vidurkis:</h4>
            <p><strong>${firstName} ${lastName}: ${average}</strong></p>
        `;

        // 4. Parodome pop-up pranešimą
        successPopup.style.display = "block";

        setTimeout(() => {
            successPopup.style.display = "none";
        }, 2500); // paslėpti po 2,5 sekundės
    });
});
