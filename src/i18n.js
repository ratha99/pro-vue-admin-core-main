import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import kh from './locales/kh.json'

function loadLocaleMessages() {
    const locales = [{ kh: kh }, { en: en }]
    const messages = {}
    locales.forEach(lang => {
        const key = Object.keys(lang)
        messages[key] = lang[key]
    })
    return messages
}

export default createI18n({
    legacy: false,
    locale: 'kh',
    fallbackLocale: 'kh',
    messages: loadLocaleMessages(),
})
