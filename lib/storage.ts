// lib/storage.ts
import supabase from './supabaseClient'

export async function uploadFile(file: File, folder: string, fileName: string) {
  const { error } = await supabase.storage
    .from('dokumenter')
    .upload(`${folder}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage.from('dokumenter').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(path: string) {
  const { error } = await supabase.storage.from('dokumenter').remove([path])
  if (error) throw error
}
