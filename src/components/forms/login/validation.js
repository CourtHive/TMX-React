import * as Yup from 'yup';

// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].{8,}$/;
// const PASSWORD_ERROR = 'Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special';
export const validationSchema = Yup.object().shape({
  emailAddress: Yup.string().email().required(''),
  password: Yup.string()
    // .min(8)
    // .matches(PASSWORD_REGEX, { message: PASSWORD_ERROR })
    .required('')
});
