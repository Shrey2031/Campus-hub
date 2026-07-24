import { Home, BookOpen, MessageCircle, Bot, Upload, User, Settings } from 'lucide-react';


export const primaryNavItems = [
  { icon: Home, label: 'Feed', path: '/', activePath: '/' },
  { icon: BookOpen, label: 'Resources', path: '/resources', activePath: '/resources' },
  { icon: MessageCircle, label: 'Discussions', path: '/discussions', activePath: '/discussions' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-chat', activePath: '/ai-chat' },
  { icon: Upload, label: 'Upload', path: '/upload-page', activePath: '/upload-page' },
];

export const accountNavItems = [
  { icon: User, label: 'Profile', path: '/profile', activePath: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings', activePath: '/settings' },
];


export const menuItems = [...primaryNavItems, ...accountNavItems];