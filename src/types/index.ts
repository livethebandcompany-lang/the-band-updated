export type Role = 'admin' | 'subadmin' | 'artist' | 'sales_executive';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  image?: string;
  createdAt: Date;
}

export interface IBooking {
  _id: string;
  // Basic Details
  clientName: string;
  clientPhone: string;
  clientAltPhone?: string;
  clientEmail?: string;
  clientInstagram?: string;
  companyName?: string;

  // Event Details
  eventType: 'wedding' | 'mehendi' | 'haldi' | 'sangeet' | 'cocktail_night' | 'wedding_ceremony' | 'reception' | 'after_party' | 'birthday' | 'anniversary' | 'house_party' | 'reunion_party' | 'baby_shower' | 'corporate' | 'annual_corporate' | 'team_offsite' | 'award_night' | 'product_launch' | 'bachelorette' | 'brunch' | 'private_party' | 'other';
  performanceType: 'solo' | 'duet' | 'trio' | '4piece' | 'full_band';
  eventDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;

  // Location
  venueName: string;
  city: string;
  fullAddress?: string;
  googleMapsLink?: string;
  stayRequired: boolean;

  // Financial
  quotedAmount: number;
  finalAmount: number;
  paymentStatus: 'not_paid' | 'partial' | 'paid';
  paymentMode?: 'upi' | 'bank' | 'cash' | 'cheque';
  paymentNotes?: string;

  // Lead Source
  source: 'instagram' | 'referral' | 'google' | 'wedding_planner' | 'repeat_client' | 'b2b_sv' | 'meta_ad' | 'google_ad' | 'b2b' | 'other';
  campaignName?: string;
  referralName?: string;
  salesPerson: 'neha' | 'samad' | 'team' | 'other';
  notes?: string;

  // System
  artistId?: string;
  artistIds?: string[];
  artist?: IUser;
  status: BookingStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteCode {
  _id: string;
  code: string;
  role: Role;
  allowedEmail: string;
  expiresAt: Date;
  isUsed: boolean;
  usedBy?: string;
  createdBy: string;
  createdAt: Date;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      isActive: boolean;
    };
  }
  interface User {
    id: string;
    role: Role;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    isActive: boolean;
  }
}
