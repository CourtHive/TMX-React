import i18n from "i18next";
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    link: Yup.string().url(i18n.t('phrases.invalidurl'))
});