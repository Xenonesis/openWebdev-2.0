'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EnvConfig {
  E2B_API_KEY: string;
  FIRECRAWL_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  GROQ_API_KEY: string;
  OPENROUTER_API_KEY: string;
}

const envFields = [
  {
    key: 'E2B_API_KEY' as keyof EnvConfig,
    label: 'E2B API Key',
    description: 'Required for code execution sandboxes',
    placeholder: 'your_e2b_api_key_here',
    required: true,
    link: 'https://e2b.dev'
  },
  {
    key: 'FIRECRAWL_API_KEY' as keyof EnvConfig,
    label: 'Firecrawl API Key',
    description: 'Required for web scraping and cloning websites',
    placeholder: 'your_firecrawl_api_key_here',
    required: true,
    link: 'https://firecrawl.dev'
  },
  {
    key: 'ANTHROPIC_API_KEY' as keyof EnvConfig,
    label: 'Anthropic API Key',
    description: 'Optional - For Claude AI models',
    placeholder: 'your_anthropic_api_key_here',
    required: false,
    link: 'https://console.anthropic.com'
  },
  {
    key: 'OPENAI_API_KEY' as keyof EnvConfig,
    label: 'OpenAI API Key',
    description: 'Optional - For GPT models',
    placeholder: 'your_openai_api_key_here',
    required: false,
    link: 'https://platform.openai.com'
  },
  {
    key: 'GEMINI_API_KEY' as keyof EnvConfig,
    label: 'Gemini API Key',
    description: 'Optional - For Google Gemini models',
    placeholder: 'your_gemini_api_key_here',
    required: false,
    link: 'https://aistudio.google.com/app/apikey'
  },
  {
    key: 'GROQ_API_KEY' as keyof EnvConfig,
    label: 'Groq API Key',
    description: 'Optional - For Groq models',
    placeholder: 'your_groq_api_key_here',
    required: false,
    link: 'https://console.groq.com'
  },
  {
    key: 'OPENROUTER_API_KEY' as keyof EnvConfig,
    label: 'OpenRouter API Key',
    description: 'Optional - For OpenRouter models',
    placeholder: 'your_openrouter_api_key_here',
    required: false,
    link: 'https://openrouter.ai'
  }
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [config, setConfig] = useState<EnvConfig>({
    E2B_API_KEY: '',
    FIRECRAWL_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    OPENAI_API_KEY: '',
    GEMINI_API_KEY: '',
    GROQ_API_KEY: '',
    OPENROUTER_API_KEY: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load existing config from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedConfig = localStorage.getItem('openwebdev_env_config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved config:', error);
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (key: keyof EnvConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save to localStorage
      localStorage.setItem('openwebdev_env_config', JSON.stringify(config));
      
      // Also try to update server-side env vars
      try {
        const response = await fetch('/api/update-env', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config) 
        });
        
        if (!response.ok) {
          console.warn('Server-side env update failed, but localStorage was updated');
        }
      } catch (serverError) {
        console.warn('Could not update server-side env vars:', serverError);
        // Continue anyway since localStorage was updated
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save config:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadEnv = () => {
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value || `your_${key.toLowerCase()}_here`}`)
      .join('\n');
    
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const requiredFieldsFilled = envFields
    .filter(field => field.required)
    .every(field => config[field.key].trim() !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Environment Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Configure your API keys and settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {envFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <a
                    href={field.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Get API Key
                  </a>
                </div>
                <Input
                  id={field.key}
                  type="password"
                  value={config[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">{field.description}</p>
              </div>
            ))}
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✓ Configuration saved successfully!</p>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">✗ Failed to save configuration. Please try again.</p>
            </div>
          )}

          {!requiredFieldsFilled && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">⚠ Please fill in all required fields (marked with *)</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={handleDownloadEnv}
            className="text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download .env
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[100px]"
            >
              {isSaving ? 'Saving...' : 'Save Config'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}