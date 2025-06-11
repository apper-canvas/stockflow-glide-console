import React from 'react';
import Label from '@/components/atoms/Label';

const FormField = ({ label, id, children, className = '' }) => {
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { id });
        }
        return child;
      })}
    </div>
  );
};

export default FormField;