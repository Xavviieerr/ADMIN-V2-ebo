'use client'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Upload, Copy, Check, FileImage, FileAudio } from 'lucide-react'
import { useUploadImageMutation, useUploadAudioMutation } from '@/slice/requestSlice'
import LoadingSpinner from '../ui/LoadingSpinner'
import { toast } from 'sonner'
import { getErrorMessage } from "@/utils/errorHandler";

interface UploadModalProps {
  type: 'image' | 'audio'
  onUrlSelect: (url: string) => void
  children: React.ReactNode
  className?: string
}

interface ImageUploadResponse {
  thumbnail: string
  small: string
  medium: string
  large: string
  original: string
}

interface AudioUploadResponse {
  lowQuality: string
  mediumQuality: string
  highQuality: string
  original: string
}

type UploadResponse = ImageUploadResponse | AudioUploadResponse

export default function UploadModal({ type, onUrlSelect, children, className }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation()
  const [uploadAudio, { isLoading: isUploadingAudio }] = useUploadAudioMutation()

  const isUploading = isUploadingImage || isUploadingAudio

  // Supported mime types
  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
  const supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/mp4']

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (type === 'image') {
        if (!supportedImageTypes.includes(file.type)) {
          toast.error('Unsupported image type. Allowed: JPG, PNG, WEBP')
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }
      }
      if (type === 'audio') {
        // Check MIME type or file extension for m4a files (can have different MIME types)
        const fileExtension = file.name.toLowerCase().split('.').pop()
        const isValidMimeType = supportedAudioTypes.includes(file.type)
        const isValidExtension = fileExtension === 'm4a' && (file.type === 'audio/m4a' || file.type === 'audio/x-m4a' || file.type === 'audio/mp4' || !file.type)

        if (!isValidMimeType && !isValidExtension) {
          toast.error('Unsupported audio type. Allowed: MP3, WAV, WEBM, OGG, M4A')
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }
      }
      setSelectedFile(file)
      setUploadResponse(null)
      setCopiedUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const response = type === 'image'
        ? await uploadImage(selectedFile).unwrap()
        : await uploadAudio(selectedFile).unwrap()

      setUploadResponse(response)

      // Automatically populate the form with the correct URL based on type
      let urlToUse = ''
      if (type === 'image') {
        urlToUse = (response as ImageUploadResponse).medium
      } else {
        urlToUse = (response as AudioUploadResponse).mediumQuality
      }

      if (urlToUse) {
        onUrlSelect(urlToUse)
        // Close modal automatically after successful upload for images and audio
        setTimeout(() => {
          handleClose()
        }, 300) // Small delay to show success feedback
      }
    } catch (_error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Upload failed:', _error as any)
      toast.error(getErrorMessage(_error, 'Upload failed. Please try again.'))
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset state
    setSelectedFile(null)
    setUploadResponse(null)
    setCopiedUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = () => {
    return type === 'image' ? <FileImage className="h-8 w-8" /> : <FileAudio className="h-8 w-8" />
  }

  const getFileTypeLabel = () => {
    return type === 'image' ? 'Image' : 'Audio'
  }

  const getAcceptedTypes = () => {
    return type === 'image' ? '.jpg,.jpeg,.png,.webp' : '.mp3,.wav,.webm,.ogg,.m4a'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="text-white bg-[#1e1e1e] p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2 ">
            {getFileIcon()}
            Upload {getFileTypeLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept={getAcceptedTypes()}
                onChange={handleFileSelect}
                className="flex-1 bg-[#1e1e1e] border-white/10 text-white file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold  file:text-[#1e1e1e file:cursor-pointer cursor-pointer h-10 flex items-center"
              />
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              )}
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-300">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Upload Results */}
          {uploadResponse && (
            <div className="space-y-4 rounded-lg p-4 bg-[#2a2a2a]">
              <h3 className="text-lg font-semibold text-white">Upload Successful!</h3>
              <p className="text-sm text-gray-300">
                {type === 'image' ? 'Medium URL' : 'Medium Quality URL'} automatically selected:
              </p>

              <div className="bg-[#1e1e1e] border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">
                    {type === 'image' ? 'Medium' : 'Medium Quality'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const urlToCopy = type === 'image'
                        ? (uploadResponse as ImageUploadResponse).medium
                        : (uploadResponse as AudioUploadResponse).mediumQuality
                      handleCopyUrl(urlToCopy)
                    }}
                    className="h-8 px-2 border-white/20 text-white hover:bg-white/10"
                  >
                    {copiedUrl === (type === 'image'
                      ? (uploadResponse as ImageUploadResponse).medium
                      : (uploadResponse as AudioUploadResponse).mediumQuality) ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Input
                  value={type === 'image'
                    ? (uploadResponse as ImageUploadResponse).medium
                    : (uploadResponse as AudioUploadResponse).mediumQuality}
                  readOnly
                  className="text-xs font-mono bg-[#1a1a1a] border-white/10 text-gray-300"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleClose}
              className="hover:bg-[#F5DEB3]/90 bg-[#F5DEB3] text-[#1e1e1e] cursor-pointer"
            >
              Cancel
            </Button>
            {uploadResponse && (
              <Button
                onClick={handleClose}
                className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]"
              >
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
