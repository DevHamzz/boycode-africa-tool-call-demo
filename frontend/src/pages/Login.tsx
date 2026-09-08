import { useState } from 'react'

export default function Login() {
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')

      return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
                  <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-2xl">
                        <h1 className="text-2xl font-bold mb-2">Sign in to GenZpt AI</h1>
                        <p className="text-sm text-slate-400 mb-6">Use Supabase Auth or NextAuth in production.</p>

                        <div className="space-y-4">
                              <div>
                                    <label className="text-sm text-slate-300 block mb-1">Email</label>
                                    <input
                                          type="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 outline-none"
                                          placeholder="you@example.com"
                                    />
                              </div>

                              <div>
                                    <label className="text-sm text-slate-300 block mb-1">Password</label>
                                    <input
                                          type="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 outline-none"
                                          placeholder="••••••••"
                                    />
                              </div>

                              <button className="w-full rounded-xl bg-violet-600 px-4 py-2.5 font-semibold">Continue</button>
                              <button className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 font-semibold">Continue with Google</button>
                        </div>
                  </div>
            </div>
      )
}
