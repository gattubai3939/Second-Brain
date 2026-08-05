import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  BookOpen,
  Mic,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Zap,
  Send,
  Skull,
  Lightbulb,
  Trophy,
  FolderOpen,
  Tag,
  ArrowRight,
  Check,
  Trash2,
  Folder,
  ChevronLeft,
  MoveRight,
  History,
  Sparkles,
  Activity,
  GripVertical,
  Moon,
  Flame,
  X,
  Settings,
  User,
  Image as ImageIcon,
  Lock
} from "lucide-react";

// Revision Intervals: Tomorrow, Day 3, 7, 14, 21, 28, 30
const REVISION_INTERVALS = [1, 3, 7, 14, 21, 28, 30];

const MORNING_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Your mind is a weapon. Keep it loaded.",
  "Pain is temporary. The pain of regret lasts forever.",
  "Don't stop when you're tired. Stop when you're done.",
];

const formatDate = (dateObj) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

const loadLocalData = () => {
  try {
    const local = localStorage.getItem('apexMindData_Final_V3');
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error("Storage error", e);
  }
  return {};
};

const savedData = loadLocalData();

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Real Date Initialization
  const baseDate = new Date();
  const todayStr = formatDate(baseDate);

  // User Profile States (Synchronously loaded)
  const [userName, setUserName] = useState(savedData.userName ?? "Prateek Maurya");
  const [profilePic, setProfilePic] = useState(savedData.profilePic ?? null);

  const [syllabusCategories, setSyllabusCategories] = useState(savedData.syllabusCategories ?? ["Raw Backlog"]);
  const [stagingTopics, setStagingTopics] = useState(savedData.stagingTopics ?? []); // Liquid Queue
  const [studyTopics, setStudyTopics] = useState(savedData.studyTopics ?? []); // Active Revisions
  const [masteredTopics, setMasteredTopics] = useState(savedData.masteredTopics ?? []); // Hall of Fame

  const [wisdomCategories, setWisdomCategories] = useState(savedData.wisdomCategories ?? ["Quick Thoughts"]);
  const [wisdomNotes, setWisdomNotes] = useState(savedData.wisdomNotes ?? []);
  const [expandedWisdomCategory, setExpandedWisdomCategory] = useState(null);
  
  const [vaultNotes, setVaultNotes] = useState(savedData.vaultNotes ?? []);
  const [vaultCategories, setVaultCategories] = useState(savedData.vaultCategories ?? ["Others"]);
  const [isVaultSorting, setIsVaultSorting] = useState(false);
  
  // Input States
  const [newSyllabusCat, setNewSyllabusCat] = useState("");
  const [selectedSyllabusCat, setSelectedSyllabusCat] = useState("Raw Backlog");
  const [newTopic, setNewTopic] = useState("");
  
  const [newWisdomCat, setNewWisdomCat] = useState("");
  const [selectedWisdomCat, setSelectedWisdomCat] = useState("Quick Thoughts");
  const [newWisdom, setNewWisdom] = useState("");
  const [newNote, setNewNote] = useState("");
  
  // AI Keys and State
  const [groqKey, setGroqKey] = useState(savedData.groqKey ?? "");

  // Urge Interceptor State
  const [urgeTimer, setUrgeTimer] = useState(null);
  const [isUrgeActive, setIsUrgeActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [urgeQuotes, setUrgeQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // ORACLE STATE
  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState("");
  const [isOracleThinking, setIsOracleThinking] = useState(false);

  // PHASE 2 & 3: Pace-Maker & Night-Shift States
  const [globalDeadlineDays, setGlobalDeadlineDays] = useState(savedData.globalDeadlineDays ?? 30);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  // NIGHT SHIFT INBOX STATES
  const [customMissions, setCustomMissions] = useState(savedData.customMissions ?? []);
  const [isNightShiftOpen, setIsNightShiftOpen] = useState(false);
  const [newCustomMission, setNewCustomMission] = useState("");

  // ==========================================
  // 🚀 BULLETPROOF LOCAL SAVE ENGINE (Zero Glitches)
  // ==========================================
  useEffect(() => {
    const dataPayload = {
      userName, profilePic, syllabusCategories, stagingTopics, studyTopics,
      masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories,
      globalDeadlineDays, customMissions, groqKey
    };
    localStorage.setItem('apexMindData_Final_V3', JSON.stringify(dataPayload));
  }, [userName, profilePic, syllabusCategories, stagingTopics, studyTopics, masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories, globalDeadlineDays, customMissions, groqKey]);
  // ==========================================

  useEffect(() => {
    let timerInterval;
    let quoteInterval;

    if (isUrgeActive && urgeTimer > 0) {
      timerInterval = setInterval(() => {
        setUrgeTimer((prev) => prev - 1);
      }, 1000);

      quoteInterval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % (urgeQuotes.length || 5));
      }, 7000);

    } else if (isUrgeActive && urgeTimer === 0) {
      setIsUrgeActive(false);
    }
    
    return () => {
      clearInterval(timerInterval);
      clearInterval(quoteInterval);
    };
  }, [isUrgeActive, urgeTimer, urgeQuotes.length]);

  const triggerUrgeInterceptor = async () => {
    setIsUrgeActive(true);
    setUrgeTimer(90); 
    setCurrentQuoteIndex(0);

    const defaultQuotes = [
      "Don't trade your long-term goals for 5 seconds of cheap dopamine. Breathe.",
      "The pain of discipline is better than the pain of regret.",
      "Your brain is lying to you right now. Stand your ground.",
      "You have survived 100% of your bad days. This urge will pass.",
      "Greatness is forged in moments exactly like this one."
    ];
    setUrgeQuotes(defaultQuotes);

    if (groqKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: "Generate exactly 10 short, brutal, hard-hitting motivational sentences (max 15 words each) to stop someone from breaking a discipline streak. Output ONLY as a JSON array of strings. Like: [\"sentence 1\", \"sentence 2\"]" }],
            response_format: { type: "json_object" }
          })
        });
        const data = await response.json();
        const content = data.choices[0].message.content;
        const aiQuotes = JSON.parse(content);
        
        if (Array.isArray(aiQuotes) && aiQuotes.length > 0) {
          setUrgeQuotes(aiQuotes);
        } else {
           const objKeys = Object.keys(aiQuotes);
           if(objKeys.length > 0 && Array.isArray(aiQuotes[objKeys[0]])) {
               setUrgeQuotes(aiQuotes[objKeys[0]]);
           }
        }
      } catch (e) {
        console.error("AI Quote failed, using defaults", e);
      }
    }
  };

  const handleAskOracle = async (querySource) => {
    if (!groqKey) {
      alert("Please configure your Groq API Key in the Settings tab.");
      return;
    }
    const query = querySource === 'wisdom' ? oracleQuery : querySource;
    if (!query.trim()) return;

    setIsOracleThinking(true);
    setOracleResponse("");

    try {
      const allNotes = [
        ...wisdomNotes.map(n => `[Wisdom: ${n.category}] ${n.text}`),
        ...vaultNotes.map(n => `[Dump: ${n.category}] ${n.text}`)
      ].join("\n");

      const prompt = `You are "The Oracle", an AI assistant that synthesizes the user's personal notes.
      Knowledge Base (User's thoughts/wisdom):
      ${allNotes}
      
      User's Question: "${query}"
      
      RULES:
      1. Answer strictly based on the Knowledge Base.
      2. Connect different ideas if they relate to the question.
      3. If the answer is not in the notes, say "I cannot find an answer to this in your Second Brain." Do not make up outside facts.
      4. Keep it concise, punchy, and highly actionable.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: prompt }]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setOracleResponse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error("Oracle failed", error);
      setOracleResponse("The Oracle's connection was disrupted. Please check your API key in Settings.");
    }
    setIsOracleThinking(false);
  };

  const handleAddSyllabusCategory = () => {
    if (newSyllabusCat.trim() && !syllabusCategories.includes(newSyllabusCat.trim())) {
      setSyllabusCategories([...syllabusCategories, newSyllabusCat.trim()]);
      setSelectedSyllabusCat(newSyllabusCat.trim());
      setNewSyllabusCat("");
    }
  };

  const handleDeleteSyllabusCategory = (cat) => {
    if (cat === "Raw Backlog") return;
    setSyllabusCategories(syllabusCategories.filter(c => c !== cat));
    setStagingTopics(prev => prev.map(t => t.category === cat ? { ...t, category: "Raw Backlog" } : t));
    if (selectedSyllabusCat === cat) setSelectedSyllabusCat("Raw Backlog");
  };

  const handleAddStagingTopic = () => {
    if (!newTopic.trim()) return;
    const topicEntry = {
      id: Date.now().toString(),
      title: newTopic,
      category: selectedSyllabusCat,
    };
    setStagingTopics([...stagingTopics, topicEntry]);
    setNewTopic("");
  };

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault(); 
  };
  
  const handleDrop = (index) => {
    if (draggedItemIndex === null) return;
    const items = [...stagingTopics];
    const draggedItem = items[draggedItemIndex];
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);
    setStagingTopics(items);
    setDraggedItemIndex(null);
  };

  const handleStartRevision = (topicId) => {
    const topic = stagingTopics.find(t => t.id === topicId);
    if (!topic) return;

    const revisionSchedule = REVISION_INTERVALS.map((interval) => ({
      dayOffset: interval,
      targetDate: addDays(todayStr, interval),
      completed: false,
    }));

    const activeEntry = {
      ...topic,
      startDate: todayStr,
      schedule: revisionSchedule,
    };

    setStudyTopics([...studyTopics, activeEntry]);
    setStagingTopics(stagingTopics.filter(t => t.id !== topicId));
  };

  const markRevisionComplete = (topicId, targetDate, dayOffset) => {
    const topic = studyTopics.find(t => t.id === topicId);
    if (!topic) return;

    const updatedSchedule = topic.schedule.map(rev => 
      (rev.targetDate === targetDate && rev.dayOffset === dayOffset) ? { ...rev, completed: true } : rev
    );

    const day30Completed = updatedSchedule.some(rev => rev.dayOffset === 30 && rev.completed);

    if (day30Completed) {
      setTimeout(() => {
        setStudyTopics(prev => prev.filter(t => t.id !== topicId));
        setMasteredTopics(prev => [...prev, { ...topic, masteredDate: todayStr }]);
      }, 0);
    } else {
      setStudyTopics(prev => prev.map(t => t.id === topicId ? { ...topic, schedule: updatedSchedule } : t));
    }
  };

  const handleAddWisdomCategory = () => {
    if (newWisdomCat.trim() && !wisdomCategories.includes(newWisdomCat.trim())) {
      setWisdomCategories([...wisdomCategories, newWisdomCat.trim()]);
      setSelectedWisdomCat(newWisdomCat.trim());
      setNewWisdomCat("");
    }
  };

  const handleDeleteWisdomCategory = (cat) => {
    if (cat === "Quick Thoughts") return;
    setWisdomCategories(wisdomCategories.filter(c => c !== cat));
    setWisdomNotes(prev => prev.map(n => n.category === cat ? { ...n, category: "Quick Thoughts" } : n));
    if (selectedWisdomCat === cat) setSelectedWisdomCat("Quick Thoughts");
    if (expandedWisdomCategory === cat) setExpandedWisdomCategory(null);
  };

  const handleAddWisdom = () => {
    if (!newWisdom.trim()) return;
    const wisdomEntry = {
      id: Date.now().toString(),
      text: newWisdom,
      category: expandedWisdomCategory || selectedWisdomCat,
      date: todayStr,
    };
    setWisdomNotes([wisdomEntry, ...wisdomNotes]);
    setNewWisdom("");
  };

  const handleMoveWisdomNote = (noteId, newCategory) => {
    setWisdomNotes(prev => prev.map(n => n.id === noteId ? { ...n, category: newCategory } : n));
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const noteId = Date.now().toString();
    const newEntry = {
      id: noteId,
      text: newNote,
      date: todayStr,
      category: "Others"
    };

    setVaultNotes(prev => [newEntry, ...prev]);
    setNewNote("");

    if (!groqKey) return; 

    setIsVaultSorting(true);
    try {
      const othersNotes = vaultNotes.filter(n => n.category === "Others");
      const existingCats = vaultCategories.filter(c => c !== "Others");

      const prompt = `
        You are a super-smart AI brain sorter.
        Existing Categories: [${existingCats.join(", ")}]
        New Idea: "${newEntry.text}"
        Other unclassified ideas: ${JSON.stringify(othersNotes.map(n => ({id: n.id, text: n.text})))}

        RULES:
        1. Categorize the New Idea into one of the Existing Categories. If it doesn't fit, use "Others".
        2. EXCEPTION: Look at the "Other unclassified ideas". If the New Idea PLUS at least 2 of those unclassified ideas share a strong common theme (meaning 3 or more ideas total), you MUST invent a new category name (1-2 words max) for them.
        3. Output ONLY a valid JSON object.

        FORMAT:
        {
          "assignedCategory": "Category Name",
          "extractedIdsFromOthers": ["id1", "id2"]
        }
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: prompt }],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);

      if (aiResponse.assignedCategory) {
         let newCat = aiResponse.assignedCategory;
         if (!vaultCategories.includes(newCat) && newCat !== "Others") {
             setVaultCategories(prev => [...prev, newCat]);
         }

         setVaultNotes(prev => prev.map(n => {
            if (n.id === noteId) return { ...n, category: newCat };
            if (aiResponse.extractedIdsFromOthers && aiResponse.extractedIdsFromOthers.includes(n.id)) {
                return { ...n, category: newCat };
            }
            return n;
         }));
      }
    } catch (error) {
      console.error("AI Vault Sort Failed", error);
    }
    setIsVaultSorting(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDashboard = () => {
    const remainingChapters = stagingTopics.length;
    const pace = remainingChapters > 0 ? (globalDeadlineDays / remainingChapters).toFixed(1) : 0;
    
    let paceStatus = { text: "On Track", color: "text-green-400", bg: "bg-green-950", border: "border-green-900/50" };
    if (pace < 1 && remainingChapters > 0) {
      paceStatus = { text: "Danger (Speed Up)", color: "text-red-400", bg: "bg-red-950", border: "border-red-900/50" };
    } else if (pace >= 1 && pace <= 1.5) {
      paceStatus = { text: "Moderate Pace", color: "text-yellow-400", bg: "bg-yellow-950", border: "border-yellow-900/50" };
    } else if (remainingChapters === 0) {
       paceStatus = { text: "Queue Empty", color: "text-zinc-400", bg: "bg-zinc-900", border: "border-zinc-800" };
    }

    const todaysRevisions = [];
    studyTopics.forEach(topic => {
      topic.schedule.forEach(rev => {
        if (rev.targetDate <= todayStr && !rev.completed) {
          todaysRevisions.push({
            topicId: topic.id,
            title: topic.title,
            category: topic.category,
            targetDate: rev.targetDate,
            dayOffset: rev.dayOffset,
            isOverdue: rev.targetDate < todayStr
          });
        }
      });
    });

    const todaysCustomMissions = customMissions.filter(m => m.targetDate <= todayStr && !m.completed);
    const quoteOfTheDay = MORNING_QUOTES[baseDate.getDate() % MORNING_QUOTES.length];

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Morning Injection */}
        <div className="bg-[#121212] border-l-4 border-l-white border-y border-r border-zinc-800/50 p-6 rounded-2xl shadow-2xl transition-transform hover:-translate-y-1 duration-300">
          <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap size={14} className="text-white" /> Morning Injection
          </h3>
          <p className="text-zinc-100 text-2xl font-black tracking-tight leading-snug">
            "{quoteOfTheDay}"
          </p>
        </div>

        {/* Pace-Maker Engine */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800 opacity-20 blur-3xl rounded-full"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                <Flame size={12} className="text-white"/> Current Strike Target
              </h3>
              {stagingTopics.length > 0 ? (
                <h2 className="text-white text-2xl font-black tracking-tight mt-1">{stagingTopics[0].title}</h2>
              ) : (
                <h2 className="text-zinc-600 text-xl font-bold tracking-tight mt-1 italic">No active target in Queue</h2>
              )}
              {stagingTopics.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 mt-2 inline-block">
                  {stagingTopics[0].category}
                </span>
              )}
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs text-zinc-500 font-bold">Deadline:</span>
                 <input 
                   type="number" 
                   value={globalDeadlineDays}
                   onChange={(e) => setGlobalDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
                   className="w-12 bg-zinc-900 border border-zinc-700 rounded text-center text-xs font-bold text-white py-0.5 outline-none"
                   title="Global Master Deadline in Days"
                 />
                 <span className="text-[10px] text-zinc-500 font-bold uppercase">Days</span>
              </div>
              <div className={`mt-2 px-3 py-1.5 rounded-lg border flex flex-col items-end ${paceStatus.bg} ${paceStatus.border}`}>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${paceStatus.color}`}>
                   {paceStatus.text}
                 </span>
                 <span className="text-white font-bold text-sm">
                   {pace > 0 ? `${pace} Days / Ch.` : "N/A"}
                 </span>
              </div>
            </div>
          </div>
          {stagingTopics.length > 0 && (
            <button 
              onClick={() => handleStartRevision(stagingTopics[0].id)}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg z-10 mt-2"
            >
              Target Destroyed <Check size={18} className="stroke-[3]" />
            </button>
          )}
        </div>

        {/* Custom Daily Targets */}
        {todaysCustomMissions.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
             <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
               <CheckCircle2 className="text-indigo-400" size={20} /> Today's Custom Targets
             </h3>
             <div className="space-y-3">
               {todaysCustomMissions.map((mission) => (
                 <div key={mission.id} className="flex items-center justify-between p-4 rounded-xl border bg-indigo-950/20 border-indigo-900/50 hover:bg-indigo-950/40 transition-colors">
                   <h4 className="text-indigo-100 font-bold text-sm">{mission.text}</h4>
                   <button 
                     onClick={() => setCustomMissions(prev => prev.filter(m => m.id !== mission.id))}
                     className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-900/50 border border-indigo-500/50 hover:bg-indigo-500 hover:text-white transition-all text-indigo-300 shadow-lg active:scale-90"
                   >
                     <Check size={24} className="stroke-[3]" />
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Revisions */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="text-zinc-300" size={20} /> Today's Revisions
          </h3>
          {todaysRevisions.length === 0 ? (
            <div className="text-center py-10 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
              <p className="font-bold text-zinc-500">All caught up.</p>
              <p className="text-xs text-zinc-600 mt-1">Focus on destroying your Current Target.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysRevisions.map((rev, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] shadow-sm ${rev.isOverdue ? 'bg-red-950/10 border-red-900/40' : 'bg-zinc-950/80 border-zinc-800'}`}>
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                      {rev.title} 
                      {rev.isOverdue && <span className="text-[9px] bg-red-600 px-2 py-0.5 rounded-sm text-white font-black uppercase tracking-wider animate-pulse">Overdue</span>}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{rev.category}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 bg-white/10 px-2 py-0.5 rounded">Day {rev.dayOffset} Revision</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => markRevisionComplete(rev.topicId, rev.targetDate, rev.dayOffset)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-900 border border-zinc-700 hover:bg-white hover:border-white hover:text-black active:scale-90 transition-all duration-200 text-zinc-500 shadow-lg"
                  >
                    <Check size={24} className="stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStudyEngine = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Activity className="text-zinc-300" size={20} /> Liquid Strike Queue
          </h3>
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Drag to Reorder</span>
        </div>
        
        <div className="flex gap-2 mb-4 border-b border-zinc-800/80 pb-4">
          <input 
            type="text" 
            value={newSyllabusCat}
            onChange={(e) => setNewSyllabusCat(e.target.value)}
            placeholder="New Category (e.g., Physics)"
            className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleAddSyllabusCategory}
            className="bg-zinc-100 hover:bg-white text-zinc-900 active:scale-95 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-1 shadow-md"
          >
            <Plus size={18} className="stroke-[3]" /> Add Tag
          </button>
        </div>

        {syllabusCategories.length > 1 && (
           <div className="flex flex-wrap gap-2 mb-6">
             {syllabusCategories.map(cat => (
               <div key={cat} className="group flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400">
                 {cat}
                 {cat !== "Raw Backlog" && (
                   <button onClick={() => handleDeleteSyllabusCategory(cat)} className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-1">
                     <Trash2 size={12} />
                   </button>
                 )}
               </div>
             ))}
           </div>
        )}

        <div className="flex gap-2">
          <select 
            value={selectedSyllabusCat}
            onChange={(e) => setSelectedSyllabusCat(e.target.value)}
            className="w-1/3 bg-zinc-950 border border-zinc-700/50 rounded-xl px-3 py-3 text-sm font-bold text-zinc-300 focus:outline-none focus:border-white transition-colors cursor-pointer"
          >
            {syllabusCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input 
            type="text" 
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStagingTopic()}
            placeholder="Chapter Name..."
            className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleAddStagingTopic}
            className="bg-zinc-800 hover:bg-zinc-700 text-white active:scale-95 px-5 rounded-xl font-bold transition-all flex items-center justify-center border border-zinc-600 shadow-md"
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {stagingTopics.length === 0 && (
            <div className="text-center py-10 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-500 font-medium">Queue is empty. Add chapters below.</p>
            </div>
          )}
          {stagingTopics.map((topic, index) => (
            <div 
              key={topic.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`bg-zinc-950 p-3 rounded-xl border flex items-center justify-between group transition-colors cursor-move 
                ${index === 0 ? 'border-zinc-500 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'border-zinc-800 hover:border-zinc-700'}
                ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="text-zinc-600 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                  <GripVertical size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    {topic.title}
                    {index === 0 && <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Next Target</span>}
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-1 block">{topic.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <History className="text-zinc-300" size={20} /> Ongoing 30-Day Cycles
        </h3>
        {studyTopics.length === 0 ? (
          <p className="text-sm font-medium text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">No active revisions in history. Complete a topic in Syllabus first.</p>
        ) : (
          <div className="space-y-4">
            {studyTopics.map(topic => (
              <div key={topic.id} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 relative overflow-hidden transition-all hover:border-zinc-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white text-lg">{topic.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-1 rounded-sm mt-2 inline-block">{topic.category}</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded">Init: {topic.startDate}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topic.schedule.map((rev, i) => {
                    const isPending = !rev.completed && rev.targetDate <= todayStr;
                    return (
                      <div key={i} className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all duration-300 ${
                        rev.completed 
                          ? 'bg-zinc-100 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                          : isPending 
                            ? 'bg-red-950/20 border-red-900/50'
                            : 'bg-zinc-900 border-zinc-800 opacity-60'
                      }`}>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${rev.completed ? 'text-zinc-900' : isPending ? 'text-red-400' : 'text-zinc-500'}`}>
                          D{rev.dayOffset}
                        </span>
                        {rev.completed ? (
                          <Check size={14} className="text-zinc-900 mt-1 stroke-[3]" />
                        ) : (
                          <Circle size={14} className={`mt-1 ${isPending ? 'text-red-400 animate-pulse' : 'text-zinc-700'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#1c1917] to-zinc-900 border border-[#44403c] p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#78716c] opacity-10 rounded-full blur-3xl"></div>
        <h3 className="text-[#d6d3d1] font-black text-xl mb-6 flex items-center gap-2 tracking-tight">
          <Trophy size={24} className="text-[#a8a29e]" /> Hall of Fame (Mastered)
        </h3>
        {masteredTopics.length === 0 ? (
          <p className="text-sm font-medium text-[#78716c] text-center py-6 border border-dashed border-[#57534e] rounded-xl">Check off a Day 30 revision to lock knowledge here permanently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masteredTopics.map(topic => (
              <div key={topic.id} className="bg-[#292524] p-4 rounded-xl border border-[#57534e] flex items-center gap-4 transition-transform hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-full bg-[#1c1917] flex items-center justify-center border border-[#44403c] shadow-inner">
                  <Trophy size={20} className="text-[#a8a29e]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{topic.title}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716c] mt-1">{topic.category} • {topic.masteredDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderWisdom = () => {
    if (expandedWisdomCategory) {
      const filteredNotes = wisdomNotes.filter(n => n.category === expandedWisdomCategory);
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setExpandedWisdomCategory(null)} className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-lg text-zinc-400 transition-colors active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <FolderOpen size={24} className="text-zinc-400" /> {expandedWisdomCategory}
            </h2>
          </div>
          <div className="flex gap-2 bg-zinc-900 border border-zinc-800/80 p-3 rounded-2xl shadow-xl">
            <input 
              type="text" 
              value={newWisdom}
              onChange={(e) => setNewWisdom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWisdom()}
              placeholder="Dump knowledge here..."
              className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-white transition-colors"
            />
            <button 
              onClick={handleAddWisdom}
              className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 rounded-xl font-black transition-all active:scale-95 flex items-center justify-center"
            >
              <Plus size={20} className="stroke-[3]" />
            </button>
          </div>
          <div className="grid gap-4 mt-6">
            {filteredNotes.length === 0 && <p className="text-zinc-500 font-medium text-center py-10 border border-dashed border-zinc-800 rounded-2xl">Folder is empty.</p>}
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-3 transition-colors group hover:border-zinc-600 shadow-sm">
                <div className="flex items-start gap-3">
                  <Mic size={18} className="text-zinc-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed font-medium">{note.text}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-800/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{note.date}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoveRight size={14} className="text-zinc-500" />
                    <select 
                      onChange={(e) => handleMoveWisdomNote(note.id, e.target.value)}
                      value={note.category}
                      className="bg-zinc-950 border border-zinc-700 text-[10px] font-bold text-zinc-300 rounded px-2 py-1 outline-none cursor-pointer"
                    >
                      {wisdomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-indigo-950/20 border border-indigo-900/50 p-5 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-10 rounded-full blur-3xl"></div>
          <h3 className="text-indigo-300 font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" /> Ask The Oracle
          </h3>
          <p className="text-xs font-medium text-indigo-200/60 mb-4 leading-relaxed">
            Chat with your Second Brain. The AI will synthesize answers using exclusively your saved Wisdom and Dump notes.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')}
              placeholder="E.g., What did I learn about focus?"
              className="flex-1 bg-zinc-950/80 border border-indigo-900/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-indigo-900/50"
            />
            <button 
              onClick={() => handleAskOracle('wisdom')}
              disabled={isOracleThinking}
              className="bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 px-6 rounded-xl font-black transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20 disabled:opacity-50"
            >
              {isOracleThinking ? <Circle size={18} className="animate-pulse" /> : <Send size={18} className="stroke-[3]" />}
            </button>
          </div>
          {oracleResponse && (
            <div className="mt-4 p-4 bg-zinc-950/80 border border-indigo-900/50 rounded-xl animate-in fade-in duration-300">
              <p className="text-indigo-100 text-sm whitespace-pre-line leading-relaxed font-medium">{oracleResponse}</p>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Folder className="text-zinc-300" size={20} /> Wisdom Folders
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newWisdomCat}
              onChange={(e) => setNewWisdomCat(e.target.value)}
              placeholder="Create New Folder (e.g., Podcasts)"
              className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-white transition-colors"
            />
            <button 
              onClick={handleAddWisdomCategory}
              className="bg-zinc-800 hover:bg-zinc-700 text-white active:scale-95 px-5 rounded-xl text-sm font-bold transition-all shadow-md"
            >
              <Plus size={18} className="stroke-[3]" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wisdomCategories.map(cat => {
            const count = wisdomNotes.filter(n => n.category === cat).length;
            return (
              <div key={cat} className="group relative">
                <button 
                  onClick={() => setExpandedWisdomCategory(cat)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 p-5 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 active:scale-95 shadow-sm text-left h-full"
                >
                  <FolderOpen size={32} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{cat}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1 block">{count} Notes</span>
                  </div>
                </button>
                {cat !== "Quick Thoughts" && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteWisdomCategory(cat); }}
                    className="absolute top-3 right-3 p-1.5 bg-zinc-950 hover:bg-red-950 text-zinc-600 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-900/50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const renderVault = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Ask The Oracle */}
      <div className="bg-indigo-950/20 border border-indigo-900/50 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-10 rounded-full blur-3xl"></div>
        <h3 className="text-indigo-300 font-bold text-lg mb-3 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" /> Ask The Oracle
        </h3>
        <p className="text-xs font-medium text-indigo-200/60 mb-4 leading-relaxed">
          Chat with your Second Brain. The AI will synthesize answers using exclusively your saved Wisdom and Dump notes.
        </p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={oracleQuery}
            onChange={(e) => setOracleQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')}
            placeholder="E.g., What did I learn about focus?"
            className="flex-1 bg-zinc-950/80 border border-indigo-900/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-indigo-900/50"
          />
          <button 
            onClick={() => handleAskOracle('wisdom')}
            disabled={isOracleThinking}
            className="bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 px-6 rounded-xl font-black transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20 disabled:opacity-50"
          >
            {isOracleThinking ? <Circle size={18} className="animate-pulse" /> : <Send size={18} className="stroke-[3]" />}
          </button>
        </div>
        {oracleResponse && (
          <div className="mt-4 p-4 bg-zinc-950/80 border border-indigo-900/50 rounded-xl animate-in fade-in duration-300">
            <p className="text-indigo-100 text-sm whitespace-pre-line leading-relaxed font-medium">{oracleResponse}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <BrainCircuit className="text-zinc-400" size={20} /> Brain Dump (Inbox)
          </h3>
          {isVaultSorting && (
            <span className="text-[10px] bg-blue-950 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse border border-blue-900/50 flex items-center gap-1 shadow-lg">
              <Sparkles size={12}/> AI Sorting
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-zinc-500 mb-5 leading-relaxed">
          Fast-capture raw ideas. Add 3 similar thoughts, and AI will automatically build a new folder for them.
        </p>
        
        <div className="flex gap-2 relative">
          <button 
            onClick={() => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) {
                alert("Voice typing is not supported in this browser. Please use Chrome/Edge.");
                return;
              }
              const recognition = new SpeechRecognition();
              recognition.onstart = () => setIsListening(true);
              recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setNewNote(prev => prev + (prev ? " " : "") + transcript);
              };
              recognition.onerror = () => setIsListening(false);
              recognition.onend = () => setIsListening(false);
              recognition.start();
            }}
            className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-md ${isListening ? 'bg-red-950 text-red-500 border border-red-900 animate-pulse' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'}`}
            title="Speak your thought"
          >
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder={isListening ? "Listening (Speak now)..." : "Type your raw thought..."}
            className="flex-1 bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-white transition-colors"
          />
          <button 
            onClick={handleAddNote}
            disabled={isVaultSorting}
            className="bg-zinc-100 hover:bg-white text-zinc-900 active:scale-95 px-6 rounded-xl font-black transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:active:scale-100"
          >
            <Send size={18} className="stroke-[3]" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {vaultCategories.map(cat => {
          const notesInCat = vaultNotes.filter(n => n.category === cat);
          if (notesInCat.length === 0) return null;
          return (
            <div key={cat} className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800/80 pb-2 flex items-center gap-2">
                <Folder size={12}/> {cat}
              </h4>
              {notesInCat.map(note => (
                <div key={note.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start gap-4 hover:border-zinc-700 transition-colors shadow-sm group">
                  <BrainCircuit size={16} className="text-zinc-600 mt-1 flex-shrink-0 group-hover:text-zinc-400 transition-colors" />
                  <div>
                    <p className="text-zinc-200 text-sm font-medium leading-relaxed">{note.text}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 mt-2 block">{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        {vaultNotes.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30">
            <p className="font-bold text-zinc-500">Inbox Zero.</p>
            <p className="text-xs text-zinc-600 mt-1">Dump your messy thoughts here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUrgeKiller = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto text-center pt-10">
      <h2 className="text-2xl font-black text-white flex justify-center items-center gap-2 mb-2 tracking-tight">
        <ShieldAlert className="text-zinc-400" size={28} /> Trigger Interceptor
      </h2>
      <p className="text-zinc-500 font-medium text-sm mb-10 leading-relaxed">About to break your streak? Want to scroll? Hit this button first to activate the friction zone.</p>

      {!isUrgeActive ? (
        <button 
          onClick={triggerUrgeInterceptor}
          className="w-56 h-56 rounded-full bg-[#111111] hover:bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] mx-auto transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
        >
          <span className="text-white font-black text-2xl uppercase tracking-widest flex flex-col items-center relative z-10 gap-3">
            <Skull size={48} className="text-zinc-400 group-hover:text-white transition-colors" />
            I Have an Urge
          </span>
        </button>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
            <div 
              className="bg-white h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${(urgeTimer / 90) * 100}%` }}
            ></div>
          </div>
          <h3 className="text-zinc-400 font-black mb-6 uppercase tracking-[0.2em] text-xs">Friction Zone Active</h3>
          <div className="text-8xl font-black text-white mb-8 tabular-nums tracking-tighter">
            {urgeTimer}s
          </div>
          <div className="min-h-[80px] flex items-center justify-center">
            <p className="text-zinc-300 font-medium italic text-lg px-4 leading-relaxed animate-in fade-in zoom-in duration-500" key={currentQuoteIndex}>
              "{urgeQuotes[currentQuoteIndex] || 'Stay strong. Do not give in.'}"
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Profile Section */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <User size={20} className="text-zinc-400"/> Profile Settings
        </h3>
        
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-24 h-24 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🦊</span>
            )}
          </div>
          <div>
            <input 
              type="file" 
              id="picUpload" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
            <label 
              htmlFor="picUpload" 
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <ImageIcon size={14}/> Upload Picture
            </label>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">1:1 Ratio Recommended</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Display Name</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="e.g., Apex Hunter" 
            className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-white transition-colors" 
          />
        </div>
      </div>

      {/* AI Key Section */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl">
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          <Lock size={20} className="text-zinc-400"/> AI Brain Engine API
        </h3>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-5">
          Paste your Groq API Key here. This key powers your Oracle, Auto-Sorter, and dynamic Urge Quotes. It is stored securely on your local device.
        </p>
        <input 
          type="password" 
          value={groqKey} 
          onChange={(e) => setGroqKey(e.target.value)} 
          placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx" 
          className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-white transition-colors" 
        />
      </div>

    </div>
  );

  const showNightShift = new Date().getHours() >= 21;

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans pb-28 relative selection:bg-zinc-800 overflow-x-hidden">
      
      <div className="max-w-2xl mx-auto p-4 md:p-6 relative z-10 pt-8">
        {/* Header Updated with User Profile */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              Apex Mind <span className="text-[10px] bg-white text-black px-2 py-1 rounded-sm font-black uppercase tracking-widest align-middle">V2.1</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">Second Brain OS</p>
          </div>
          
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('settings')}
            title="Open Settings"
          >
            {userName && (
              <span className="font-bold text-white text-sm hidden sm:block group-hover:text-zinc-300 transition-colors">
                {userName}
              </span>
            )}
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg overflow-hidden relative group-hover:border-zinc-600 transition-colors">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🦊</span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'study' && renderStudyEngine()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'wisdom' && renderWisdom()}
        {activeTab === 'vault' && renderVault()}
        {activeTab === 'urge' && renderUrgeKiller()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Floating Night Shift Widget (Active strictly 9PM - 12AM) */}
      {showNightShift && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 flex flex-col items-end">
          {!isNightShiftOpen ? (
            <button 
              onClick={() => setIsNightShiftOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 animate-in slide-in-from-bottom-10 fade-in duration-500 hover:scale-105 active:scale-95 transition-all"
            >
              <Moon size={18} /> Plan Tomorrow
            </button>
          ) : (
            <div className="w-full bg-[#1a1a2e] border border-indigo-900/50 p-5 rounded-2xl shadow-[0_0_40px_rgba(49,46,129,0.3)] animate-in zoom-in-95 duration-300 relative">
               <button 
                 onClick={() => setIsNightShiftOpen(false)} 
                 className="absolute top-3 right-3 text-indigo-400/50 hover:text-indigo-300 transition-colors"
               >
                 <X size={16} />
               </button>
               <h3 className="text-indigo-300 font-black text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                 <Moon size={16}/> Night Shift Inbox
               </h3>
               <p className="text-xs text-indigo-200/60 font-medium mb-4">Add tasks for tomorrow, or pin a queue target.</p>
               
               <div className="flex gap-2 mb-4">
                 <input 
                   type="text"
                   value={newCustomMission}
                   onChange={(e) => setNewCustomMission(e.target.value)}
                   onKeyPress={(e) => {
                      if(e.key === 'Enter' && newCustomMission.trim()) {
                         setCustomMissions(prev => [...prev, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }]);
                         setNewCustomMission("");
                      }
                   }}
                   placeholder="Type custom task..."
                   className="flex-1 bg-indigo-950/30 border border-indigo-900/40 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-indigo-500"
                 />
                 <button 
                   onClick={() => {
                      if(newCustomMission.trim()) {
                         setCustomMissions(prev => [...prev, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }]);
                         setNewCustomMission("");
                      }
                   }}
                   className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
                 >
                   <Send size={16} className="stroke-[3]" />
                 </button>
               </div>

               {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).map(m => (
                       <div key={m.id} className="text-xs font-medium text-indigo-200 bg-indigo-950/50 px-3 py-2 rounded-lg flex justify-between items-center border border-indigo-900/30">
                         <span>• {m.text}</span>
                         <button onClick={() => setCustomMissions(prev => prev.filter(task => task.id !== m.id))} className="text-indigo-400 hover:text-red-400 transition-colors p-1"><Trash2 size={12}/></button>
                       </div>
                    ))}
                  </div>
               )}

               {stagingTopics.length > 0 && (
                 <>
                   <div className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-2 border-t border-indigo-900/50 pt-3">Pin Syllabus Target</div>
                   <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar">
                     {stagingTopics.slice(0, 3).map((topic, idx) => (
                       <button 
                         key={topic.id}
                         onClick={() => {
                           const items = [...stagingTopics];
                           const clickedItem = items.splice(idx, 1)[0];
                           items.unshift(clickedItem);
                           setStagingTopics(items);
                         }}
                         className="w-full text-left bg-indigo-950/30 hover:bg-indigo-900/50 border border-indigo-900/40 p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-between group"
                       >
                         <span className="font-bold text-indigo-100 text-xs truncate pr-2">{topic.title}</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Pin</span>
                       </button>
                     ))}
                   </div>
                 </>
               )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation with Settings Added */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-zinc-900 z-50 pb-safe overflow-x-auto hide-scrollbar">
        <div className="max-w-2xl mx-auto flex justify-between px-2 py-4 min-w-[320px]">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'dashboard' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Calendar size={22} className={activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Mission</span>
          </button>
          <button onClick={() => setActiveTab('study')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'study' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Activity size={22} className={activeTab === 'study' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Queue</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'history' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <History size={22} className={activeTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">History</span>
          </button>
          <button onClick={() => setActiveTab('wisdom')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'wisdom' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Folder size={22} className={activeTab === 'wisdom' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Wisdom</span>
          </button>
          <button onClick={() => setActiveTab('vault')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'vault' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <BrainCircuit size={22} className={activeTab === 'vault' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Dump</span>
          </button>
          <button onClick={() => setActiveTab('urge')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'urge' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <ShieldAlert size={22} className={activeTab === 'urge' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Urge</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 flex flex-col items-center gap-1.5 p-2 transition-all duration-300 active:scale-95 ${activeTab === 'settings' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Settings size={22} className={activeTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[9px] font-black uppercase tracking-widest">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
