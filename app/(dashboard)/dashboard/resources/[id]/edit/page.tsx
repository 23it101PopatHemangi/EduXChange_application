'use client'

import React from "react"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  X, 
  Loader2, 
  Save,
  FileText, 
  Video, 
  ImageIcon, 
  Link as LinkIcon, 
  StickyNote,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Resource, ResourceType } from '@/lib/types'

const resourceTypeIcons = {
  pdf: FileText,
  notes: StickyNote,
  video: Video,
  image: ImageIcon,
  link: LinkIcon,
}

interface EditResourcePageProps {
  params: Promise<{ id: string }>
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [resource, setResource] = useState<Resource | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const fetchResource = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        toast.error('Resource not found')
        router.push('/dashboard/resources')
        return
      }

      setResource(data)
      setTitle(data.title)
      setDescription(data.description || '')
      setSubject(data.subject || '')
      setCourseCode(data.course_code || '')
      setExternalLink(data.external_link || '')
      setIsPublic(data.is_public)
      setTags(data.tags || [])
      setIsLoading(false)
    }

    fetchResource()
  }, [id, router])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('resources')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          subject: subject.trim() || null,
          course_code: courseCode.trim() || null,
          external_link: externalLink.trim() || null,
          is_public: isPublic,
          tags: tags.length > 0 ? tags : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Resource updated successfully!')
      router.push(`/dashboard/resources/${id}`)
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update resource')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!resource) return null

  const Icon = resourceTypeIcons[resource.resource_type as ResourceType] || FileText

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="gap-2 -ml-2">
        <Link href={`/dashboard/resources/${id}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to Resource
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
        <p className="text-muted-foreground mt-1">
          Update your resource information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resource Type (Read-only) */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Resource Type</CardTitle>
            <CardDescription>Resource type cannot be changed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <Icon className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium capitalize">{resource.resource_type}</span>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Update details about your resource</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Data Structures"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this resource covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Computer Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Link (if applicable) */}
        {(resource.resource_type === 'video' || resource.resource_type === 'link') && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">External Link</CardTitle>
              <CardDescription>Update the resource URL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="externalLink">URL</Label>
                <Input
                  id="externalLink"
                  type="url"
                  placeholder="https://"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
            <CardDescription>Add up to 5 tags to help others find your resource</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                disabled={isSaving || tags.length >= 5}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addTag}
                disabled={isSaving || tags.length >= 5 || !tagInput.trim()}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Resource</p>
                <p className="text-sm text-muted-foreground">
                  Make this resource visible to everyone
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="flex-1 sm:flex-none sm:min-w-[200px]">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
