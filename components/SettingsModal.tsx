'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { appConfig } from '@/config/app.config';
import { ModelSelector } from '@/components/ModelSelector';

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

interface AppSettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  sandboxTimeout: number;
  enableDebugLogging: boolean;
  autoRestartVite: boolean;
  useLegacyPeerDeps: boolean;
  theme: 'light' | 'dark' | 'system';
}

const envFields = [
  {
    key: 'E2B_API_KEY' as keyof EnvConfig,
    label: 'E2B API Key',
    description: 'Required for code execution sandboxes',
    placeholder: 'your_e2b_api_key_here',
    required: true,
    link: 'https://e2b.dev',
    category: 'Core Services'
  },
  {
    key: 'FIRECRAWL_API_KEY' as keyof EnvConfig,
    label: 'Firecrawl API Key',
    description: 'Required for web scraping and cloning websites',
    placeholder: 'your_firecrawl_api_key_here',
    required: true,
    link: 'https://firecrawl.dev',
    category: 'Core Services'
  },
  {
    key: 'ANTHROPIC_API_KEY' as keyof EnvConfig,
    label: 'Anthropic API Key',
    description: 'For Claude AI models',
    placeholder: 'your_anthropic_api_key_here',
    required: false,
    link: 'https://console.anthropic.com',
    category: 'AI Providers'
  },
  {
    key: 'OPENAI_API_KEY' as keyof EnvConfig,
    label: 'OpenAI API Key',
    description: 'For GPT models',
    placeholder: 'your_openai_api_key_here',
    required: false,
    link: 'https://platform.openai.com',
    category: 'AI Providers'
  },
  {
    key: 'GEMINI_API_KEY' as keyof EnvConfig,
    label: 'Gemini API Key',
    description: 'For Google Gemini models',
    placeholder: 'your_gemini_api_key_here',
    required: false,
    link: 'https://aistudio.google.com/app/apikey',
    category: 'AI Providers'
  },
  {
    key: 'GROQ_API_KEY' as keyof EnvConfig,
    label: 'Groq API Key',
    description: 'For Groq models',
    placeholder: 'your_groq_api_key_here',
    required: false,
    link: 'https://console.groq.com',
    category: 'AI Providers'
  },
  {
    key: 'OPENROUTER_API_KEY' as keyof EnvConfig,
    label: 'OpenRouter API Key',
    description: 'For OpenRouter models',
    placeholder: 'your_openrouter_api_key_here',
    required: false,
    link: 'https://openrouter.ai',
    category: 'AI Providers'
  }
];

