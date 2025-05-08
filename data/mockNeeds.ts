import { Need } from '@/types';

const mockNeeds: Need[] = [
  {
    id: 'need1',
    userId: '1',
    title: 'Need a plumber for leaking sink',
    description: 'I have a leaking sink in my kitchen that needs urgent repair. Available evenings after 6pm.',
    categoryId: 'services',
    price: 50,
    location: {
      name: 'Madrid, Spain',
      latitude: 40.4168,
      longitude: -3.7038
    },
    images: [
      'https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000,
    status: 'active'
  },
  {
    id: 'need2',
    userId: '2',
    title: 'Looking for a second-hand laptop',
    description: 'I need a laptop for university, preferably with at least 8GB RAM and an i5 processor or higher. Budget around €500. Can meet in the city center.',
    categoryId: 'electronics',
    price: 500,
    location: {
      name: 'Barcelona, Spain',
      latitude: 41.3851,
      longitude: 2.1734
    },
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 172800000,
    status: 'active'
  },
  {
    id: 'need3',
    userId: '3',
    title: 'Math tutor needed for high school student',
    description: 'Looking for a math tutor to help my daughter with algebra and calculus. Needs to be available twice a week for 1-hour sessions.',
    categoryId: 'education',
    price: 25,
    location: {
      name: 'Valencia, Spain',
      latitude: 39.4699,
      longitude: -0.3763
    },
    images: [
      'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 259200000, // 3 days ago
    updatedAt: Date.now() - 259200000,
    status: 'active'
  },
  {
    id: 'need4',
    userId: '4',
    title: 'Need a ride to airport next Friday',
    description: 'I need a ride to Madrid-Barajas Airport on Friday at 6am. I have 2 suitcases. Will pay for gas and your time.',
    categoryId: 'transportation',
    price: 30,
    location: {
      name: 'Madrid, Spain',
      latitude: 40.4168,
      longitude: -3.7038
    },
    images: [
      'https://images.pexels.com/photos/2993059/pexels-photo-2993059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 345600000, // 4 days ago
    updatedAt: Date.now() - 345600000,
    status: 'active'
  },
  {
    id: 'need5',
    userId: '5',
    title: 'Looking for a photographer for birthday party',
    description: 'Need a photographer for my daughter\'s 5th birthday party. The event is next Saturday from 2pm to 6pm. Need someone experienced with children events.',
    categoryId: 'services',
    price: 150,
    location: {
      name: 'Seville, Spain',
      latitude: 37.3891,
      longitude: -5.9845
    },
    images: [
      'https://images.pexels.com/photos/3405530/pexels-photo-3405530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 432000000, // 5 days ago
    updatedAt: Date.now() - 432000000,
    status: 'active'
  },
  {
    id: 'need6',
    userId: '1',
    title: 'Need someone to assemble IKEA furniture',
    description: 'I have several IKEA pieces (bed frame, wardrobe, desk) that need assembly. Should take about 3-4 hours total.',
    categoryId: 'services',
    price: 80,
    location: {
      name: 'Madrid, Spain',
      latitude: 40.4168,
      longitude: -3.7038
    },
    images: [
      'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    createdAt: Date.now() - 518400000, // 6 days ago
    updatedAt: Date.now() - 518400000,
    status: 'active'
  }
];

export default mockNeeds;