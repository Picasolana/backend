/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Session: {
    Base: '/session',
    New: '/new',
    Save: '/save',
    Telegram: '/telegram/:telegramHandle',
    Email: '/email/:email',
  },
  Contest: {
    Base: '/contest',
    Submission: '/submission/:sessionId/:index',
    Leaderboard: '/leaderboard',
    Submit: '/submit',
    Best: '/best/:sessionId',
    Target: '/target',
    Mint: '/mint',
  },
} as const;
