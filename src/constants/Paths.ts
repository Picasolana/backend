/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Session: {
    Base: '/session',
    New: '/new',
    Save: '/save',
  },
  Contest: {
    Base: '/contest',
    Leaderboard: '/leaderboard',
    Submit: '/submit',
    Target: '/target',
    Mint: '/mint',
  },
} as const;
