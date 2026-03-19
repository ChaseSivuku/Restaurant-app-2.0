import { supabase } from '@/lib/supabase';
import { User } from '@/store/slices/authSlice';

export const authService = {
  async signUp(email: string, password: string, userData: {
    name: string;
    surname: string;
    contactNumber: string;
    address: string;
    cardDetails?: any;
  }) {
    const cardDetails = userData.cardDetails || {};
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      // Store profile fields in auth metadata so the DB can create the profile
      // via a trigger even when client-side inserts are blocked by RLS.
      options: {
        data: {
          name: userData.name,
          surname: userData.surname,
          contact_number: userData.contactNumber,
          address: userData.address,
          card_last4: cardDetails.last4 || null,
          card_type: cardDetails.type || null,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // If email confirmations are enabled, signUp may not create a session immediately.
    // In that case a client-side insert will run as `anon` and fail under RLS.
    const { data: sessionData } = await supabase.auth.getSession();
    const hasSession = Boolean(sessionData?.session?.user);

    if (hasSession) {
      // Create user profile (works if your RLS policies allow it).
      // If you also have a DB trigger to create the profile, this insert can be redundant.
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          name: userData.name,
          surname: userData.surname,
          contact_number: userData.contactNumber,
          address: userData.address,
          card_last4: cardDetails.last4 || null,
          card_type: cardDetails.type || null,
        });

      // If RLS blocks the insert, the DB must be updated with a policy/trigger.
      if (profileError) {
        const msg = String((profileError as any)?.message || profileError);
        if (msg.toLowerCase().includes('row-level security')) {
          throw new Error(
            'Registration created the auth user, but database security blocked creating the profile. ' +
            'Add an INSERT RLS policy (and optionally an auth.users trigger) for the profiles table.'
          );
        }
        throw profileError;
      }
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;

    return {
      uid: profile.id,
      name: profile.name,
      surname: profile.surname,
      email: profile.email,
      contactNumber: profile.contact_number || '',
      address: profile.address || '',
      cardDetails: {
        last4: profile.card_last4,
        type: profile.card_type,
      },
    };
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.surname) updateData.surname = updates.surname;
    if (updates.email) updateData.email = updates.email;
    if (updates.contactNumber) updateData.contact_number = updates.contactNumber;
    if (updates.address) updateData.address = updates.address;
    
    if (updates.cardDetails) {
      updateData.card_last4 = updates.cardDetails.last4 || null;
      updateData.card_type = updates.cardDetails.type || null;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const user = await this.getCurrentUser();
          callback(user);
        } catch (error) {
          console.error('Error getting user on auth change:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};

