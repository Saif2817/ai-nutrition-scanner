import React from 'react';

type IconProps = {
  className?: string;
};

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const BackIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const ScanIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h-2m-2 2v-2m-4 2v-2m-2 2h-2m12-4h2M4 12H2m18 0h2M6 6l-2-2m14 2l2-2m-2 14l-2 2m-10-2l-2 2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.062 3.65A1 1 0 005.51 8H5a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
  </svg>
);

export const ThumbsDownIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l2.062-3.65A1 1 0 0018.49 16H19a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export const MegaphoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.104 9.168-5.188V13.812a2.25 2.25 0 01-1.657 2.095l-6.052 1.512A2.25 2.25 0 015.436 13.683z" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const LanguageIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.06 7.11a22.39 22.39 0 01-2.12 0m2.12 0a22.39 22.39 0 00-2.12 0m0 0a22.39 22.39 0 00-2.12 0m2.12 0v8.59M12 3v18m0 0a22.39 22.39 0 01-2.12 0m2.12 0a22.39 22.39 0 00-2.12 0m0 0a22.39 22.39 0 00-2.12 0m2.12 0v-8.59M14.25 3h6.5M14.25 12h6.5m-6.5 9h6.5M3.75 6.75h4.5M3.75 12h4.5m-4.5 5.25h4.5" />
    </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
    </svg>
);


export const GenderIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1-3.72a6.022 6.022 0 00-2-2.28" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

export const LeafIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const RunningIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 12a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-2.387-.477a2 2 0 01-.547-1.806l.477-2.387a6 6 0 013.86-.517l.318.158a6 6 0 003.86-.517l2.387-.477a2 2 0 011.806-.547a2 2 0 01.547 1.806l-.477 2.387a6 6 0 01-3.86.517l-.318.158a6 6 0 00-3.86.517l-2.387.477a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86z" />
  </svg>
);

export const HeightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);

export const ScaleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 2v4m6-4v4M12 18.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12V9" />
    </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export const BedIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 7.5V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 12.75 3.75 12.75v6.75h16.5V12.75L12.75 12.75M3 16.5h18" />
    </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
    </svg>
);

export const WineIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 21v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5m4.5 0h-4.5M12 16.5v-3.75m0 0a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-4.5 0v4.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const ForkKnifeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 21v-6.375a.75.75 0 00-.375-.65l-3.75-2.25-3.75 2.25a.75.75 0 00-.375.65V21M14.25 21H9.75M14.25 21H18m-3.75 0H9.75m3.75 0H6m3.75 0v-6.375m0 6.375v-6.375m0 6.375H3.75M9.75 14.625v6.375M9.75 14.625l3.75-2.25m-3.75 2.25L6 12.375m3.75 2.25L13.5 12.375m-3.75-6.375V3m0 4.875L9.75 6m0 0L6 3.75M9.75 6L13.5 3.75m0 0L17.25 6" />
    </svg>
);

export const WaterDropIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 007.5-12.75C19.5 5.25 12 3 12 3S4.5 5.25 4.5 8.25A9 9 0 0012 21z" />
    </svg>
);

export const ChefHatIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5m18 0l-2.25 1.313M3 7.5l2.25 1.313M3 7.5v10.5a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V7.5M12 15.75v-6.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 14.25l2.25-1.313m0 0l2.25 1.313M12 12.937V9.75M12 12.937L9.75 11.625m2.25 1.312L14.25 11.625" />
    </svg>
);


