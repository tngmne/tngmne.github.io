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
      console.log(`Initializing i18n with language: ${this.currentLanguage}`);
      
      // Load translations
      await this.loadTranslations(this.currentLanguage);
      
      // Apply RTL if needed
      this.applyDirectionality();
      
      // Translate the page
      this.translatePage();
      
      console.log(`i18n initialized successfully with language: ${this.currentLanguage}`);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      // Fallback to English if translation loading fails
      if (this.currentLanguage !== 'en') {
        console.log('Falling back to English...');
        this.currentLanguage = 'en';
        await this.loadTranslations('en');
        this.translatePage();
      } else {
        // If English itself failed, try to reload it with a different cache buster
        console.log('English failed to load, retrying...');
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
      console.log(`Using saved language: ${savedLanguage}`);
      return savedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language.substring(0, 2).toLowerCase();
    console.log(`Browser language detected: ${navigator.language} -> ${browserLanguage}`);
    if (this.supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    }

    // Default to English
    console.log('Defaulting to English');
    return 'en';
  }

  // Load translation file
  async loadTranslations(language) {
    try {
      // Add cache-busting parameter to prevent browser caching issues
      // Use more aggressive cache busting for problematic languages
      const problematicLangs = ['en', 'uk', 'ru'];
      const cacheBuster = problematicLangs.includes(language) 
        ? Date.now() + Math.random() + Math.floor(Math.random() * 10000)
        : Date.now();
      
      const url = `./i18n/${language}.json?v=${cacheBuster}&nocache=true&t=${Math.random()}`;
      console.log(`Loading translations from: ${url}`);
      
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations (${response.status})`);
      }
      
      const text = await response.text();
      console.log(`Raw response for ${language}:`, text.substring(0, 200) + '...');
      
      this.translations = JSON.parse(text);
      
      // Debug logging to check if translations loaded correctly
      console.log(`Loaded translations for ${language}:`, {
        'meal.servedFrom': this.translations?.meal?.servedFrom,
        'meal.till': this.translations?.meal?.till,
        'header.welcome': this.translations?.header?.welcome,
        'header.description': this.translations?.header?.description,
        'totalKeys': Object.keys(this.translations).length
      });
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
        console.warn(`Translation key not found: ${keyPath} (language: ${this.currentLanguage})`);
        return fallback || keyPath;
      }
    }
    
    return value || fallback || keyPath;
  }

    // Hard reload translations for problematic languages
  async hardReloadTranslations(language = null) {
    const targetLanguage = language || this.currentLanguage;
    const problematicLangs = ['en', 'uk', 'ru'];
    if (!problematicLangs.includes(targetLanguage)) {
      return; // No need for hard reload
    }
    
    console.log(`Hard reloading translations for ${targetLanguage}`);
    try {
      // Force complete cache invalidation
      const cacheBuster = Date.now() + Math.random() * 999999 + Math.floor(Math.random() * 999999);
      const url = `./i18n/${targetLanguage}.json?v=${cacheBuster}&nocache=true&t=${Math.random()}&hard=${Date.now()}`;
      
      const response = await fetch(url, {
        cache: 'no-cache',
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        console.log(`Hard reload raw response for ${targetLanguage}:`, text.substring(0, 200) + '...');
        
        this.translations = JSON.parse(text);
        console.log(`Hard reload successful for ${targetLanguage}:`, {
          'header.welcome': this.translations?.header?.welcome,
          'header.description': this.translations?.header?.description,
          'meal.servedFrom': this.translations?.meal?.servedFrom,
          'meal.till': this.translations?.meal?.till
        });
        return true;
      }
    } catch (error) {
      console.error(`Hard reload failed for ${targetLanguage}:`, error);
    }
    return false;
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
      
      // For problematic languages, try hard reload first
      const problematicLangs = ['en', 'uk', 'ru'];
      if (problematicLangs.includes(language)) {
        console.log(`Attempting hard reload for problematic language: ${language}`);
        const success = await this.hardReloadTranslations(language);
        if (!success) {
          console.log(`Hard reload failed, trying standard load for ${language}`);
          await this.loadTranslations(language);
        }
      } else {
        await this.loadTranslations(language);
      }
      
      this.applyDirectionality();
      this.translatePage();
      
      console.log(`Successfully switched to language: ${language}`);
      
      // Verify translations loaded correctly for problematic languages
      if (problematicLangs.includes(language)) {
        const headerWelcome = this.t('header.welcome');
        const servedFrom = this.t('meal.servedFrom');
        console.log(`Verification for ${language}: header.welcome = ${headerWelcome}, meal.servedFrom = ${servedFrom}`);
        
        if (headerWelcome === 'header.welcome' || servedFrom === 'meal.servedFrom') {
          console.warn(`Translation verification failed for ${language}, attempting another reload`);
          await this.hardReloadTranslations(language);
        }
      }
      
    } catch (error) {
      console.error(`Failed to switch to language ${language}:`, error);
      // Don't fallback for switchLanguage - let user try again
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

  // Clear language cache and reset to browser default
  clearLanguageCache() {
    localStorage.removeItem('language');
    // Also clear any other potential cache keys
    localStorage.removeItem('i18n_cache');
    localStorage.removeItem('translations');
    console.log('Language cache cleared');
  }

  // Force clear all caches and reload
  async hardReset() {
    console.log('Performing hard reset of i18n system...');
    this.clearLanguageCache();
    this.translations = {};
    this.currentLanguage = 'en';
    
    // Force reload with aggressive cache busting
    await this.init();
  }

  // Force reload current language (useful for debugging)
  async forceReload() {
    console.log(`Force reloading language: ${this.currentLanguage}`);
    await this.loadTranslations(this.currentLanguage);
    this.translatePage();
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
