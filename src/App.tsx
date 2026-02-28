import { useState, useEffect } from 'react'
import { Shield, Globe, FileCheck, Lock, Server, CreditCard, Download, X, Settings } from 'lucide-react'

const checklists = [
  { id: 'hipaa', title: 'HIPAA Compliance', subtitle: 'Healthcare Providers', description: 'Healthcare data protection compliance.', icon: Shield, gradient: 'from-blue-500 to-cyan-500', pages: 14, downloadUrl: '/downloads/HIPAA_Compliance_Bundle_2026.zip' },
  { id: 'gdpr', title: 'GDPR Compliance', subtitle: 'SaaS & EU Businesses', description: 'European data protection compliance.', icon: Globe, gradient: 'from-indigo-500 to-purple-500', pages: 16, downloadUrl: '/downloads/GDPR_Compliance_Bundle_2026.zip' },
  { id: 'soc2', title: 'SOC 2 Type II', subtitle: 'Tech & SaaS Companies', description: 'Service organization control framework.', icon: FileCheck, gradient: 'from-amber-500 to-orange-500', pages: 15, downloadUrl: '/downloads/SOC2_Compliance_Bundle_2026.zip' },
  { id: 'ccpa', title: 'CCPA/CPRA', subtitle: 'California Businesses', description: 'California consumer privacy compliance.', icon: Lock, gradient: 'from-green-500 to-emerald-500', pages: 15, downloadUrl: '/downloads/CCPA_Compliance_Bundle_2026.zip' },
  { id: 'iso27001', title: 'ISO 27001', subtitle: 'Enterprise Security', description: 'Information security management.', icon: Server, gradient: 'from-purple-500 to-pink-500', pages: 18, downloadUrl: '/downloads/ISO27001_Compliance_Bundle_2026.zip' },
  { id: 'pci', title: 'PCI DSS', subtitle: 'E-commerce & Payments', description: 'Payment card industry security.', icon: CreditCard, gradient: 'from-orange-500 to-red-500', pages: 19, downloadUrl: '/downloads/PCI_DSS_Compliance_Bundle_2026.zip' }
]

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [config, setConfig] = useState({ enabled: false, countdown: 5, headerAd: '', downloadAd: '', verificationCode: '' })
  const [saved, setSaved] = useState(false)
  useEffect(() => { const s = localStorage.getItem('adConfig'); if (s) setConfig(JSON.parse(s)) }, [])
  const save = () => { localStorage.setItem('adConfig', JSON.stringify(config)); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <a href="/" className="text-blue-600">View Site</a>
            <button onClick={onLogout} className="text-gray-600">Logout</button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Ad Settings</h2>
          <label className="flex items-center gap-3 mb-4">
            <input type="checkbox" checked={config.enabled} onChange={e => setConfig({...config, enabled: e.target.checked})} className="w-5 h-5" />
            <span>Enable ads before downloads</span>
          </label>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Countdown (seconds)</label>
            <input type="number" value={config.countdown} onChange={e => setConfig({...config, countdown: parseInt(e.target.value) || 5})} className="w-32 px-3 py-2 border rounded" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Verification Code</h2>
          <textarea value={config.verificationCode} onChange={e => setConfig({...config, verificationCode: e.target.value})} placeholder="Paste Google AdSense verification code" className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Ad Codes</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Header Ad</label>
            <textarea value={config.headerAd} onChange={e => setConfig({...config, headerAd: e.target.value})} placeholder="Paste ad code" className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Download Page Ad</label>
            <textarea value={config.downloadAd} onChange={e => setConfig({...config, downloadAd: e.target.value})} placeholder="Paste ad code" className="w-full h-24 px-3 py-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Settings</button>
        {saved && <span className="ml-4 text-green-600">Saved!</span>}
      </main>
    </div>
  )
}

