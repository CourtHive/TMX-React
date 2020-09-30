import { normalizeName } from 'normalize-text';
import i18n from "i18next";

export function lastName(p) { return p.otherName || p.last_name; }
export function fullName(p) {
  let fullName = !p ? '' : `${p.last_name.toUpperCase()}, ${normalizeName(p.first_name, false)}`
  return (p && p.otherName) || fullName;
}
export function potentialBlock(p) { 
  return lastName(p) ? normalizeName(lastName(p), false).toUpperCase() : p.qualifier ? i18n.t('qualifier') : i18n.t('unk');
}
export function localizeDate(date, localization) {
  return date.toLocaleDateString(i18n.t('datelocalization'), localization);
}
