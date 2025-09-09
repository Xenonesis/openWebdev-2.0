'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    input?: number;
    output?: number;
  };
}

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({ value, onChange, className = '' }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const fetchModels = async (searchTerm = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/get-available-models?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setModels(data.models);
      } else {
        setError(data.error || 'Failed to fetch models');
      }
    } catch (err) {
      setError('Failed to fetch models');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== '') {
        fetchModels(search);
      } else if (isOpen) {
        fetchModels();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isOpen]);

  const selectedModel = models.find(model => model.id === value);
  const filteredModels = search 
    ? models.filter(model =>
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.id.toLowerCase().includes(search.toLowerCase()) ||
        model.provider.toLowerCase().includes(search.toLowerCase()) ||
        model.description?.toLowerCase().includes(search.toLowerCase())
      )
    : models;

  const handleModelSelect = (modelId: string) => {
    onChange(modelId);
    setIsOpen(false);
    setSearch('');
  };

  const formatContextLength = (length?: number) => {
    if (!length) return '';
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Model Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex-1 min-w-0">
          {selectedModel ? (
            <div>
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {selectedModel.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {selectedModel.provider}
                {selectedModel.contextLength && (
                  <span className="ml-2">• {formatContextLength(selectedModel.contextLength)} tokens</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Select a model...</div>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Models List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading models...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No models found
              </div>
            ) : (
              <div className="py-1">
                {/* Group models by provider */}
                {Object.entries(
                  filteredModels.reduce((groups, model) => {
                    const provider = model.provider;
                    if (!groups[provider]) groups[provider] = [];
                    groups[provider].push(model);
                    return groups;
                  }, {} as Record<string, ModelInfo[]>)
                ).map(([provider, providerModels]) => (
                  <div key={provider}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                      {provider}
                    </div>
                    {providerModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className="w-full px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 flex items-center justify-between group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {model.name}
                            </div>
                            {model.id === value && (
                              <Check className="w-4 h-4 text-orange-500 ml-2 flex-shrink-0" />
                            )}
                          </div>
                          {model.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {model.description}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {model.contextLength && (
                              <span>{formatContextLength(model.contextLength)} tokens</span>
                            )}
                            {model.pricing?.input && (
                              <span>${model.pricing.input}/1K tokens</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}