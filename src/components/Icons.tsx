import React from 'react';

// Simple placeholder SVG icons. Replace paths with actual designs later.
const IconWrapper = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.children}
  </svg>
);

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M5 12h14M13 5l6 7-6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const ArrowUpRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M5 19V5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" fill="none" />
  </IconWrapper>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.66 17.66l1.42 1.42M4.93 19.07l1.42-1.42M17.66 6.34l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const BoxesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
  </IconWrapper>
);

export const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M12 2C6.48 2 2 6.58 2 12.33c0 4.56 2.87 8.44 6.84 9.81.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05 .88 1.55 2.31 1.1 2.87 .84 .09-.66 .35-1.1 .64-1.35-2.22-.26-4.55-1.13-4.55-5.02 0-1.11 .39-2.02 1.03-2.73-.1-.26-.45-1.3 .1-2.71 0 0 .84-.27 2.75 1.03a9.5 9.5 0 012.5-.34c.85 .004 1.71 .115 2.5 .34 1.9-1.3 2.74-1.03 2.74-1.03 .55 1.41 .2 2.45 .1 2.71 .64 .71 1.02 1.62 1.02 2.73 0 3.9-2.34 4.76-4.57 5.02 .36 .31 .68 .92 .68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27 .18 .58 .69 .48A10.34 10.34 0 0022 12.33C22 6.58 17.52 2 12 2z" fill="currentColor" />
  </IconWrapper>
);

export const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M4 3a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2H4zm4 14H5v-8h3v8zm-1.5-9.2a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zM19 17h-3v-4c0-1-.02-2.3-1.4-2.3-1.4 0-1.62 1.1-1.62 2.22V17h-3v-8h2.88v1.1h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V17z" fill="currentColor" />
  </IconWrapper>
);

export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012.07 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="currentColor" />
  </IconWrapper>
);

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7zm10 2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10zm-5 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm4.5-.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="currentColor" />
  </IconWrapper>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <polygon points="5,3 19,12 5,21" fill="currentColor" />
  </IconWrapper>
);

export const PaletteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M12 2v4M2 12h4M22 12h-4M12 22v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const LayoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
  </IconWrapper>
);

export const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v4M12 14v4M8 8h.01M16 8h.01M8 16h.01M16 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </IconWrapper>
);

export const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M2 12l5 5 7-12 2 2-12 7 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
  </IconWrapper>
);

export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </IconWrapper>
);

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none" />
  </IconWrapper>
);

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
  </IconWrapper>
);

export const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </IconWrapper>
);
