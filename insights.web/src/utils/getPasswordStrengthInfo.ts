export const getPasswordStrengthInfo = (strength: number) => {
  const borderColors: { [key: number]: string } = {
    4: "border-password-500",
    3: "border-password-400",
    2: "border-password-300",
    1: "border-password-200",
    0: "border-password-100",
  };

  const textColors: { [key: number]: string } = {
    4: "text-password-500",
    3: "text-password-400",
    2: "text-password-300",
    1: "text-password-200",
    0: "text-password-100",
  };

  const content: { [key: number]: string } = {
    4: "Forte",
    3: "Bom",
    2: "Médio",
    1: "Fraca",
    0: "Muito Fraca",
  };

  return {
    borderColor: borderColors,
    contentColor: textColors,
    content: content[strength],
  };
};
