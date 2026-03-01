import { useState, useEffect } from 'react'
import type { LucideProps } from 'lucide-react'
import { Shield, Globe, FileCheck, Lock, Server, CreditCard, Download, X, Settings, AlertCircle, Loader2, Mail } from 'lucide-react'
import { supabase, getAdSettings, updateAdSettings, adminLogin, adminLogout, isAdmin } from './lib/supabase'

// ============================================
// TYPES
// ============================================
type ChecklistItem = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<LucideProps>
  gradient: string
  pages: number
  downloadUrl: string
}

type AdConfig = {
  enabled: boolean
  countdown: number
  headerAd: string
  downloadAd: string
  verificationCode: string
}

// ============================================
// FALLBACK CONFIG (used if Supabase fails)
// ============================================
const FALLBACK_CONFIG: AdConfig = {
  enabled: false,
  countdown: 5,
  headerAd: '',
  downloadAd: '',
  verificationCode: ''
}

// ============================================
// CHECKLISTS DATA
// ============================================
const checklists: ChecklistItem[] = [
  { id: 'hipaa', title: 'HIPAA Compliance', subtitle: 'Healthcare Providers', description: 'Healthcare data protection compliance checklist.', icon: Shield, gradient: 'from-blue-500 to-cyan-500', pages: 14, downloadUrl: '/downloads/HIPAA_Compliance_Bundle_2026.zip' },
  { id: 'gdpr', title: 'GDPR Compliance', subtitle: 'SaaS & EU Businesses', description: 'European data protection regulation compliance.', icon: Globe, gradient: 'from-indigo-500 to-purple-500', pages: 16, downloadUrl: '/downloads/GDPR_Compliance_Bundle_2026.zip' },
  { id: 'soc2', title: 'SOC 2 Type II', subtitle: 'Tech & SaaS Companies', description: 'Service organization control compliance framework.', icon: FileCheck, gradient: 'from-amber-500 to-orange-500', pages: 15, downloadUrl: '/downloads/SOC2_Compliance_Bundle_2026.zip' },
  { id: 'ccpa', title: 'CCPA/CPRA', subtitle: 'California Businesses', description: 'California consumer privacy rights compliance.', icon: Lock, gradient: 'from-green-500 to-emerald-500', pages: 15, downloadUrl: '/downloads/CCPA_Compliance_Bundle_2026.zip' },
  { id: 'iso27001', title: 'ISO 27001', subtitle: 'Enterprise Security', description: 'Information security management system standard.', icon: Server, gradient: 'from-purple-500 to-pink-500', pages: 18, downloadUrl: '/downloads/ISO27001_Compliance_Bundle_2026.zip' },
  { id: 'pci', title: 'PCI DSS', subtitle: 'E-commerce & Payments', description: 'Payment card industry data security standard.', icon: CreditCard, gradient: 'from-orange-500 to-red-500', pages: 19, downloadUrl: '/downloads/PCI_DSS_Compliance_Bundle_2026.zip' }
]

