'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

const AVAILABLE_LANGUAGES = [
  'English',
  'Te Reo Māori',
  'Hindi',
  'Chinese (Mandarin)',
  'Chinese (Cantonese)',
  'Korean',
  'Samoan',
  'Tongan',
  'French',
  'German',
  'Japanese',
  'Spanish',
  'Punjabi',
  'Tagalog',
  'Afrikaans',
  'Arabic',
  'Dutch',
  'Italian',
  'Russian',
  'Sign Language (NZSL)',
]

interface LanguageSelectorProps {
  defaultLanguages?: string[]
  name?: string
}

export default function LanguageSelector({ 
  defaultLanguages = ['English'],
  name = 'languages'
}: LanguageSelectorProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(defaultLanguages)
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (value: string) => {
    setInputValue(value)
    
    if (value.trim()) {
      // Filter languages that match input and aren't already selected
      const filtered = AVAILABLE_LANGUAGES.filter(
        lang => 
          lang.toLowerCase().includes(value.toLowerCase()) &&
          !selectedLanguages.includes(lang)
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language])
    }
    setInputValue('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== language))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // If there are suggestions, add the first one
      if (suggestions.length > 0) {
        addLanguage(suggestions[0])
      } else if (inputValue.trim()) {
        // Allow custom language entry if no suggestions
        addLanguage(inputValue.trim())
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-3 min-h-[42px] border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {selectedLanguages.map((language) => (
            <div
              key={language}
              className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1 text-sm"
            >
              <span>{language}</span>
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${language}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="flex-grow bg-transparent border-0 outline-none placeholder:text-muted-foreground min-w-[120px]"
            placeholder={selectedLanguages.length === 0 ? "Select languages..." : "Add another..."}
          />
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => addLanguage(language)}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                {language}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Hidden inputs for form submission */}
      {selectedLanguages.map((language, index) => (
        <input
          key={`${language}-${index}`}
          type="hidden"
          name={name}
          value={language}
        />
      ))}
    </div>
  )
}