import { v4 as uuidv4 } from 'uuid';
import waterImg from '../assets/drinkingWater.jpg';
import streetLightImg from '../assets/streetLight2.jpg';
import roadImg from '../assets/pothole.jpg';
import repairedRoad from '../assets/repairedPothole.jpg';


export const COMPLAINT_CATEGORIES = [
  { id: 'water', label: 'Water', icon: 'Droplets', color: 'bg-blue-100 text-blue-600' },
  { id: 'electricity', label: 'Electricity / Light', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'drainage', label: 'Drainage', icon: 'Waves', color: 'bg-slate-100 text-slate-600' },
  { id: 'roads', label: 'Roads', icon: 'Map', color: 'bg-stone-100 text-stone-600' },
  { id: 'others', label: 'Others', icon: 'AlertCircle', color: 'bg-gray-100 text-gray-600' },
];

export const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
];

export const STATUS_TYPES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700' },
};

export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-1001',
    category: 'water',
    description: 'No drinking water supply since 3 days in the main street.',
    urgency: 'high',
    location: { lat: 28.6139, lng: 77.2090 },
    imageBefore: waterImg,
    imageAfter: null,
    status: 'pending',
    supportCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'CMP-1002',
    category: 'electricity',
    description: 'Street light broken near the temple.',
    urgency: 'medium',
    location: { lat: 28.6145, lng: 77.2100 },
    imageBefore: streetLightImg,
    imageAfter: null,
    status: 'in_progress',
    supportCount: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'CMP-1003',
    category: 'roads',
    description: 'Pothole on the main road to the market.',
    urgency: 'low',
    location: { lat: 28.6150, lng: 77.2085 },
    imageBefore: roadImg,
    imageAfter: repairedRoad,
    status: 'resolved',
    supportCount: 20,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];
