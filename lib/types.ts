export interface Profile {
  id: string
  full_name: string | null
  university: string | null
  department: string | null
  year_of_study: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type ResourceType = 'pdf' | 'notes' | 'video' | 'image' | 'link'

export interface Resource {
  id: string
  user_id: string
  title: string
  description: string | null
  resource_type: ResourceType
  subject: string | null
  course_code: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  external_link: string | null
  download_count: number
  view_count: number
  is_public: boolean
  tags: string[] | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface ResourceFormData {
  title: string
  description: string
  resource_type: ResourceType
  subject: string
  course_code: string
  external_link: string
  is_public: boolean
  tags: string[]
  file?: File
}
