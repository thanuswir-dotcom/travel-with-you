import React, { useState } from 'react';
import {
  GraduationCap, Sparkles, Wallet, Clock, Users, MapPin,
  Zap, ChevronRight, RotateCcw, CheckCircle2, Loader2,
  MessageCircle, Send, Bot, Navigation2
} from 'lucide-react';
import { generateTripPlan, generateAIChat, isGeminiConfigured } from '../utils/gemini';
import type { TripPlan, TripPlanRequest } from '../utils/gemini';

interface PlannerPageProps {
  city: string;
}

const VIBE_OPTIONS = [
  { id: 'cafes', label: '☕ Café Hopping', desc: 'Cozy spots & filter coffee' },
  { id: 'street_food', label: '🍕 Street Food Run', desc: 'Cheap eats & local flavors' },
  { id: 'parks_nature', label: '🌳 Park & Chill', desc: 'Green spaces & fresh air' },
  { id: 'entertainment', label: '🎮 Gaming & Fun', desc: 'Bowling, arcades & VR' },
  { id: 'cultural_temples', label: '🛕 Cultural Tour', desc: 'Heritage & temples' },
  { id: 'photo_spots', label: '📸 Photo Walk', desc: 'Aesthetic spots & vibes' },
  { id: 'shopping', label: '🛍️ Market Crawl', desc: 'Thrift & bargain hunting' },
  { id: 'weekend_trips', label: '🏔️ Day Trip', desc: 'Get out of the city' },
];

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({ city }) => {
  // Planner State
  const [budget, setBudget] = useState(500);
  const [friends, setFriends] = useState(3);
  const [hours, setHours] = useState(4);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [transitMode, setTransitMode] = useState<string>('metro');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTripSaved, setIsTripSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'chat'>('planner');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hey there! 👋 I'm TripBot, your AI travel sidekick for ${city}! Ask me anything — cheap food spots, places to go with friends, budget hacks, weekend trip ideas, or just "what should I do today?" 🎒`,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const toggleVibe = (id: string) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setIsTripSaved(false);
    setTripPlan(null);

    const request: TripPlanRequest = {
      budget,
      friends,
      hours,
      city,
      preferences: selectedVibes,
    };

    const plan = await generateTripPlan(request);
    setTripPlan(plan);
    setIsGenerating(false);
  };

  const handleSaveTrip = () => {
    setIsTripSaved(true);
    if (!tripPlan) return;
    try {
      const stored = localStorage.getItem('twy_trips');
      const trips = stored ? JSON.parse(stored) : [];
      if (!trips.some((t: any) => t.title === tripPlan.title)) {
        trips.push({ ...tripPlan, id: `trip-${Date.now()}`, savedAt: new Date().toISOString() });
        localStorage.setItem('twy_trips', JSON.stringify(trips));
      }
    } catch {}
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    const newUserMsg: ChatMessage = { role: 'user', text: userMsg, timestamp: new Date() };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setIsChatLoading(true);

    const history = chatMessages.map((m) => ({ role: m.role, text: m.text }));
    const response = await generateAIChat(userMsg, city, history);

    setChatMessages((prev) => [
      ...prev,
      { role: 'model', text: response, timestamp: new Date() },
    ]);
    setIsChatLoading(false);
  };

  const budgetPerPerson = Math.floor(budget / Math.max(friends, 1));

  return (
    <div className="min-h-screen py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>AI-Powered Student Mode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Your Personal Trip Planner
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Tell the AI your budget, squad size, and time available — get a complete multi-stop itinerary with cost breakdown in seconds.
        </p>
        {!isGeminiConfigured() && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            ⚡ Demo Mode — Add your Gemini API key for live AI plans
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex bg-slate-900/80 border border-slate-800 rounded-2xl p-1 mb-8 max-w-xs mx-auto">
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Trip Planner
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          AI Chat
        </button>
      </div>

      {/* ── PLANNER TAB ────────────────────────────────────────────────── */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Budget */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Group Budget</label>
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">₹{budget}</div>
              <div className="text-[11px] text-slate-500 mb-3">≈ ₹{budgetPerPerson} per person</div>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>₹200</span><span>₹5000</span>
              </div>
            </div>

            {/* Friends */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-teal-400" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Friends (incl. you)</label>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">{friends} people</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFriends(n)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      friends === n
                        ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-cyan-400" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Available Time</label>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">{hours} hours</div>
              <div className="flex gap-2">
                {[2, 3, 4, 6, 8].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHours(h)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      hours === h
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vibe Selector */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                What's your vibe today? <span className="text-slate-500 font-normal">(optional, select multiple)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => toggleVibe(v.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedVibes.includes(v.id)
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="text-sm font-semibold">{v.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{v.desc}</div>
                  {selectedVibes.includes(v.id) && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Transportation Method Selector */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Navigation2 className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Transportation Method
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'metro', label: '🚇 Metro / Bus', desc: 'Cheapest & fastest' },
                { id: 'auto', label: '🛺 Auto / Shared Cab', desc: 'Direct & convenient' },
                { id: 'walking', label: '🚶 Walking / Cycle', desc: 'Zero cost & healthy' },
                { id: 'bike', label: '🛵 Two-Wheeler', desc: 'Flexible with friends' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTransitMode(t.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    transitMode === t.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/20 hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI is building your perfect day...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate My Student Trip Plan ✨</span>
              </>
            )}
          </button>

          {/* Trip Plan Results */}
          {tripPlan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Plan Header Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-teal-500/5 border border-emerald-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                      ✨ AI Generated Plan • {tripPlan.vibe} Vibe
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">{tripPlan.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal-400" />{tripPlan.duration}</span>
                      <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-emerald-400" />₹{tripPlan.totalEstimatedCost}/person</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" />{tripPlan.stops.length} stops</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveTrip}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isTripSaved
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      <span>{isTripSaved ? '✓ Trip Saved' : 'Save Trip'}</span>
                    </button>
                    <button
                      onClick={handleGeneratePlan}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Budget Guardian Alert */}
                <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between mb-4 ${
                  tripPlan.totalEstimatedCost * friends <= budget
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span>
                      <strong>Budget Guardian:</strong> Total group spend is ₹{tripPlan.totalEstimatedCost * friends} (Target Budget: ₹{budget}).
                    </span>
                  </div>
                  <span className="font-bold text-[11px] underline">
                    {tripPlan.totalEstimatedCost * friends <= budget ? 'Within Budget!' : 'Slightly Over Budget'}
                  </span>
                </div>

                {/* Budget Breakdown */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Food', value: tripPlan.budgetBreakdown.food, color: 'text-amber-400' },
                    { label: 'Transport', value: tripPlan.budgetBreakdown.transport, color: 'text-blue-400' },
                    { label: 'Activities', value: tripPlan.budgetBreakdown.activities, color: 'text-purple-400' },
                    { label: 'Buffer', value: tripPlan.budgetBreakdown.buffer, color: 'text-slate-400' },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                      <div className={`text-sm font-bold ${item.color}`}>₹{item.value}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Tips */}
                <div className="space-y-1.5">
                  {tripPlan.quickTips.map((tip, i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stop Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Your Itinerary</h3>
                {tripPlan.stops.map((stop, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        {stop.order}
                      </div>
                      {idx < tripPlan.stops.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-800 mt-2" />
                      )}
                    </div>

                    {/* Stop Card */}
                    <div className="flex-1 mb-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            {stop.category}
                          </span>
                          <h4 className="text-base font-bold text-white">{stop.name}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs flex-shrink-0">
                          <span className="flex items-center gap-1 text-teal-400">
                            <Clock className="w-3 h-3" />{stop.duration}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                            ₹{stop.estimatedCost === 0 ? 'Free' : stop.estimatedCost}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{stop.description}</p>
                      <div className="flex flex-wrap gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-amber-400">
                          💡 {stop.tips}
                        </span>
                        {idx < tripPlan.stops.length - 1 && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <ChevronRight className="w-3 h-3" />
                            Next: {stop.travelTime}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const q = encodeURIComponent(stop.name + ' Bengaluru');
                          window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                        }}
                        className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        <Navigation2 className="w-3 h-3" />
                        Open in Maps
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="flex flex-col h-[600px] rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">TripBot AI</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Online • {city} Expert
              </div>
            </div>
            {!isGeminiConfigured() && (
              <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                Demo Mode
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-sm'
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-xs text-slate-400">TripBot is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-slate-800/60">
            {[
              'Cheap food spots?',
              'Best parks in Bangalore?',
              'Plans under ₹300',
              'Places for 5 friends',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => { setChatInput(prompt); }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-800 flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder="Ask TripBot anything about student travel in Bengaluru..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim() || isChatLoading}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