const settingsSections = [
  {
    id: 'api-keys',
    title: 'API Keys',
    icon: '🔑',
    description: 'Configure your API keys for various services'
  },
  {
    id: 'ai-settings',
    title: 'AI Configuration',
    icon: '🤖',
    description: 'AI model and generation settings'
  },
  {
    id: 'sandbox',
    title: 'Sandbox',
    icon: '📦',
    description: 'Code execution and package management'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: '⚙️',
    description: 'General application preferences'
  }
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState('api-keys');
  const [config, setConfig] = useState<EnvConfig>({
    E2B_API_KEY: '',
    FIRECRAWL_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    OPENAI_API_KEY: '',
    GEMINI_API_KEY: '',
    GROQ_API_KEY: '',
    OPENROUTER_API_KEY: ''
  });
  const [appSettings, setAppSettings] = useState<AppSettings>({
    defaultModel: appConfig.ai.defaultModel,
    temperature: appConfig.ai.defaultTemperature,
    maxTokens: appConfig.ai.maxTokens,
    sandboxTimeout: appConfig.e2b.timeoutMinutes,
    enableDebugLogging: appConfig.dev.enableDebugLogging,
    autoRestartVite: appConfig.packages.autoRestartVite,
    useLegacyPeerDeps: appConfig.packages.useLegacyPeerDeps,
    theme: 'system'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load existing config from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedConfig = localStorage.getItem('openwebdev_env_config');
      const savedAppSettings = localStorage.getItem('openwebdev_app_settings');
      
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved config:', error);
        }
      }
      
      if (savedAppSettings) {
        try {
          const parsed = JSON.parse(savedAppSettings);
          setAppSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved app settings:', error);
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (key: keyof EnvConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  };

  const handleAppSettingChange = (key: keyof AppSettings, value: any) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save to localStorage
      localStorage.setItem('openwebdev_env_config', JSON.stringify(config));
      localStorage.setItem('openwebdev_app_settings', JSON.stringify(appSettings));
      
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

  const renderApiKeysSection = () => {
    const coreServices = envFields.filter(field => field.category === 'Core Services');
    const aiProviders = envFields.filter(field => field.category === 'AI Providers');

    return (
      <div className="space-y-8">
        {/* Core Services */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            Required Services
          </h3>
          <div className="space-y-4">
            {coreServices.map((field) => (
              <div key={field.key} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-red-50/30 dark:bg-red-900/20">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor={field.key} className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {field.label}
                    <span className="text-red-500 ml-1">*</span>
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
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Providers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">🔵</span>
            AI Providers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiProviders.map((field) => (
              <div key={field.key} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor={field.key} className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {field.label}
                  </Label>
                  <a
                    href={field.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Get Key
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
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAISettingsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="defaultModel" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
            Default AI Model
          </Label>
          <ModelSelector
            value={appSettings.defaultModel}
            onChange={(model) => handleAppSettingChange('defaultModel', model)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose your preferred AI model for code generation</p>
        </div>

        <div>
          <Label htmlFor="temperature" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
            Temperature: {appSettings.temperature}
          </Label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={appSettings.temperature}
            onChange={(e) => handleAppSettingChange('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Controls randomness in AI responses (0 = deterministic, 2 = very creative)</p>
        </div>

        <div>
          <Label htmlFor="maxTokens" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
            Max Tokens
          </Label>
          <Input
            id="maxTokens"
            type="number"
            min="1000"
            max="32000"
            value={appSettings.maxTokens}
            onChange={(e) => handleAppSettingChange('maxTokens', parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum tokens for AI responses</p>
        </div>
      </div>
    </div>
  );

  const renderSandboxSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sandboxTimeout" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
            Sandbox Timeout (minutes)
          </Label>
          <Input
            id="sandboxTimeout"
            type="number"
            min="5"
            max="60"
            value={appSettings.sandboxTimeout}
            onChange={(e) => handleAppSettingChange('sandboxTimeout', parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How long sandboxes stay active before timing out</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Auto-restart Vite</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automatically restart Vite after package installation</p>
            </div>
            <input
              type="checkbox"
              checked={appSettings.autoRestartVite}
              onChange={(e) => handleAppSettingChange('autoRestartVite', e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Use Legacy Peer Deps</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Use --legacy-peer-deps flag for npm install</p>
            </div>
            <input
              type="checkbox"
              checked={appSettings.useLegacyPeerDeps}
              onChange={(e) => handleAppSettingChange('useLegacyPeerDeps', e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
            Theme
          </Label>
          <select
            id="theme"
            value={appSettings.theme}
            onChange={(e) => handleAppSettingChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose your preferred theme</p>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Debug Logging</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enable detailed logging for troubleshooting</p>
          </div>
          <input
            type="checkbox"
            checked={appSettings.enableDebugLogging}
            onChange={(e) => handleAppSettingChange('enableDebugLogging', e.target.checked)}
            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal (flex column so footer stays fixed and content scrolls) */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure your API keys, AI models, and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{section.icon}</span>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content (scrollable) */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'api-keys' && renderApiKeysSection()}
            {activeSection === 'ai-settings' && renderAISettingsSection()}
            {activeSection === 'sandbox' && renderSandboxSection()}
            {activeSection === 'preferences' && renderPreferencesSection()}

            {/* Status Messages */}
            {saveStatus === 'success' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Settings saved successfully!
                </p>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Failed to save settings. Please try again.
                </p>
              </div>
            )}

            {!requiredFieldsFilled && activeSection === 'api-keys' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please fill in all required fields (marked with *)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
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
              variant="orange"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}