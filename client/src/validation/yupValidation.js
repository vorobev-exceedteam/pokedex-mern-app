import * as yup from 'yup';

const getStringTypeMessage = (name) => `${name} should be a text`;
const getRequiredMessage = (name) => `${name} is required`;
const getMaxMessage = (name, max) =>
  `${name} should be less than ${max} characters`;
const getMinMessage = (name, min) => {
  const text = `${name} should be at least ${min} character`;
  if (min > 1) {
    return text + 's';
  }
  return text;
};

export const signUpSchema = yup.object().shape({
  email: yup
    .string(getStringTypeMessage('Email'))
    .required(getRequiredMessage('Email'))
    .email('Should be a valid email address')
    .max(254, ({ max }) => getMaxMessage('Email', max)),
  password: yup
    .string(getStringTypeMessage('Password'))
    .required(getRequiredMessage('Password'))
    .min(4, ({ min }) => getMinMessage('Password', min))
    .max(64, ({ max }) => getMaxMessage('Password', max)),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const setPasswordSchema = yup.object().shape({
  password: yup
    .string(getStringTypeMessage('Password'))
    .required(getRequiredMessage('Password'))
    .min(4, ({ min }) => getMinMessage('Password', min))
    .max(64, ({ max }) => getMaxMessage('Password', max)),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string(getStringTypeMessage('Old Password'))
    .required(getRequiredMessage('Old Password'))
    .min(4, ({ min }) => getMinMessage('Old Password', min))
    .max(64, ({ max }) => getMaxMessage('Old Password', max)),
  password: yup
    .string(getStringTypeMessage('Password'))
    .required(getRequiredMessage('Password'))
    .notOneOf([yup.ref('oldPassword'), null], 'New password can\'t be equal to old')
    .min(4, ({ min }) => getMinMessage('Password', min))
    .max(64, ({ max }) => getMaxMessage('Password', max)),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const loginSchema = yup.object().shape({
  email: yup
    .string(getStringTypeMessage('Email'))
    .required(getRequiredMessage('Email'))
    .email('Should be a valid email address')
    .max(254, ({ max }) => getMaxMessage('Email', max)),
  password: yup
    .string(getStringTypeMessage('Password'))
    .required(getRequiredMessage('Password'))
    .min(4, ({ min }) => getMinMessage('Password', min))
    .max(64, ({ max }) => getMaxMessage('Password', max)),
});
