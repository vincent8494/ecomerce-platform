import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'This field is required',
  },
  string: {
    email: 'Please enter a valid email',
    min: 'Must be at least ${min} characters',
    max: 'Must be at most ${max} characters',
  },
  number: {
    min: 'Must be at least ${min}',
    max: 'Must be at most ${max}',
  },
});

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .nullable()
    .required('Please confirm your password'),
});

export const profileValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  phone: yup.string().nullable(),
  address: yup.object().shape({
    street: yup.string().nullable(),
    city: yup.string().nullable(),
    state: yup.string().nullable(),
    zipCode: yup.string().nullable(),
    country: yup.string().nullable(),
  }),
});

export const passwordValidationSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .nullable()
    .required('Please confirm your new password'),
});

export const shippingValidationSchema = yup.object().shape({
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
});

export const paymentValidationSchema = yup.object().shape({
  paymentMethod: yup.string().required('Payment method is required'),
});

export const productValidationSchema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  discount: yup
    .number()
    .typeError('Discount must be a number')
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot be more than 100%')
    .required('Discount is required'),
  category: yup.string().required('Category is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .required('Quantity is required'),
  colors: yup.array().of(yup.string()),
  sizes: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
  featured: yup.boolean(),
  freeShipping: yup.boolean(),
});

export const categoryValidationSchema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required'),
  parent: yup.string().nullable(),
  featured: yup.boolean(),
  isActive: yup.boolean(),
});

export const reviewValidationSchema = yup.object().shape({
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .required('Rating is required'),
  comment: yup.string().required('Review comment is required'),
});

export const validateFormData = async <T>(
  schema: yup.ObjectSchema<any>,
  data: T
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { form: 'An unknown error occurred' } };
  }
};
