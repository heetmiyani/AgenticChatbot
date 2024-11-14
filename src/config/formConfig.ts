import { FieldConfig } from '../types';

export const formConfig: Record<string, FieldConfig> = {
  fullName: {
    label: 'Full Name',
    type: 'text',
    required: true,
    helpText: 'Please enter your legal full name',
    validation: (value) => 
      !value ? 'Name is required' : 
      value.length < 2 ? 'Name must be at least 2 characters' : null
  },
  email: {
    label: 'Email Address',
    type: 'email',
    required: true,
    helpText: 'Enter your primary email address',
    validation: (value) => 
      !value ? 'Email is required' : 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : null
  },
  loanAmount: {
    label: 'Loan Amount',
    type: 'number',
    required: true,
    helpText: 'Enter the amount you wish to borrow (USD)',
    validation: (value) => 
      !value ? 'Loan amount is required' : 
      value < 1000 ? 'Minimum loan amount is $1,000' : 
      value > 1000000 ? 'Maximum loan amount is $1,000,000' : null
  },
  loanPurpose: {
    label: 'Loan Purpose',
    type: 'select',
    required: true,
    helpText: 'Select the primary purpose for this loan',
    validation: (value) => !value ? 'Loan purpose is required' : null
  },
  employmentStatus: {
    label: 'Employment Status',
    type: 'select',
    required: true,
    helpText: 'Select your current employment status',
    validation: (value) => !value ? 'Employment status is required' : null
  },
  monthlyIncome: {
    label: 'Monthly Income',
    type: 'number',
    required: true,
    helpText: 'Enter your average monthly income (USD)',
    validation: (value) => 
      !value ? 'Monthly income is required' : 
      value < 0 ? 'Monthly income cannot be negative' : null
  },
  creditScore: {
    label: 'Credit Score',
    type: 'number',
    required: true,
    helpText: 'Enter your current credit score',
    validation: (value) => 
      !value ? 'Credit score is required' : 
      value < 300 || value > 850 ? 'Credit score must be between 300 and 850' : null
  },
  hasCollateral: {
    label: 'Do you have collateral?',
    type: 'boolean',
    required: true,
    helpText: 'Indicate if you have any assets to offer as collateral',
    validation: (value) => value === undefined ? 'Please indicate if you have collateral' : null
  },
  collateralType: {
    label: 'Collateral Type',
    type: 'text',
    required: false,
    dependsOn: {
      field: 'hasCollateral',
      value: true
    },
    helpText: 'Describe the type of collateral you can offer',
    validation: (value) => null
  },
  additionalNotes: {
    label: 'Additional Notes',
    type: 'textarea',
    required: false,
    helpText: 'Any additional information you would like to provide',
    validation: (value) => 
      value && value.length > 1000 ? 'Notes cannot exceed 1000 characters' : null
  }
};