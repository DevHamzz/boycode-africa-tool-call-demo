# GenZpt AI

A DeepSeek-powered AI app intended for live deployment on Vercel with Supabase authentication, database storage, uploads, and a professional dashboard UI.

## Stack

- DeepSeek for reasoning
- Supabase for auth and database
- Supabase Storage for uploads
- Vercel for hosting
- Live web search via a real search API
- Memory layer with user sessions
- React + Vite frontend
- Express-compatible API layer

## Environment variables

Create a `.env` file based on `.env.example` with values like:

```bash
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_deepseek_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
TAVILY_API_KEY=your_tavily_api_key
API_KEY=your_random_api_key
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## Supabase setup

1. Create a new Supabase project.
2. Open SQL editor.
3. Run the contents of `supabase/schema.sql`.
4. Enable Email auth in Authentication settings.
5. Create a storage bucket named `uploads`.
6. Set storage policies to allow authenticated users to upload and view their own files.

## Vercel deployment

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Set environment variables in Vercel.
4. Set the root build command to `npm run build` if needed.
5. Deploy.

## Suggested production workflow

- Use DeepSeek for reasoning.
- Use Supabase for auth + profiles + memory + chats.
- Use Supabase Storage for file uploads.
- Use a real search API such as Tavily or SerpApi for live web answers.
- Use Vercel for deployment and serverless hosting.
- Add a separate session database if you need long-lived memory beyond simple per-user profiles.

## Notes

This project is a strong starting point for a production-grade AI SaaS app. It still needs a proper auth layer and database integration to become a fully production-ready app with secure user sessions and persistent memory.
