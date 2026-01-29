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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const cardDetails = userData.cardDetails || {};
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

    if (profileError) throw profileError;

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