export const OnboardingScanIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{`
            .quick-scan-icon #hand-phone {
                animation: slide-in-scan 3s ease-in-out forwards;
            }
            .quick-scan-icon #scan-line {
                opacity: 0;
                animation: scan-anim 1.5s ease-in-out infinite 1s;
            }
            .quick-scan-icon #scan-glow {
                opacity: 0;
                animation: scan-glow-anim 1.5s ease-in-out infinite 1s;
            }
           
            @keyframes slide-in-scan {
                0% { transform: translate(100px, -20px) rotate(15deg); opacity: 0; }
                40% { transform: translate(0, 0) rotate(-5deg); opacity: 1; }
                60% { transform: translate(0, 0) rotate(-5deg); opacity: 1; }
                100% { transform: translate(0, 0) rotate(-5deg); opacity: 1; }
            }

            @keyframes scan-anim {
                0% { transform: translateY(0); opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(70px); opacity: 0; }
            }
            @keyframes scan-glow-anim {
                0% { opacity: 0; transform: translateY(0) scaleY(1); }
                50% { opacity: 0.4; transform: translateY(35px) scaleY(10); }
                100% { opacity: 0; transform: translateY(70px) scaleY(1); }
            }
        `}</style>
        <g className="quick-scan-icon">
            {/* Product with label */}
            <g id="product" transform="translate(0, 10)">
                <rect x="30" y="50" width="70" height="110" rx="8" fill="#e5e7eb" className="dark:fill-gray-700"/>
                <rect x="35" y="55" width="60" height="100" rx="4" fill="white" className="dark:fill-gray-600"/>
                <text x="65" y="70" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#4b5563" className="dark:fill-gray-300">Nutrition</text>
                
                {/* Label content lines */}
                <rect x="42" y="80" width="46" height="3" rx="1.5" fill="#d1d5db" className="dark:fill-gray-500" />
                <rect x="42" y="90" width="46" height="3" rx="1.5" fill="#d1d5db" className="dark:fill-gray-500" />
                <rect x="42" y="100" width="30" height="3" rx="1.5" fill="#d1d5db" className="dark:fill-gray-500" />
                <rect x="42" y="110" width="46" height="3" rx="1.5" fill="#d1d5db" className="dark:fill-gray-500" />
                 <rect x="42" y="120" width="35" height="3" rx="1.5" fill="#d1d5db" className="dark:fill-gray-500" />

                {/* Barcode */}
                <g transform="translate(48, 130)">
                    <rect x="0" y="0" width="2" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="4" y="0" width="1" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="7" y="0" width="3" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="12" y="0" width="2" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="16" y="0" width="1" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="19" y="0" width="1" height="15" fill="#374151" className="dark:fill-gray-400"/>
                    <rect x="22" y="0" width="3" height="15" fill="#374151" className="dark:fill-gray-400"/>
                </g>
            </g>

            {/* Hand holding phone. Group for animation */}
            <g id="hand-phone">
                {/* Hand. Drawn behind the phone. */}
                <path d="M165,105 C165,120 150,145 135,150 L105,130 L115,80 C115,70 130,60 140,70 L160,85 C170,90 165,100 165,105 Z" fill="#f3d7c3" className="dark:fill-gray-500" />
                
                {/* Phone */}
                <g transform="translate(10, -5)">
                    <rect x="100" y="40" width="50" height="90" rx="8" fill="#1f2937" className="dark:fill-gray-800" stroke="#4b5563" strokeWidth="2"/>
                    <rect x="104" y="44" width="42" height="82" rx="4" fill="black" />
                    
                    {/* Scan glow and line */}
                    <g transform="translate(0, 5)">
                        <rect id="scan-glow" x="104" y="45" width="42" height="1.5" fill="currentColor" />
                        <line id="scan-line" x1="104" y1="45" x2="146" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </g>
                </g>

                {/* Thumb */}
                <path d="M125,78 C135,70 145,75 145,85 L135,100 C125,105 115,95 120,85 Z" fill="#f3d7c3" className="dark:fill-gray-500" />

            </g>
        </g>
    </svg>
);

