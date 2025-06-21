
import React from 'react';
import { AudioContent, SubscriptionPlan, SubscriptionTier, User, Playlist, ChatMessage, Reminder } from './types';

export const APP_NAME = "Blissful";

export const DEFAULT_THEME = 'dark';

// SVG Icons (Heroicons v2 - MIT License)
export const LogoSymbol = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" className="stroke-current text-indigo-500 dark:text-indigo-400" strokeWidth="4"/>
    <path d="M30 60C30 45 40 35 50 35C60 35 70 45 70 60C70 70 60 80 50 80C40 70 30 70 30 60Z" className="fill-current text-indigo-500 dark:text-indigo-400 opacity-50"/>
    <path d="M50 20C50 20 55 30 65 30C75 30 75 20 75 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 dark:text-pink-400"/>
    <path d="M50 20C50 20 45 30 35 30C25 30 25 20 25 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 dark:text-sky-400"/>
  </svg>
);


export const HomeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const Squares2X2Icon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Explore
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export const MagnifyingGlassIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Search
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const BookmarkSquareIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Library
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

export const UserCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Profile
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const PlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.279 20.001c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

export const PauseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const HeartIconOutline = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const HeartIconSolid = ({ className = "w-6 h-6 text-red-500" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.645 20.91a.75.75 0 01-1.29 0C8.603 18.737 5.508 16.311 4.362 14.372c-1.148-1.94-1.362-3.808-1.362-5.463 0-1.657.945-3.033 2.25-3.033 1.118 0 2.08.643 2.569 1.488A5.253 5.253 0 0112 5.25c.981 0 1.883.292 2.569.762.49-.845 1.451-1.488 2.569-1.488 1.305 0 2.25 1.376 2.25 3.033 0 1.655-.214 3.523-1.362 5.463-1.146 1.939-4.239 4.365-6.002 6.208z" />
  </svg>
);

export const PlusIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const BellIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

export const TvIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( // Cast
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75V3.75m3.75 0A2.25 2.25 0 0112 1.5h0A2.25 2.25 0 0114.25 3.75v12.75m0 0A2.25 2.25 0 0012 18.75h0A2.25 2.25 0 009.75 16.5M6 20.25H3.75A2.25 2.25 0 011.5 18V6A2.25 2.25 0 013.75 3.75h16.5A2.25 2.25 0 0122.5 6v12A2.25 2.25 0 0120.25 18H18" />
  </svg>
);

export const SpeakerWaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const SpeakerXMarkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0L17.25 14.25M19.5 12h-7.5M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const ChevronRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export const SunIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25V15a2.25 2.25 0 002.25 2.25h.008c1.241 0 2.242-1.002 2.242-2.25v-.75A2.25 2.25 0 0012 12h-.008zM12 6.75A5.25 5.25 0 0117.25 12c0 2.213-1.34 4.098-3.257 4.883a.75.75 0 01-.84-1.325 3.75 3.75 0 00-.317-5.454.75.75 0 011.106-1.018A5.192 5.192 0 0117.25 12 5.25 5.25 0 0112 6.75z" />
  </svg>
);


export const MoonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SparklesIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624L16.5 21.75l-.398-1.126a3.375 3.375 0 00-2.456-2.456L12.525 18l1.126-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.126a3.375 3.375 0 002.456 2.456L20.475 18l-1.126.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

export const ShareIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.383.052.571.081M7.217 10.907v1.159c0 .59.178 1.15.49 1.638M14.25 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 4.5c-.195-.025-.383-.052-.571-.081m5.429-2.186a2.25 2.25 0 100-2.186m0 2.186c.195-.025.383-.052.571-.081M14.828 15H12A2.25 2.25 0 019.75 12.75V9M14.25 7.5c.39 0 .769.055 1.125.15M14.828 15c.39 0 .769-.055 1.125-.15m-5.429-2.186c.39-.095.735-.224 1.057-.382m2.316-.957c.39-.095.735-.224 1.057-.382m0 0a2.25 2.25 0 003.018-3.018m-3.018 3.018c.322.158.667.287 1.057.382M7.217 10.907a2.25 2.25 0 00-3.018 3.018m3.018-3.018c-.322.158-.667.287-1.057.382" />
    </svg>
);

export const XMarkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// Mock Data
export const MOCK_USER: User = {
  id: 'user123',
  fullName: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  mobileNumber: '+1 555-123-4567',
  address: '123 Bliss St, Serenity City, CA 90210'
};

export const MOCK_AUDIO_FILES: AudioContent[] = [
  { id: 'audio001', title: 'Morning Dew Meditation', artist: 'Serene Voices', duration: '15:30', coverArtUrl: 'https://picsum.photos/seed/audio1/400/400', category: 'Stress Relief', audioUrl: '#', isFavorite: true },
  { id: 'audio002', title: 'Deep Sleep Waves', artist: 'Calm Collective', duration: '45:10', coverArtUrl: 'https://picsum.photos/seed/audio2/400/400', category: 'Sleep', audioUrl: '#' },
  { id: 'audio003', title: 'Focus Flow Beta', artist: 'MindSharp', duration: '30:00', coverArtUrl: 'https://picsum.photos/seed/audio3/400/400', category: 'Focus', audioUrl: '#' },
  { id: 'audio004', title: 'Anxiety Release Ambient', artist: 'Peaceful Mind', duration: '22:00', coverArtUrl: 'https://picsum.photos/seed/audio4/400/400', category: 'Stress Relief', audioUrl: '#' },
  { id: 'audio005', title: 'Ocean Dreams Lullaby', artist: 'Nature Sounds', duration: '60:00', coverArtUrl: 'https://picsum.photos/seed/audio5/400/400', category: 'Sleep', audioUrl: '#', isFavorite: true },
  { id: 'audio006', title: 'Energizing Morning Mix', artist: 'Uplift Beats', duration: '10:00', coverArtUrl: 'https://picsum.photos/seed/audio6/400/400', category: 'Energy', audioUrl: '#' },
  { id: 'audio007', title: 'Kid\'s Bedtime Story: The Magical Forest', artist: 'Story Teller', duration: '12:15', coverArtUrl: 'https://picsum.photos/seed/kids1/400/400', category: 'Kids Bedtime', audioUrl: '#' },
  { id: 'audio008', title: 'Kid\'s Calming Music: Gentle Clouds', artist: 'Childhood Melodies', duration: '20:00', coverArtUrl: 'https://picsum.photos/seed/kids2/400/400', category: 'Kids Calming', audioUrl: '#' },
];

