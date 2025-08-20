'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Input } from '@/components/ui/input'

interface LocationAutocompleteProps {
  placeholder?: string
  onLocationSelect?: (location: string) => void
  name?: string
  id?: string
}

export default function LocationAutocomplete({ 
  placeholder = "e.g., Remuera, Auckland",
  onLocationSelect,
  name = "location",
  id = "location"
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ['places']
    })

    loader.load().then(() => {
      if (inputRef.current && window.google) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          inputRef.current, 
          {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'nz' },
            fields: ['address_components', 'name']
          }
        )

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace()
          if (place && place.address_components) {
            // Extract suburb and city from address components
            let suburb = ''
            let city = ''
            
            place.address_components.forEach((component: any) => {
              if (component.types.includes('sublocality') || 
                  component.types.includes('sublocality_level_1') ||
                  component.types.includes('neighborhood')) {
                suburb = component.long_name
              }
              if (component.types.includes('locality')) {
                city = component.long_name
              }
            })
            
            // Format as "Suburb, City" or just "City" if no suburb
            const formattedLocation = suburb ? `${suburb}, ${city}` : city
            setValue(formattedLocation)
            
            if (inputRef.current) {
              inputRef.current.value = formattedLocation
            }
            
            if (onLocationSelect) {
              onLocationSelect(formattedLocation)
            }
          }
        })
      }
    }).catch(err => {
      console.error('Error loading Google Maps:', err)
    })
  }, [])

  return (
    <Input
      ref={inputRef}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
      autoComplete="off"
    />
  )
}