function AdModal({ isOpen, onClose, checklist }: { isOpen: boolean, onClose: () => void, checklist: any }) {
  const [config, setConfig] = useState({ enabled: false, countdown: 5, downloadAd: '' })
  const [count, setCount] = useState(5)
  const [ready, setReady] = useState(false)
  useEffect(() => { const s = localStorage.getItem('adConfig'); if (s) { const c = JSON.parse(s); setConfig(c); setCount(c.countdown || 5) } }, [isOpen])
  useEffect(() => { if (!isOpen || !config.enabled) return; if (count > 0) { const t = setTimeout(() => setCount(count - 1), 1000); return () => clearTimeout(t) } else setReady(true) }, [count, isOpen, config.enabled])
  if (!isOpen) return null
  if (!config.enabled) { window.location.href = checklist.downloadUrl; onClose(); return null }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Download {checklist.title}</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>
        {config.downloadAd && <div className="bg-gray-100 rounded p-4 mb-4 text-center" dangerouslySetInnerHTML={{ __html: config.downloadAd }} />}
        <div className="text-center py-4">
          {!ready ? (<><p className="text-gray-600 mb-2">Please wait...</p><div className="text-5xl font-bold text-blue-600">{count}</div></>) : (
            <a href={checklist.downloadUrl} download onClick={onClose} className={`inline-block px-8 py-3 rounded-lg text-white font-medium bg-gradient-to-r ${checklist.gradient}`}>
              <Download className="w-5 h-5 inline mr-2" />Download Now
            </a>
          )}
        </div>
        {config.downloadAd && <div className="bg-gray-100 rounded p-4 mt-4 text-center" dangerouslySetInnerHTML={{ __html: config.downloadAd }} />}
      </div>
    </div>
  )
}

function App() {
  const [config, setConfig] = useState({ enabled: false, headerAd: '', verificationCode: '' })
  const [selected, setSelected] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { const s = localStorage.getItem('adConfig'); if (s) setConfig(JSON.parse(s)) }, [])
  if (window.location.pathname === '/admin') {
    if (!isAdmin) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={e => { e.preventDefault(); if (password === 'admin123') setIsAdmin(true); else setError('Wrong password') }}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border rounded-lg mb-4" />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Login</button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">Password: admin123</p>
        </div>
      </div>
    )
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {config.verificationCode && <div dangerouslySetInnerHTML={{ __html: config.verificationCode }} style={{ display: 'none' }} />}
      {config.enabled && config.headerAd && <div className="bg-white border-b p-2 text-center" dangerouslySetInnerHTML={{ __html: config.headerAd }} />}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg"><Shield className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ComplianceHub</span>
          </div>
          <button onClick={() => window.location.href = '/admin'} className="flex items-center gap-2 text-gray-600"><Settings className="w-5 h-5" /><span className="hidden sm:inline">Admin</span></button>
        </div>
      </header>
      <section className="container mx-auto px-4 py-16 text-center">
        <span className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">2026 Edition - Free Downloads</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Free Compliance Checklists</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Professional compliance assessment tools for HIPAA, GDPR, SOC 2, CCPA, ISO 27001, and PCI DSS.</p>
      </section>
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map(c => {
            const Icon = c.icon
            return (
              <div key={c.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${c.gradient} text-white p-3 rounded-lg w-fit mb-4`}><Icon className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{c.subtitle}</p>
                <p className="text-gray-600 mb-4">{c.description}</p>
                <p className="text-sm text-gray-400 mb-4">{c.pages} pages</p>
                <button onClick={() => setSelected(c)} className={`w-full text-center bg-gradient-to-r ${c.gradient} text-white py-2 rounded-md font-medium hover:opacity-90`}><Download className="w-4 h-4 inline mr-2" />Download Free</button>
              </div>
            )
          })}
        </div>
      </section>
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center"><p>&copy; 2026 ComplianceHub. All rights reserved.</p></div>
      </footer>
      <AdModal isOpen={!!selected} onClose={() => setSelected(null)} checklist={selected} />
    </div>
  )
}

export default App
