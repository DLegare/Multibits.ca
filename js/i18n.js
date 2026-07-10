/**
 * Système de gestion multilingue (Français/Anglais)
 * Utilise localStorage pour mémoriser la préférence de langue
 */

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'multibits-lang';
    const DEFAULT_LANG = 'fr';
    const AVAILABLE_LANGS = ['fr', 'en'];

    // État actuel
    let currentLang = DEFAULT_LANG;

    /**
     * Initialise le système de langue
     */
    function init() {
        // Récupérer la langue sauvegardée ou utiliser la langue par défaut
        const savedLang = localStorage.getItem(STORAGE_KEY);
        currentLang = (savedLang && AVAILABLE_LANGS.includes(savedLang)) ? savedLang : DEFAULT_LANG;

        // Appliquer la langue
        applyLanguage(currentLang);

        // Mettre à jour le bouton de langue
        updateLanguageButton();

        // Attacher l'événement au bouton de changement de langue
        attachLanguageButtonEvent();
    }

    /**
     * Applique la langue à tous les éléments traduits
     */
    function applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-lang-fr][data-lang-en]');

        elements.forEach(function(element) {
            const translation = element.getAttribute('data-lang-' + lang);

            if (translation) {
                // Pour les inputs, traduire le placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Mettre à jour l'attribut lang du HTML avec la locale canadienne
        document.documentElement.lang = (lang === 'fr') ? 'fr-CA' : 'en-CA';

        // Sauvegarder la préférence
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
    }

    /**
     * Change la langue active
     */
    function changeLanguage(newLang) {
        if (!AVAILABLE_LANGS.includes(newLang)) {
            console.error('Langue non supportée:', newLang);
            return;
        }

        applyLanguage(newLang);
        updateLanguageButton();
    }

    /**
     * Bascule entre les langues disponibles
     */
    function toggleLanguage() {
        const newLang = (currentLang === 'fr') ? 'en' : 'fr';
        changeLanguage(newLang);
    }

    /**
     * Met à jour l'apparence du bouton de langue
     */
    function updateLanguageButton() {
        const button = document.getElementById('langToggle');
        if (button) {
            const langText = (currentLang === 'fr') ? 'English' : 'Français';
            button.textContent = langText;
            button.setAttribute('title', (currentLang === 'fr') ? 'Switch to English (Canada)' : 'Passer en français (Canada)');
        }
    }

    /**
     * Attache l'événement de clic au bouton de langue
     */
    function attachLanguageButtonEvent() {
        const button = document.getElementById('langToggle');
        if (button) {
            button.addEventListener('click', toggleLanguage);
        }
    }

    /**
     * Obtient la langue actuelle
     */
    function getCurrentLanguage() {
        return currentLang;
    }

    // Exposer l'API publique
    window.MultibitsI18n = {
        init: init,
        changeLanguage: changeLanguage,
        toggleLanguage: toggleLanguage,
        getCurrentLanguage: getCurrentLanguage
    };

    // Initialiser automatiquement au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
