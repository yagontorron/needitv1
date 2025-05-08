import { Message } from '@/types';

const mockMessages: Message[] = [
  // Conversation 1
  {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: '1',
    text: 'Hello, I saw your profile and I need a plumber for my leaking sink. Are you available?',
    createdAt: Date.now() - 86390000, // ~24 hours ago
    read: true
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    senderId: '2',
    text: 'Hi there! Yes, I can help with your leaking sink. Can you tell me more about the issue?',
    createdAt: Date.now() - 86380000,
    read: true
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    senderId: '1',
    text: 'It\'s under the kitchen sink. Water is dripping from the pipe connection. I tried tightening it but it didn\'t help.',
    createdAt: Date.now() - 86370000,
    read: true
  },
  {
    id: 'msg4',
    conversationId: 'conv1',
    senderId: '2',
    text: 'I can help with your sink. Are you available tomorrow?',
    createdAt: Date.now() - 3600000, // 1 hour ago
    read: false
  },

  // Conversation 2
  {
    id: 'msg5',
    conversationId: 'conv2',
    senderId: '3',
    text: 'Hi, I saw your post about needing a laptop for university.',
    createdAt: Date.now() - 172790000,
    read: true
  },
  {
    id: 'msg6',
    conversationId: 'conv2',
    senderId: '1',
    text: 'Yes, I\'m looking for something with good specs for programming classes.',
    createdAt: Date.now() - 172780000,
    read: true
  },
  {
    id: 'msg7',
    conversationId: 'conv2',
    senderId: '3',
    text: 'What\'s your budget?',
    createdAt: Date.now() - 172770000,
    read: true
  },
  {
    id: 'msg8',
    conversationId: 'conv2',
    senderId: '1',
    text: 'I have a laptop that might be perfect for you. It\'s an Dell XPS with 16GB RAM.',
    createdAt: Date.now() - 7200000, // 2 hours ago
    read: false
  },

  // Conversation 3
  {
    id: 'msg9',
    conversationId: 'conv3',
    senderId: '4',
    text: 'Hello, I need a math tutor for my daughter who\'s in high school.',
    createdAt: Date.now() - 259190000,
    read: true
  },
  {
    id: 'msg10',
    conversationId: 'conv3',
    senderId: '1',
    text: 'I\'m an experienced math tutor. Can we schedule a trial session?',
    createdAt: Date.now() - 10800000, // 3 hours ago
    read: false
  },

  // Conversation 4
  {
    id: 'msg11',
    conversationId: 'conv4',
    senderId: '1',
    text: 'Hi, I need help assembling some IKEA furniture. Are you available this weekend?',
    createdAt: Date.now() - 431990000,
    read: true
  },
  {
    id: 'msg12',
    conversationId: 'conv4',
    senderId: '5',
    text: 'I can help with the IKEA furniture. My rate is €20/hour.',
    createdAt: Date.now() - 14400000, // 4 hours ago
    read: false
  }
];

export default mockMessages;