// ============================================
// ADMIN DASHBOARD COMPONENT (with Supabase)
// ============================================
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [config, setConfig] = useState<AdConfig>(FALLBACK_CONFIG)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => { 
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const settings = await getAdSettings()
    if (settings) {
      setConfig({
        enabled: settings.enabled,
        countdown: settings.countdown,
        headerAd: settings.header_ad,
        downloadAd: settings.download_ad,
        verificationCode: settings.verification_code
      })
    }
    setLoading(false)
  }
  
  const save = async () => { 
    setSaving(true)
    setError('')
    
    const success = await updateAdSettings({
      enabled: config.enabled,
      countdown: config.countdown,
      header_ad: config.headerAd,
      download_ad: config.downloadAd,
      verification_code: config.verificationCode
    })
    
    setSaving(false)
    
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setError('Failed to save settings. Please try again.')
    }
  }

  const resetToDefaults = async () => {
    setConfig(FALLBACK_CONFIG)
    await updateAdSettings({
      enabled: false,
      countdown: 5,
      header_ad: '',
      download_ad: '',
      verification_code: ''
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <a href="/" className="text-blue-600 hover:underline">View Site</a>
            <button onClick={onLogout} className="text-gray-600 hover:text-gray-800">Logout</button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Ad Platform Support</h3>
          <p className="text-blue-700 text-sm">
            This works with ANY ad platform: Google AdSense, Media.net, Ezoic, PropellerAds, Adsterra, etc.
            Just paste their HTML/JavaScript code below.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Ad Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Ad Settings</h2>
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.enabled} 
              onChange={e => setConfig({...config, enabled: e.target.checked})} 
              className="w-5 h-5" 
            />
            <span className="font-medium">Enable ads before downloads</span>
          </label>
          
          {config.enabled && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Countdown Timer (seconds)
              </label>
              <input 
                type="number" 
                min="1" 
                max="60"
                value={config.countdown} 
                onChange={e => setConfig({...config, countdown: parseInt(e.target.value) || 5})} 
                className="w-32 px-3 py-2 border rounded" 
              />
              <p className="text-sm text-gray-500 mt-1">
                Users must wait this long before they can download
              </p>
            </div>
          )}
        </div>

        {/* Verification Code */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Site Verification Code</h2>
          <p className="text-gray-600 text-sm mb-4">
            Paste verification codes from Google AdSense, Bing, etc. This goes in the page &lt;head&gt;.
          </p>
          <textarea 
            value={config.verificationCode} 
            onChange={e => setConfig({...config, verificationCode: e.target.value})} 
            placeholder="<!-- Paste meta tag or verification script here -->"
            className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" 
          />
        </div>

        {/* Ad Codes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Ad Placement Codes</h2>
          <p className="text-gray-600 text-sm mb-4">
            Paste ad codes from your ad platform. These will be displayed on your site.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Header Ad (shown at top of page)
            </label>
            <textarea 
              value={config.headerAd} 
              onChange={e => setConfig({...config, headerAd: e.target.value})} 
              placeholder="<!-- Paste ad code here -->"
              className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Download Page Ad (shown before download)
            </label>
            <textarea 
              value={config.downloadAd} 
              onChange={e => setConfig({...config, downloadAd: e.target.value})} 
              placeholder="<!-- Paste ad code here -->"
              className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" 
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={save} 
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Settings
          </button>
          <button 
            onClick={resetToDefaults} 
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Reset to Defaults
          </button>
          {saved && <span className="text-green-600 font-medium self-center">Settings saved!</span>}
        </div>

        {/* Note about Supabase */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <strong>Good news:</strong> Settings are now saved in Supabase and will work across all browsers and devices!
          </p>
        </div>
      </main>
    </div>
  )
}

// ============================================
// ADMIN LOGIN COMPONENT (with Forgot Password)
// ============================================
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('luewaweru@gmail.com') // Pre-filled admin email
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('luewaweru@gmail.com')
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    
    const result = await adminLogin(email, password)
    
    if (result.success) {
      const admin = await isAdmin()
      if (admin) {
        onLogin()
      } else {
        setLoginError('You do not have admin access.')
        await adminLogout()
      }
    } else {
      setLoginError(result.error || 'Login failed. Please check your email and password.')
    }
    
    setLoggingIn(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    setSendingReset(true)
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + '/admin',
    })
    
    setSendingReset(false)
    
    if (error) {
      setResetError(error.message)
    } else {
      setResetSent(true)
    }
  }

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-6">
            Enter your email and we'll send you a password reset link.
          </p>
          
          {resetSent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700">
                <strong>Check your email!</strong> We've sent a password reset link to {resetEmail}.
              </p>
              <button 
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetSent(false)
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={resetEmail} 
                  onChange={e => setResetEmail(e.target.value)} 
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border rounded-lg" 
                  required
                />
              </div>
              
              {resetError && <p className="text-red-500 mb-4">{resetError}</p>}
              
              <button 
                type="submit" 
                disabled={sendingReset}
                className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingReset && <Loader2 className="w-4 h-4 animate-spin" />}
                <Mail className="w-4 h-4" />
                Send Reset Link
              </button>
              
              <button 
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // Show login form
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-6">Sign in to manage ad settings</p>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border rounded-lg" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg" 
              required
            />
          </div>
          
          {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
          
          <button 
            type="submit" 
            disabled={loggingIn}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot password?
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Admin:</strong> luewaweru@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// AD MODAL COMPONENT (with countdown)
// ============================================
function AdModal({ 
  isOpen, 
  onClose, 
  checklist,
  config
}: { 
  isOpen: boolean
  onClose: () => void
  checklist: ChecklistItem
  config: AdConfig
}) {
  const [count, setCount] = useState(config.countdown)
  const [ready, setReady] = useState(false)

  useEffect(() => { 
    setCount(config.countdown)
    setReady(false)
  }, [isOpen, config.countdown])

  useEffect(() => { 
    if (!isOpen || !config.enabled) return 
    if (count > 0) { 
      const t = setTimeout(() => setCount(count - 1), 1000) 
      return () => clearTimeout(t) 
    } else { 
      setReady(true) 
    } 
  }, [count, isOpen, config.enabled])

  if (!isOpen) return null

  const Icon = checklist.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Download {checklist.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Top Ad */}
        {config.enabled && config.downloadAd && (
          <div 
            className="bg-gray-100 rounded p-4 mb-4 text-center" 
            dangerouslySetInnerHTML={{ __html: config.downloadAd }} 
          />
        )}

        {/* Countdown or Download Button */}
        <div className="text-center py-6">
          {config.enabled ? (
            !ready ? (
              <div className="space-y-4">
                <div className={`bg-gradient-to-r ${checklist.gradient} text-white p-4 rounded-lg inline-block mb-4`}>
                  <Icon className="w-12 h-12" />
                </div>
                <p className="text-gray-600">Please wait while we prepare your download...</p>
                <div className="text-5xl font-bold text-blue-600">{count}</div>
                <p className="text-sm text-gray-500">Your download will start automatically</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Your file is ready!</p>
                <a 
                  href={checklist.downloadUrl} 
                  download 
                  onClick={onClose}
                  className={`inline-block px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r ${checklist.gradient} hover:opacity-90`}
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Download Now
                </a>
              </div>
            )
          ) : (
            // Ads disabled - show immediate download
            <div className="space-y-4">
              <div className={`bg-gradient-to-r ${checklist.gradient} text-white p-4 rounded-lg inline-block mb-4`}>
                <Icon className="w-12 h-12" />
              </div>
              <p className="text-gray-600">Click below to download your file</p>
              <a 
                href={checklist.downloadUrl} 
                download 
                onClick={onClose}
                className={`inline-block px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r ${checklist.gradient} hover:opacity-90`}
              >
                <Download className="w-5 h-5 inline mr-2" />
                Download Now
              </a>
            </div>
          )}
        </div>

        {/* Bottom Ad */}
        {config.enabled && config.downloadAd && (
          <div 
            className="bg-gray-100 rounded p-4 mt-4 text-center" 
            dangerouslySetInnerHTML={{ __html: config.downloadAd }} 
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [config, setConfig] = useState<AdConfig>(FALLBACK_CONFIG)
  const [selected, setSelected] = useState<ChecklistItem | null>(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Load config from Supabase on mount
  useEffect(() => { 
    loadConfig()
    checkAuth()
  }, [])

  const loadConfig = async () => {
    const settings = await getAdSettings()
    if (settings) {
      setConfig({
        enabled: settings.enabled,
        countdown: settings.countdown,
        headerAd: settings.header_ad,
        downloadAd: settings.download_ad,
        verificationCode: settings.verification_code
      })
    }
  }

  const checkAuth = async () => {
    const admin = await isAdmin()
    setIsAdminUser(admin)
    setCheckingAuth(false)
  }

  // Handle logout
  const handleLogout = async () => {
    await adminLogout()
    setIsAdminUser(false)
  }

  // Admin route
  if (window.location.pathname === '/admin') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )
    }

    if (!isAdminUser) {
      return <AdminLogin onLogin={() => setIsAdminUser(true)} />
    }
    
    return <AdminDashboard onLogout={handleLogout} />
  }

  // Handle download click
  const handleDownloadClick = (checklist: ChecklistItem) => {
    if (config.enabled) {
      // Show ad modal with countdown
      setSelected(checklist)
    } else {
      // Ads disabled - download directly
      window.location.href = checklist.downloadUrl
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Verification Code (hidden) */}
      {config.verificationCode && (
        <div dangerouslySetInnerHTML={{ __html: config.verificationCode }} style={{ display: 'none' }} />
      )}

      {/* Header Ad */}
      {config.enabled && config.headerAd && (
        <div 
          className="bg-white border-b p-2 text-center" 
          dangerouslySetInnerHTML={{ __html: config.headerAd }} 
        />
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Checklists Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map(c => {
            const Icon = c.icon
            return (
              <div key={c.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${c.gradient} text-white p-3 rounded-lg w-fit mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{c.subtitle}</p>
                <p className="text-gray-600 mb-4">{c.description}</p>
                <p className="text-sm text-gray-400 mb-4">{c.pages} pages</p>
                <button 
                  onClick={() => handleDownloadClick(c)}
                  className={`w-full text-center bg-gradient-to-r ${c.gradient} text-white py-2 rounded-md font-medium hover:opacity-90`}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Free
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Note about downloads */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">About Downloads</h4>
              <p className="text-yellow-700 text-sm mt-1">
                Make sure to upload your ZIP files to the <code className="bg-yellow-100 px-1 rounded">public/downloads/</code> folder 
                in your GitHub repository. The download links won't work without the actual files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 ComplianceHub. All rights reserved.</p>
        </div>
      </footer>

      {/* Ad Modal */}
      {selected && (
        <AdModal 
          isOpen={true} 
          onClose={() => setSelected(null)} 
          checklist={selected}
          config={config}
        />
      )}
    </div>
  )
}

export default App