export const MOCK_CATEGORIES = ['All', 'Stress Relief', 'Sleep', 'Focus', 'Energy', 'Meditation', 'Kids Bedtime', 'Kids Calming'];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'pl1', name: 'Morning Routine', audioIds: ['audio001', 'audio006'], coverArtUrl: 'https://picsum.photos/seed/playlist1/200/200' },
  { id: 'pl2', name: 'Bedtime Sounds', audioIds: ['audio002', 'audio005'], coverArtUrl: 'https://picsum.photos/seed/playlist2/200/200' },
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { tier: SubscriptionTier.Daily, price: "$0.99", description: "Access for 24 hours." },
  { tier: SubscriptionTier.Weekly, price: "$4.99", description: "7 days of full access." },
  { tier: SubscriptionTier.Monthly, price: "$12.99", description: "Unlock everything for a month.", isPopular: true },
  { tier: SubscriptionTier.Quarterly, price: "$29.99", description: "3 months of blissful content." },
  { tier: SubscriptionTier.Yearly, price: "$99.99", description: "Best value for a full year.", isBestValue: true },
];

export const MOCK_REMINDERS: Reminder[] = [
    {id: 'rem1', audioId: 'audio001', time: '07:00', timeZone: 'America/Los_Angeles', alertBefore: '10 min', repetitionType: 'every_day_indefinite'},
];

export const MOCK_ONBOARDING_SCREENS = [
  {
    image: 'https://picsum.photos/seed/onboard1/600/800',
    headline: 'Reduce Anxiety, Find Calm',
    description: 'Discover guided meditations and soothing sounds to ease your mind.',
  },
  {
    image: 'https://picsum.photos/seed/onboard2/600/800',
    headline: 'Get Sound, Restful Sleep',
    description: 'Drift off to sleep with our curated collection of sleep stories and music.',
  },
  {
    image: 'https://picsum.photos/seed/onboard3/600/800',
    headline: 'Improve Focus & Productivity',
    description: 'Enhance your concentration with soundscapes designed for deep work.',
  },
];

export const MOCK_AI_ASSISTANT_WELCOME: ChatMessage = {
  id: 'ai-welcome',
  sender: 'ai',
  text: `Hello ${MOCK_USER.fullName}! I'm your personal Blissful assistant. How can I help you today? You can ask me to find an audio, set a reminder, or just chat about how you're feeling.`,
  timestamp: new Date(),
};

export const COUNTRY_CODES = [
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
];

export const ALERT_OPTIONS = ["5 min before", "10 min before", "15 min before", "30 min before", "1 hour before"];
export const DAYS_OF_WEEK = [
  { short: "S", long: "Sunday" },
  { short: "M", long: "Monday" },
  { short: "T", long: "Tuesday" },
  { short: "W", long: "Wednesday" },
  { short: "T", long: "Thursday" },
  { short: "F", long: "Friday" },
  { short: "S", long: "Saturday" },
];

export const PROBLEM_DIAGNOSIS_QUESTIONS = [
  { id: 'q1', text: "What's primarily on your mind right now?", type: 'tags', options: ["Stress", "Sleep Issues", "Lack of Focus", "Low Energy", "Anxiety", "Feeling Overwhelmed", "Need Relaxation"] },
  { id: 'q2', text: "How would you rate your current mood (1=Low, 10=Great)?", type: 'slider', min: 1, max: 10, defaultValue: 5 },
  { id: 'q3', text: "What do you hope to achieve with a session?", type: 'choice', options: ["Calm Down", "Fall Asleep", "Concentrate Better", "Boost Energy", "General Well-being"] },
];

export const KIDS_AREA_CATEGORIES = ["Bedtime Stories", "Calming Music", "Fun Adventures", "Learning Sounds"];
export const MOCK_KIDS_AUDIO: AudioContent[] = [
    { id: 'kaudio001', title: 'The Sleepy Dragon', artist: 'Friendly Narrator', duration: '10:00', coverArtUrl: 'https://picsum.photos/seed/kidsaudio1/400/400', category: 'Bedtime Stories', audioUrl: '#' },
    { id: 'kaudio002', title: 'Rainbow Relaxation', artist: 'Gentle Harmonies', duration: '15:00', coverArtUrl: 'https://picsum.photos/seed/kidsaudio2/400/400', category: 'Calming Music', audioUrl: '#' },
];

export const GEMINI_API_KEY_INFO = "process.env.API_KEY"; // Placeholder to acknowledge API key requirement
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002";


