import React, { useState } from 'react';
import { 
  LayoutDashboard, Bot, Megaphone, Activity, 
  ArrowUpRight, ShieldAlert, Sparkles, MapPin, DollarSign, 
  Layers, Users, Copy, CheckCircle, Target, Send
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// Change this link to your Render URL after hosting backend
const BACKEND_URL = "http://localhost:5000";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Business Twin. Ask me anything about scaling your shop!' }
  ]);

  const [formData, setFormData] = useState({
    category: 'Jewellery',
    budget: '5000',
    targetAge: '18',
    location: 'Hapur'
  });

  const [graphData, setGraphData] = useState([
    { month: 'Jan', revenue: 4000, prediction: 4200 },
    { month: 'Feb', revenue: 3000, prediction: 3500 },
    { month: 'Mar', revenue: 5000, prediction: 5300 },
    { month: 'Apr', revenue: 4700, prediction: 7050 },
    { month: 'May', revenue: 6000, prediction: 6500 },
    { month: 'Jun', revenue: 6500, prediction: 7200 },
  ]);

  const [aiOutput, setAiOutput] = useState({
    adCopy: "✨ Premium Jewellery Collection now live in Hapur! ✨\n\nLooking for the perfect style statement? Specially crafted to blend classic tradition with modern trends, our latest collection is perfect for the age group 18+!\n\n📍 Visit our hub in Hapur today or DM us for exclusive lookbooks!",
    hashtags: "#Jewellery #ShopLocalHapur #FashionVibes",
    strategy: "Allocate ₹5000 towards highly optimized geo-fenced Instagram carousel ads targeting buyers within 15km of Hapur."
  });
  
  const [confidenceScore, setConfidenceScore] = useState('99%');

  const handleSimulate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setGraphData(data.graphData);
        setAiOutput(data.aiOutput);
        setConfidenceScore(data.confidence);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          category: formData.category,
          location: formData.location,
          targetAge: formData.targetAge
        }),
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">TwinSeller AI</h1>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'twin', label: 'AI Twin Chat', icon: Bot },
              { id: 'marketing', label: 'Marketing Gen', icon: Megaphone },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400">
          <p>Hackathon Build v1.2</p>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>AI Core: Connected
          </div>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0f172a]">
        <div className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-[#1e293b]/30 backdrop-blur-md z-10">
          <h2 className="text-xl font-semibold text-slate-200 capitalize">{activeTab} View</h2>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full font-mono">API SYSTEM ACTIVE</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { title: 'Business Health', value: '92%', change: '+2.4%', color: 'text-emerald-400', icon: Activity, bg: 'from-emerald-500/10 border-emerald-500/20' },
                  { title: 'Growth Potential', value: 'Exponential', change: 'Live Predict', color: 'text-purple-400', icon: ArrowUpRight, bg: 'from-purple-500/10 border-purple-500/20' },
                  { title: 'Risk Score', value: 'Low', change: 'Stable', color: 'text-sky-400', icon: ShieldAlert, bg: 'from-sky-500/10 border-sky-500/20' },
                  { title: 'AI Confidence', value: confidenceScore, change: 'Optimized', color: 'text-indigo-400', icon: Sparkles, bg: 'from-indigo-500/10 border-indigo-500/20' },
                ].map((card, i) => (
                  <div key={i} className={`bg-gradient-to-b ${card.bg} bg-[#1e293b] border p-5 rounded-2xl`}>
                    <div className="flex justify-between items-start"><span className="text-sm text-slate-400 font-medium">{card.title}</span><card.icon className={`w-5 h-5 ${card.color}`} /></div>
                    <div className="mt-4 flex items-baseline gap-2"><span className={`text-3xl font-bold tracking-tight ${card.color}`}>{card.value}</span><span className="text-xs text-slate-500">{card.change}</span></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 h-fit">
                  <div className="flex items-center gap-2 mb-6"><Bot className="w-6 h-6 text-indigo-400" /><h3 className="text-lg font-semibold text-slate-200">Simulation Settings</h3></div>
                  <div className="space-y-4">
                    <div><label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Product Category</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Budget Limit (₹)</label><input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Target Age</label><input type="number" value={formData.targetAge} onChange={(e) => setFormData({...formData, targetAge: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none" /></div>
                    <div><label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> City Hub</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none" /></div>
                    <button onClick={(e) => handleSimulate(e)} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Sparkles className="w-4 h-4" /> Run Simulation Engine</>}
                    </button>
                  </div>
                </div>

                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-200">Twin Forecast & Simulation Chart</h3>
                  <div className="h-64 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                          <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRev)" name="Baseline Sales" />
                        <Area type="monotone" dataKey="prediction" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorPred)" name="AI Twin Projection" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {aiOutput && (
                <div className="bg-[#1e293b] border border-indigo-500/30 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-4"><Megaphone className="w-6 h-6 text-indigo-400" /><h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Live Localized Output Insights</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 relative">
                      <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1"><Target className="w-3.5 h-3.5" /> High Converting Ad Text</span><button onClick={() => { navigator.clipboard.writeText(aiOutput.adCopy); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-400 hover:text-white">{copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}</button></div>
                      <p className="text-sm text-slate-300 whitespace-pre-line">{aiOutput.adCopy}</p><p className="text-xs text-indigo-300 mt-2 font-mono">{aiOutput.hashtags}</p>
                    </div>
                    <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div><span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">💡 Strategic Twin Advice</span><p className="text-sm text-slate-300 font-medium">"{aiOutput.strategy}"</p></div>
                      <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-lg text-xs text-slate-300">🎯 Contextually configured targeting for <b>{formData.location}</b> demographics.</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'twin' && (
            <div className="bg-[#1e293b] border border-slate-800 rounded-2xl h-[calc(100vh-12rem)] flex flex-col justify-between overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-[#1e293b]/50 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-semibold text-sm">AI Digital Twin Advisor</h3>
                  <p className="text-xs text-slate-400">Context: {formData.category} in {formData.location}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-4 text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#0f172a] border border-slate-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 animate-pulse">Twin is thinking...</div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#0f172a]/50 flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={`Ask anything about selling ${formData.category}...`} className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 text-sm focus:outline-none" />
                <button type="submit" className="bg-indigo-600 p-3 rounded-xl"><Send className="w-4 h-4 text-white" /></button>
              </form>
            </div>
          )}

          {activeTab === 'marketing' && aiOutput && (
            <div className="bg-[#1e293b] border border-indigo-500/30 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4"><Megaphone className="w-6 h-6 text-indigo-400" /><h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Automated Marketing Panel</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800"><p className="text-sm text-slate-300 whitespace-pre-line">{aiOutput.adCopy}</p><p className="text-xs text-indigo-300 mt-2 font-mono">{aiOutput.hashtags}</p></div>
                <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800"><p className="text-sm text-slate-300 font-medium">"{aiOutput.strategy}"</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}