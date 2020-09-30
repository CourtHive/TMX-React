import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { defaultIdiom } from 'config/idiom/defaultIdiom';
import { IDIOM_STORAGE, IDIOM_SELECTED } from 'constants/localStorage';
import { attemptJSONparse } from 'functions/attemptJSONparse';

export function idiomSetup() {
    let idiomSelected = {};
    try {
        const storedIdiom = localStorage.getItem(IDIOM_STORAGE);
        idiomSelected = attemptJSONparse(storedIdiom) || {};
    } catch (err) {
        console.log(err);
    }

    const idiomDefault = defaultIdiom();
    const resources = Object.assign({}, idiomDefault, idiomSelected)
    const lng = localStorage.getItem(IDIOM_SELECTED) || "en";
  
    i18n
        .use(initReactI18next)
        .init({
            resources, lng,
            fallbackLng: "en",

            interpolation: {
              escapeValue: false
            }
        });
}
  