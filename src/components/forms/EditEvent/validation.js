import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    name: Yup.string(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
});