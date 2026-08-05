import React, { useState, useEffect, useRef } from "react";
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
  Trophy,
  FolderOpen,
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
  Lock,
  Search,
  Trash2,
  ChevronLeft,
  Check,
  Folder
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
    const local = localStorage.getItem('apexMindData_Final_V4');
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error("Storage error", e);
  }
  return {};
};

const savedData = loadLocalData();

// 2. Press and Hold Hook (800ms)
function useLongPress(callback = () => {}, ms = 800) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (startLongPress) {
      timerRef.current = setTimeout(callback, ms);
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [startLongPress, callback, ms]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
}

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
  const [expandedVaultCategory, setExpandedVaultCategory] = useState(null);
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

  const [globalDeadlineDays, setGlobalDeadlineDays] = useState(savedData.globalDeadlineDays ?? 30);
  const [lastActiveDate, setLastActiveDate] = useState(savedData.lastActiveDate ?? todayStr);
  
  // Automatic Night Shift Checker (9 PM to 4 AM)
  const [isNightTime, setIsNightTime] = useState(
    new Date().getHours() >= 21 || new Date().getHours() < 4
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightTime(hour >= 21 || hour < 4);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  // NIGHT SHIFT INBOX STATES
  const [customMissions, setCustomMissions] = useState(savedData.customMissions ?? []);
  const [isNightShiftOpen, setIsNightShiftOpen] = useState(false);
  const [newCustomMission, setNewCustomMission] = useState("");

  // ==========================================
  // 🚀 BULLETPROOF LOCAL SAVE ENGINE
  // ==========================================
  useEffect(() => {
    const dataPayload = {
      userName, profilePic, syllabusCategories, stagingTopics, studyTopics,
      masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories,
      globalDeadlineDays, customMissions, groqKey, lastActiveDate
    };
    localStorage.setItem('apexMindData_Final_V4', JSON.stringify(dataPayload));
  }, [userName, profilePic, syllabusCategories, stagingTopics, studyTopics, masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories, globalDeadlineDays, customMissions, groqKey, lastActiveDate]);

  // ==========================================
  // BULLETPROOF AUTO-DECREMENT LOGIC
  // ==========================================
  useEffect(() => {
    if (lastActiveDate !== todayStr) {
      const partsOld = lastActiveDate.split('-');
      const partsNow = todayStr.split('-');
      // Strict Date Parsing bypassing Timezones (YYYY, MM-1, DD)
      const dOld = new Date(partsOld[0], partsOld[1] - 1, partsOld[2]);
      const dNow = new Date(partsNow[0], partsNow[1] - 1, partsNow[2]);
      
      const diffTime = dNow.getTime() - dOld.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setGlobalDeadlineDays((prev) => Math.max(1, prev - diffDays));
        setLastActiveDate(todayStr);
      }
    }
  }, [lastActiveDate, todayStr]);

  // LONG PRESS DELETE HANDLER (Hold to Delete)
  const LongPressItem = ({ item, onDelete, children }) => {
    // REPLACED window.confirm with internal V3 state to avoid crashing the canvas
    const [showConfirm, setShowConfirm] = useState(false);
    
    const longPressEvent = useLongPress(() => {
      setShowConfirm(true);
    });

    return (
      <div {...longPressEvent} className="relative group cursor-pointer w-full">
        {children}
        {showConfirm && (
          <div className="absolute inset-0 bg-yellow-400 border-4 border-black p-4 flex flex-col items-center justify-center z-10 shadow-[6px_6px_0px_white]">
            <span className="font-black text-black uppercase text-[10px] mb-3 tracking-widest">Delete this item?</span>
            <div className="flex gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); setShowConfirm(false); }} 
                className="bg-black text-white px-6 py-2 font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-colors"
              >
                Yes
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
                className="bg-white text-black px-6 py-2 font-black uppercase tracking-widest hover:bg-black hover:text-white border-2 border-black transition-colors"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // DELETE ACTIONS
  const deleteStagingTopic = (id) => setStagingTopics(prev => prev.filter(t => t.id !== id));
  const deleteWisdomNote = (id) => setWisdomNotes(prev => prev.filter(n => n.id !== id));
  const deleteVaultNote = (id) => setVaultNotes(prev => prev.filter(n => n.id !== id));

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
      setOracleResponse("ERROR: API KEY MISSING. CONFIGURE IN SETTINGS.");
      return;
    }
    
    // 🔥 FIX: Ab Oracle dono jagah se exactly tumhara type kiya hua text (oracleQuery) hi padhega!
    const query = oracleQuery; 
    
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
      setOracleResponse("CONNECTION DISRUPTED. Please check your API key in Settings.");
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
      targetDate: addDays(todayStr, interval), // Automatically schedules for TOMORROW onwards
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

  const handleDeleteVaultCategory = (cat) => {
    if (cat === "Others") return;
    setVaultCategories(vaultCategories.filter(c => c !== cat));
    setVaultNotes(prev => prev.map(n => n.category === cat ? { ...n, category: "Others" } : n));
    if (expandedVaultCategory === cat) setExpandedVaultCategory(null);
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
    
    let paceStatus = { text: "ON TRACK", color: "text-white" };
    if (pace < 1 && remainingChapters > 0) paceStatus = { text: "DANGER", color: "text-red-500" };
    else if (pace >= 1 && pace <= 1.5) paceStatus = { text: "WARNING", color: "text-yellow-400" };
    else if (remainingChapters === 0) paceStatus = { text: "STANDBY", color: "text-zinc-500" };

    const todaysRevisions = [];
    studyTopics.forEach(topic => {
      topic.schedule.forEach(rev => {
        if (rev.targetDate <= todayStr && !rev.completed) {
          todaysRevisions.push({
            topicId: topic.id, title: topic.title, category: topic.category,
            targetDate: rev.targetDate, dayOffset: rev.dayOffset, isOverdue: rev.targetDate < todayStr
          });
        }
      });
    });

    const todaysCustomMissions = customMissions.filter(m => m.targetDate <= todayStr && !m.completed);
    const quoteOfTheDay = MORNING_QUOTES[baseDate.getDate() % MORNING_QUOTES.length];

    return (
      <div className="space-y-8 pb-10">
        
        {/* Morning Injection Brutalist */}
        <div className="bg-yellow-400 p-6 border-4 border-white shadow-[8px_8px_0px_white]">
          <h3 className="text-black text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b-2 border-black/20 pb-2">
            <Zap size={16} /> PROTOCOL INITIATED
          </h3>
          <p className="text-black text-2xl font-black uppercase tracking-tight leading-snug">
            "{quoteOfTheDay}"
          </p>
        </div>

        {/* Pace-Maker Engine (Now fully editable via Brutalist Input) */}
        <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_#facc15] relative overflow-hidden">
          <h2 className="text-[10px] font-black text-yellow-400 tracking-[0.2em] uppercase mb-4 border-b-2 border-white/20 pb-2">GLOBAL DEADLINE</h2>
          <div className="flex justify-between items-end">
            
            <div className="flex items-baseline gap-2 border-b-4 border-transparent hover:border-white/20 transition-colors focus-within:border-yellow-400">
              <input 
                type="number" 
                value={globalDeadlineDays}
                onChange={(e) => setGlobalDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 bg-transparent text-6xl font-black tracking-tighter text-white outline-none p-0 m-0"
              />
              <span className="text-xl text-yellow-400 font-black">DAYS</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-white tracking-widest font-bold uppercase mb-1">PACE DETECTOR</p>
              <p className={`text-2xl font-black ${paceStatus.color}`}>
                {pace} <span className="text-xs">CH/DAY</span>
              </p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${paceStatus.color}`}>{paceStatus.text}</p>
            </div>
          </div>
          
          {stagingTopics.length > 0 && (
            <div className="mt-8 bg-yellow-400 p-4 border-2 border-white text-black">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">CURRENT STRIKE TARGET</h3>
              <h2 className="text-xl font-black uppercase tracking-tight truncate">{stagingTopics[0].title}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black px-2 py-1 mt-2 inline-block">
                {stagingTopics[0].category}
              </span>
              <button 
                onClick={() => handleStartRevision(stagingTopics[0].id)}
                className="w-full mt-4 bg-black text-yellow-400 py-3 border-2 border-white font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all active:translate-y-1 shadow-[4px_4px_0px_black] active:shadow-none"
              >
                TARGET DESTROYED
              </button>
            </div>
          )}
        </div>

        {todaysCustomMissions.length > 0 && (
          <div className="pt-4">
            <h3 className="text-[10px] font-black text-yellow-400 tracking-[0.2em] uppercase mb-4">TODAY'S MISSIONS</h3>
            {todaysCustomMissions.map((mission) => (
              <div key={mission.id} className="flex items-center justify-between bg-black p-4 mb-3 border-2 border-white shadow-[4px_4px_0px_#facc15]">
                <span className="font-bold uppercase tracking-wider text-sm text-white">{mission.text}</span>
                <button 
                  onClick={() => setCustomMissions(prev => prev.filter(m => m.id !== mission.id))}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4">
          <h3 className="text-[10px] font-black text-yellow-400 tracking-[0.2em] uppercase mb-4">MANDATORY REVISIONS (TODAY)</h3>
          {todaysRevisions.length === 0 ? (
            <div className="border-4 border-dashed border-zinc-800 p-8 text-center text-zinc-600 font-black uppercase tracking-widest">
              SYSTEM CLEAR
            </div>
          ) : (
            <div className="space-y-4">
              {todaysRevisions.map((rev, idx) => (
                <div key={idx} className={`bg-black border-2 border-white p-4 flex items-center justify-between shadow-[4px_4px_0px_white] ${rev.isOverdue ? 'border-red-500 shadow-[4px_4px_0px_#ef4444]' : ''}`}>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm flex items-center gap-2">
                      {rev.title} 
                      {rev.isOverdue && <span className="text-[9px] bg-red-500 text-white px-2 py-1 tracking-widest">OVERDUE</span>}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">{rev.category}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">DAY {rev.dayOffset}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => markRevisionComplete(rev.topicId, rev.targetDate, rev.dayOffset)}
                    className="w-12 h-12 bg-white text-black border-2 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors active:translate-y-1"
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
    <div className="space-y-8 pb-10">
      <div className="bg-black border-4 border-white p-5 shadow-[8px_8px_0px_#facc15]">
        <div className="flex justify-between items-center mb-6 border-b-2 border-white/20 pb-2">
           <h3 className="text-yellow-400 font-black uppercase tracking-widest flex items-center gap-2 text-sm">
             LIQUID STRIKE QUEUE
           </h3>
           <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Hold to drag</span>
        </div>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newSyllabusCat}
            onChange={(e) => setNewSyllabusCat(e.target.value)}
            placeholder="NEW TAG..."
            className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
          />
          <button 
            onClick={handleAddSyllabusCategory}
            className="bg-yellow-400 text-black border-2 border-white px-4 font-black uppercase hover:bg-white active:translate-y-1 transition-all rounded-none"
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>

        {syllabusCategories.length > 1 && (
           <div className="flex flex-wrap gap-2 mb-6">
             {syllabusCategories.map(cat => (
               <div key={cat} className="group flex items-center gap-2 bg-black border-2 border-white px-3 py-2 text-xs font-black text-white uppercase tracking-widest hover:border-yellow-400 transition-colors cursor-pointer">
                 {cat}
                 {cat !== "Raw Backlog" && (
                   <button onClick={() => handleDeleteSyllabusCategory(cat)} className="text-zinc-500 hover:text-red-500 transition-colors">
                     <Trash2 size={14} />
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
            className="w-1/3 bg-black border-2 border-white px-2 py-3 text-xs font-black uppercase tracking-widest text-yellow-400 focus:outline-none rounded-none cursor-pointer"
          >
            {syllabusCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input 
            type="text" 
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStagingTopic()}
            placeholder="CHAPTER NAME..."
            className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
          />
          <button 
            onClick={handleAddStagingTopic}
            className="bg-white text-black border-2 border-white px-5 font-black hover:bg-yellow-400 active:translate-y-1 transition-all rounded-none"
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {stagingTopics.length === 0 && (
            <div className="text-center py-10 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">
              QUEUE EMPTY
            </div>
          )}
          {stagingTopics.map((topic, index) => (
            <LongPressItem key={topic.id} item={topic} onDelete={(id) => deleteStagingTopic(id)}>
              <div 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`bg-black p-4 border-2 flex items-center justify-between cursor-move transition-all select-none
                  ${index === 0 ? 'border-yellow-400 shadow-[6px_6px_0px_#facc15]' : 'border-white shadow-[4px_4px_0px_white] hover:border-yellow-400'}
                  ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <div className="flex items-center gap-4">
                  <GripVertical size={20} className={index === 0 ? "text-yellow-400" : "text-zinc-500"} />
                  <div>
                    <h4 className="font-black text-white text-sm uppercase flex items-center gap-2">
                      {topic.title}
                      {index === 0 && <span className="text-[9px] bg-yellow-400 text-black px-2 py-0.5 tracking-widest font-black">NEXT</span>}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 block">{topic.category}</span>
                  </div>
                </div>
              </div>
            </LongPressItem>
          ))}
        </div>
        <p className="text-[10px] font-black tracking-widest text-zinc-600 mt-6 text-center uppercase">Hold item to execute delete</p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 pb-10">
      <div className="bg-black border-4 border-white p-5 shadow-[8px_8px_0px_#facc15]">
        <h3 className="text-yellow-400 font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-sm border-b-2 border-white/20 pb-2">
          ONGOING 30-DAY CYCLES
        </h3>
        {studyTopics.length === 0 ? (
          <div className="text-center py-10 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">
            NO ACTIVE CYCLES
          </div>
        ) : (
          <div className="space-y-6">
            {studyTopics.map(topic => (
              <div key={topic.id} className="bg-black border-2 border-white p-5 shadow-[4px_4px_0px_white]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-white text-lg uppercase">{topic.title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-1 mt-2 inline-block">{topic.category}</span>
                  </div>
                  <span className="text-[10px] font-black text-yellow-400 tracking-widest border border-yellow-400 px-2 py-1">INIT: {topic.startDate}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {topic.schedule.map((rev, i) => {
                    const isPending = !rev.completed && rev.targetDate <= todayStr;
                    return (
                      <div key={i} className={`flex flex-col items-center justify-center py-2 px-3 border-2 transition-all ${
                        rev.completed 
                          ? 'bg-yellow-400 border-yellow-400 text-black' 
                          : isPending 
                            ? 'bg-black border-red-500 text-red-500 shadow-[2px_2px_0px_#ef4444]'
                            : 'bg-black border-zinc-800 text-zinc-600'
                      }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">D{rev.dayOffset}</span>
                        {rev.completed ? (
                          <Check size={16} className="mt-1 stroke-[4]" />
                        ) : (
                          <Circle size={16} className={`mt-1 stroke-[3] ${isPending ? 'animate-pulse' : ''}`} />
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

      <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_white]">
        <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-sm border-b-2 border-zinc-800 pb-2">
          HALL OF FAME (MASTERED)
        </h3>
        {masteredTopics.length === 0 ? (
          <div className="text-center py-10 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">
            EMPTY VAULT
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {masteredTopics.map(topic => (
              <div key={topic.id} className="bg-black p-4 border-2 border-zinc-700 flex items-center gap-4 hover:border-yellow-400 transition-colors">
                <div className="w-12 h-12 bg-black border-2 border-yellow-400 flex items-center justify-center">
                   <Trophy size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm uppercase">{topic.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{topic.category} • {topic.masteredDate}</p>
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
        <div className="space-y-6 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setExpandedWisdomCategory(null)} className="p-3 bg-white text-black hover:bg-yellow-400 transition-colors border-2 border-black rounded-none active:translate-y-1">
              <ChevronLeft size={24} className="stroke-[3]"/>
            </button>
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FolderOpen size={24} className="text-zinc-500" /> {expandedWisdomCategory}
            </h2>
          </div>
          <div className="flex gap-2 shadow-[6px_6px_0px_#facc15] mb-8">
            <input 
              type="text" 
              value={newWisdom}
              onChange={(e) => setNewWisdom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWisdom()}
              placeholder="DUMP KNOWLEDGE..."
              className="flex-1 bg-black border-4 border-white px-4 py-4 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
            />
            <button 
              onClick={handleAddWisdom}
              className="bg-yellow-400 text-black border-4 border-white px-6 font-black transition-all hover:bg-white rounded-none active:bg-zinc-300"
            >
              <Plus size={24} className="stroke-[4]" />
            </button>
          </div>
          <div className="grid gap-4">
            {filteredNotes.length === 0 && <div className="text-center py-10 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">EMPTY FOLDER</div>}
            {filteredNotes.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => deleteWisdomNote(id)}>
                <div className="bg-black border-2 border-white p-5 shadow-[4px_4px_0px_white] flex flex-col gap-4 group hover:border-yellow-400 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                     <Mic size={18} className="text-zinc-600 mt-1 flex-shrink-0" />
                     <p className="text-white text-sm font-bold leading-relaxed">{note.text}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-zinc-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{note.date}</span>
                    <div className="flex items-center gap-2">
                       <MoveRight size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <select 
                         onChange={(e) => handleMoveWisdomNote(note.id, e.target.value)}
                         value={note.category}
                         className="bg-zinc-900 border-2 border-zinc-700 text-[10px] font-black text-white uppercase px-2 py-1 outline-none cursor-pointer"
                       >
                         {wisdomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-8 pb-10">
        
        {/* Ask Oracle Brutalist Box */}
        <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_#facc15]">
          <h3 className="text-yellow-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-sm border-b-2 border-white/20 pb-2">
            <Sparkles size={18} /> ASK THE ORACLE
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-4">Chat with your Second Brain. Uses your saved Wisdom.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')}
              placeholder="QUERY..."
              className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
            />
            <button 
              onClick={() => handleAskOracle('wisdom')}
              disabled={isOracleThinking}
              className="bg-white text-black border-2 border-white px-6 font-black uppercase hover:bg-yellow-400 active:translate-y-1 transition-all rounded-none disabled:opacity-50"
            >
              {isOracleThinking ? <Circle size={20} className="animate-pulse stroke-[4]" /> : <Send size={20} className="stroke-[3]" />}
            </button>
          </div>
          {oracleResponse && (
            <div className="mt-6 p-5 bg-zinc-900 border-l-4 border-yellow-400">
              <p className="text-white text-sm font-bold leading-relaxed">{oracleResponse}</p>
            </div>
          )}
        </div>

        <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_white]">
          <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-sm border-b-2 border-zinc-800 pb-2">
            <Folder size={18} /> WISDOM FOLDERS
          </h3>
          <div className="flex gap-2 mb-8">
            <input 
              type="text" 
              value={newWisdomCat}
              onChange={(e) => setNewWisdomCat(e.target.value)}
              placeholder="NEW FOLDER..."
              className="flex-1 bg-black border-2 border-zinc-600 px-4 py-3 text-white font-black uppercase placeholder:text-zinc-700 focus:outline-none focus:border-white rounded-none"
            />
            <button 
              onClick={handleAddWisdomCategory}
              className="bg-zinc-800 text-white border-2 border-zinc-600 px-5 font-black hover:bg-white hover:text-black transition-colors rounded-none"
            >
              <Plus size={20} className="stroke-[3]" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {wisdomCategories.map(cat => {
              const count = wisdomNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button 
                    onClick={() => setExpandedWisdomCategory(cat)}
                    className="w-full bg-black border-2 border-white p-5 flex flex-col items-start gap-4 hover:border-yellow-400 hover:shadow-[4px_4px_0px_#facc15] transition-all text-left active:translate-y-1 rounded-none h-full"
                  >
                    <FolderOpen size={32} className="text-zinc-400 group-hover:text-yellow-400 transition-colors" />
                    <div>
                      <h4 className="font-black text-white text-sm uppercase truncate w-full">{cat}</h4>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 block">{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Quick Thoughts" && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteWisdomCategory(cat); }}
                      className="absolute top-3 right-3 p-2 bg-black text-zinc-600 hover:text-red-500 border-2 border-transparent hover:border-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderVault = () => {
    if (expandedVaultCategory) {
      const notesInCat = vaultNotes.filter(n => n.category === expandedVaultCategory);
      return (
        <div className="space-y-6 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setExpandedVaultCategory(null)} className="p-3 bg-white text-black hover:bg-yellow-400 transition-colors border-2 border-black rounded-none active:translate-y-1">
              <ChevronLeft size={24} className="stroke-[3]"/>
            </button>
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
               <FolderOpen size={24} className="text-zinc-500" /> {expandedVaultCategory}
            </h2>
          </div>
          <div className="grid gap-4">
            {notesInCat.length === 0 && <div className="text-center py-10 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">EMPTY FOLDER</div>}
            {notesInCat.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => deleteVaultNote(id)}>
                <div className="bg-black border-2 border-white p-5 shadow-[4px_4px_0px_white] flex items-start gap-4 hover:border-yellow-400 transition-colors group cursor-pointer">
                  <BrainCircuit size={20} className="text-zinc-600 mt-1 shrink-0 group-hover:text-yellow-400 transition-colors" />
                  <div>
                    <p className="text-white text-sm font-bold leading-relaxed">{note.text}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-3 block">{note.date}</span>
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 pb-10">
        
        {/* Ask Oracle Brutalist Box */}
        <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_#facc15]">
          <h3 className="text-yellow-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-sm border-b-2 border-white/20 pb-2">
            <Sparkles size={18} /> ASK THE ORACLE
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-4">Chat with your Second Brain. Uses your saved Dump notes.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('vault')}
              placeholder="QUERY..."
              className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
            />
            <button 
              onClick={() => handleAskOracle('vault')}
              disabled={isOracleThinking}
              className="bg-white text-black border-2 border-white px-6 font-black uppercase hover:bg-yellow-400 active:translate-y-1 transition-all rounded-none disabled:opacity-50"
            >
              {isOracleThinking ? <Circle size={20} className="animate-pulse stroke-[4]" /> : <Send size={20} className="stroke-[3]" />}
            </button>
          </div>
          {oracleResponse && (
            <div className="mt-6 p-5 bg-zinc-900 border-l-4 border-yellow-400">
              <p className="text-white text-sm font-bold leading-relaxed">{oracleResponse}</p>
            </div>
          )}
        </div>

        {/* AI Inbox Input (Brain Dump) */}
        <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_white]">
          <div className="flex justify-between items-center mb-4 border-b-2 border-zinc-800 pb-2">
            <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
               <BrainCircuit size={18} /> BRAIN DUMP (INBOX)
            </h3>
            {isVaultSorting && (
              <span className="text-[9px] bg-yellow-400 text-black px-2 py-1 font-black uppercase tracking-widest animate-pulse border-2 border-white">
                <Sparkles size={10} className="inline mr-1" /> AI SORTING
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-5 leading-relaxed">
             Fast-capture raw ideas. Add 3 similar thoughts, and AI will automatically build a new folder for them below.
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
              className={`p-3 border-2 transition-all rounded-none ${isListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-zinc-900 text-white border-zinc-700 hover:border-white'}`}
            >
              <Mic size={24} />
            </button>
            <input 
              type="text" 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder={isListening ? "SPEAKING..." : "RAW THOUGHT..."}
              className="flex-1 bg-black border-2 border-white px-4 py-3 text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:bg-zinc-900 rounded-none"
            />
            <button 
              onClick={handleAddNote}
              disabled={isVaultSorting}
              className="bg-yellow-400 text-black border-2 border-white px-5 font-black uppercase hover:bg-white active:translate-y-1 transition-all rounded-none disabled:opacity-50"
            >
              <Send size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 px-1">
             <Folder size={18} /> VAULT FOLDERS
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {vaultCategories.map(cat => {
              const count = vaultNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button 
                    onClick={() => setExpandedVaultCategory(cat)}
                    className="w-full bg-black border-2 border-white p-5 flex flex-col items-start gap-4 hover:border-yellow-400 hover:shadow-[4px_4px_0px_#facc15] transition-all text-left active:translate-y-1 rounded-none h-full"
                  >
                    <FolderOpen size={32} className="text-zinc-400 group-hover:text-yellow-400 transition-colors" />
                    <div>
                      <h4 className="font-black text-white text-sm uppercase truncate w-full">{cat}</h4>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 block">{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Others" && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteVaultCategory(cat); }}
                      className="absolute top-3 right-3 p-2 bg-black text-zinc-600 hover:text-red-500 border-2 border-transparent hover:border-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {vaultNotes.length === 0 && (
            <div className="text-center py-12 border-4 border-dashed border-zinc-800 text-zinc-600 font-black uppercase tracking-widest">
              INBOX ZERO
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUrgeKiller = () => (
    <div className="space-y-10 pb-10 pt-4 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-black text-white uppercase tracking-widest flex justify-center items-center gap-3">
        <ShieldAlert className="text-yellow-400 stroke-[3]" size={32} /> INTERCEPTOR
      </h2>
      <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px] px-8">Trigger this protocol if you are about to break discipline.</p>

      {!isUrgeActive ? (
        <button 
          onClick={triggerUrgeInterceptor}
          className="w-full aspect-square max-w-[280px] mx-auto bg-yellow-400 hover:bg-white text-black border-8 border-black outline outline-4 outline-yellow-400 shadow-[12px_12px_0px_white] active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center gap-6 group rounded-none"
        >
          <Skull size={80} className="stroke-[2] group-hover:scale-110 transition-transform" />
          <span className="font-black text-3xl uppercase tracking-widest text-center px-4">I HAVE AN URGE</span>
        </button>
      ) : (
        <div className="bg-black border-4 border-yellow-400 p-8 shadow-[12px_12px_0px_#facc15] relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-zinc-900">
            <div 
              className="bg-yellow-400 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(urgeTimer / 90) * 100}%` }}
            ></div>
          </div>
          <h3 className="text-yellow-400 font-black mt-4 mb-6 uppercase tracking-[0.2em] text-xs">FRICTION ZONE ACTIVE</h3>
          <div className="text-8xl font-black text-white mb-8 tabular-nums tracking-tighter">
            {urgeTimer}s
          </div>
          <div className="min-h-[100px] flex items-center justify-center border-t-2 border-zinc-800 pt-6">
            <p className="text-white font-bold text-lg uppercase tracking-wider leading-relaxed px-2" key={currentQuoteIndex}>
              "{urgeQuotes[currentQuoteIndex] || 'STAY STRONG. DO NOT GIVE IN.'}"
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 pb-10">
      
      {/* Profile Section */}
      <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_white]">
        <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-sm border-b-2 border-zinc-800 pb-2">
           <User size={18} /> PROFILE COMMAND
        </h3>
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-32 h-32 bg-black border-4 border-yellow-400 flex items-center justify-center overflow-hidden shadow-[6px_6px_0px_#facc15] relative">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
            ) : (
              <span className="text-5xl">🦊</span>
            )}
            {/* Direct Hidden Input */}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              onChange={handleImageUpload} 
            />
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">TAP AVATAR TO UPLOAD</p>
        </div>
        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">DISPLAY NAME</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="e.g., APEX HUNTER" 
            className="w-full bg-black border-2 border-white px-4 py-4 text-white font-black uppercase placeholder:text-zinc-700 focus:outline-none focus:border-yellow-400 transition-colors rounded-none" 
          />
        </div>
      </div>

      {/* AI Key Section */}
      <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_#facc15]">
        <h3 className="text-yellow-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-sm border-b-2 border-white/20 pb-2">
           <Lock size={18} /> AI ENGINE CORE
        </h3>
        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed mb-6">
          Paste Groq API Key. Required for Oracle, Sorter, and dynamic Urges. Stored locally.
        </p>
        <input 
          type="password" 
          value={groqKey} 
          onChange={(e) => setGroqKey(e.target.value)} 
          placeholder="GSK_XXXX..." 
          className="w-full bg-black border-2 border-white px-4 py-4 text-white font-bold tracking-widest focus:outline-none focus:border-yellow-400 transition-colors rounded-none" 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-28 selection:bg-yellow-400 selection:text-black overflow-x-hidden relative">
      
      <div className="max-w-2xl mx-auto p-4 md:p-6 relative z-10 pt-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b-4 border-white pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3 uppercase">
              Apex Mind <span className="text-[10px] bg-yellow-400 text-black px-2 py-1 font-black uppercase tracking-widest align-middle border-2 border-white">V3.0</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">SECOND BRAIN OS</p>
          </div>
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setActiveTab('settings')}
          >
            {userName && (
              <span className="font-black uppercase tracking-widest text-white text-xs hidden sm:block group-hover:text-yellow-400 transition-colors">
                {userName}
              </span>
            )}
            <div className="w-14 h-14 bg-black border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_#facc15] overflow-hidden group-hover:shadow-[6px_6px_0px_white] transition-all">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
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

      {/* Floating Night Shift Widget */}
      {isNightTime && (
        <div className="fixed bottom-28 right-4 z-40 flex flex-col items-end">
          {!isNightShiftOpen ? (
            <button 
              onClick={() => setIsNightShiftOpen(true)}
              className="bg-yellow-400 text-black border-4 border-white px-6 py-4 font-black shadow-[6px_6px_0px_white] flex items-center gap-3 uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_white] transition-all rounded-none"
            >
              <Moon size={20} className="stroke-[3]" /> PLAN TOMORROW
            </button>
          ) : (
            <div className="bg-black border-4 border-white p-6 w-[320px] shadow-[8px_8px_0px_#facc15] rounded-none">
               <div className="flex justify-between items-center mb-6 border-b-2 border-white/20 pb-3">
                 <h3 className="font-black text-yellow-400 text-xs uppercase tracking-widest flex items-center gap-2">
                   <Moon size={16} className="stroke-[3]"/> NIGHT SHIFT INBOX
                 </h3>
                 <button onClick={() => setIsNightShiftOpen(false)} className="text-white hover:text-yellow-400 transition-colors">
                   <X size={20} className="stroke-[3]"/>
                 </button>
               </div>
               
               <p className="text-[10px] text-zinc-400 font-bold mb-4">Add tasks for tomorrow, or pin a queue target.</p>

               <div className="flex gap-2 mb-6">
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
                   placeholder="CUSTOM TASK..."
                   className="flex-1 bg-black border-2 border-white px-3 py-3 text-xs text-white font-black uppercase placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                 />
                 <button 
                   onClick={() => {
                      if(newCustomMission.trim()) {
                         setCustomMissions(prev => [...prev, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }]);
                         setNewCustomMission("");
                      }
                   }}
                   className="bg-white hover:bg-yellow-400 text-black border-2 border-black px-4 transition-colors active:translate-y-1"
                 >
                   <Send size={16} className="stroke-[3]" />
                 </button>
               </div>

               {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).length > 0 && (
                  <div className="mb-6 space-y-2">
                    {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).map(m => (
                       <div key={m.id} className="text-xs font-black uppercase tracking-wider text-white bg-zinc-900 border-2 border-zinc-700 px-3 py-2 flex justify-between items-center">
                         <span className="truncate pr-2">• {m.text}</span>
                         <button onClick={() => setCustomMissions(prev => prev.filter(task => task.id !== m.id))} className="text-zinc-500 hover:text-red-500 transition-colors shrink-0">
                           <Trash2 size={14} className="stroke-[3]" />
                         </button>
                       </div>
                    ))}
                  </div>
               )}

               {stagingTopics.length > 0 && (
                 <>
                   <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-3 border-t-2 border-white/20 pt-4">PIN SYLLABUS TARGET</div>
                   <div className="space-y-2 max-h-32 overflow-y-auto hide-scrollbar pr-1">
                     {stagingTopics.slice(0, 3).map((topic, idx) => (
                       <button 
                         key={topic.id}
                         onClick={() => {
                           const items = [...stagingTopics];
                           const clickedItem = items.splice(idx, 1)[0];
                           items.unshift(clickedItem);
                           setStagingTopics(items);
                         }}
                         className="w-full text-left bg-black hover:bg-white border-2 border-white p-3 transition-colors flex items-center justify-between group"
                       >
                         <span className="font-black text-white group-hover:text-black text-[10px] uppercase truncate pr-2 tracking-widest">{topic.title}</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-black bg-yellow-400 px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">PIN</span>
                       </button>
                     ))}
                   </div>
                 </>
               )}
            </div>
          )}
        </div>
      )}

      {/* Brutalist Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t-4 border-white z-50 overflow-x-auto hide-scrollbar">
        <div className="max-w-2xl mx-auto flex justify-between px-2 py-3 min-w-[360px]">
          {[
            { id: 'dashboard', icon: Calendar, label: 'MISSION' },
            { id: 'study', icon: Activity, label: 'QUEUE' },
            { id: 'history', icon: History, label: 'HISTORY' },
            { id: 'wisdom', icon: Folder, label: 'WISDOM' },
            { id: 'vault', icon: BrainCircuit, label: 'DUMP' },
            { id: 'urge', icon: ShieldAlert, label: 'URGE' },
            { id: 'settings', icon: Settings, label: 'CONFIG' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-2 transition-colors border-b-4 ${activeTab === tab.id ? 'text-yellow-400 border-yellow-400' : 'text-zinc-600 border-transparent hover:text-white'}`}
            >
              <tab.icon size={22} className={activeTab === tab.id ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
