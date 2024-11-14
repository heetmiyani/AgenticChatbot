import React from 'react';
import { FormData, FormField } from '../types';
import { formConfig } from '../config/formConfig';

interface LoanFormProps {
  formData: FormData;
  onChange: (field: FormField, value: any) => void;
  errors: Partial<Record<FormField, string>>;
}

export default function LoanForm({ formData, onChange, errors }: LoanFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let hasErrors = false;
    Object.entries(formConfig).forEach(([field, config]) => {
      if (config.required && !formData[field as FormField]) {
        hasErrors = true;
      }
      if (config.validation) {
        const error = config.validation(formData[field as FormField]);
        if (error) hasErrors = true;
      }
    });

    if (hasErrors) {
      alert('Please fill in all required fields correctly before submitting.');
      return;
    }

    // Log the submission (replace with actual submission logic)
    console.log('Form submitted:', formData);
    alert('Application submitted successfully!');
  };

  const renderField = (field: FormField) => {
    const config = formConfig[field];

    // Check dependencies
    if (config.dependsOn) {
      const { field: dependentField, value } = config.dependsOn;
      if (formData[dependentField] !== value) {
        return null;
      }
    }

    const commonClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
    const errorClasses = errors[field] ? "border-red-300" : "";

    switch (config.type) {
      case 'select':
        return (
          <select
            value={formData[field] as string}
            onChange={(e) => onChange(field, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          >
            <option value="">Select...</option>
            {field === 'loanPurpose' && [
              'Home Purchase',
              'Business',
              'Education',
              'Debt Consolidation',
              'Personal',
              'Other'
            ].map(purpose => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
            {field === 'employmentStatus' && [
              'Full-time',
              'Part-time',
              'Self-employed',
              'Unemployed',
              'Retired'
            ].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData[field] === true}
                onChange={() => onChange(field, true)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={formData[field] === false}
                onChange={() => onChange(field, false)}
                className="form-radio text-blue-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field] as string}
            onChange={(e) => onChange(field, e.target.value)}
            className={`${commonClasses} ${errorClasses} h-24`}
            placeholder={config.helpText}
          />
        );

      default:
        return (
          <input
            type={config.type}
            value={formData[field] as string}
            onChange={(e) => onChange(field, 
              config.type === 'number' ? Number(e.target.value) : e.target.value
            )}
            className={`${commonClasses} ${errorClasses}`}
            placeholder={config.helpText}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">US Loan Application</h2>
      
      {Object.keys(formConfig).map((field) => {
        const config = formConfig[field as FormField];
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field as FormField)}
            {errors[field as FormField] && (
              <p className="text-sm text-red-500">{errors[field as FormField]}</p>
            )}
            <p className="text-sm text-gray-500">{config.helpText}</p>
          </div>
        );
      })}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}