import * as Yup from 'yup';

import i18n from "i18next";

export const validationSchema = Yup.object().shape({
    link: Yup.string().url(i18n.t('phrases.invalidurl')),
    emailAddress: Yup.string().email().required(''),
});