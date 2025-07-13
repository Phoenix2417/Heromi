class I18n {
  constructor() {
    this.translations = {
      vi: require('./locales/vi.json'),
      en: require('./locales/en.json'),
      // Các ngôn ngữ khác...
    };
    this.currentLang = 'vi';
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      this.applyTranslations();
      localStorage.setItem('heromi_lang', lang);
    }
  }

  t(key) {
    const translation = this.translations[this.currentLang];
    return translation[key] || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', this.t(el.getAttribute('data-i18n-placeholder')));
    });
  }
}

const i18n = new I18n();
module.exports = i18n;