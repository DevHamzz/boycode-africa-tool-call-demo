export default function handler(_req: any, res: any) {
  return res.status(200).json({
    message: 'Use NextAuth, Clerk, or Supabase Auth to sign in users for production.',
    providers: ['github', 'google', 'email'],
  })
}
