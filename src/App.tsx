import React, { useState, useEffect } from 'react';
import { Search, Loader2, Globe, ExternalLink, Info, X, ChevronRight, LayoutGrid, Newspaper, Image as ImageIcon, Video, ShoppingCart, Star, Play, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, SearchResult, KnowledgeData, SearchTab } from './services/aiService';

// --- Components ---

const SearchInput = ({ value, onChange, onSearch, placeholder, size = 'large' }: any) => {
  return (
    <div className="relative w-full max-w-2xl group">
      <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-110 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      <div className={`relative flex items-center w-full glass-light rounded-full transition-all duration-300 ${size === 'large' ? 'p-1 h-16' : 'p-0.5 h-12'} focus-within:bg-white/20 shadow-2xl`}>
        <div className="pl-6 text-white/40">
          <Search className={size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
          placeholder={placeholder || "Ask anything..."}
          className="flex-1 bg-transparent border-none outline-none text-white px-4 text-lg placeholder:text-white/30"
          id="search-box"
        />
        <div className="flex items-center gap-2 pr-4">
          {value && (
            <button onClick={() => onChange('')} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onSearch(value)}
            className="bg-white text-blue-900 font-bold p-3 rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            {size === 'large' ? <ChevronRight className="w-6 h-6" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ result, index, type }: { result: SearchResult; index: number; type: SearchTab }) => {
  if (type === 'images') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.03 }}
        className="break-inside-avoid mb-4 group cursor-pointer"
      >
        <div className="relative glass-dark rounded-2xl overflow-hidden border-white/5 aspect-square">
          <img 
            src={`https://loremflickr.com/400/400/${result.thumbnail || 'abstract'}?lock=${index}`} 
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
             <p className="text-white text-xs font-bold truncate">{result.title}</p>
             <p className="text-white/40 text-[10px] uppercase tracking-widest truncate">{result.url}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'videos') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 group"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-64 aspect-video glass-dark rounded-xl overflow-hidden border-white/5">
             <img 
              src={`https://loremflickr.com/400/225/${result.thumbnail || 'video'}?lock=${index}`} 
              className="w-full h-full object-cover opacity-60" 
              loading="lazy"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-white/40">
                   <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                </div>
             </div>
             <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">{result.duration || '0:00'}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">{result.title}</h3>
            <div className="flex items-center gap-4 text-white/40 text-xs mb-3 uppercase tracking-widest font-black">
              <span>{result.source}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>102K Views</span>
            </div>
            <p className="text-white/60 text-sm line-clamp-2">{result.snippet}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'shopping') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-3xl p-4 group hover:bg-white/5 transition-colors border-white/5 flex flex-col"
      >
        <div className="aspect-square glass-dark rounded-2xl mb-4 overflow-hidden relative border-white/5 bg-white/5">
          <img 
            src={`https://loremflickr.com/400/400/${result.thumbnail || 'product'}?lock=${index}`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" 
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-white text-black px-2 py-1 rounded-lg font-black text-xs shadow-xl">{result.price || '$0.00'}</div>
        </div>
        <div className="flex flex-col h-full">
          <h3 className="text-white font-bold mb-1 truncate">{result.title}</h3>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">{result.source}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold text-white/60">{result.rating || '4.5'}</span>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Buy</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-10 group"
      id={`result-${index}`}
    >
      <div className="flex items-center text-xs text-white/40 mb-1 space-x-2 font-mono tracking-wider">
        <span className="truncate">{result.url}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-2xl font-semibold text-white hover:text-white/80 transition-colors mb-2 block tracking-tight">
        {result.title}
      </a>
      <p className="text-white/60 text-base leading-relaxed max-w-3xl">
        {result.snippet}
      </p>
    </motion.div>
  );
};

