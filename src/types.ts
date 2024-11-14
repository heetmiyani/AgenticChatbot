export interface FormData {
  fullName: string;
  email: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  creditScore: number;
  hasCollateral: boolean;
  collateralType?: string;
  additionalNotes: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export type FormField = keyof FormData;

export interface FieldConfig {
  label: string;
  type: string;
  required: boolean;
  dependsOn?: {
    field: FormField;
    value: any;
  };
  validation?: (value: any) => string | null;
  helpText: string;
}