'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  title: string;
  type: 'symptom' | 'pathology' | 'product' | 'page';
  description?: string;
  url?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

const SearchBar = ({ 
  placeholder = "Rechercher un symptôme, une pathologie...", 
  onSearch,
  onSelect,
  className = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem('afriquadis-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Simulation de recherche (à remplacer par votre API)
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        // Simulation de résultats
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'Maux de tête',
            type: 'symptom',
            description: 'Douleur dans la région de la tête',
            url: '/diagnostic?symptom=maux-de-tete'
          },
          {
            id: '2',
            title: 'Kit Digestif AFRIQUADIS',
            type: 'product',
            description: 'Solution naturelle pour les troubles digestifs',
            url: '/products/kit-digestif'
          },
          {
            id: '3',
            title: 'Troubles digestifs',
            type: 'pathology',
            description: 'Pathologie affectant le système digestif',
            url: '/pathologies/troubles-digestifs'
          }
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(mockResults);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Ajouter à l'historique
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('afriquadis-recent-searches', JSON.stringify(newRecentSearches));
      
      onSearch?.(searchQuery);
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    onSelect?.(result);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('afriquadis-recent-searches');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'symptom': return '🩺';
      case 'pathology': return '📋';
      case 'product': return '🌿';
      case 'page': return '📄';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'symptom': return 'Symptôme';
      case 'pathology': return 'Pathologie';
      case 'product': return 'Produit';
      case 'page': return 'Page';
      default: return 'Résultat';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer la recherche"
            title="Effacer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto"
          >
            {/* Loading */}
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                Recherche en cours...
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  Résultats
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{getTypeIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{result.title}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading && query.length === 0 && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Recherches récentes
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Effacer
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length > 2 && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>Aucun résultat trouvé pour "{query}"</p>
                <p className="text-sm mt-1">Essayez avec d'autres mots-clés</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
