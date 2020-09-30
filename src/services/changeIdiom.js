import i18n from 'i18next';

import { NAMESPACE } from 'constants/idioms';
import { IDIOM_STORAGE, IDIOM_SELECTED, IDIOM_UPDATED } from 'constants/localStorage';
import { idiomFetch, idiomsUpdated } from 'services/communications/idiomService';

export async function changeIdiom({ lng = 'en', ns = NAMESPACE } = {}) {
  try {
    const resource = await idiomFetch({ lng, ns });
    const translation = resource && resource[lng] && resource[lng].translation;

    if (translation) {
      i18n.addResourceBundle(lng, 'translation', translation);

      localStorage.setItem(IDIOM_SELECTED, lng);
      const idiomToStore = JSON.stringify({ [lng]: { translation } });
      localStorage.setItem(IDIOM_STORAGE, idiomToStore);
      i18n.changeLanguage(lng);
    }
  } catch (err) {
    if (i18n.languages.includes(lng)) {
      localStorage.setItem(IDIOM_SELECTED, lng);
      i18n.changeLanguage(lng);
    }
  }
}

export async function checkIdiomUpdate() {
  const currentIdiom = localStorage.getItem(IDIOM_SELECTED) || 'en';
  const lastIdiomUpdate = parseInt(localStorage.getItem(IDIOM_UPDATED) || 0);
  const haveUpdated = await idiomsUpdated();
  if (haveUpdated > lastIdiomUpdate) {
    localStorage.setItem(IDIOM_UPDATED, haveUpdated);
    return await changeIdiom({ lng: currentIdiom });
  }
}
