import React, { useState } from 'react';
import { FormData, FormField } from './types';
import { formConfig } from './config/formConfig';
import LoanForm from './components/LoanForm';
import ChatInterface from './components/ChatInterface';
import useChatbot from './hooks/useChatbot';

const initialFormData: FormData = {
  fullName: '',
  email: '',
  loanAmount: 0,
  loanPurpose: '',
  employmentStatus: '',
  monthlyIncome: 0,
  creditScore: 0,
  hasCollateral: false,
  collateralType: '',
  additionalNotes: '',
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  const updateForm = (field: FormField, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validate the field
    const config = formConfig[field];
    if (config.validation) {
      const error = config.validation(value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const { messages, processMessage } = useChatbot(formData, updateForm);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            <LoanForm
              formData={formData}
              onChange={updateForm}
              errors={errors}
            />
          </div>

          {/* Right side - Chat Interface */}
          <div className="h-[calc(100vh-4rem)]">
            <ChatInterface
              messages={messages}
              onSendMessage={processMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;