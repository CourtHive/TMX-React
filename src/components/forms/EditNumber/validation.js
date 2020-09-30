import * as Yup from 'yup';

import i18n from 'i18next';

const nullableNumber = (value, originalValue) => (originalValue.trim() === '' ? null : value);

export const validationSchema = Yup.object().shape({
  ranking: Yup.number().integer(i18n.t('Whole Number')).nullable().transform(nullableNumber),
  rating: Yup.number().nullable().transform(nullableNumber),
  seedPosition: Yup.number().integer(i18n.t('Whole Number')).nullable().transform(nullableNumber)
});
