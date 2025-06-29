// Bolt.new configuration
export default {
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
  },

  // Server configuration for Bolt.new
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    cors: true,
  },

  // Environment variables for Bolt.new
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
    'process.env.SUPABASE_SERVICE_KEY': JSON.stringify(process.env.SUPABASE_SERVICE_KEY),
  },

  // Optimizations for Bolt.new
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      '@neondatabase/serverless',
      'drizzle-orm',
      'react',
      'react-dom'
    ],
  },

  // Preview mode settings
  preview: {
    port: 5000,
    host: '0.0.0.0',
  }
};