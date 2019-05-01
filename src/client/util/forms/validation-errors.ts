export const VALIDATION_ERRORS: {
  [key: string]: string,
} = {
  'required': 'This field is required.',
  'email': 'This is not a valid email address.',
  'minlength': 'Field must have at least {requiredLength} characters.',
  'maxlength': 'Field must have at most {requiredLength} characters.',
  'isMatch': 'Fields must match.',
  'custom': '{message}'
};