const KnowledgePanel = ({ data, loading }: { data: KnowledgeData | null; loading: boolean }) => {
  if (loading) return (
    <div className="p-8 glass-dark rounded-3xl animate-pulse">
      <div className="h-8 w-3/4 bg-white/10 rounded-lg mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/5 rounded"></div>
        <div className="h-4 w-full bg-white/5 rounded"></div>
        <div className="h-4 w-5/6 bg-white/5 rounded"></div>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 glass-dark rounded-3xl shadow-2xl relative overflow-hidden group"
      id="knowledge-panel"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors"></div>

      <div className="aspect-[16/10] w-full bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative border border-white/5">
        <img 
          src={`https://loremflickr.com/800/500/${data.title.split(' ')[0]}?lock=100`} 
          alt={data.title}
          className="w-full h-full object-cover opacity-60 mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-white bg-black/60 px-3 py-1 rounded backdrop-blur border border-white/10">Verification: 98%</div>
        </div>
      </div>

      <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">{data.title}</h2>
      <p className="text-white/70 text-base mb-8 leading-relaxed font-light">
        {data.description}
      </p>
      
      <div className="space-y-6">
        {data.facts.map((fact, idx) => (
          <div key={idx} className="flex flex-col group/fact">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover/fact:text-white/50 transition-colors">{fact.label}</span>
            <span className="text-base text-white/90 font-medium group-hover/fact:text-white transition-colors">{fact.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center text-[10px] uppercase font-black text-white/20 tracking-widest leading-none">
          <Info className="w-3.5 h-3.5 mr-2 opacity-50" />
          AI Synthesized Agent • v2.0
        </div>
        <button className="text-[10px] uppercase font-black text-white/60 hover:text-white transition-colors tracking-widest">Share Info</button>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'results'>('home');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState(['James Webb Space Telescope', 'Neuralink Updates', 'Global Fusion Energy', 'AI Ethics 2024']);

  const handleSearch = async (searchQuery: string, tab: SearchTab = 'all') => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setActiveTab(tab);
    setView('results');
    setLoading(true);
    setResults([]);
    setKnowledge(null);
    
    // Fetch search results first (critical path)
    const searchRes = await aiService.generateSearchResults(searchQuery, tab);
    setResults(searchRes);
    setLoading(false);

    // Fetch knowledge panel in background if on 'all' tab (non-critical path)
    if (tab === 'all') {
      aiService.generateKnowledgePanel(searchQuery).then(knowledgeRes => {
        setKnowledge(knowledgeRes);
      }).catch(err => console.error("Knowledge panel error:", err));
    }
  };

  const changeTab = (tab: SearchTab) => {
    handleSearch(query, tab);
  };

  const goHome = () => {
    setQuery('');
    setResults([]);
    setKnowledge(null);
    setActiveTab('all');
    setView('home');
  };

  const Tabs = () => (
    <div className="px-6 lg:px-12 py-3 border-b border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
        {[
          { id: 'all', label: 'All Results', icon: LayoutGrid },
          { id: 'news', label: 'News Lattice', icon: Newspaper },
          { id: 'images', label: 'Images', icon: ImageIcon },
          { id: 'videos', label: 'Videos', icon: Video },
          { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => changeTab(tab.id as SearchTab)}
            className={`flex items-center gap-2 pb-2 bg-transparent cursor-pointer transition-colors ${activeTab === tab.id ? 'text-white border-b-2 border-white' : 'hover:text-white border-b-2 border-transparent'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (view === 'home') {
    return (
      <div className="relative min-h-screen flex flex-col bg-immersive overflow-hidden" id="home-view">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 lg:px-12 py-8 z-20">
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
            <button onClick={goHome} className="hover:text-white border-b-2 border-white pb-1 bg-transparent cursor-pointer">Search</button>
            <button className="hover:text-white border-b-2 border-transparent pb-1 bg-transparent cursor-pointer">Intelligence</button>
            <button className="hover:text-white border-b-2 border-transparent pb-1 bg-transparent cursor-pointer">Immersive</button>
            <button className="hover:text-white border-b-2 border-transparent pb-1 bg-transparent cursor-pointer">Discovery</button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-[0.25em] text-white/50">SafeSearch: Active</div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-sm border-2 border-white/20 shadow-2xl">F</div>
          </div>
        </nav>

        {/* Featured Image Credit (Top Right) */}
        <div className="absolute top-12 right-12 z-10 text-right opacity-30 group hidden lg:block">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Featured Atmospheric</p>
          <p className="text-sm font-light">Void Manifestation • San Francisco Digital</p>
        </div>

        {/* Main Content */}
        <main className="relative flex-grow flex flex-col items-center justify-center -mt-20 px-6 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-[100px] lg:text-[140px] font-black tracking-[-0.05em] logo-gradient drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] leading-[0.9] select-none">
              FAHHH
            </h1>
            <p className="text-white/40 font-black uppercase tracking-[0.5em] text-[10px] sm:text-xs mt-8">Next Generation Synthesized Search</p>
          </motion.div>

          <SearchInput 
            value={query} 
            onChange={setQuery} 
            onSearch={handleSearch} 
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center gap-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Trending Synthesis:</span>
            <div className="flex flex-wrap gap-4">
              {trending.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSearch(item)}
                  className="text-white/60 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-widest bg-transparent cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </main>

        {/* Bottom Tray Widgets */}
        <footer className="p-8 lg:px-12 z-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Weather Widget */}
            <div className="glass-dark rounded-3xl p-6 group hover:bg-white/5 transition-colors cursor-pointer border-white/5">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/40">San Francisco</span>
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                </div>
              </div>
              <div>
                <span className="text-4xl font-light text-white">68°</span>
                <p className="text-[11px] font-bold text-white/30 uppercase mt-2 tracking-widest">Partly Cloudy • Calm Winds</p>
              </div>
            </div>

            {/* News 1 */}
            <div className="glass-dark rounded-3xl p-6 group hover:bg-white/5 transition-colors cursor-pointer border-white/5 flex flex-col justify-between">
              <p className="text-sm font-medium text-white/80 leading-snug line-clamp-2">Autonomous mining robots deploy to Shackleton crater for lunar ice extraction...</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Cosmos • 2h</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* News 2 */}
            <div className="glass-dark rounded-3xl p-6 group hover:bg-white/5 transition-colors cursor-pointer border-white/5 flex flex-col justify-between">
              <p className="text-sm font-medium text-white/80 leading-snug line-clamp-2">Synthesized protein scaffolds represent breakthrough in bio-architecture...</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Science • 5h</span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Market Widget */}
            <div className="glass-dark rounded-3xl p-6 group hover:bg-white/5 transition-colors cursor-pointer border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Markets</span>
                <span className="text-[10px] font-black text-green-400">+1.84%</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white/60 tracking-wider">FAHHH</span>
                  <span className="text-sm font-mono text-green-400">$2,442.12</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-green-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative" id="results-view">
      <div className="fixed inset-0 z-0 bg-immersive opacity-40"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-x-0 border-t-0 p-4 lg:p-6 lg:px-12 flex items-center gap-8 lg:gap-12">
        <button 
          onClick={goHome} 
          className="text-3xl lg:text-4xl font-black tracking-tighter logo-gradient mb-1 bg-transparent cursor-pointer border-none shrink-0"
        >
          FAHHH
        </button>
        <div className="flex-1 max-w-4xl">
          <SearchInput 
            size="small" 
            value={query} 
            onChange={setQuery} 
            onSearch={handleSearch}
          />
        </div>
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-white/40 shrink-0">
           <LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6 hover:text-white cursor-pointer transition-colors" />
           <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/20 shadow-xl opacity-80"></div>
        </div>
      </header>

      {/* Sub Navigation */}
      <Tabs />

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">
        {/* Main Column */}
        <div className={activeTab === 'images' || activeTab === 'shopping' ? "lg:col-span-12" : "lg:col-span-7 xl:col-span-8"}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-8">
                 <div className="w-16 h-16 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                 <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-white/5"></div>
              </div>
              <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Accessing Neural Lattice...</p>
            </div>
          ) : (
            <motion.div
              key={activeTab} // Reset animation on tab change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4 mb-16">
                <div className="h-px bg-white/10 flex-1"></div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Synthesis Complete</p>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              
              <div className={
                activeTab === 'images' ? "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6" : 
                activeTab === 'shopping' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8" : 
                "space-y-12"
              }>
                {results.map((result, idx) => (
                  <ResultCard key={idx} result={result} index={idx} type={activeTab} />
                ))}
              </div>

              {results.length === 0 && !loading && (
                <div className="py-32 text-center glass-dark rounded-3xl">
                   <p className="text-white/40 font-bold uppercase tracking-[0.2em]">The void returned no echoes.</p>
                   <button onClick={goHome} className="mt-6 text-blue-400 uppercase text-xs font-black tracking-widest hover:text-blue-300 bg-transparent border-none cursor-pointer">Return to Nexus</button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar - Hide on Images/Shopping for more space */}
        {activeTab !== 'images' && activeTab !== 'shopping' && (
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="lg:sticky lg:top-40 h-fit space-y-10">
              <KnowledgePanel data={knowledge} loading={loading} />
              
              <div className="p-8 glass-dark rounded-3xl border-white/5">
                 <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                   Topological Context
                 </h3>
                 <div className="space-y-6">
                   {['Neural Context Alpha', 'Lattice Integrity', 'Quantum Persistence', 'Temporal Drift'].map((topic, i) => (
                     <div key={i} className="flex items-center justify-between group cursor-pointer">
                       <span className="text-sm text-white/50 group-hover:text-white transition-colors">{topic}</span>
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-white/20">{(Math.random() * 100).toFixed(1)}ms</span>
                          <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-blue-500 transition-colors translate-x-0 group-hover:translate-x-1" />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-dark border-x-0 border-b-0 py-12 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em] gap-8">
          <div className="flex gap-10">
            <span className="hover:text-white transition-colors cursor-pointer">Sanctum</span>
            <span className="hover:text-white transition-colors cursor-pointer">Protocols</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
            <span className="hover:text-white transition-colors cursor-pointer">Feedback</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40">FAHHH CORE NODE: 0xDE44</span>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
