import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from('resources')
    .upload(`uploads/${file.name}`, file);

  if (error) {
    console.error('Error uploading file:', error.message);
    return { success: false, error: error.message };
  } else {
    console.log('File uploaded successfully:', data);
    return { success: true, data };
  }
}