export const OnboardingAnalysisIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{`
            .analysis-icon #magnifying-glass {
                animation: scan 4s ease-in-out infinite;
            }
            .analysis-icon .highlight, 
            .analysis-icon .result {
                opacity: 0;
            }

            .analysis-icon #highlight-1 { animation: highlight-loop 4s ease-out 0s infinite; }
            .analysis-icon #result-1 { animation: popIn-loop 4s ease-out 0s infinite; }

            .analysis-icon #highlight-2 { animation: highlight-loop 4s ease-out 1s infinite; }
            .analysis-icon #result-2 { animation: popIn-loop 4s ease-out 1s infinite; }

            .analysis-icon #highlight-3 { animation: highlight-loop 4s ease-out 2s infinite; }
            .analysis-icon #result-3 { animation: popIn-loop 4s ease-out 2s infinite; }

            .analysis-icon #highlight-4 { animation: highlight-loop 4s ease-out 3s infinite; }
            .analysis-icon #result-4 { animation: popIn-loop 4s ease-out 3s infinite; }
            
            @keyframes scan {
                0%   { transform: translate(0, 20px); }
                25%  { transform: translate(0, 40px); }
                50%  { transform: translate(0, 60px); }
                75%  { transform: translate(0, 80px); }
                100% { transform: translate(0, 20px); }
            }
            @keyframes highlight-loop {
                0%, 100% { opacity: 0; }
                10% { opacity: 0.5; }
                25% { opacity: 0; }
            }
            @keyframes popIn-loop {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                10% { opacity: 0; transform: scale(0.5); }
                25% { opacity: 1; transform: scale(1); }
                90% { opacity: 1; transform: scale(1); }
            }
        `}</style>
        <g className="analysis-icon">
            {/* Nutrition Label */}
            <g transform="translate(40, 20)">
                <rect x="0" y="0" width="120" height="160" rx="10" className="fill-white dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-gray-800 dark:fill-gray-100">Nutrition Facts</text>
                
                <g fontSize="10" className="fill-gray-600 dark:fill-gray-300">
                    <text x="10" y="50">Total Fat</text><text x="105" y="50" textAnchor="end">8g</text>
                    <rect id="highlight-1" x="5" y="40" width="110" height="15" rx="3" className="highlight fill-green-500/30" />
                    <g id="result-1" className="result" transform="translate(140, 48)">
                        <circle cx="0" cy="0" r="8" className="fill-green-500"/>
                        <path d="M -3 0 L -1 2 L 2 -1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    <text x="10" y="70">Sodium</text><text x="105" y="70" textAnchor="end">160mg</text>
                    <rect id="highlight-2" x="5" y="60" width="110" height="15" rx="3" className="highlight fill-yellow-500/30" />
                    <g id="result-2" className="result" transform="translate(140, 68)">
                        <circle cx="0" cy="0" r="8" className="fill-yellow-500"/>
                    </g>

                    <text x="10" y="90">Total Sugars</text><text x="105" y="90" textAnchor="end">35g</text>
                    <rect id="highlight-3" x="5" y="80" width="110" height="15" rx="3" className="highlight fill-red-500/30" />
                    <g id="result-3" className="result" transform="translate(140, 88)">
                        <circle cx="0" cy="0" r="8" className="fill-red-500"/>
                    </g>

                    <text x="10" y="110">Protein</text><text x="105" y="110" textAnchor="end">5g</text>
                    <rect id="highlight-4" x="5" y="100" width="110" height="15" rx="3" className="highlight fill-green-500/30" />
                    <g id="result-4" className="result" transform="translate(140, 108)">
                        <circle cx="0" cy="0" r="8" className="fill-green-500"/>
                        <path d="M -3 0 L -1 2 L 2 -1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    <text x="10" y="130" fontSize="9">Ingredients: Sugar, Flour...</text>
                </g>
            </g>
            
            <g id="magnifying-glass" className="text-gray-700 dark:text-gray-300" transform="translate(10, 0)">
                <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="6"/>
                <line x1="48" y1="48" x2="65" y2="65" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
            </g>
        </g>
    </svg>
);

