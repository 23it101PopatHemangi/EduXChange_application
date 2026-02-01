'use client'

import React from "react"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Upload, 
  FileText, 
  Video, 
  ImageIcon, 
  Link as LinkIcon, 
  StickyNote,
  X,
  Loader2,
  CheckCircle2,
  CloudUpload,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ResourceType } from '@/lib/types'

const resourceTypes: { value: ResourceType; label: string; icon: typeof FileText; description: string }[] = [
  { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Upload PDF files' },
  { value: 'notes', label: 'Notes', icon: ImageIcon, description: 'Written study notes' },
  { value: 'video', label: 'Video', icon: Video, description: 'Video content link' },
  { value: 'image', label: 'Image', icon: ImageIcon, description: 'Images and diagrams' },
  { value: 'link', label: 'External Link', icon: LinkIcon, description: 'External resource' },
]

export default function UploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [resourceType, setResourceType] = useState<ResourceType>('pdf')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

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

    if ((resourceType === 'video' || resourceType === 'link') && !externalLink.trim()) {
      toast.error('Please enter an external link')
      return
    }

    if ((resourceType === 'pdf' || resourceType === 'image') && !file) {
      toast.error('Please select a file to upload')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('You must be logged in')
        return
      }

      let fileUrl = null
      let fileName = null
      let fileSize = null
      let mimeType = null

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath)

        fileUrl = publicUrl
        fileName = file.name
        fileSize = file.size
        mimeType = file.type
      }

      // Create resource record
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          resource_type: resourceType,
          subject: subject.trim() || null,
          course_code: courseCode.trim() || null,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          mime_type: mimeType,
          external_link: externalLink.trim() || null,
          is_public: isPublic,
          tags: tags.length > 0 ? tags : null,
        })

      if (insertError) {
        throw insertError
      }

      toast.success('Resource uploaded successfully!')
      router.push('/dashboard/resources')
      router.refresh()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload resource')
    } finally {
      setIsLoading(false)
    }
  }

  const needsFile = resourceType === 'pdf' || resourceType === 'image'
  const needsLink = resourceType === 'video' || resourceType === 'link'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resource</h1>
        <p className="text-muted-foreground mt-1">
          Share your academic materials with the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resource Type Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Resource Type</CardTitle>
            <CardDescription>What type of resource are you sharing?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {resourceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setResourceType(type.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    resourceType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <type.icon className={`h-6 w-6 mb-2 ${
                    resourceType === type.value ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="font-medium text-sm">{type.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Provide details about your resource</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Data Structures"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this resource covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload or Link */}
        {needsFile && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Upload File</CardTitle>
              <CardDescription>
                {resourceType === 'pdf' ? 'Upload your PDF document' : 'Upload your image file'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border'
                } ${file ? 'bg-accent/10' : ''}`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CloudUpload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept={resourceType === 'pdf' ? '.pdf' : 'image/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                    />
                    <Button type="button" variant="secondary">
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {needsLink && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">External Link</CardTitle>
              <CardDescription>
                {resourceType === 'video' ? 'Enter the video URL (YouTube, Vimeo, etc.)' : 'Enter the external resource URL'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="externalLink">URL *</Label>
                <Input
                  id="externalLink"
                  type="url"
                  placeholder="https://"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  disabled={isLoading}
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
                disabled={isLoading || tags.length >= 5}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addTag}
                disabled={isLoading || tags.length >= 5 || !tagInput.trim()}
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
                disabled={isLoading}
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
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none sm:min-w-[200px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
