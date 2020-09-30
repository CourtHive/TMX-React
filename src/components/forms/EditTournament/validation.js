import * as Yup from 'yup';

import i18n from "i18next";

export const validationSchema = Yup.object().shape({
    name: Yup.string().required(i18n.t('Required')),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
});