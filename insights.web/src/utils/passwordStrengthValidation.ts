interface PasswordStrength {
  length: boolean;
  hasUppercaseAndLowercase: boolean;
  digit: boolean;
  specialCharacter: boolean;
  strength: number;
}

export function passwordStrengthValidation(password: string): PasswordStrength {
  let strength = 0;

  const result: PasswordStrength = {
    length: password?.length >= 8,
    hasUppercaseAndLowercase: /[A-Za-z]/.test(password),
    digit: /[0-9]/.test(password),
    specialCharacter: /(?=.*[^a-zA-Z\d])/.test(password),
    strength,
  };

  if (result.length) strength++;
  if (result.hasUppercaseAndLowercase) strength++;
  if (result.digit) strength++;
  if (result.specialCharacter) strength++;

  result.strength = strength;

  return result;
}
