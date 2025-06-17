// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        'yuno-blue-primary':    '#2563eb',
        'yuno-blue-light':      '#3b82f6',
        'yuno-blue-dark':       '#1d4ed8',
        'yuno-cyan-primary':    '#06b6d4',
        'yuno-cyan-light':      '#22d3ee',
        'yuno-cyan-dark':       '#0891b2',
        // Backgrounds
        'yuno-bg-primary':      '#111827',
        'yuno-bg-secondary':    '#1f2937',
        'yuno-bg-tertiary':     '#0f172a',
        // Text
        'yuno-text-primary':    '#ffffff',
        'yuno-text-secondary':  '#e5e7eb',
        'yuno-text-muted':      '#9ca3af',
        // Status
        'success-primary':      '#10b981',
        'success-light':        '#34d399',
        'warning-primary':      '#f59e0b',
        'warning-light':        '#fbbf24',
        'error-primary':        '#ef4444',
        'error-light':          '#f87171'
      },
      backgroundImage: theme => ({
        // Core gradients
        'hero-gradient':           'linear-gradient(to bottom right, #111827, #1e293b, #1e3a8a)',
        'section-gradient':        'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)',
        'main-cta-gradient':       'linear-gradient(to right, #2563eb, #06b6d4)',
        'icon-gradient':           'linear-gradient(to bottom right, #3b82f6, #22d3ee)',
        'text-gradient':           'linear-gradient(to right, #60a5fa, #22d3ee)',
        'cta-hover-gradient':      'linear-gradient(to right, #1d4ed8, #0891b2)',
        'secondary-hover-gradient':'linear-gradient(to right, #7c3aed, #ec4899)',
        // Feature cards
        'feature-1-gradient':      'linear-gradient(to bottom right, #eab308, #f97316)',
        'feature-2-gradient':      'linear-gradient(to bottom right, #10b981, #059669)',
        'feature-3-gradient':      'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
        'feature-4-gradient':      'linear-gradient(to bottom right, #8b5cf6, #ec4899)',
        'feature-5-gradient':      'linear-gradient(to bottom right, #6366f1, #3b82f6)',
        'feature-6-gradient':      'linear-gradient(to bottom right, #14b8a6, #06b6d4)'
      })
    }
  },
  plugins: []
}
