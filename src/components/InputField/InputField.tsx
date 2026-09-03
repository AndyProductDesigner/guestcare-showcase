import type { InputHTMLAttributes } from 'react';
import './InputField.css';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

function InputField({
  label,
  helperText,
  id,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <div className={`input-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>

      <input id={id} {...props} />

      {helperText && <p className="input-field-helper">{helperText}</p>}
    </div>
  );
}

export default InputField;
