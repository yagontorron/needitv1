import { Conversation } from '@/types';

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    needId: 'need1',
    members: ['1', '2'],
    lastMessage: {
      text: 'I can help with your sink. Are you available tomorrow?',
      createdAt: Date.now() - 3600000, // 1 hour ago
      senderId: '2'
    },
    createdAt: Date.now() - 86400000 // 1 day ago
  },
  {
    id: 'conv2',
    needId: 'need2',
    members: ['1', '3'],
    lastMessage: {
      text: 'I have a laptop that might be perfect for you. It\'s an Dell XPS with 16GB RAM.',
      createdAt: Date.now() - 7200000, // 2 hours ago
      senderId: '1'
    },
    createdAt: Date.now() - 172800000 // 2 days ago
  },
  {
    id: 'conv3',
    needId: 'need3',
    members: ['1', '4'],
    lastMessage: {
      text: 'I\'m an experienced math tutor. Can we schedule a trial session?',
      createdAt: Date.now() - 10800000, // 3 hours ago
      senderId: '1'
    },
    createdAt: Date.now() - 259200000 // 3 days ago
  },
  {
    id: 'conv4',
    needId: 'need6',
    members: ['1', '5'],
    lastMessage: {
      text: 'I can help with the IKEA furniture. My rate is €20/hour.',
      createdAt: Date.now() - 14400000, // 4 hours ago
      senderId: '5'
    },
    createdAt: Date.now() - 432000000 // 5 days ago
  }
];

export default mockConversations;