export const OnboardingChatIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 250 200" className={className}>
        <style>{`
            .chat-icon * {
                transform-origin: center;
            }
            .chat-icon #user-bubble {
                animation: user-bubble-anim 5s ease-in-out infinite;
            }
            .chat-icon #typing-dots {
                animation: typing-dots-fade-in 5s ease-in-out infinite;
            }
            .chat-icon #typing-dots circle {
                animation: typing-dot-anim 1.2s ease-in-out infinite;
            }
            .chat-icon #typing-dots circle:nth-child(2) {
                animation-delay: 0.2s;
            }
            .chat-icon #typing-dots circle:nth-child(3) {
                animation-delay: 0.4s;
            }
            .chat-icon #ai-bubble {
                animation: ai-bubble-anim 5s ease-in-out infinite;
            }
            .chat-icon #ai-text {
                animation: ai-text-fade-in 5s ease-in-out infinite;
            }
            .chat-icon #checkmark {
                stroke-dasharray: 20;
                stroke-dashoffset: 20;
                animation: checkmark-anim 5s ease-out infinite;
            }

            @keyframes user-bubble-anim {
                0%, 100% { opacity: 0; transform: translateY(10px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
            }

            @keyframes typing-dots-fade-in {
                0%, 20%, 40%, 100% { opacity: 0; }
                25%, 35% { opacity: 1; }
            }
            
            @keyframes typing-dot-anim {
                0%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-4px); }
            }

            @keyframes ai-bubble-anim {
                0%, 40%, 100% { opacity: 0; transform: scale(0.8); }
                50%, 90% { opacity: 1; transform: scale(1); }
            }
            
            @keyframes ai-text-fade-in {
                0%, 50%, 90%, 100% { opacity: 0; }
                55%, 89% { opacity: 1; }
            }

            @keyframes checkmark-anim {
                0%, 60% { stroke-dashoffset: 20; }
                70%, 100% { stroke-dashoffset: 0; }
            }
        `}</style>
        <g className="chat-icon" transform="translate(15, 0)">
            <g id="user-bubble">
                <path d="M 170 80 C 170 60, 150 60, 150 60 L 50 60 C 30 60, 30 80, 30 80 L 30 50 C 30 30, 50 30, 50 30 L 130 30 L 150 10 L 150 30 L 150 30 C 170 30, 170 50, 170 80 Z" className="fill-gray-200 dark:fill-gray-700" />
                <text x="100" y="60" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="500" fontFamily="sans-serif">Is this good for my diet?</text>
            </g>

            <g id="typing-dots" transform="translate(55 130)">
                <circle cx="0" cy="0" r="4" fill="#34d399" />
                <circle cx="12" cy="0" r="4" fill="#34d399" />
                <circle cx="24" cy="0" r="4" fill="#34d399" />
            </g>

            <g id="ai-bubble">
                <path d="M 30 110 C 30 90, 50 90, 50 90 L 200 90 C 220 90, 220 110, 220 110 L 220 140 C 220 160, 200 160, 200 160 L 70 160 L 50 180 L 50 160 L 50 160 C 30 160, 30 140, 30 110 Z" fill="#34d399" />
                <text id="ai-text" x="40" y="135" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Want some better options?</text>
                <path id="checkmark" d="M 208 128 l 4 4 l 6 -6" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </g>
    </svg>
);

