import { useState, useEffect } from 'react'
import { Shield, Globe, FileCheck, Lock, Server, CreditCard, Download, X, Settings, Code, Eye } from 'lucide-react'

// Ad configuration - stored in localStorage for persistence
interface AdConfig {
  enabled: boolean
  headerAdCode: string
  sidebarAdCode: string
  downloadAdCode: string
  verificationCode: string
  countdownSeconds: number
}

const defaultAdConfig: AdConfig = {
  enabled: false,
  headerAdCode: '',
  sidebarAdCode: '',
  downloadAdCode: '',
  verificationCode: '',
  countdownSeconds: 5
}

const checklists = [
  {
    id: 'hipaa',
    title: 'HIPAA Compliance',
    subtitle: 'Healthcare Providers',
    description: 'Complete checklist for healthcare data protection compliance.',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500',
    pages: 14,
    downloadUrl: '/downloads/HIPAA_Compliance_Bundle_2026.zip'
  },
  {
    id: 'gdpr',
    title: 'GDPR Compliance',
    subtitle: 'SaaS & EU Businesses',
    description: 'European data protection regulation compliance guide.',
    icon: Globe,
    gradient: 'from-indigo-500 to-purple-500',
    pages: 16,
    downloadUrl: '/downloads/GDPR_Compliance_Bundle_2026.zip'
  },
  {
    id: 'soc2',
    title: 'SOC 2 Type II',
    subtitle: 'Tech & SaaS Companies',
    description: 'Service organization control compliance framework.',
    icon: FileCheck,
    gradient: 'from-amber-500 to-orange-500',
    pages: 15,
    downloadUrl: '/downloads/SOC2_Compliance_Bundle_2026.zip'
  },
  {
    id: 'ccpa',
    title: 'CCPA/CPRA',
    subtitle: 'California Businesses',
    description: 'California consumer privacy rights compliance.',
    icon: Lock,
    gradient: 'from-green-500 to-emerald-500',
    pages: 15,
    downloadUrl: '/downloads/CCPA_Compliance_Bundle_2026.zip'
  },
  {
    id: 'iso27001',
    title: 'ISO 27001',
    subtitle: 'Enterprise Security',
    description: 'Information security management system standard.',
    icon: Server,
    gradient: 'from-purple-500 to-pink-500',
    pages: 18,
    downloadUrl: '/downloads/ISO27001_Compliance_Bundle_2026.zip'
  },
  {
    id: 'pci',
    title: 'PCI DSS',
    subtitle: 'E-commerce & Payments',
    description: 'Payment card industry data security standard.',
    icon: CreditCard,
    gradient: 'from-orange-500 to-red-500',
    pages: 19,
    downloadUrl: '/downloads/PCI_DSS_Compliance_Bundle_2026.zip'
  }
]

// Admin Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Default password: admin123 (you should change this)
    if (password === 'admin123') {
      onLogin()
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Default password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
        </p>
      </div>
    </div>
  )
}

