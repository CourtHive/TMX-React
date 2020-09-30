import * as Yup from 'yup';

import i18n from "i18next";

export const validationSchema = Yup.object().shape({
    logoLink: Yup.string().url(i18n.t('phrases.invalidurl')),
    name: Yup.string().required('Required'),
    abbreviation: Yup.string().max(10, i18n.t('Max 10 characters')),
    code: Yup.string().max(3, i18n.t('Max 3 characters'))
});