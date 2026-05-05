import React from "react";

interface PasswordStrengthBarsProps {
  strength: number;
  borderColor: Record<number, string>;
}

const PasswordStrengthBars: React.FC<PasswordStrengthBarsProps> = ({ strength, borderColor }) => (
  <div className={`flex gap-1 `}>
    <div
      className={`border-b-4 w-1/4 ${
        strength <= 0 ? borderColor[0] : (borderColor as Record<number, string>)[strength]
      }`}
    ></div>
    <div
      className={`border-b-4 w-1/4 ${
        strength <= 1 ? borderColor[0] : (borderColor as Record<number, string>)[strength]
      }`}
    ></div>
    <div
      className={`border-b-4 w-1/4 ${
        strength <= 2 ? borderColor[0] : (borderColor as Record<number, string>)[strength]
      }`}
    ></div>
    <div
      className={`border-b-4 w-1/4 ${
        strength <= 3 ? borderColor[0] : (borderColor as Record<number, string>)[strength]
      }`}
    ></div>
  </div>
);

export default PasswordStrengthBars;