export const OnboardingUnlockIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{`
            .onboarding-unlock #profile-progress-bar {
                animation: fillProfile 1.5s 1s ease-in-out forwards;
            }
            .onboarding-unlock #padlock-shackle {
                transform-origin: 25% 75%;
                animation: unlockShackle 0.4s 2.7s ease-out forwards;
            }
            .onboarding-unlock #padlock-body {
                animation: unlockBody 0.4s 2.7s ease-out forwards;
            }
            .onboarding-unlock #analysis-card-bg {
                animation: colorizeCard 0.8s 3.1s ease-in-out forwards;
            }
            .onboarding-unlock #analysis-charts {
                animation: fadeInCharts 0.8s 3.3s ease-in-out forwards;
            }
            .onboarding-unlock #profile-icon-group, .onboarding-unlock #padlock-group {
                animation: fadeIn 0.5s ease-in-out forwards;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fillProfile {
                from { height: 0; y: 115; }
                to { height: 20; y: 95; }
            }

            @keyframes unlockShackle {
                0% { transform: translateY(0) rotate(0); }
                50% { transform: translateY(-5px) rotate(0); }
                100% { transform: translateY(-5px) rotate(-30deg); }
            }

            @keyframes unlockBody {
                 0% { transform: rotate(0); }
                 25% { transform: rotate(-2deg); }
                 50% { transform: rotate(2deg); }
                 75% { transform: rotate(-1deg); }
                 100% { transform: rotate(0); fill: #34d399; }
            }

            @keyframes colorizeCard {
                from { fill: #d1d5db; }
                to { fill: #ffffff; }
            }
            
            @keyframes fadeInCharts {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
        
        <g className="onboarding-unlock">
            {/* Analysis Card */}
            <g id="analysis-card">
                <rect id="analysis-card-bg" x="60" y="50" width="110" height="130" rx="10" fill="#d1d5db" className="dark:fill-gray-700" stroke="#9ca3af" strokeWidth="2"/>
                <g id="analysis-charts" style={{ opacity: 0 }}>
                    <line x1="75" y1="160" x2="75" y2="130" stroke="#34d399" strokeWidth="8" strokeLinecap="round" />
                    <line x1="95" y1="160" x2="95" y2="110" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
                    <line x1="115" y1="160" x2="115" y2="140" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
                    <line x1="135" y1="160" x2="135" y2="120" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                    <path d="M70,100 C 85,80 115,110 130,90" fill="none" stroke="#6366f1" strokeWidth="3" />
                </g>
            </g>
            
            {/* Padlock */}
            <g id="padlock-group" opacity="0">
                <path id="padlock-shackle" d="M100 55 A 15 15 0 0 1 100 25 A 15 15 0 0 1 100 55 M 100 55 L 100 42 M 85 55 L 85 42" stroke="#4b5563" className="dark:stroke-gray-400" strokeWidth="6" fill="none" transform="translate(15, 0)"/>
                <rect id="padlock-body" x="80" y="50" width="40" height="30" rx="5" fill="#9ca3af" className="dark:fill-gray-500" transform="translate(15, 0)"/>
            </g>
            
            {/* Profile Icon */}
            <g id="profile-icon-group" opacity="0">
                <circle cx="45" cy="90" r="25" fill="#e5e7eb" className="dark:fill-gray-600" stroke="#9ca3af" strokeWidth="2"/>
                <rect id="profile-progress-bar" x="35" y="115" width="20" height="0" fill="#34d399" />
                <circle cx="45" cy="85" r="8" fill="#d1d5db" className="dark:fill-gray-500"/>
                <path d="M35,115 a10,5 0 0,1 20,0 z" fill="#d1d5db" className="dark:fill-gray-500"/>
            </g>
        </g>
    </svg>
);

export const GlycemicIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
);

export const PairingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v2.25A2.25 2.25 0 006 20.25z" />
    </svg>
);

export const TimeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SwapIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

export const ChartPieIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

export const OverviewIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

export const HeartbeatIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h3.5l2-8 4 16 3-9h3.5" />
  </svg>
);

export const BulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.96a3 3 0 00-4.682 2.72 8.986 8.986 0 003.741.479m7.5-2.96L12 12.75m-2.25 3.75L12 12.75m-2.25 3.75a3 3 0 01-3-3V1.5a3 3 0 013-3h.008c1.657 0 3 1.343 3 3v9.75m-1.5-3.75a3 3 0 00-3-3h-.008a3 3 0 00-3 3v9.75m6-12.75a3 3 0 013-3h.008a3 3 0 013 3v9.75a3 3 0 01-3 3h-.008a3 3 0 01-3-3V6.75z" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const LondonBridgeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 20V54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 20V54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 54H20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M44 54H56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 28H10V20H18V28H14Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 28H46V20H54V28H50Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 40C20 35.5817 23.5817 32 28 32H36C40.4183 32 44 35.5817 44 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 14C14 11.7909 15.7909 10 18 10H46C48.2091 10 50 11.7909 50 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const IndiaGateIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 56V26C12 23.7909 13.7909 22 16 22H48C50.2091 22 52 23.7909 52 26V56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 56H56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 56V32H40V56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16H52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16V12H48V16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12V8H44V12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const TamilTempleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 60H52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 60V24H48V60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 24L22 16H42L44 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 16L27 10H37L38 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 10V6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 52H36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const KeralaBoatIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 42C10 42 16 36 32 36C48 36 54 42 54 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 42L8 52H56L52 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 36V20C18 17.7909 19.7909 16 22 16H42C44.2091 16 46 17.7909 46 20V36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 24H42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const PaperclipIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
  </svg>
);

export const DrumstickIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.46 5.47a3.75 3.75 0 00-5.3 0l-1.16 1.16-1.5-1.5A3.75 3.75 0 005.2 10.43l-1.77 4.93a.75.75 0 001.06 1.06l4.93-1.77a3.75 3.75 0 005.3-5.3l-1.5-1.5 1.16-1.16a3.75 3.75 0 000-5.3zM15.5 10.75a.75.75 0 01-1.06 0l-2.69-2.69a.75.75 0 010-1.06.75.75 0 011.06 0l2.69 2.69a.75.75 0 010 1.06z" />
    </svg>
);


export const SpiceJarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v3H6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8v12a2 2 0 01-2 2H10a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h4" />
    </svg>
);

export const SugarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25V21" />
    </svg>
);

export const SaltIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21H5.25a2.25 2.25 0 01-2.25-2.25V10.5a2.25 2.25 0 012.25-2.25h5.25a2.25 2.25 0 012.25 2.25v8.25a2.25 2.25 0 01-2.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 8.25V3.75a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 3.75v4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.938 12.312a2.25 2.25 0 10-3.181 3.182c.497.497 1.13.78 1.812.78h.008c.682 0 1.314-.283 1.812-.78a2.25 2.25 0 00-1.07-4.444z" />
    </svg>
);

export const FlaskIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const TagIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v18" />
  </svg>
);


export const ShoppingBagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.5a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.625 7.5h12.75c.654 0 1.187.585 1.117 1.244z" />
    </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

export const GrainIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9.75s-1.125-1.5-3.375-1.5-3.375 1.5-3.375 1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 21a2.25 2.25 0 00-2.25-2.25H12a2.25 2.25 0 00-2.25 2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75c-1.036 0-1.875.84-1.875 1.875s.84 1.875 1.875 1.875h.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75c1.036 0 1.875.84 1.875 1.875s-.84 1.875-1.875 1.875H7.875" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12.75c-1.036 0-1.875.84-1.875 1.875s.84 1.875 1.875 1.875h.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.75c1.036 0 1.875.84 1.875 1.875s-.84 1.875-1.875 1.875H7.875" />
    </svg>
);

export const DieticianIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

// Constants for photorealistic images
const NECK_GUIDE_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... (full base64 string) ...";
const WAIST_GUIDE_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... (full base64 string) ...";
const HIP_GUIDE_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... (full base64 string) ...";

export const NeckMeasurementIcon = () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAADg/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA3QIh8gABTj4iNQAAAABJRU5ErkJggg==" alt="Guide for measuring neck circumference" className="w-full h-full object-contain" />;
export const WaistMeasurementIcon = () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAADg/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA3QIh8gABTj4iNQAAAABJRU5ErkJggg==" alt="Guide for measuring waist circumference" className="w-full h-full object-contain" />;
export const HipMeasurementIcon = () => <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAADg/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/3kEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA/zkEAAAAAAAAAADA3QIh8gABTj4iNQAAAABJRU5ErkJggg==" alt="Guide for measuring hip circumference" className="w-full h-full object-contain" />;

export const GoogleDriveIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.1 5H9.4l-2.7 4.8L16.2 19l2.8-4.8L19.1 5zM8.2 12.2L5.4 17l2.8 4.8h9.7l2.7-4.8-9.4-7.8zM4.9 10.3l-2.8 4.8L4.9 20h.1l2.8-4.8-2.9-4.9z" />
    </svg>
);

export const DropboxIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="m6.2 4-3.9 2.5 3.9 2.5L12 4 8.1 1.5 6.2 4zm11.6 0-3.9-2.5-1.9 2.5 5.8 4.4 3.9-2.5-3.9-4.4zM2 9.1l3.9 2.5 3.9-2.5-3.9-2.5L2 9.1zm16.2-2.5 3.9 2.5-3.9 2.5-3.9-2.5 3.9-2.5zM8.1 22.5 12 18.1l3.9 4.4L12 20l-3.9 2.5z" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const PdfIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2.25-1.5V6a2.25 2.25 0 00-2.25-2.25H15M9 12v3m2.25-3V6A2.25 2.25 0 009 3.75H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const DocxIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l6-3.75-6-3.75v7.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);