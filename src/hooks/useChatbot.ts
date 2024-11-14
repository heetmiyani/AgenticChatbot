import { useState, useCallback } from 'react';
import { ChatMessage, FormData, FormField } from '../types';
import { formConfig } from '../config/formConfig';

const generateUniqueId = (() => {
  let counter = 0;
  return () => `${Date.now()}-${counter++}`;
})();

const FIELD_EXPLANATIONS: Record<string, string> = {
  fullName: "Your full legal name as it appears on official documents. What's your full name?",
  email: "Your primary email address for communications about your loan application. What's your email address?",
  creditScore: "A credit score is a number between 300-850 that depicts your creditworthiness. The higher your score, the better your chances of loan approval. What's your credit score?",
  loanAmount: "The loan amount is the total sum you'd like to borrow. We offer loans between $1,000 and $1,000,000. How much would you like to borrow?",
  monthlyIncome: "Monthly income is your total earnings per month before taxes. This helps us determine your loan repayment capacity. What's your monthly income?",
  collateral: "Collateral is an asset (like a house or car) that you pledge against your loan. It provides security to the lender. Do you have any assets to offer as collateral?",
  employmentStatus: "Employment status indicates your current work situation. Are you employed full-time, part-time, self-employed, or in a different situation?",
  loanPurpose: "The loan purpose helps us understand how you plan to use the funds. Common purposes include home purchase, business, education, or debt consolidation. What's your loan purpose?"
};

const LOAN_PURPOSES = [
  'home purchase', 'business', 'education', 'debt consolidation', 'personal', 'other'
];

