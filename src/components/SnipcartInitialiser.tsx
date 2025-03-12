import { useEffect, useState } from 'react';

const SnipcartInitialiser = () => {
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    // Only initialize once
    if (isInitialised) {
      return;
    }

    // Check if Snipcart div already exists
    if (document.getElementById('snipcart')) {
      setIsInitialised(true);
      return;
    }

    // Set up Snipcart settings
    window.SnipcartSettings = {
      publicApiKey: import.meta.env.VITE_SNIPCART_API_KEY,
      loadStrategy: 'on-user-interaction',
      version: '3.0',
      addProductBehavior: 'none',
    };

    // Create Snipcart container
    const snipcartDiv = document.createElement('div');
    snipcartDiv.id = 'snipcart';
    snipcartDiv.setAttribute('hidden', 'true');
    document.body.appendChild(snipcartDiv);

    // Add Snipcart JS
    const script = document.createElement('script');
    script.src = 'https://cdn.snipcart.com/themes/v3.0/default/snipcart.js';
    script.async = true;
    document.head.appendChild(script);

    // Add Snipcart CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdn.snipcart.com/themes/v3.0/default/snipcart.css';
    document.head.appendChild(link);

    setIsInitialised(true);
  }, [isInitialised]);

  return null;
};

declare global {
  interface Window {
    SnipcartSettings: {
      publicApiKey: string;
      loadStrategy: string;
      version: string;
      timeoutDuration?: number;
      domain?: string;
      protocol?: string;
      addProductBehavior?: string;
      modalStyle?: string;
      currency?: string;
      templatesUrl?: string;
    };
  }
}

export default SnipcartInitialiser;
