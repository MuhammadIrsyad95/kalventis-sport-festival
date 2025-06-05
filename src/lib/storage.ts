import { supabase } from './supabase/client'

/**
 * Extract file path from a Supabase public URL
 * Contoh: https://xyz.supabase.co/storage/v1/object/public/images/upload/filename.jpg
 * Hasil: images/upload/filename.jpg
 */
const extractFilePathFromPublicUrl = (
  publicUrl: string | null | undefined
): string | null => {
  if (!publicUrl) return null

  const parts = publicUrl.split('/storage/v1/object/public/')
  return parts.length > 1 ? parts[1] : null
}

/**
 * Delete image from Supabase storage by its public URL
 */
export async function deleteOldImage(
  publicUrl: string | null | undefined
): Promise<boolean> {
  const filePath = extractFilePathFromPublicUrl(publicUrl)
  if (!filePath) {
    console.log('⚠️ deleteOldImage: no valid file path found')
    return false
  }

  const { error } = await supabase.storage.from('images').remove([filePath])
  if (error) {
    console.error('❌ Error deleting image:', error)
    return false
  }
  // console.log('✅ Deleted image:', filePath)
  return true
}

/**
 * Upload image to folder "upload/" and delete old one if provided
 */
export async function uploadFile(
  file: File,
  bucket = 'images',
  oldFileUrl?: string,
  folder = 'upload' // Default folder
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    // console.log('⬅️ oldFileUrl for deletion:', oldFileUrl)

    if (oldFileUrl) {
      await deleteOldImage(oldFileUrl)
    }

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const cleanFolder = folder.replace(/^\/+|\/+$/g, '')
    const path = `${cleanFolder}/${filename}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file)
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    const cleanedUrl = data.publicUrl.replace(/([^:]\/)\/+/g, '$1')

    return { url: cleanedUrl, path }
  } catch (error) {
    console.error('❌ Upload error:', error)
    return { error: error instanceof Error ? error.message : 'Upload failed' }
  }
}