export default function useChatbot(
  formData: FormData,
  updateForm: (field: FormField, value: any) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateUniqueId(),
      content: "Hello! I'm here to help you with your loan application. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [lastExplainedField, setLastExplainedField] = useState<string | null>(null);

  const addMessage = (content: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: generateUniqueId(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const extractNumber = (text: string): number | null => {
    const cleanText = text.replace(/[$,]/g, '');
    const match = cleanText.match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const extractEmail = (text: string): string | null => {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
  };

  const processMessage = useCallback((message: string) => {
    addMessage(message, 'user');
    const lowerMessage = message.toLowerCase();

    // Handle field explanations
    if (lowerMessage.includes('what is') || lowerMessage.includes('what\'s') || lowerMessage.includes('explain') || lowerMessage.includes('tell me about')) {
      for (const [field, explanation] of Object.entries(FIELD_EXPLANATIONS)) {
        if (lowerMessage.includes(field.toLowerCase()) || 
            lowerMessage.includes(field.replace(/([A-Z])/g, ' $1').toLowerCase())) {
          setLastExplainedField(field);
          addMessage(explanation, 'bot');
          return;
        }
      }
    }

    // Check for greetings
    if (/^(hi|hello|hey)/.test(lowerMessage)) {
      addMessage("Hello! How can I assist you with your loan application today? You can ask me about any field in the form or how to fill it out.", 'bot');
      return;
    }

    // Handle direct responses based on last explained field
    if (lastExplainedField) {
      switch (lastExplainedField) {
        case 'loanAmount':
          const amount = extractNumber(message);
          if (amount) {
            if (amount < 1000 || amount > 1000000) {
              addMessage(`The loan amount must be between $1,000 and $1,000,000. Please provide a different amount.`, 'bot');
              return;
            }
            updateForm('loanAmount', amount);
            addMessage(`I've set your loan amount to $${amount.toLocaleString()}. What's the purpose of this loan?`, 'bot');
            setLastExplainedField('loanPurpose');
            return;
          }
          break;

        case 'creditScore':
          const score = extractNumber(message);
          if (score) {
            if (score < 300 || score > 850) {
              addMessage(`Credit scores range from 300 to 850. Please provide a valid credit score.`, 'bot');
              return;
            }
            updateForm('creditScore', score);
            addMessage(`I've recorded your credit score of ${score}. Would you like to tell me about your monthly income?`, 'bot');
            setLastExplainedField('monthlyIncome');
            return;
          }
          break;

        case 'monthlyIncome':
          const income = extractNumber(message);
          if (income) {
            updateForm('monthlyIncome', income);
            addMessage(`Thank you for providing your monthly income of $${income.toLocaleString()}. What's your employment status?`, 'bot');
            setLastExplainedField('employmentStatus');
            return;
          }
          break;

        case 'fullName':
          if (message.length >= 2 && !message.includes('?')) {
            updateForm('fullName', message);
            addMessage(`Thank you, ${message}. What's your email address?`, 'bot');
            setLastExplainedField('email');
            return;
          }
          break;

        case 'email':
          const email = extractEmail(message);
          if (email) {
            updateForm('email', email);
            addMessage(`Thanks for providing your email. How much would you like to borrow?`, 'bot');
            setLastExplainedField('loanAmount');
            return;
          } else {
            addMessage(`That doesn't look like a valid email address. Please provide a valid email.`, 'bot');
            return;
          }
          break;

        case 'loanPurpose':
          const purpose = LOAN_PURPOSES.find(p => lowerMessage.includes(p));
          if (purpose) {
            updateForm('loanPurpose', purpose.charAt(0).toUpperCase() + purpose.slice(1));
            addMessage(`I've set your loan purpose to ${purpose}. What's your credit score?`, 'bot');
            setLastExplainedField('creditScore');
            return;
          }
          break;

        case 'employmentStatus':
          const statuses = {
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'self-employed': 'Self-employed',
            'unemployed': 'Unemployed',
            'retired': 'Retired'
          };

          for (const [key, value] of Object.entries(statuses)) {
            if (lowerMessage.includes(key)) {
              updateForm('employmentStatus', value);
              addMessage(`I've noted that you're ${value.toLowerCase()}. Do you have any collateral to offer?`, 'bot');
              setLastExplainedField('collateral');
              return;
            }
          }
          break;

        case 'collateral':
          if (lowerMessage.includes('yes') || lowerMessage.includes('have')) {
            updateForm('hasCollateral', true);
            addMessage("Great! What type of collateral are you offering? This could be property, vehicles, or other valuable assets.", 'bot');
            setLastExplainedField('collateralType');
            return;
          }
          if (lowerMessage.includes('no') || lowerMessage.includes("don't")) {
            updateForm('hasCollateral', false);
            addMessage("I understand you don't have collateral. Would you like to add any additional notes to your application?", 'bot');
            setLastExplainedField('additionalNotes');
            return;
          }
          break;

        case 'collateralType':
          if (message.length > 0 && !message.includes('?')) {
            updateForm('collateralType', message);
            addMessage("Thank you for providing your collateral information. Would you like to add any additional notes to your application?", 'bot');
            setLastExplainedField('additionalNotes');
            return;
          }
          break;

        case 'additionalNotes':
          if (message.length > 0 && !message.includes('?')) {
            updateForm('additionalNotes', message);
            addMessage("I've added your notes to the application. You can now review and submit your application using the form. Is there anything else you'd like to know?", 'bot');
            setLastExplainedField(null);
            return;
          }
          break;
      }
    }

    // Handle help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('confused')) {
      addMessage("I can help you with filling out the loan application. You can ask me about any field like:\n- Full Name\n- Email\n- Credit Score\n- Loan Amount\n- Monthly Income\n- Employment Status\n- Collateral\n- Loan Purpose\n\nWhat would you like to know about?", 'bot');
      return;
    }

    // Default response
    addMessage("I can help you with any part of the loan application. You can ask about specific fields like loan amount, credit score, employment, or collateral. What would you like to know?", 'bot');
  }, [messages, updateForm, lastExplainedField]);

  return {
    messages,
    processMessage,
  };
}