// i18n.js - Internationalization module
class I18n {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = ['en', 'de', 'fr', 'sr', 'uk', 'ru', 'he'];
    this.rtlLanguages = ['he']; // Right-to-left languages
  }

  // Initialize i18n system
  async init() {
    try {
      // Detect user language
      this.currentLanguage = this.detectLanguage();
      
      // Load translations
      await this.loadTranslations(this.currentLanguage);
      
      // Apply RTL if needed
      this.applyDirectionality();
      
      // Translate the page
      this.translatePage();
      
      console.log(`i18n initialized with language: ${this.currentLanguage}`);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      // Fallback to English if translation loading fails
      if (this.currentLanguage !== 'en') {
        this.currentLanguage = 'en';
        await this.loadTranslations('en');
        this.translatePage();
      }
    }
  }

  // Detect user language from browser/localStorage
  detectLanguage() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language.substring(0, 2).toLowerCase();
    if (this.supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    }

    // Default to English
    return 'en';
  }

  // Load translation file
  async loadTranslations(language) {
    try {
      const response = await fetch(`./i18n/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      this.translations = await response.json();
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);
      throw error;
    }
  }

  // Get translated text by key path (e.g., 'meal.selectBreakfast')
  t(keyPath, fallback = '') {
    const keys = keyPath.split('.');
    let value = this.translations;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`Translation key not found: ${keyPath}`);
        return fallback || keyPath;
      }
    }
    
    return value || fallback || keyPath;
  }

  // Switch language
  async switchLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.error(`Language ${language} is not supported`);
      return;
    }

    try {
      this.currentLanguage = language;
      localStorage.setItem('language', language);
      
      await this.loadTranslations(language);
      this.applyDirectionality();
      this.translatePage();
      
      console.log(`Switched to language: ${language}`);
    } catch (error) {
      console.error(`Failed to switch to language ${language}:`, error);
    }
  }

  // Apply RTL/LTR directionality
  applyDirectionality() {
    const isRtl = this.rtlLanguages.includes(this.currentLanguage);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLanguage;
  }

  // Translate all elements on the page
  translatePage() {
    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Translate elements with data-i18n-html for HTML content
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.t(key);
      element.innerHTML = translation;
    });

    // Translate title
    document.title = this.t('app.title', 'Meal Selection');
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Format message with variables (simple template)
  format(keyPath, variables = {}) {
    let message = this.t(keyPath);
    
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), variables[key]);
    });
    
    return message;
  }
}

// Global i18n instance
window.i18n = new I18n();
