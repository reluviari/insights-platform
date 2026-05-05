export function formatPhone(phone: string) {
  if (!phone) return "";
  const numbers = phone.replace(/\D/g, "");
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
