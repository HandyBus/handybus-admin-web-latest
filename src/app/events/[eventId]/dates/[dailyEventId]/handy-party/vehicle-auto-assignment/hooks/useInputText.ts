import { useState } from 'react';

export const useInputText = () => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  return {
    inputText,
    handleInputChange,
  };
};