// Admin Dashboard Component
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [config, setConfig] = useState<AdConfig>(defaultAdConfig)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('adConfig')
    if (saved) {
      setConfig(JSON.parse(saved))
    }
  }, [])

  const saveConfig = () => {
    localStorage.setItem('adConfig', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-blue-600 hover:underline">View Site</a>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ad Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Ad Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="adsEnabled"
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="adsEnabled" className="font-medium">
                  Enable Ads Before Downloads
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Countdown Timer (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.countdownSeconds}
                  onChange={(e) => setConfig({ ...config, countdownSeconds: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Users must wait this many seconds before downloading
                </p>
              </div>
            </div>
          </div>

          {/* Verification Code */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Ad Platform Verification
            </h2>
            <p className="text-gray-600 mb-4">
              Paste verification codes here (Google AdSense, etc.). These will be added to the page head.
            </p>
            <textarea
              value={config.verificationCode}
              onChange={(e) => setConfig({ ...config, verificationCode: e.target.value })}
              placeholder="<!-- Google AdSense verification code -->"
              className="w-full h-32 px-4 py-2 border rounded-lg font-mono text-sm"
            />
          </div>

          {/* Ad Codes */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Ad Placement Codes</h2>
            <p className="text-gray-600 mb-4">
              Paste your ad codes from Google AdSense, Media.net, or other ad platforms.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Ad (shown at top of page)
                </label>
                <textarea
                  value={config.headerAdCode}
                  onChange={(e) => setConfig({ ...config, headerAdCode: e.target.value })}
                  placeholder="<!-- Paste ad code here -->"
                  className="w-full h-24 px-4 py-2 border rounded-lg font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Download Page Ad (shown before download)
                </label>
                <textarea
                  value={config.downloadAdCode}
                  onChange={(e) => setConfig({ ...config, downloadAdCode: e.target.value })}
                  placeholder="<!-- Paste ad code here -->"
                  className="w-full h-24 px-4 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={saveConfig}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90"
          >
            Save Settings
          </button>
          {saved && <span className="text-green-600 font-medium">Settings saved!</span>}
        </div>
      </main>
    </div>
  )
}

// Ad Modal Component
function AdModal({ 
  isOpen, 
  onClose, 
  onDownload, 
  checklist 
}: { 
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
  checklist: typeof checklists[0]
}) {
  const [config, setConfig] = useState<AdConfig>(defaultAdConfig)
  const [countdown, setCountdown] = useState(5)
  const [canDownload, setCanDownload] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('adConfig')
    if (saved) {
      const parsed = JSON.parse(saved)
      setConfig(parsed)
      setCountdown(parsed.countdownSeconds || 5)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !config.enabled) return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanDownload(true)
    }
  }, [countdown, isOpen, config.enabled])

  if (!isOpen) return null

  // If ads are disabled, just trigger download immediately
  if (!config.enabled) {
    onDownload()
    onClose()
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Download {checklist.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Ad Space */}
          {config.downloadAdCode && (
            <div 
              className="bg-gray-100 rounded-lg p-4 mb-6 text-center"
              dangerouslySetInnerHTML={{ __html: config.downloadAdCode }}
            />
          )}

          {/* Countdown / Download Button */}
          <div className="text-center">
            {!canDownload ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Please wait while we prepare your download...
                </p>
                <div className="text-4xl font-bold text-blue-600">
                  {countdown}
                </div>
                <p className="text-sm text-gray-500">
                  Your download will start automatically
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Your file is ready!</p>
                <a
                  href={checklist.downloadUrl}
                  download
                  onClick={() => {
                    onDownload()
                    onClose()
                  }}
                  className={`inline-block px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r ${checklist.gradient} hover:opacity-90`}
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Download Now
                </a>
              </div>
            )}
          </div>

          {/* Additional Ad Space */}
          {config.downloadAdCode && (
            <div 
              className="bg-gray-100 rounded-lg p-4 mt-6 text-center"
              dangerouslySetInnerHTML={{ __html: config.downloadAdCode }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [config, setConfig] = useState<AdConfig>(defaultAdConfig)
  const [selectedChecklist, setSelectedChecklist] = useState<typeof checklists[0] | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('adConfig')
    if (saved) {
      setConfig(JSON.parse(saved))
    }
  }, [])

  // Check if we're on admin page
  const isAdminPage = window.location.pathname === '/admin'

  if (isAdminPage) {
    if (!isAdmin) {
      return <AdminLogin onLogin={() => setIsAdmin(true)} />
    }
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Verification Code in Head - injected via useEffect */}
      {config.verificationCode && (
        <div dangerouslySetInnerHTML={{ 
          __html: `<script>${config.verificationCode}</script>` 
        }} style={{ display: 'none' }} />
      )}

      {/* Header Ad */}
      {config.enabled && config.headerAdCode && (
        <div 
          className="bg-white border-b p-2 text-center"
          dangerouslySetInnerHTML={{ __html: config.headerAdCode }}
        />
      )}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ComplianceHub
              </span>
            </div>
            <button
              onClick={() => window.location.href = '/admin'}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <span className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
          2026 Edition - Free Downloads
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Free Compliance Checklists
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Professional compliance assessment tools for HIPAA, GDPR, SOC 2, CCPA, ISO 27001, and PCI DSS.
        </p>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist) => {
            const Icon = checklist.icon
            return (
              <div key={checklist.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${checklist.gradient} text-white p-3 rounded-lg w-fit mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-1">{checklist.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{checklist.subtitle}</p>
                <p className="text-gray-600 mb-4">{checklist.description}</p>
                <p className="text-sm text-gray-400 mb-4">{checklist.pages} pages</p>
                <button
                  onClick={() => setSelectedChecklist(checklist)}
                  className={`w-full text-center bg-gradient-to-r ${checklist.gradient} text-white py-2 rounded-md font-medium hover:opacity-90`}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Free
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 ComplianceHub. All rights reserved.</p>
        </div>
      </footer>

      {/* Ad Modal */}
      <AdModal
        isOpen={!!selectedChecklist}
        onClose={() => setSelectedChecklist(null)}
        onDownload={() => {
          // Track download if needed
          console.log('Download started:', selectedChecklist?.title)
        }}
        checklist={selectedChecklist || checklists[0]}
      />
    </div>
  )
}

export default App

