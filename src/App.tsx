import { Shield, Globe, FileCheck, Lock, Server, CreditCard, Download } from 'lucide-react'

const checklists = [
  { id: 'hipaa', title: 'HIPAA Compliance', subtitle: 'Healthcare Providers', description: 'Complete checklist for healthcare data protection compliance.', icon: Shield, gradient: 'from-blue-500 to-cyan-500', pages: 14, downloadUrl: '/downloads/HIPAA_Compliance_Bundle_2026.zip' },
  { id: 'gdpr', title: 'GDPR Compliance', subtitle: 'SaaS & EU Businesses', description: 'European data protection regulation compliance guide.', icon: Globe, gradient: 'from-indigo-500 to-purple-500', pages: 16, downloadUrl: '/downloads/GDPR_Compliance_Bundle_2026.zip' },
  { id: 'soc2', title: 'SOC 2 Type II', subtitle: 'Tech & SaaS Companies', description: 'Service organization control compliance framework.', icon: FileCheck, gradient: 'from-amber-500 to-orange-500', pages: 15, downloadUrl: '/downloads/SOC2_Compliance_Bundle_2026.zip' },
  { id: 'ccpa', title: 'CCPA/CPRA', subtitle: 'California Businesses', description: 'California consumer privacy rights compliance.', icon: Lock, gradient: 'from-green-500 to-emerald-500', pages: 15, downloadUrl: '/downloads/CCPA_Compliance_Bundle_2026.zip' },
  { id: 'iso27001', title: 'ISO 27001', subtitle: 'Enterprise Security', description: 'Information security management system standard.', icon: Server, gradient: 'from-purple-500 to-pink-500', pages: 18, downloadUrl: '/downloads/ISO27001_Compliance_Bundle_2026.zip' },
  { id: 'pci', title: 'PCI DSS', subtitle: 'E-commerce & Payments', description: 'Payment card industry data security standard.', icon: CreditCard, gradient: 'from-orange-500 to-red-500', pages: 19, downloadUrl: '/downloads/PCI_DSS_Compliance_Bundle_2026.zip' }
]

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ComplianceHub</span>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <span className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">2026 Edition - Free Downloads</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Free Compliance Checklists</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Professional compliance assessment tools for HIPAA, GDPR, SOC 2, CCPA, ISO 27001, and PCI DSS.</p>
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
                <a href={checklist.downloadUrl} download className={`block w-full text-center bg-gradient-to-r ${checklist.gradient} text-white py-2 rounded-md font-medium hover:opacity-90`}>
                  <Download className="w-4 h-4 inline mr-2" />Download Free
                </a>
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
    </div>
  )
}

export default App
