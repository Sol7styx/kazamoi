// script.js

// Initialiser EmailJS avec votre Public Key
(function() {
    emailjs.init("My82HTIL1aM-_Bbm_"); // Remplacez par votre clé publique EmailJS
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const arrivalDateInput = document.getElementById('arrivalDate');
    const validationMessage = document.getElementById('validationMessage');
    
    // Définir la date minimum à J+2 (48h à l'avance)
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const minDate = twoDaysLater.toISOString().split('T')[0];
    arrivalDateInput.setAttribute('min', minDate);
    
    // Validation du formulaire et envoi d'email
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const selectedDate = new Date(arrivalDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        const diffTime = selectedDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 2) {
            // Date invalide - moins de 48h
            validationMessage.textContent = '❌ Oups ! Les réservations doivent être faites au moins 48h à l\'avance. Merci de respecter ce délai ! 🙏';
            validationMessage.className = 'info-text error';
            
            // Animation de secousse
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        } else {
            // Réservation valide - Envoi de l'email
            validationMessage.textContent = '⏳ Envoi de votre réservation en cours...';
            validationMessage.className = 'info-text';
            
            // Préparer les paramètres pour l'email
            const templateParams = {
                guestName: document.getElementById('guestName').value,
                arrivalDate: arrivalDateInput.value,
                arrivalTime: document.getElementById('arrivalTime').value,
                roomType: document.getElementById('roomType').value,
                specialRequests: document.getElementById('specialRequests').value || 'Aucune demande spéciale',
                to_email: 'l.vitam72@gmail.com'
            };
            
            // Envoyer l'email via EmailJS
            emailjs.send('service_79ryu6l', 'template_qr4bpwf', templateParams)
                .then(function(response) {
                    console.log('Email envoyé avec succès!', response.status, response.text);
                    
                    const guestName = templateParams.guestName;
                    const roomType = document.getElementById('roomType').options[document.getElementById('roomType').selectedIndex].text;
                    
                    validationMessage.textContent = `✅ Fantastique ${guestName} ! Votre réservation pour la ${roomType} le ${arrivalDateInput.value} à ${templateParams.arrivalTime} est confirmée ! Un email de confirmation a été envoyé ! 🎉`;
                    validationMessage.className = 'info-text success';
                    
                    // Réinitialiser le formulaire après 5 secondes
                    setTimeout(() => {
                        form.reset();
                        validationMessage.textContent = '';
                    }, 5000);
                }, function(error) {
                    console.log('Erreur lors de l\'envoi:', error);
                    validationMessage.textContent = '❌ Oups ! Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.';
                    validationMessage.className = 'info-text error';
                });
        }
    });
    
    // Animation de secousse pour les erreurs
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});
