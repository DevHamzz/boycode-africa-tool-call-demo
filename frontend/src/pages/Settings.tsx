import { useState } from 'react'
import { Save, Eye, EyeOff, Zap } from 'lucide-react'

interface SettingRow {
  id: string
  label: string
  description: string
  type: 'text' | 'select' | 'toggle'
  options?: string[]
}

const SETTINGS: SettingRow[] = [
  {
    id: 'model',
    label: 'AI Model',
    description: 'Which DeepSeek model the backend uses.',
    type: 'select',
    options: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
  },
  {
    id: 'systemPrompt',
    label: 'System Prompt',
    description: 'Custom instructions prepended to every conversation.',
    type: 'text',
  },
  {
    id: 'streaming',
    label: 'Streaming Responses',
    description: 'Show AI output word-by-word as it arrives.',
    type: 'toggle',
  },
  {
    id: 'toolCalls',
    label: 'Enable Tool Calls',
    description: 'Allow the AI to run commands and manage files.',
    type: 'toggle',
  },
]

export default function Settings() {
  const [values, setValues] = useState<Record<string, string | boolean>>({
    model: 'deepseek-chat',
    systemPrompt: '',
    streaming: false,
    toolCalls: true,
  })
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (id: string, val: string | boolean) =>
    setValues((v) => ({ ...v, [id]: val }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure your GenZpt AI environment.
        </p>
      </div>

      {/* API Key section */}
      <div className="card p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} className="text-brand-purple" />
          <span className="text-sm font-semibold text-gray-700">DeepSeek API Key</span>
        </div>
        <p className="text-xs text-gray-400">
          Stored in your <code className="bg-cream-200 px-1 rounded">.env</code> file. Never
          shared or sent anywhere except the DeepSeek API.
        </p>
        <div className="flex items-center gap-2">
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="sk-••••••••••••••••"
            className="flex-1 text-sm bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-purple/30"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-2 rounded-xl hover:bg-cream-200 text-gray-400 transition-colors"
          >
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Settings rows */}
      <div className="card p-1 flex flex-col divide-y divide-cream-200">
        {SETTINGS.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
            </div>

            {s.type === 'select' && (
              <select
                value={values[s.id] as string}
                onChange={(e) => set(s.id, e.target.value)}
                className="text-sm bg-cream-100 border border-cream-300 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-purple/30 cursor-pointer"
              >
                {s.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}

            {s.type === 'toggle' && (
              <button
                onClick={() => set(s.id, !(values[s.id] as boolean))}
                className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
                  values[s.id] ? 'bg-brand-purple' : 'bg-gray-200'
                }`}
                style={{ height: 22, width: 40 }}
                role="switch"
                aria-checked={values[s.id] as boolean}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    values[s.id] ? 'translate-x-[18px]' : 'translate-x-0'
                  }`}
                />
              </button>
            )}

            {s.type === 'text' && (
              <input
                type="text"
                value={values[s.id] as string}
                onChange={(e) => set(s.id, e.target.value)}
                placeholder="Enter value…"
                className="text-sm bg-cream-50 border border-cream-300 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-purple/30 w-52"
              />
            )}
          </div>
        ))}
      </div>

      {/* Save button */}
      <div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
