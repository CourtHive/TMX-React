import * as Yup from 'yup';
import i18n from "i18next";

export const validationSchema = Yup.object().shape({
    venueName: Yup.string()
        .required(i18n.t('Required')),
    abbreviation: Yup.string()
        .max(10, i18n.t('Max 10 characters'))
        .required(i18n.t('Required')),
    courts: Yup.number()
        .typeError(i18n.t('Must be a number'))
        .positive(i18n.t('Must be greater than zero'))
        .required(i18n.t('Required'))
});
