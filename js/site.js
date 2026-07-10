// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var subject = document.getElementById('subject').value;
            var message = document.getElementById('message').value;

            // Créer le lien mailto
            var mailtoLink = 'mailto:Web@multibits.ca' +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(
                    'Nom: ' + name + '\n' +
                    'Email: ' + email + '\n\n' +
                    'Message:\n' + message
                );

            // Ouvrir le client email
            window.location.href = mailtoLink;
        });
    }
});
