// Small inline SVG icon set (stroke icons, currentColor) so there is no icon dependency.
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const I = (paths) => (props) => (
  <svg {...base} {...props}>
    {paths}
  </svg>
);

export const Icon = {
  mountain: I(<path d="M3 20l7-13 3 5 2-3 6 11z" />),
  pin: I(<><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>),
  clock: I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  thermo: I(<><path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" /><path d="M12 9v6" /></>),
  wind: I(<path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h8a2 2 0 1 1-2 2" />),
  gauge: I(<><path d="M4 14a8 8 0 0 1 16 0" /><path d="M12 14l4-5" /><path d="M2 18h20" /></>),
  drop: I(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />),
  compass: I(<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>),
  heart: I(<path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />),
  drone: I(<><circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2" /></>),
  chart: I(<><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>),
  camera: I(<><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>),
  imu: I(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>),
  gps: I(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>),
  env: I(<path d="M3 20l7-13 3 5 2-3 6 11z" />),
  battery: I(<><rect x="2" y="7" width="18" height="10" rx="2" /><path d="M22 10v4" /><rect x="5" y="10" width="7" height="4" fill="currentColor" stroke="none" /></>),
  gimbal: I(<><circle cx="12" cy="12" r="3" /><path d="M12 2a10 10 0 0 1 10 10M12 22A10 10 0 0 1 2 12" /><path d="M12 5v4M12 15v4" /></>),
  comm: I(<><path d="M4 12h16" /><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /></>),
  brain: I(<><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-3V4z" /></>),
  bell: I(<><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>),
  gear: I(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>),
  info: I(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  warn: I(<><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 18h.01" /></>),
  check: I(<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>),
  x: I(<><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>),
  chevL: I(<path d="M15 6l-6 6 6 6" />),
  chevR: I(<path d="M9 6l6 6-6 6" />),
};
