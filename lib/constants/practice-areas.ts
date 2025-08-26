export const practiceAreas = [
  { value: 'criminal', label: 'Criminal Law' },
  { value: 'civil', label: 'Civil Litigation' },
  { value: 'family', label: 'Family Law' },
  { value: 'employment', label: 'Employment Law' },
  { value: 'property', label: 'Property Law' },
  { value: 'commercial', label: 'Commercial Law' },
  { value: 'immigration', label: 'Immigration Law' },
  { value: 'intellectual-property', label: 'Intellectual Property' },
  { value: 'tax', label: 'Tax Law' },
  { value: 'wills-estates', label: 'Wills & Estates' },
  { value: 'personal-injury', label: 'Personal Injury' },
  { value: 'consumer', label: 'Consumer Law' },
  { value: 'environmental', label: 'Environmental Law' },
  { value: 'human-rights', label: 'Human Rights Law' },
  { value: 'mediation', label: 'Mediation & Arbitration' }
] as const

export type PracticeArea = typeof practiceAreas[number]['value']