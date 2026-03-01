import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase dashboard: https://app.supabase.com
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Ad settings type
export type AdSettings = {
  id: string
  enabled: boolean
  countdown: number
  header_ad: string
  download_ad: string
  verification_code: string
  updated_at: string
}

// Get ad settings from Supabase (public read)
export async function getAdSettings(): Promise<AdSettings | null> {
  const { data, error } = await supabase
    .from('ad_settings')
    .select('*')
    .eq('id', 'default')
    .single()
  
  if (error) {
    console.error('Error fetching ad settings:', error)
    return null
  }
  
  return data
}

// Update ad settings in Supabase (requires admin)
export async function updateAdSettings(settings: Partial<AdSettings>) {
  const { data, error } = await supabase
    .from('ad_settings')
    .upsert({ 
      id: 'default',
      ...settings,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    console.error('Error updating ad settings:', error)
    return false
  }
  
  return true
}

// Admin login
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true, user: data.user }
}

// Admin logout
export async function adminLogout() {
  await supabase.auth.signOut()
}

// Check if current user is admin
// Uses a secure function that bypasses RLS for self-check
export async function isAdmin(): Promise<boolean> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('No user logged in')
      return false
    }
    
    console.log('Checking admin status for user:', user.id)
    
    // Call the secure function to check admin status
    // This bypasses RLS because it's a SECURITY DEFINER function
    const { data, error } = await supabase
      .rpc('check_is_admin', { user_uuid: user.id })
    
    if (error) {
      console.error('Error checking admin status:', error)
      // Fallback: try direct query (may fail due to RLS)
      return await checkAdminFallback(user.id)
    }
    
    console.log('Admin check result:', data)
    return data === true
  } catch (err) {
    console.error('Exception in isAdmin:', err)
    return false
  }
}

// Fallback method to check admin status
async function checkAdminFallback(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle()
    
    if (error) {
      console.error('Fallback admin check failed:', error)
      return false
    }
    
    return data !== null
  } catch (err) {
    console.error('Fallback check exception:', err)
    return false
  }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
