import supabase from './supabaseClient'

export async function fullforOnboarding(userId: string) {
  const { error } = await supabase
    .from('brukerprofiler')
    .update({ onboarding_fullfort: true })
    .eq('id', userId)

  if (error) throw error
}
