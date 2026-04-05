// Static stats only — all other data comes from MongoDB via API
export const stats = [
  { value: 50,  label: 'Projects Completed', suffix: '+' },
  { value: 20,  label: 'Happy Clients',       suffix: '+' },
  { value: 3,   label: 'Years Experience',    suffix: '+' },
  { value: 1,   label: 'Million Views',       suffix: 'M+' },
]

// Shared types
export interface Project {
  _id: string
  title: string
  description: string
  category: string
  thumbnail: string
  videoUrl: string
  tools: string[]
  result: string
  featured: boolean
}

export interface Service {
  _id: string
  title: string
  description: string
  icon: string
  order: number
}

export interface Testimonial {
  _id: string
  name: string
  role: string
  photo: string
  review: string
  rating: number
}

export interface Skill {
  _id: string
  name: string
  logo: string
  color: string
  category: string
  order: number
}
