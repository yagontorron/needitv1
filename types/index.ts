export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  location?: string;
  bio?: string;
  createdAt: number;
}

export interface Need {
  id: string;
  userId: string;
  title: string;
  description: string;
  categoryId: string;
  price?: number;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'fulfilled' | 'closed';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  needId: string;
  members: string[];
  lastMessage?: {
    text: string;
    createdAt: number;
    senderId: string;
  };
  createdAt: number;
}