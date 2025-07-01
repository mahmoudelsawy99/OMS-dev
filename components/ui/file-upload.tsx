"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Trash2, FileText, FileImage, Film } from "lucide-react"
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"

interface FileUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
  title?: string
  description?: string
  maxSize?: number // in MB
  allowedTypes?: string[]
  multiple?: boolean
}

interface UploadingFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export function FileUpload({
  isOpen,
  onClose,
  onUpload,
  title = "Upload files",
  description = "Select and upload the files of your choice",
  maxSize = 50,
  allowedTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4"],
  multiple = true,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-500" />
    if (type.startsWith("video/")) return <Film className="h-5 w-5 text-purple-500" />
    return <FileText className="h-5 w-5 text-red-500" />
  }

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isValidType = allowedTypes.includes(file.type)
      const isValidSize = file.size <= maxSize * 1024 * 1024 // Convert MB to bytes
      return isValidType && isValidSize
    })

    const newUploadingFiles = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

    // Simulate upload progress
    newUploadingFiles.forEach((uploadingFile) => {
      simulateUpload(uploadingFile)
    })
  }

  const simulateUpload = (uploadingFile: UploadingFile) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === uploadingFile.file
            ? {
                ...f,
                progress,
                status: progress === 100 ? "completed" : "uploading",
              }
            : f,
        ),
      )

      if (progress === 100) {
        clearInterval(interval)
        // Call onUpload when all files are completed
        const allCompleted = uploadingFiles.every((f) => f.status === "completed")
        if (allCompleted) {
          onUpload(uploadingFiles.map((f) => f.file))
        }
      }
    }, 300)
  }

  const removeFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div
          className="border-2 border-dashed rounded-lg p-8 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple={multiple}
            accept={allowedTypes.join(",")}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-muted-foreground">Choose a file or drag & drop it here.</p>
          <p className="text-xs text-muted-foreground mt-1">
            {allowedTypes.map((type) => type.split("/")[1].toUpperCase()).join(", ")} formats, up to {maxSize} MB.
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
            Browse File
          </Button>
        </div>

        {uploadingFiles.length > 0 && (
          <div className="space-y-2">
            {uploadingFiles.map(({ file, progress, status }) => (
              <div key={file.name} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(file.size / 1024)} KB • {status === "completed" ? "Completed" : "Uploading..."}
                    </p>
                  </div>
                </div>
                {status === "completed" ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(file)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                ) : (
                  <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
