import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  Calendar as CalendarIcon, Lock, CheckCircle2, XCircle, AlertTriangle, ChevronLeft,
  ChevronRight, Download, BarChart2, X, Flame, Star, BookOpen, Copy,
  FileDown, User, ShoppingCart, Briefcase, Bot, Settings, Swords,
  ArrowLeft, Zap, Check, History, Target, Shield, Camera, Edit3, Trash2, Plus,
  BrainCircuit, Circle, Send, Skull, Trophy, FolderOpen, MoveRight,
  Sparkles, Activity, GripVertical, Moon, Image as ImageIcon, Folder,
  ShieldAlert, Mic
} from "lucide-react";

// ==========================================
// THEME ENGINE 
// ==========================================
const THEMES = {
   titan: {
    id: 'titan', name: 'Mad Titan',
    appBg: 'bg-[#1a0525] text-[#e0b0ff] font-sans selection:bg-[#ffd700] selection:text-black',
    devBar: 'bg-[#ffd700] text-black border-b-4 border-[#4a148c] font-black',
    header: 'bg-[#4a148c] text-[#ffd700] border-4 border-[#ffd700] shadow-[0_0_30px_rgba(255,215,0,0.3)] rounded-lg',
    card: 'bg-[#2a0845] border-2 border-[#ffd700]/50 shadow-[8px_8px_0px_#ffd700] rounded-lg',
    cardInner: 'bg-[#311b54] border border-[#ffd700]/30 hover:border-[#ffd700] transition-all rounded-md',
    textMain: 'text-[#e0b0ff]', textMuted: 'text-[#8e5eb5]', textAccent: 'text-[#ffd700]', textWarning: 'text-[#ffb300]',
    input: 'bg-[#1a0525] border-2 border-[#ffd700]/50 text-[#ffd700] placeholder:text-[#8e5eb5] focus:border-[#ffd700] rounded-md px-4',
    btnPrimary: 'bg-[#ffd700] text-[#1a0525] border-2 border-[#ffd700] hover:bg-white shadow-[0_0_15px_rgba(255,215,0,0.5)] active:translate-y-1 active:shadow-none rounded-md font-black uppercase',
    btnWarning: 'bg-[#4a148c] text-[#ffd700] border-2 border-[#ffd700] hover:bg-[#ffd700] hover:text-[#4a148c] shadow-[4px_4px_0px_black] rounded-md font-black uppercase',
    fontHeading: 'font-black tracking-widest uppercase', borderAccent: 'border-[#ffd700]', badge: 'bg-[#ffd700] text-[#1a0525] font-black rounded-sm px-2'
  },
  speedster: {
    id: 'speedster', name: 'Speed Force',
    appBg: 'bg-[#990000] text-white font-sans selection:bg-[#ffcc00] selection:text-black',
    devBar: 'bg-[#ffcc00] text-black border-b-4 border-black font-black',
    header: 'bg-gradient-to-r from-[#cc0000] to-[#ff3333] text-white border-[3px] border-black shadow-[6px_6px_0px_#ffcc00] rounded-xl transform -skew-x-2',
    card: 'bg-white border-[3px] border-black shadow-[6px_6px_0px_#111] rounded-xl',
    cardInner: 'bg-[#fff5cc] border-2 border-black hover:bg-[#ffcc00] transition-all rounded-lg',
    textMain: 'text-black', textMuted: 'text-zinc-600', textAccent: 'text-[#cc0000]', textWarning: 'text-[#ffcc00]',
    input: 'bg-white border-2 border-black text-black placeholder:text-zinc-500 focus:border-[#cc0000] rounded-lg px-4',
    btnPrimary: 'bg-[#cc0000] text-white border-[3px] border-black hover:bg-[#ffcc00] hover:text-black shadow-[4px_4px_0px_#111] active:translate-y-1 active:shadow-none rounded-lg font-black uppercase italic',
    btnWarning: 'bg-[#ffcc00] text-black border-[3px] border-black hover:bg-white shadow-[2px_2px_0px_#111] rounded-lg font-black uppercase italic',
    fontHeading: 'font-black tracking-widest italic', borderAccent: 'border-[#ffcc00]', badge: 'bg-[#ffcc00] text-black border-2 border-black font-black rounded-lg italic'
  },
  wolverine: {
    id: 'wolverine', name: 'Weapon X',
    appBg: 'bg-[#ffce00] text-black font-sans selection:bg-[#32527b] selection:text-white',
    devBar: 'bg-[#32527b] text-white border-b-4 border-black font-black',
    header: 'bg-[#32527b] text-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-none',
    card: 'bg-[#f4f4f4] border-4 border-black shadow-[6px_6px_0px_#000] rounded-none',
    cardInner: 'bg-white border-2 border-black hover:border-[#32527b] transition-all rounded-none',
    textMain: 'text-black', textMuted: 'text-zinc-600', textAccent: 'text-[#32527b]', textWarning: 'text-[#ffce00]',
    input: 'bg-white border-2 border-black text-black placeholder:text-zinc-500 focus:border-[#32527b] rounded-none px-4',
    btnPrimary: 'bg-[#32527b] text-white border-4 border-black hover:bg-[#ffce00] hover:text-black shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none rounded-none font-black uppercase',
    btnWarning: 'bg-[#ffce00] text-black border-4 border-black hover:bg-white shadow-[4px_4px_0px_black] rounded-none font-black uppercase',
    fontHeading: 'font-black tracking-widest italic', borderAccent: 'border-[#32527b]', badge: 'bg-[#32527b] text-white border-2 border-black font-black rounded-none'
  },
  batman: {
    id: 'batman', name: 'Dark Knight',
    appBg: 'bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#ffe81f] selection:text-black',
    devBar: 'bg-[#ffe81f] text-black border-b-2 border-black font-black',
    header: 'bg-[#111] text-gray-100 border border-[#222] shadow-[0_10px_30px_rgba(255,232,31,0.1)] rounded-xl',
    card: 'bg-[#151515] border border-[#222] shadow-2xl rounded-xl',
    cardInner: 'bg-[#1a1a1a] border border-[#333] hover:border-[#ffe81f]/50 transition-all rounded-lg',
    textMain: 'text-gray-200', textMuted: 'text-gray-500', textAccent: 'text-[#ffe81f]', textWarning: 'text-yellow-500',
    input: 'bg-[#111] border border-[#333] text-white placeholder:text-gray-600 focus:border-[#ffe81f] rounded-lg px-4',
    btnPrimary: 'bg-[#ffe81f] text-black border-none hover:bg-white shadow-[0_0_15px_rgba(255,232,31,0.3)] rounded-lg font-black uppercase',
    btnWarning: 'bg-[#222] text-[#ffe81f] border border-[#ffe81f] hover:bg-[#ffe81f] hover:text-black rounded-lg font-black uppercase',
    fontHeading: 'font-bold tracking-widest', borderAccent: 'border-[#ffe81f]/30', badge: 'bg-[#ffe81f]/10 text-[#ffe81f] border border-[#ffe81f]/20 rounded-md'
  },
   mario: {
    id: 'mario', name: 'Super Plumber',
    appBg: 'bg-[#5c94fc] text-white font-sans selection:bg-[#e02424] selection:text-white',
    devBar: 'bg-[#e02424] text-white border-b-4 border-[#000] font-black',
    header: 'bg-[#e02424] text-white border-4 border-black shadow-[6px_6px_0px_#fbd000] rounded-2xl',
    card: 'bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-2xl',
    cardInner: 'bg-[#f8f8f8] border-2 border-black hover:border-[#e02424] transition-all rounded-xl',
    textMain: 'text-black', textMuted: 'text-zinc-600', textAccent: 'text-[#e02424]', textWarning: 'text-[#fbd000]',
    input: 'bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:border-[#e02424] rounded-xl px-4',
    btnPrimary: 'bg-[#e02424] text-white border-4 border-black hover:bg-[#43b047] shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none rounded-xl font-black uppercase',
    btnWarning: 'bg-[#fbd000] text-black border-4 border-black hover:bg-white shadow-[4px_4px_0px_black] rounded-xl font-black uppercase',
    fontHeading: 'font-black tracking-wide', borderAccent: 'border-[#e02424]', badge: 'bg-[#43b047] text-white border-2 border-black font-black rounded-full'
  },
   stark: {
    id: 'stark', name: 'Stark Tech',
    appBg: 'bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#00f3ff] selection:text-black',
    devBar: 'bg-[#990000] text-[#ffcc00] border-b border-[#ffcc00] font-bold',
    header: 'bg-gradient-to-r from-[#800000] to-[#cc0000] text-[#ffcc00] border-b-2 border-[#00f3ff] shadow-[0_0_20px_rgba(204,0,0,0.5)] rounded-xl',
    card: 'bg-[#0a0a0a] border border-[#333] shadow-[0_0_15px_rgba(0,243,255,0.1)] rounded-xl',
    cardInner: 'bg-[#141414] border border-[#00f3ff]/30 hover:border-[#00f3ff] transition-all rounded-lg',
    textMain: 'text-[#e0e0e0]', textMuted: 'text-[#666]', textAccent: 'text-[#00f3ff]', textWarning: 'text-[#ffcc00]',
    input: 'bg-[#050505] border border-[#00f3ff]/50 text-[#00f3ff] placeholder:text-[#333] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] rounded-lg px-4',
    btnPrimary: 'bg-[#cc0000] text-[#ffcc00] border border-[#ffcc00] hover:bg-[#ffcc00] hover:text-[#cc0000] shadow-[0_0_15px_rgba(204,0,0,0.4)] rounded-lg font-black uppercase',
    btnWarning: 'bg-[#141414] text-[#00f3ff] border border-[#00f3ff] hover:bg-[#00f3ff] hover:text-black rounded-lg font-black uppercase',
    fontHeading: 'font-mono tracking-widest uppercase', borderAccent: 'border-[#00f3ff]', badge: 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff] rounded font-mono'
  },
  rpgDark: {
    id: 'rpgDark', name: 'RPG Stealth',
    appBg: 'bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30 selection:text-blue-200',
    devBar: 'bg-blue-900 text-blue-100 border-b border-blue-700 font-bold',
    header: 'bg-gray-900 border border-gray-800 shadow-xl rounded-2xl',
    card: 'bg-gray-900 border border-gray-800 shadow-xl rounded-2xl',
    cardInner: 'bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-xl transition-all',
    textMain: 'text-gray-200', textMuted: 'text-gray-500', textAccent: 'text-blue-400', textWarning: 'text-yellow-500',
    input: 'bg-gray-950 border border-gray-700 text-white rounded-xl focus:border-blue-500 placeholder:text-gray-600',
    btnPrimary: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]',
    btnWarning: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-xl font-bold',
    fontHeading: 'font-sans', borderAccent: 'border-blue-500/50', badge: 'bg-gray-900 border border-gray-700 text-gray-300 rounded-full'
  },
  brutalist: {
    id: 'brutalist', name: 'Neo-Brutalist',
    appBg: 'bg-black text-white font-sans uppercase tracking-wider selection:bg-yellow-400 selection:text-black',
    devBar: 'bg-yellow-400 text-black border-b-4 border-white font-black',
    header: 'bg-black border-4 border-white shadow-[6px_6px_0px_white] sm:shadow-[8px_8px_0px_white] rounded-none',
    card: 'bg-black border-4 border-white shadow-[6px_6px_0px_#facc15] sm:shadow-[8px_8px_0px_#facc15] rounded-none',
    cardInner: 'bg-black border-2 border-white hover:border-yellow-400 hover:shadow-[4px_4px_0px_#facc15] transition-all rounded-none',
    textMain: 'text-white', textMuted: 'text-zinc-500', textAccent: 'text-yellow-400', textWarning: 'text-yellow-400',
    input: 'bg-black border-2 border-white text-white rounded-none focus:border-yellow-400 placeholder:text-zinc-600',
    btnPrimary: 'bg-white text-black border-2 border-white hover:bg-yellow-400 hover:border-yellow-400 active:translate-y-1 rounded-none font-black shadow-[4px_4px_0px_black]',
    btnWarning: 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-white active:translate-y-1 rounded-none font-black',
    fontHeading: 'font-black tracking-wide uppercase', borderAccent: 'border-yellow-400', badge: 'bg-yellow-400 text-black border-2 border-white rounded-none font-black'
  },
  doraemonDark: {
    id: 'doraemonDark', name: 'Doraemon Dark',
    appBg: 'bg-[#09111e] text-slate-200 font-sans selection:bg-[#0096FE] selection:text-white',
    devBar: 'bg-[#FFD900] text-slate-900 border-b border-[#E6C300] font-bold',
    header: 'bg-gradient-to-r from-[#0096FE] to-[#0077CC] text-white border border-[#0096FE]/50 shadow-[0_10px_30px_rgba(0,150,254,0.3)] rounded-3xl',
    card: 'bg-[#152238] border border-[#1E3A5F] shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-3xl',
    cardInner: 'bg-[#0B132B] border border-[#1E3A5F] hover:border-[#0096FE]/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-slate-200', textMuted: 'text-slate-400', textAccent: 'text-[#0096FE]', textWarning: 'text-[#FFD900]',
    input: 'bg-[#0B132B] border border-[#1E3A5F] text-slate-200 placeholder:text-slate-600 focus:border-[#0096FE] rounded-full px-4',
    btnPrimary: 'bg-[#0096FE] text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(0,150,254,0.3)] rounded-full font-bold',
    btnWarning: 'bg-[#1E3A5F] text-[#33AAFF] hover:bg-[#1E3A5F]/80 rounded-full font-bold',
    fontHeading: 'font-bold tracking-normal', borderAccent: 'border-[#0096FE]', badge: 'bg-[#0B132B] text-slate-400 border border-[#1E3A5F] rounded-full'
  },
  doraemonLight: {
    id: 'doraemonLight', name: 'Doraemon Light',
    appBg: 'bg-[#FAFAFA] text-slate-800 font-sans selection:bg-[#0096FE] selection:text-white',
    devBar: 'bg-[#FFD900] text-slate-900 border-b border-[#E6C300] font-bold',
    header: 'bg-gradient-to-r from-[#0096FE] to-[#33AAFF] text-white shadow-lg rounded-3xl',
    card: 'bg-white border border-[#E2E8F0] shadow-xl rounded-3xl',
    cardInner: 'bg-slate-50 border border-[#E2E8F0] hover:border-[#0096FE]/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-slate-800', textMuted: 'text-slate-500', textAccent: 'text-[#0096FE]', textWarning: 'text-[#FFD900]',
    input: 'bg-slate-50 border border-[#E2E8F0] text-slate-800 placeholder:text-slate-400 focus:border-[#0096FE] rounded-full px-4',
    btnPrimary: 'bg-[#0096FE] text-white hover:bg-blue-600 shadow-md rounded-full font-bold',
    btnWarning: 'bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full font-bold',
    fontHeading: 'font-bold tracking-normal', borderAccent: 'border-[#0096FE]', badge: 'bg-slate-100 text-slate-600 border border-slate-200 rounded-full'
  },
  cyber: {
    id: 'cyber', name: 'Cyber-Glass',
    appBg: 'bg-[#050b14] text-cyan-50 font-sans selection:bg-cyan-500 selection:text-white',
    devBar: 'bg-cyan-900 text-cyan-100 border-b border-cyan-500 font-bold',
    header: 'bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-3xl',
    card: 'bg-[#0a192f]/60 backdrop-blur-lg border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl',
    cardInner: 'bg-[#050b14]/50 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-cyan-50', textMuted: 'text-cyan-600/80', textAccent: 'text-cyan-400', textWarning: 'text-teal-400',
    input: 'bg-[#050b14]/50 border border-cyan-500/20 text-cyan-50 placeholder:text-cyan-800 focus:border-cyan-400 rounded-xl px-4',
    btnPrimary: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl font-bold',
    btnWarning: 'bg-[#050b14]/50 text-cyan-600 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl font-bold',
    fontHeading: 'font-sans tracking-wide uppercase', borderAccent: 'border-cyan-500/50', badge: 'bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-md'
  },
  shinchan: {
    id: 'shinchan', name: 'Action Kamen',
    appBg: 'bg-[#ffeb3b] text-[#111] font-sans selection:bg-[#ff0000] selection:text-white',
    devBar: 'bg-[#ff0000] text-white border-b-4 border-black font-black',
    header: 'bg-[#00a8ff] text-white border-[3px] border-black rounded-full shadow-[4px_4px_0px_#111]',
    card: 'bg-white border-[3px] border-black shadow-[6px_6px_0px_#111] rounded-3xl',
    cardInner: 'bg-[#fff9c4] border-2 border-black hover:bg-[#ffeb3b] transition-all rounded-2xl',
    textMain: 'text-black', textMuted: 'text-zinc-600', textAccent: 'text-[#ff0000]', textWarning: 'text-[#00a8ff]',
    input: 'bg-white border-[3px] border-black text-black placeholder:text-zinc-500 focus:border-[#ff0000] rounded-full px-4',
    btnPrimary: 'bg-[#00a8ff] text-white border-[3px] border-black hover:bg-[#008bcb] shadow-[4px_4px_0px_#111] active:translate-y-1 active:shadow-none rounded-full font-black',
    btnWarning: 'bg-[#ffeb3b] text-black border-[3px] border-black hover:bg-[#fbc02d] rounded-full font-black shadow-[2px_2px_0px_#111]',
    fontHeading: 'font-black tracking-wide uppercase', borderAccent: 'border-[#ff0000]', badge: 'bg-[#ffeb3b] text-black border-2 border-black font-black rounded-full'
  },
  squid: {
    id: 'squid', name: 'Squid Game',
    appBg: 'bg-[#111] text-[#eee] font-sans selection:bg-[#ff0055] selection:text-white',
    devBar: 'bg-[#ff0055] text-white border-b-2 border-black font-bold tracking-widest',
    header: 'bg-[#ff0055] text-white border-b-4 border-black rounded-none shadow-[0_4px_20px_rgba(255,0,85,0.4)]',
    card: 'bg-[#1a1a1a] border-2 border-[#333] shadow-2xl rounded-none',
    cardInner: 'bg-[#222] border border-[#444] hover:border-[#ff0055] transition-all rounded-none',
    textMain: 'text-[#eee]', textMuted: 'text-[#888]', textAccent: 'text-[#00c896]', textWarning: 'text-[#ff0055]',
    input: 'bg-[#111] border-2 border-[#444] text-white placeholder:text-[#666] focus:border-[#00c896] rounded-none px-3',
    btnPrimary: 'bg-[#00c896] text-black border-none hover:bg-[#00e6aa] shadow-[0_0_15px_rgba(0,200,150,0.4)] rounded-none font-black',
    btnWarning: 'bg-[#111] text-[#00c896] border-2 border-[#00c896] hover:bg-[#00c896] hover:text-black rounded-none font-black',
    fontHeading: 'font-bold tracking-widest uppercase', borderAccent: 'border-[#ff0055]', badge: 'bg-[#ff0055] text-white font-bold rounded-sm px-2'
  },
  spider: {
    id: 'spider', name: 'Spider-Verse',
    appBg: 'bg-[#0a0a0a] text-white font-sans selection:bg-[#e23636] selection:text-white',
    devBar: 'bg-[#e23636] text-white border-b-2 border-[#0033cc] font-bold',
    header: 'bg-gradient-to-b from-[#e23636] to-[#b91c1c] text-white border-b-4 border-[#0033cc] shadow-[0_8px_0px_#0033cc] rounded-3xl',
    card: 'bg-[#121212] border-2 border-[#333] shadow-[0_0_20px_rgba(226,54,54,0.15)] rounded-3xl',
    cardInner: 'bg-[#1a1a1a] border border-[#e23636]/30 hover:border-[#0033cc] transition-all rounded-2xl',
    textMain: 'text-white', textMuted: 'text-zinc-500', textAccent: 'text-[#e23636]', textWarning: 'text-[#0033cc]',
    input: 'bg-[#121212] border-2 border-[#333] text-white placeholder:text-zinc-600 focus:border-[#e23636] rounded-2xl px-4',
    btnPrimary: 'bg-[#e23636] text-white border border-[#ff6666] hover:bg-[#0033cc] hover:border-[#3366ff] shadow-[0_0_15px_rgba(226,54,54,0.4)] rounded-2xl font-black uppercase',
    btnWarning: 'bg-[#1a1a1a] text-[#0033cc] border-2 border-[#0033cc] hover:bg-[#0033cc] hover:text-white rounded-2xl font-black uppercase',
    fontHeading: 'font-bold uppercase tracking-wider', borderAccent: 'border-[#e23636]', badge: 'bg-[#0033cc] text-white border border-[#3366ff] rounded-full font-bold'
  },
  goku: {
    id: 'goku', name: 'Super Saiyan',
    appBg: 'bg-[#FF5E00] text-black font-sans selection:bg-[#0047BB] selection:text-white',
    devBar: 'bg-[#0047BB] text-white border-b-4 border-black font-black',
    header: 'bg-[#0047BB] text-white border-4 border-black shadow-[6px_6px_0px_#FFD700] rounded-2xl',
    card: 'bg-[#FFF9E6] border-4 border-black shadow-[6px_6px_0px_#0047BB] rounded-2xl',
    cardInner: 'bg-white border-2 border-black hover:border-[#0047BB] transition-all rounded-xl',
    textMain: 'text-black', textMuted: 'text-zinc-600', textAccent: 'text-[#FF5E00]', textWarning: 'text-[#0047BB]',
    input: 'bg-white border-2 border-black text-black placeholder:text-zinc-400 focus:border-[#FF5E00] rounded-xl px-4',
    btnPrimary: 'bg-[#FF5E00] text-white border-4 border-black hover:bg-[#FFD700] hover:text-black shadow-[4px_4px_0px_black] active:translate-y-1 active:shadow-none rounded-xl font-black uppercase',
    btnWarning: 'bg-[#0047BB] text-white border-4 border-black hover:bg-white hover:text-black shadow-[4px_4px_0px_black] rounded-xl font-black uppercase',
    fontHeading: 'font-black', borderAccent: 'border-[#0047BB]', badge: 'bg-[#FFD700] text-black border-2 border-black font-black rounded-full'
  },
  synthwave: {
    id: 'synthwave', name: 'Retro Synthwave',
    appBg: 'bg-[#1a0b2e] text-[#00f3ff] font-sans selection:bg-[#ff007f] selection:text-white',
    devBar: 'bg-[#ff007f] text-white border-b-2 border-[#00f3ff] font-bold tracking-widest',
    header: 'bg-gradient-to-r from-[#2b0f4c] to-[#1a0b2e] text-[#00f3ff] border-2 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.5)] rounded-xl',
    card: 'bg-[#11051f] border-2 border-[#00f3ff] shadow-[4px_4px_0px_#ff007f] rounded-xl',
    cardInner: 'bg-[#1a0b2e] border border-[#ff007f] hover:border-[#00f3ff] transition-all rounded-lg',
    textMain: 'text-[#00f3ff]', textMuted: 'text-[#9d4edd]', textAccent: 'text-[#ff007f]', textWarning: 'text-[#f9c80e]',
    input: 'bg-[#11051f] border-2 border-[#ff007f] text-[#00f3ff] placeholder:text-[#9d4edd] focus:border-[#00f3ff] rounded-lg px-4',
    btnPrimary: 'bg-[#ff007f] text-white border-2 border-[#00f3ff] hover:bg-[#00f3ff] hover:text-[#1a0b2e] shadow-[0_0_15px_rgba(255,0,127,0.8)] rounded-lg font-black uppercase tracking-widest',
    btnWarning: 'bg-[#11051f] text-[#00f3ff] border-2 border-[#00f3ff] hover:bg-[#ff007f] hover:border-[#ff007f] rounded-lg font-black',
    fontHeading: 'font-mono tracking-wide', borderAccent: 'border-[#ff007f]', badge: 'bg-[#ff007f] text-white border border-[#00f3ff] rounded-md font-bold'
  },
  naruto: {
    id: 'naruto', name: 'Hidden Leaf',
    appBg: 'bg-[#1c1c1c] text-[#f4f4f4] font-sans selection:bg-[#ff7b00] selection:text-black',
    devBar: 'bg-[#ff7b00] text-black border-b-4 border-black font-black',
    header: 'bg-[#2b2b2b] text-white border-l-8 border-[#ff7b00] shadow-xl rounded-lg',
    card: 'bg-[#222] border border-[#333] shadow-lg rounded-lg',
    cardInner: 'bg-[#2b2b2b] border border-[#444] hover:border-[#ff7b00] transition-all rounded-md',
    textMain: 'text-[#f4f4f4]', textMuted: 'text-[#888]', textAccent: 'text-[#ff7b00]', textWarning: 'text-[#e53e3e]',
    input: 'bg-[#1c1c1c] border-2 border-[#444] text-white placeholder:text-[#666] focus:border-[#ff7b00] rounded-md px-4',
    btnPrimary: 'bg-[#ff7b00] text-black border-2 border-[#ff7b00] hover:bg-white shadow-[0_0_10px_rgba(255,123,0,0.5)] rounded-md font-black uppercase',
    btnWarning: 'bg-[#2b2b2b] text-[#ff7b00] border-2 border-[#ff7b00] hover:bg-[#ff7b00] hover:text-black rounded-md font-black uppercase',
    fontHeading: 'font-bold tracking-tight', borderAccent: 'border-[#ff7b00]', badge: 'bg-[#e53e3e] text-white rounded-sm px-2 font-bold'
  },
  stark: {
    id: 'stark', name: 'Stark Tech',
    appBg: 'bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#00f3ff] selection:text-black',
    devBar: 'bg-[#990000] text-[#ffcc00] border-b border-[#ffcc00] font-bold',
    header: 'bg-gradient-to-r from-[#800000] to-[#cc0000] text-[#ffcc00] border-b-2 border-[#00f3ff] shadow-[0_0_20px_rgba(204,0,0,0.5)] rounded-xl',
    card: 'bg-[#0a0a0a] border border-[#333] shadow-[0_0_15px_rgba(0,243,255,0.1)] rounded-xl',
    cardInner: 'bg-[#141414] border border-[#00f3ff]/30 hover:border-[#00f3ff] transition-all rounded-lg',
    textMain: 'text-[#e0e0e0]', textMuted: 'text-[#666]', textAccent: 'text-[#00f3ff]', textWarning: 'text-[#ffcc00]',
    input: 'bg-[#050505] border border-[#00f3ff]/50 text-[#00f3ff] placeholder:text-[#333] focus:border-[#00f3ff] focus:shadow-[0_0_10px_rgba(0,243,255,0.3)] rounded-lg px-4',
    btnPrimary: 'bg-[#cc0000] text-[#ffcc00] border border-[#ffcc00] hover:bg-[#ffcc00] hover:text-[#cc0000] shadow-[0_0_15px_rgba(204,0,0,0.4)] rounded-lg font-black uppercase',
    btnWarning: 'bg-[#141414] text-[#00f3ff] border border-[#00f3ff] hover:bg-[#00f3ff] hover:text-black rounded-lg font-black uppercase',
    fontHeading: 'font-mono tracking-widest uppercase', borderAccent: 'border-[#00f3ff]', badge: 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff] rounded font-mono'
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyDZIEDwRpOOtYHqwpRlVsgC2AHYMojwoZM",
  authDomain: "realitytracker-3939393939.firebaseapp.com",
  projectId: "realitytracker-3939393939",
  storageBucket: "realitytracker-3939393939.firebasestorage.app",
  messagingSenderId: "522487820920",
  appId: "1:522487820920:web:bbaa9259c1e0694edcb38d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "habit-tracker-pro-v1";

// ==========================================
// UTILS
// ==========================================
const getRealTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const formatDate = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const addDays = (dateStr, days) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const SHOP_ITEMS = [
  { id: "s_webseries", name: "The Binge Pass", desc: "Watch one complete Web Series (No guilt).", cost: 25, expiryHours: 120, icon: "🍿" }
];

const DEFAULT_TASKS = [
  { id: "t1", title: "Mind Control", desc: "5 Min Meditation", isLocked: false },
  { id: "t2", title: "Deep Study", desc: "1 Hr Minimum Focus", isLocked: true },
  { id: "t3", title: "Physical Push", desc: "Intense Workout", isLocked: false },
  { id: "t4", title: "Trigger Killer", desc: "No Phone in Bed", isLocked: true },
  { id: "t5", title: "Future Build", desc: "YT / Edit / Trade", isLocked: false },
  { id: "t6", title: "Spirituality", desc: "Prayer / Connection", isLocked: false },
  { id: "t7", title: "Home Duties", desc: "Chores / Cleaning", isLocked: false },
];

const REVISION_INTERVALS = [1, 3, 7, 14, 21, 28, 30];

const MORNING_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Your mind is a weapon. Keep it loaded.",
  "Pain is temporary. The pain of regret lasts forever.",
  "Don't stop when you're tired. Stop when you're done.",
];

// ==========================================
// CUSTOM HOOKS
// ==========================================
const useLongPress = (callback = () => {}, ms = 800) => {
  const [startLongPress, setStartLongPress] = useState(false);
  useEffect(() => {
      let timerId;
      if (startLongPress) { timerId = setTimeout(callback, ms); } 
      else { clearTimeout(timerId); }
      return () => clearTimeout(timerId);
  }, [callback, ms, startLongPress]);

  return {
      onMouseDown: () => setStartLongPress(true),
      onMouseUp: () => setStartLongPress(false),
      onMouseLeave: () => setStartLongPress(false),
      onTouchStart: () => setStartLongPress(true),
      onTouchEnd: () => setStartLongPress(false),
  };
};

// ==========================================
// SHARED COMPONENTS
// ==========================================
const RemovableTask = ({ task, t, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const longPressEvent = useLongPress(() => { if (!task.isLocked) { setShowConfirm(true); } }, 800);

  return (
    <div {...(showConfirm ? {} : longPressEvent)} className={`flex items-center justify-between p-3 sm:p-4 ${t.cardInner} relative overflow-hidden group mb-2 transition-all`}>
      {showConfirm ? (
        <div className="w-full flex items-center justify-between gap-3 animate-in fade-in zoom-in duration-200">
          <span className={`text-[10px] sm:text-sm font-black uppercase tracking-widest ${t.textWarning} ${t.fontHeading}`}>Delete this task?</span>
          <div className="flex gap-2">
            <button onClick={() => onDelete(task.id)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all active:scale-95 ${t.fontHeading}`}>YES</button>
            <button onClick={() => setShowConfirm(false)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${t.btnWarning} ${t.fontHeading}`}>NO</button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className={`text-[10px] sm:text-sm font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>{task.title} {task.isLocked && <Lock className="w-3 h-3 text-red-500" />}</h3>
            <p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${t.textMuted} ${t.fontHeading}`}>{task.desc}</p>
          </div>
          {task.isLocked ? (
            <span className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 uppercase bg-red-500/20 text-red-500 border border-red-500/50 ${t.fontHeading}`}>Locked Core</span>
          ) : (
            <span className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${t.textMuted} opacity-50 group-hover:opacity-100 transition-opacity ${t.fontHeading}`}>Hold to Delete</span>
          )}
        </>
      )}
    </div>
  );
};

const RemovableShopItem = ({ item, t, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const longPressEvent = useLongPress(() => { setShowConfirm(true); }, 800);

  return (
    <div {...(showConfirm ? {} : longPressEvent)} className={`flex items-center justify-between p-3 sm:p-4 ${t.cardInner} relative overflow-hidden group mb-2 transition-all`}>
      {showConfirm ? (
        <div className="w-full flex items-center justify-between gap-3 animate-in fade-in zoom-in duration-200">
          <span className={`text-[10px] sm:text-sm font-black uppercase tracking-widest ${t.textWarning} ${t.fontHeading}`}>Delete this reward?</span>
          <div className="flex gap-2">
            <button onClick={() => onDelete(item.id)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all active:scale-95 ${t.fontHeading}`}>YES</button>
            <button onClick={() => setShowConfirm(false)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${t.btnWarning} ${t.fontHeading}`}>NO</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className={`text-xl sm:text-2xl p-1.5 rounded-lg ${t.card}`}>{item.icon}</span>
            <div>
              <h3 className={`text-[10px] sm:text-sm font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>{item.name}</h3>
              <p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${t.textMuted} ${t.fontHeading}`}>{item.cost}⭐ • Exp: {item.expiryHours}h</p>
            </div>
          </div>
          <span className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${t.textMuted} opacity-50 group-hover:opacity-100 transition-opacity ${t.fontHeading}`}>Hold to Delete</span>
        </>
      )}
    </div>
  );
};

const LongPressItem = ({ item, onDelete, children, duration = 800, t }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const longPressEvent = useLongPress(() => { setShowConfirm(true); }, duration);

  return (
    <div {...longPressEvent} className="relative group cursor-pointer w-full h-full">
      {children}
      {showConfirm && (
        <div className={`absolute inset-0 p-4 flex flex-col items-center justify-center z-10 shadow-xl ${t.cardInner} border-2 border-red-500`}>
          <span className={`font-black uppercase text-[10px] mb-3 tracking-widest text-center ${t.textWarning}`}>Delete this item?</span>
          <div className="flex gap-2 sm:gap-4">
            <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); setShowConfirm(false); }} className={`px-4 sm:px-6 py-2 font-black uppercase tracking-widest bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs sm:text-base`}>Yes</button>
            <button onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} className={`px-4 sm:px-6 py-2 font-black uppercase tracking-widest ${t.btnWarning} transition-colors text-xs sm:text-base`}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [appMode, setAppMode] = useState("habit"); // 'habit' | 'brain'
  const [user, setUser] = useState(null);
  const [todayStr, setTodayStr] = useState(getRealTodayStr()); 
  const [toast, setToast] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const testMode = false; 

  // ================= HABIT STATE =================
  const [habitRoute, setHabitRoute] = useState("hub");
  const [settingsRoute, setSettingsRoute] = useState("menu");
  
  // DUAL SAVE ENGINE: Initialize from LocalStorage
  const [trackerData, setTrackerData] = useState(() => JSON.parse(localStorage.getItem('apex_tracker_v5') || '{}'));
  const [profile, setProfile] = useState(() => {
    const local = JSON.parse(localStorage.getItem('apex_profile_v5') || '{}');
    const oldV4 = JSON.parse(localStorage.getItem('apexMindData_Final_V4') || '{}');
    
    return {
      name: local.name || oldV4.userName || "Prateek Maurya", 
      stars: local.stars || 0, 
      geminiKey: local.geminiKey || oldV4.groqKey || "", 
      inventory: local.inventory || [], 
      dp: local.dp || oldV4.profilePic || "", 
      activeTheme: local.activeTheme || oldV4.activeTheme || "brutalist", 
      customTasks: local.customTasks || DEFAULT_TASKS, 
      customShopItems: local.customShopItems || SHOP_ITEMS
    };
  });

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [unlockedBlankDate, setUnlockedBlankDate] = useState(null); 
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [reasonInput, setReasonInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newShopName, setNewShopName] = useState("");
  const [newShopDesc, setNewShopDesc] = useState("");
  const [newShopCost, setNewShopCost] = useState("");
  const [newShopExpiry, setNewShopExpiry] = useState("");
  const [newShopIcon, setNewShopIcon] = useState("");
  
  const [exportStartDate, setExportStartDate] = useState(todayStr);
  const [exportEndDate, setExportEndDate] = useState(todayStr);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([{ role: "ai", text: "I am your Habit Tracker Coach. What's on your mind today?" }]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // ================= BRAIN STATE =================
  const [brainTab, setBrainTab] = useState("dashboard");
  const [brain, setBrain] = useState(() => {
    const local = JSON.parse(localStorage.getItem('apex_brain_v5'));
    const oldV4 = JSON.parse(localStorage.getItem('apexMindData_Final_V4') || '{}');
    
    // Agar naye (V5) app mein data hai, toh usko use karo
    if (local && Object.keys(local).length > 0) {
      return {
        syllabusCategories: ["Raw Backlog"], stagingTopics: [], studyTopics: [], masteredTopics: [],
        wisdomCategories: ["Quick Thoughts"], wisdomNotes: [], vaultNotes: [], vaultCategories: ["Others"],
        globalDeadlineDays: 30, customMissions: [], lastActiveDate: getRealTodayStr(),
        ...local
      };
    }
    
    // Warna, purane (V4) app se poora Second Brain migrate kar lo
    return {
      syllabusCategories: oldV4.syllabusCategories || ["Raw Backlog"], 
      stagingTopics: oldV4.stagingTopics || [], 
      studyTopics: oldV4.studyTopics || [], 
      masteredTopics: oldV4.masteredTopics || [],
      wisdomCategories: oldV4.wisdomCategories || ["Quick Thoughts"], 
      wisdomNotes: oldV4.wisdomNotes || [], 
      vaultNotes: oldV4.vaultNotes || [], 
      vaultCategories: oldV4.vaultCategories || ["Others"],
      globalDeadlineDays: oldV4.globalDeadlineDays || 30, 
      customMissions: oldV4.customMissions || [], 
      lastActiveDate: oldV4.lastActiveDate || getRealTodayStr()
    };
  });
  
  const [newSyllabusCat, setNewSyllabusCat] = useState("");
  const [selectedSyllabusCat, setSelectedSyllabusCat] = useState("Raw Backlog");
  const [newTopic, setNewTopic] = useState("");
  const [newWisdomCat, setNewWisdomCat] = useState("");
  const [selectedWisdomCat, setSelectedWisdomCat] = useState("Quick Thoughts");
  const [newWisdom, setNewWisdom] = useState("");
  const [newNote, setNewNote] = useState("");
  const [expandedWisdomCategory, setExpandedWisdomCategory] = useState(null);
  const [expandedVaultCategory, setExpandedVaultCategory] = useState(null);
  const [isVaultSorting, setIsVaultSorting] = useState(false);
  const [urgeTimer, setUrgeTimer] = useState(null);
  const [isUrgeActive, setIsUrgeActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [urgeQuotes, setUrgeQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState("");
  const [isOracleThinking, setIsOracleThinking] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [isNightShiftOpen, setIsNightShiftOpen] = useState(false);
  const [newCustomMission, setNewCustomMission] = useState("");
  const [isNightTime, setIsNightTime] = useState(new Date().getHours() >= 21 || new Date().getHours() < 4);

  const t = THEMES[profile.activeTheme] || THEMES.brutalist;

  // ==========================================
  // INITIALIZATION & SYNC
  // ==========================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) { await signInWithCustomToken(auth, __initial_auth_token); } 
        else { await signInAnonymously(auth); }
      } catch (err) {
        console.error("Auth Error:", err);
        setErrorMsg("Firebase Setup Needed: Enable Anonymous Sign-in.");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const trackerRef = collection(db, "artifacts", appId, "users", user.uid, "tracker_data");
    const unsubsTracker = onSnapshot(trackerRef, (snapshot) => {
      const dataMap = { ...trackerData };
      let changed = false;
      snapshot.forEach((docSnap) => { 
        if(!dataMap[docSnap.id] || JSON.stringify(dataMap[docSnap.id]) !== JSON.stringify(docSnap.data())) {
          dataMap[docSnap.id] = docSnap.data(); changed = true;
        }
      });
      if(changed) {
        setTrackerData(dataMap);
        localStorage.setItem('apex_tracker_v5', JSON.stringify(dataMap));
      }
    });

    const profileRef = doc(db, "artifacts", appId, "users", user.uid, "rpg_profile", "data");
    const unsubsProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.customTasks || data.customTasks.length === 0) data.customTasks = DEFAULT_TASKS;
        if (!data.customShopItems || data.customShopItems.length === 0) data.customShopItems = SHOP_ITEMS;
        setProfile((prev) => {
          const merged = { ...prev, ...data };
          localStorage.setItem('apex_profile_v5', JSON.stringify(merged));
          return merged;
        });
      } else setDoc(profileRef, profile);
    });

    const brainRef = doc(db, "artifacts", appId, "users", user.uid, "second_brain", "data");
    const unsubsBrain = onSnapshot(brainRef, (docSnap) => {
      if (docSnap.exists()) {
        setBrain(prev => {
          const merged = { ...prev, ...docSnap.data() };
          localStorage.setItem('apex_brain_v5', JSON.stringify(merged));
          return merged;
        });
      } else setDoc(brainRef, brain);
    });

    return () => { unsubsTracker(); unsubsProfile(); unsubsBrain(); };
  }, [user]);

  // Night Shift Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightTime(hour >= 21 || hour < 4);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update Brain Global Date Logic
  useEffect(() => {
    if (brain.lastActiveDate !== todayStr) {
      const partsOld = brain.lastActiveDate.split('-');
      const partsNow = todayStr.split('-');
      const dOld = new Date(partsOld[0], partsOld[1] - 1, partsOld[2]);
      const dNow = new Date(partsNow[0], partsNow[1] - 1, partsNow[2]);
      const diffDays = Math.floor((dNow.getTime() - dOld.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        updateBrainFirebase({ 
          globalDeadlineDays: Math.max(1, brain.globalDeadlineDays - diffDays),
          lastActiveDate: todayStr 
        });
      }
    }
  }, [brain.lastActiveDate, todayStr]);

  const showMessage = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ==========================================
  // DUAL SAVE WRAPPERS
  // ==========================================
  const updateProfileFirebase = async (updates) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('apex_profile_v5', JSON.stringify(newProfile));
    if (user && db) { await setDoc(doc(db, "artifacts", appId, "users", user.uid, "rpg_profile", "data"), newProfile, { merge: true }); }
  };

  const updateBrainFirebase = async (updates) => {
    const newBrain = { ...brain, ...updates };
    setBrain(newBrain);
    localStorage.setItem('apex_brain_v5', JSON.stringify(newBrain));
    if (user && db) { await setDoc(doc(db, "artifacts", appId, "users", user.uid, "second_brain", "data"), newBrain, { merge: true }); }
  };

  const saveDayData = async (dateStr, tasks, reason, summary, star, snapshot) => {
    const updatedDay = { tasks, reasonForO: reason || "", summary: summary || "", star: !!star, taskSnapshot: snapshot || (profile.customTasks || DEFAULT_TASKS) };
    const newTrackerData = { ...trackerData, [dateStr]: updatedDay };
    setTrackerData(newTrackerData);
    localStorage.setItem('apex_tracker_v5', JSON.stringify(newTrackerData));
    if (user && db) await setDoc(doc(db, "artifacts", appId, "users", user.uid, "tracker_data", dateStr), updatedDay, { merge: true });
  };


  // ==========================================
  // HABIT FUNCTIONS
  // ==========================================
  useEffect(() => {
    const dayData = trackerData[selectedDate];
    setReasonInput(dayData?.reasonForO || "");
    setSummaryInput(dayData?.summary || "");
  }, [selectedDate, trackerData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200; canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        if (img.width > img.height) { sourceWidth = img.height; sourceX = (img.width - img.height) / 2; }
        else { sourceHeight = img.width; sourceY = (img.height - img.width) / 2; }
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);
        updateProfileFirebase({ dp: canvas.toDataURL("image/jpeg", 0.8) });
        showMessage("Profile Picture Updated! 📸");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const checkPunishment = () => {
    const d1 = new Date(todayStr); d1.setDate(d1.getDate() - 1);
    const d2 = new Date(todayStr); d2.setDate(d2.getDate() - 2);
    const data1 = trackerData[formatDate(d1)]; const data2 = trackerData[formatDate(d2)];
    const hasFail1 = data1 && Object.values(data1.tasks || {}).includes("O");
    const hasFail2 = data2 && Object.values(data2.tasks || {}).includes("O");
    return hasFail1 && hasFail2;
  };
  const isPunished = checkPunishment();

  const checkPerfectDayBonus = (dateStr, tasks, totalActiveTasks) => {
    const vals = Object.values(tasks);
    if (vals.length >= totalActiveTasks && vals.every((v) => v === "X")) {
      const dayData = trackerData[dateStr] || {};
      if (!dayData.perfectBonusClaimed) {
        updateProfileFirebase({ stars: profile.stars + 3 });
        saveDayData(dateStr, tasks, dayData.reasonForO, dayData.summary, dayData.star, dayData.taskSnapshot);
        if (user && db) setDoc(doc(db, "artifacts", appId, "users", user.uid, "tracker_data", dateStr), { perfectBonusClaimed: true }, { merge: true });
        showMessage("🔥 +3 Stars for a PERFECT DAY!");
      }
    }
  };

  const handleTaskClick = async (taskId, value, currentSnapshot) => {
    const isToday = selectedDate === todayStr;
    const currentDayData = trackerData[selectedDate] || { tasks: {}, reasonForO: "", summary: "", taskSnapshot: null };
    
    if (!isToday && unlockedBlankDate !== selectedDate) {
      if (isEraserActive) {
        if (currentDayData.tasks && currentDayData.tasks[taskId] === "O" && value === "X") {
          const updatedTasks = { ...currentDayData.tasks, [taskId]: value };
          saveDayData(selectedDate, updatedTasks, currentDayData.reasonForO, currentDayData.summary, currentDayData.star, currentDayData.taskSnapshot);
          const markedInv = profile.inventory.map((i) => i.isEraserActiveFlag ? { ...i, status: "used", isEraserActiveFlag: false } : i);
          updateProfileFirebase({ inventory: markedInv });
          setIsEraserActive(false);
          showMessage("History Rewritten! 🧽 Eraser Consumed.");
          return;
        } else return;
      } else return;
    }

    const updatedTasks = { ...currentDayData.tasks, [taskId]: value };
    const hasO = Object.values(updatedTasks).includes("O");
    const newReason = hasO ? currentDayData.reasonForO : "";
    saveDayData(selectedDate, updatedTasks, newReason, currentDayData.summary, currentDayData.star, currentSnapshot);
    checkPerfectDayBonus(selectedDate, updatedTasks, currentSnapshot.length);
  };

  const handleStarClick = async (currentSnapshot) => {
    const currentDayData = trackerData[selectedDate] || { tasks: {}, reasonForO: "", summary: "" };
    if (!currentDayData.star) {
      updateProfileFirebase({ stars: profile.stars + 1 });
      saveDayData(selectedDate, currentDayData.tasks, currentDayData.reasonForO, currentDayData.summary, true, currentSnapshot);
      showMessage("⭐ +1 Star Earned! Urge Defeated.");
    }
  };

  const buyItem = (item) => {
    if (profile.stars >= item.cost) {
      const now = new Date(`${todayStr}T00:00:00`);
      const newItem = { instanceId: Date.now().toString(), itemId: item.id, name: item.name, icon: item.icon, expiryTime: new Date(now.getTime() + item.expiryHours * 60 * 60 * 1000).toISOString(), status: "active" };
      updateProfileFirebase({ stars: profile.stars - item.cost, inventory: [...(profile.inventory || []), newItem] });
      showMessage(`Purchased: ${item.name}! Check Ongoing Plan.`);
    } else showMessage("Not enough stars! Grind more. ⚔️");
  };

  const useInventoryItem = (instanceId, itemName) => {
    if (itemName === "The Eraser") {
      setIsEraserActive(true);
      updateProfileFirebase({ inventory: (profile.inventory || []).map((i) => i.instanceId === instanceId ? { ...i, isEraserActiveFlag: true } : i) });
      setHabitRoute("arena"); showMessage("ERASER ARMED! Find a past date with 'FIX' badge to rewrite history.");
    } else {
      showMessage(`${itemName} Activated. Enjoy guilt-free!`);
      updateProfileFirebase({ inventory: (profile.inventory || []).map((i) => i.instanceId === instanceId ? { ...i, status: "used" } : i) });
    }
  };

  const checkExpirations = () => {
    const now = new Date(`${todayStr}T00:00:00`).getTime();
    let changed = false;
    const updated = (profile.inventory || []).map((item) => {
      const status = item.status || "active";
      if (status === "active" && new Date(item.expiryTime).getTime() <= now) { changed = true; return { ...item, status: "expired" }; }
      return { ...item, status };
    });
    if (changed) updateProfileFirebase({ inventory: updated });
    return updated;
  };

  const getStreaks = () => {
    let study = 0, trigger = 0, perfect = 0;
    let countStudy = true, countTrigger = true, countPerfect = true;
    let d = new Date(todayStr + "T00:00:00");

    for (let i = 0; i < 365; i++) {
      const dStr = formatDate(d); const data = trackerData[dStr];
      if (i === 0 && (!data || !data.tasks || Object.keys(data.tasks).length === 0)) { d.setDate(d.getDate() - 1); continue; }
      if (!data || !data.tasks) break;
      if (countStudy && data.tasks.t2 === "X") study++; else countStudy = false;
      if (countTrigger && data.tasks.t4 === "X") trigger++; else countTrigger = false;
      const activeListCount = (data.taskSnapshot || profile.customTasks || DEFAULT_TASKS).length;
      const vals = Object.values(data.tasks);
      if (countPerfect && vals.length >= activeListCount && vals.every((v) => v === "X")) perfect++; else countPerfect = false;
      if (!countStudy && !countTrigger && !countPerfect) break;
      d.setDate(d.getDate() - 1);
    }
    return { study, trigger, perfect };
  };
  const streaks = getStreaks();
  let playerTitle = streaks.perfect >= 21 ? "👑 Ascended Master" : streaks.perfect >= 7 ? "⚔️ Disciplined Warrior" : streaks.perfect >= 3 ? "🛡️ Focused Soldier" : "🌱 Novice Tracker";

  const getWeeklyData = (offset) => {
    const dataPoints = [];
    let d = new Date(todayStr + "T00:00:00"); d.setDate(d.getDate() - offset * 7);
    for (let i = 0; i < 7; i++) {
      const dStr = formatDate(d); const dayData = trackerData[dStr];
      let xCount = 0; const snapshotUsed = dayData?.taskSnapshot || profile.customTasks || DEFAULT_TASKS;
      let total = snapshotUsed.length;
      if (dayData && dayData.tasks) xCount = Object.values(dayData.tasks).filter((v) => v === "X").length;
      const isCompleted = dayData && dayData.tasks && Object.keys(dayData.tasks).length > 0;
      dataPoints.unshift({ date: dStr, label: d.toLocaleDateString("en-US", { weekday: "short" }), percent: isCompleted ? Math.round((xCount / total) * 100) : 0, xCount, total, perfect: isCompleted && xCount === total, failed: isCompleted && Object.values(dayData.tasks).includes("O") });
      d.setDate(d.getDate() - 1);
    }
    return dataPoints;
  };

  const getFilteredDates = () => {
    const sortedDates = Object.keys(trackerData).sort();
    return sortedDates.filter((d) => {
      if (exportStartDate && d < exportStartDate) return false;
      if (exportEndDate && d > exportEndDate) return false;
      return true;
    });
  };

  const downloadExport = () => {
    const filteredDates = getFilteredDates();
    if (filteredDates.length === 0) { showMessage("No records found for this date range."); return; }

    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Habit Tracker Export</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #e2e8f0; background-color: #0f172a; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #f8fafc; text-align: center; border-bottom: 3px solid #334155; padding-bottom: 10px; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;}
        .day-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);}
        .date-title { font-size: 1.3em; font-weight: bold; color: #f8fafc; margin-bottom: 12px; border-bottom: 2px solid #334155; padding-bottom: 8px;}
        .win { color: #4ade80; font-weight: bold; }
        .loss { color: #f87171; font-weight: bold; }
        .perfect { background: rgba(74, 222, 128, 0.1); padding: 8px 12px; border-radius: 6px; color: #4ade80; font-weight: bold; display: inline-block; border: 1px solid rgba(74, 222, 128, 0.2); margin-top: 10px;}
        .reason { background: rgba(248, 113, 113, 0.1); padding: 12px; border-left: 4px solid #ef4444; margin-top: 10px; border-radius: 0 6px 6px 0; color: #fca5a5;}
        .summary { background: rgba(59, 130, 246, 0.1); padding: 12px; border-left: 4px solid #3b82f6; margin-top: 12px; border-radius: 0 6px 6px 0; color: #bfdbfe;}
        .star { background: rgba(234, 179, 8, 0.1); padding: 8px 12px; border-radius: 6px; color: #fde047; font-weight: bold; border: 1px solid rgba(234, 179, 8, 0.2); display: inline-block; margin-top: 10px;}
        ul { list-style-type: none; padding-left: 0; margin-top: 0;}
        li { margin-bottom: 8px; font-size: 1.05em; color: #cbd5e1;}
      </style>
    </head>
    <body>
      <h1>🔥 OS Tracker Report</h1>
      <p style="text-align: center; color: #94a3b8; font-weight: bold;">Date Range: ${exportStartDate} to ${exportEndDate}</p>
    `;

    filteredDates.forEach((dateStr) => {
      const data = trackerData[dateStr];
      const dateFormatted = new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", });
      htmlContent += `<div class="day-card"><div class="date-title">📅 ${dateFormatted}</div><ul>`;
      let hasTasks = false, allX = true;
      const activeListForDay = data.taskSnapshot || profile.customTasks || DEFAULT_TASKS;

      activeListForDay.forEach((task) => {
        const status = data.tasks?.[task.id];
        if (status) {
          hasTasks = true;
          htmlContent += `<li><span class="${status === "X" ? "win" : "loss"}">${status === "X" ? "✅ [WIN]" : "❌ [LOSS]"}</span> - <strong>${task.title}</strong></li>`;
          if (status === "O") allX = false;
        }
      });
      htmlContent += `</ul>`;

      if (hasTasks) {
        if (allX) htmlContent += `<div class="perfect">🔥 PERFECT DAY Achieved</div>`;
        else htmlContent += `<div class="reason"><strong>⚠️ Failure Reason:</strong> ${data.reasonForO || "No reason provided."}</div>`;
      }
      if (data.star) htmlContent += `<div class="star">⭐ WILLPOWER STAR AWARDED</div>`;
      if (data.summary) htmlContent += `<div class="summary"><strong>📖 Personal Diary:</strong><br/>${data.summary.replace(/\n/g, "<br/>")}</div>`;
      htmlContent += `</div>`;
    });

    htmlContent += `</body></html>`;
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `OS_Tracker_${exportStartDate}_to_${exportEndDate}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showMessage("Export Downloaded Successfully!");
  };

  const copyTextExport = () => {
    const filteredDates = getFilteredDates();
    if (filteredDates.length === 0) { showMessage("No records found to copy."); return; }
    let textContent = `🔥 OS TRACKER REPORT\nDate Range: ${exportStartDate} to ${exportEndDate}\n\n`;

    filteredDates.forEach((dateStr) => {
      const data = trackerData[dateStr];
      const dateFormatted = new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", });
      textContent += `📅 ${dateFormatted}\n`;
      let hasTasks = false, allX = true;
      const activeListForDay = data.taskSnapshot || profile.customTasks || DEFAULT_TASKS;

      activeListForDay.forEach((task) => {
        const status = data.tasks?.[task.id];
        if (status) {
          hasTasks = true;
          textContent += `   ${status === "X" ? "✅" : "❌"} ${task.title}\n`;
          if (status === "O") allX = false;
        }
      });

      if (hasTasks) {
        if (allX) textContent += `   🔥 PERFECT DAY\n`;
        else textContent += `   ⚠️ Reason: ${data.reasonForO || "None"}\n`;
      }
      if (data.star) textContent += `   ⭐ STAR EARNED\n`;
      if (data.summary) textContent += `   📖 Diary: ${data.summary}\n`;
      textContent += `\n`;
    });

    navigator.clipboard.writeText(textContent).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      showMessage("Data Copied to Clipboard!");
    });
  };

  const askCoach = async () => {
    if (!chatInput.trim()) return;
    if (!profile.geminiKey) { showMessage("Please enter your Groq API Key in Command Center first!"); setHabitRoute("settings"); return; }
    
    const userMessage = { role: "user", text: chatInput };
    const todayTasks = trackerData[todayStr]?.tasks || {};
    const todayCompleted = Object.values(todayTasks).filter((v) => v === "X").length;
    const activePerks = (profile.inventory || []).filter((i) => i.status === "active").map((i) => i.name).join(", ") || "None";
    const formattedHistory = chatMessages.map((msg) => ({ role: msg.role === "ai" ? "assistant" : "user", content: msg.text }));

    formattedHistory.unshift({
      role: "system",
      content: `You are a wise Habit Coach for ${profile.name}. 
      Status: ${profile.stars} Stars, Perfect Streak: ${streaks.perfect}, Study Streak: ${streaks.study}, Progress: ${todayCompleted}/${(profile.customTasks || DEFAULT_TASKS).length}. Perks: ${activePerks}.
      Keep it impactful, firm yet caring.`
    });
    formattedHistory.push({ role: "user", content: userMessage.text });
    setChatMessages((prev) => [...prev, userMessage]); setChatInput(""); setIsTyping(true);

    try {
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${profile.geminiKey.trim()}` }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: formattedHistory }) });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setChatMessages((prev) => [...prev, { role: "ai", text: data.choices[0].message.content }]);
    } catch (e) {
      setChatMessages((prev) => [...prev, { role: "ai", text: "Coach is offline. Check key or connection." }]);
    }
    setIsTyping(false);
  };

  // ==========================================
  // SECOND BRAIN FUNCTIONS
  // ==========================================
  const triggerCrossReward = (stars, msg) => {
    updateProfileFirebase({ stars: profile.stars + stars });
    showMessage(`⚡ SYSTEM SYNC: +${stars} STARS! ${msg}`);
  };

  const handleAddSyllabusCategory = () => {
    if (newSyllabusCat.trim() && !brain.syllabusCategories.includes(newSyllabusCat.trim())) {
      updateBrainFirebase({ syllabusCategories: [...brain.syllabusCategories, newSyllabusCat.trim()] });
      setSelectedSyllabusCat(newSyllabusCat.trim()); setNewSyllabusCat("");
    }
  };

  const handleDeleteSyllabusCategory = (cat) => {
    if (cat === "Raw Backlog") return;
    updateBrainFirebase({
      syllabusCategories: brain.syllabusCategories.filter(c => c !== cat),
      stagingTopics: brain.stagingTopics.map(t => t.category === cat ? { ...t, category: "Raw Backlog" } : t)
    });
    if (selectedSyllabusCat === cat) setSelectedSyllabusCat("Raw Backlog");
  };

  const handleAddStagingTopic = () => {
    if (!newTopic.trim()) return;
    updateBrainFirebase({ stagingTopics: [...brain.stagingTopics, { id: Date.now().toString(), title: newTopic, category: selectedSyllabusCat }] });
    setNewTopic("");
  };

  const handleStartRevision = (topicId) => {
    const topic = brain.stagingTopics.find(t => t.id === topicId);
    if (!topic) return;
    const schedule = REVISION_INTERVALS.map((interval) => ({ dayOffset: interval, targetDate: addDays(todayStr, interval), completed: false }));
    updateBrainFirebase({
      studyTopics: [...brain.studyTopics, { ...topic, startDate: todayStr, schedule }],
      stagingTopics: brain.stagingTopics.filter(t => t.id !== topicId)
    });
  };

  const markRevisionComplete = (topicId, targetDate, dayOffset) => {
    const topic = brain.studyTopics.find(t => t.id === topicId);
    if (!topic) return;
    const updatedSchedule = topic.schedule.map(rev => (rev.targetDate === targetDate && rev.dayOffset === dayOffset) ? { ...rev, completed: true } : rev);
    const day30Completed = updatedSchedule.some(rev => rev.dayOffset === 30 && rev.completed);

    if (day30Completed) {
      setTimeout(() => {
        updateBrainFirebase({
          studyTopics: brain.studyTopics.filter(t => t.id !== topicId),
          masteredTopics: [...brain.masteredTopics, { ...topic, masteredDate: todayStr }]
        });
        triggerCrossReward(10, "Topic Mastered (30 Days Complete)!");
      }, 0);
    } else {
      updateBrainFirebase({ studyTopics: brain.studyTopics.map(t => t.id === topicId ? { ...topic, schedule: updatedSchedule } : t) });
    }
  };

  const handleAddWisdom = () => {
    if (!newWisdom.trim()) return;
    updateBrainFirebase({ wisdomNotes: [{ id: Date.now().toString(), text: newWisdom, category: expandedWisdomCategory || selectedWisdomCat, date: todayStr }, ...brain.wisdomNotes] });
    setNewWisdom("");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const noteId = Date.now().toString();
    const newEntry = { id: noteId, text: newNote, date: todayStr, category: "Others" };
    updateBrainFirebase({ vaultNotes: [newEntry, ...brain.vaultNotes] });
    setNewNote("");

    if (!profile.geminiKey) return; 
    setIsVaultSorting(true);
    try {
      const othersNotes = brain.vaultNotes.filter(n => n.category === "Others");
      const existingCats = brain.vaultCategories.filter(c => c !== "Others");
      const prompt = `You are an AI brain sorter. Existing Categories: [${existingCats.join(", ")}]. New Idea: "${newEntry.text}". Other unclassified: ${JSON.stringify(othersNotes.map(n => ({id: n.id, text: n.text})))}. 
      RULES: 1. Categorize New Idea into Existing, or "Others". 2. If New Idea + 2 unclassified share a theme, invent a new category name. 
      FORMAT JSON: {"assignedCategory": "Cat Name", "extractedIdsFromOthers": ["id1"]}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${profile.geminiKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: prompt }], response_format: { type: "json_object" } })
      });
      const aiResponse = JSON.parse((await response.json()).choices[0].message.content);

      if (aiResponse.assignedCategory) {
         let newCat = aiResponse.assignedCategory;
         let newVaultCats = [...brain.vaultCategories];
         if (!newVaultCats.includes(newCat) && newCat !== "Others") newVaultCats.push(newCat);
         
         const newVaultNotes = [newEntry, ...brain.vaultNotes].map(n => {
            if (n.id === noteId || (aiResponse.extractedIdsFromOthers && aiResponse.extractedIdsFromOthers.includes(n.id))) return { ...n, category: newCat };
            return n;
         });
         updateBrainFirebase({ vaultCategories: newVaultCats, vaultNotes: newVaultNotes });
      }
    } catch (error) { console.error("AI Vault Sort Failed", error); }
    setIsVaultSorting(false);
  };

  const handleAskOracle = async (querySource) => {
    if (!profile.geminiKey) { setOracleResponse("ERROR: API KEY MISSING. CONFIGURE IN COMMAND CENTER."); return; }
    if (!oracleQuery.trim()) return;
    setIsOracleThinking(true); setOracleResponse("");

    try {
      const allNotes = [...brain.wisdomNotes.map(n => `[Wisdom: ${n.category}] ${n.text}`), ...brain.vaultNotes.map(n => `[Dump: ${n.category}] ${n.text}`)].join("\n");
      const prompt = `You are "The Oracle", an AI synthesizing the user's notes. Knowledge Base: ${allNotes}. Question: "${oracleQuery}". 
      RULES: 1. Answer strictly based on Knowledge Base. 2. Keep it concise, punchy, actionable.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${profile.geminiKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: prompt }] })
      });
      setOracleResponse((await response.json()).choices[0].message.content);
    } catch (error) { setOracleResponse("CONNECTION DISRUPTED. Check API key."); }
    setIsOracleThinking(false);
  };

  useEffect(() => {
    let t1, t2;
    if (isUrgeActive && urgeTimer > 0) {
      t1 = setInterval(() => setUrgeTimer(p => p - 1), 1000);
      t2 = setInterval(() => setCurrentQuoteIndex(p => (p + 1) % (urgeQuotes.length || 5)), 7000);
    } else if (isUrgeActive && urgeTimer === 0) setIsUrgeActive(false);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [isUrgeActive, urgeTimer, urgeQuotes.length]);

  const triggerUrgeInterceptor = async () => {
    setIsUrgeActive(true); setUrgeTimer(90); setCurrentQuoteIndex(0);
    const defQuotes = ["Don't trade long-term goals for cheap dopamine. Breathe.", "Pain of discipline > Pain of regret.", "Your brain is lying to you right now. Stand your ground.", "You survived 100% of bad days. This will pass."];
    setUrgeQuotes(defQuotes);
    if (profile.geminiKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${profile.geminiKey}` }, body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: "Generate exactly 10 short, brutal motivational sentences (max 15 words) to stop streak break. Output JSON array of strings: [\"s1\", \"s2\"]" }], response_format: { type: "json_object" } }) });
        const aiQuotes = JSON.parse((await response.json()).choices[0].message.content);
        if (Array.isArray(aiQuotes) && aiQuotes.length > 0) setUrgeQuotes(aiQuotes);
        else if (Object.keys(aiQuotes).length > 0 && Array.isArray(aiQuotes[Object.keys(aiQuotes)[0]])) setUrgeQuotes(aiQuotes[Object.keys(aiQuotes)[0]]);
      } catch (e) { console.error("AI Quote failed"); }
    }
  };

  // ==========================================
  // HABIT RENDERERS
  // ==========================================
  const renderHabitHub = () => (
    <div className="space-y-6 sm:space-y-8 pb-10 animate-in fade-in zoom-in duration-300">
      <div className={`p-4 sm:p-6 flex flex-row items-center justify-between relative overflow-hidden gap-3 sm:gap-4 ${t.header}`}>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 sm:gap-4 z-10 flex-shrink min-w-0">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden border-2 ${t.borderAccent}`}>
            {profile.dp ? ( <img src={profile.dp} alt="User DP" className="w-full h-full object-cover" /> ) : ( <span className="text-2xl sm:text-3xl">🦊</span> )}
          </div>
          <div className="min-w-0 overflow-hidden">
            <h1 className={`text-base sm:text-2xl font-bold truncate ${t.textMain} ${t.fontHeading}`}>{profile.name}</h1>
            <p className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate mt-0.5 sm:mt-1 ${t.textAccent} ${t.fontHeading}`}>{playerTitle} • Lvl {Math.floor(profile.stars / 10) + 1}</p>
          </div>
        </div>
        <div className={`px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-1.5 sm:gap-3 z-10 flex-shrink-0 ${t.cardInner}`}>
          <span className="text-base sm:text-2xl">⭐</span>
          <span className={`text-base sm:text-2xl font-black ${t.textWarning} ${t.fontHeading}`}>{profile.stars}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button onClick={() => setHabitRoute("arena")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner}`}>
          <Swords className={`absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 ${t.textAccent}`} />
          <Swords className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent} group-hover:${t.textMain}`} />
          <h2 className={`text-lg sm:text-2xl font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Enter Arena</h2>
          <p className={`text-[10px] sm:text-sm mt-1 relative z-10 ${t.textMuted} ${t.fontHeading}`}>Execute daily tasks & conquer levels.</p>
        </button>

        <button onClick={() => setHabitRoute("shop")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner}`}>
          <ShoppingCart className={`absolute -right-4 -bottom-4 w-24 h-24 sm:w-[110px] sm:h-[110px] opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 ${t.textAccent}`} />
          <ShoppingCart className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent} group-hover:${t.textMain}`} />
          <h2 className={`text-lg sm:text-2xl font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Reward Shop</h2>
          <p className={`text-[10px] sm:text-sm mt-1 relative z-10 ${t.textMuted} ${t.fontHeading}`}>Spend hard-earned stars.</p>
        </button>

        <button onClick={() => setHabitRoute("analysis")} className={`col-span-1 sm:col-span-2 p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner} hover:${t.borderAccent}`}>
          <BarChart2 className={`absolute -right-4 -bottom-4 w-24 h-24 sm:w-[120px] sm:h-[120px] opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 ${t.textAccent}`} />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className={`p-3 sm:p-4 transition-colors ${t.card}`}>
              <BarChart2 className={`w-6 h-6 sm:w-8 sm:h-8 ${t.textAccent}`} />
            </div>
            <div>
              <h2 className={`text-base sm:text-xl font-bold ${t.textMain} ${t.fontHeading}`}>Performance Analytics</h2>
              <p className={`text-[9px] sm:text-sm mt-0.5 sm:mt-1 ${t.textMuted} ${t.fontHeading}`}>Track your streaks, charts & history.</p>
            </div>
          </div>
        </button>

        <button onClick={() => setHabitRoute("plan")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner}`}>
          <Briefcase className={`w-6 h-6 sm:w-7 sm:h-7 mb-2 relative z-10 ${t.textAccent}`} />
          <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Ongoing Plan</h2>
          <p className={`text-[9px] sm:text-xs mt-1 relative z-10 ${t.textMuted} ${t.fontHeading}`}>Active inventory & history.</p>
        </button>
        
        <button onClick={() => setHabitRoute("coach")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner}`}>
          <Bot className={`w-6 h-6 sm:w-7 sm:h-7 mb-2 relative z-10 ${t.textAccent}`} />
          <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Tracker Coach</h2>
          <p className={`text-[9px] sm:text-xs mt-1 relative z-10 ${t.textMuted} ${t.fontHeading}`}>Your AI Mentor.</p>
        </button>

        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button onClick={() => setHabitRoute("vault")} className={`p-4 text-left group relative overflow-hidden active:scale-[0.98] flex items-center justify-center sm:justify-start gap-3 ${t.cardInner}`}>
            <Download className={`w-5 h-5 ${t.textMuted}`} />
            <span className={`text-[10px] sm:text-sm font-bold ${t.textMain} ${t.fontHeading}`}>Data Vault</span>
          </button>
          <button onClick={() => setHabitRoute("settings")} className={`p-4 text-left group relative overflow-hidden active:scale-[0.98] flex items-center justify-center sm:justify-start gap-3 ${t.cardInner}`}>
            <Settings className={`w-5 h-5 ${t.textMuted}`} />
            <span className={`text-[10px] sm:text-sm font-bold ${t.textMain} ${t.fontHeading}`}>Command Center</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderHabitArena = () => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="space-y-6 pb-20 max-w-xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>Level Map</h2>
        </div>

        {isEraserActive && (
          <div className="bg-red-900/80 text-white font-bold p-3 sm:p-4 text-[10px] sm:text-sm text-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            🧽 ERASER ARMED: Click on any past date marked with <span className="text-red-300 bg-red-900 px-1 rounded mx-1 animate-pulse">FIX</span> to rewrite it.
          </div>
        )}

        <div className={`p-4 sm:p-6 ${t.card}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); } else setCalMonth((m) => m - 1); }} className={`p-1.5 sm:p-2 active:scale-95 ${t.cardInner} ${t.textMain}`}><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <h2 className={`text-sm sm:text-lg font-bold uppercase tracking-wider ${t.textMain} ${t.fontHeading}`}>{monthNames[calMonth]} {calYear}</h2>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); } else setCalMonth((m) => m + 1); }} className={`p-1.5 sm:p-2 active:scale-95 ${t.cardInner} ${t.textMain}`}><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          </div>

          <div className={`grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[9px] sm:text-xs font-bold mb-2 sm:mb-3 ${t.textMuted} ${t.fontHeading}`}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isDayToday = dateStr === todayStr; const isFuture = dateStr > todayStr; const isPast = dateStr < todayStr;
              const dayData = trackerData[dateStr];

              let bgColor = t.cardInner.split(' ')[0] + ' opacity-50';
              let textColor = t.textMuted; let borderClass = 'border border-transparent';
              let hasFailure = false;

              if (dayData && dayData.tasks) {
                const vals = Object.values(dayData.tasks);
                if (vals.length > 0) {
                  const t4Failed = dayData.tasks.t4 === "O";
                  const snapshotUsed = dayData.taskSnapshot || profile.customTasks || DEFAULT_TASKS;
                  const totalPossible = snapshotUsed.length;
                  const xCount = vals.filter((v) => v === "X").length;
                  const majority = Math.floor(totalPossible / 2) + 1;

                  if (vals.includes("O")) hasFailure = true;

                  if (t4Failed) { bgColor = "bg-red-500/20"; borderClass = "border border-red-500/50"; textColor = "text-red-500"; } 
                  else {
                    if (xCount >= majority) { bgColor = "bg-green-500/20"; borderClass = "border border-green-500/50"; textColor = "text-green-500 font-bold"; } 
                    else { bgColor = "bg-red-500/20"; borderClass = "border border-red-500/50"; textColor = "text-red-500"; }
                  }
                }
              }

              if (isDayToday) { bgColor = t.btnPrimary.split(' ')[0]; borderClass = `border-2 ${t.borderAccent}`; textColor = "text-white font-black"; }
              const showFixBadge = isEraserActive && hasFailure && isPast;

              return (
                <button
                  key={day} disabled={isFuture && !showFixBadge}
                  onClick={() => {
                    if (isFuture) return;
                    if (isPast) {
                      const isBlank = !dayData || !dayData.tasks || Object.keys(dayData.tasks).length === 0;
                      if (isBlank) setUnlockedBlankDate(dateStr); else setUnlockedBlankDate(null);
                    } else setUnlockedBlankDate(null);
                    setSelectedDate(dateStr); setHabitRoute("tracker");
                  }}
                  className={`aspect-square flex flex-col items-center justify-center relative transition-all ${t.fontHeading} ${isFuture ? "opacity-20 cursor-not-allowed" : "cursor-pointer hover:scale-105"} ${bgColor} ${borderClass} ${textColor} ${showFixBadge ? "ring-2 ring-red-500 scale-105 z-10" : ""}`}
                >
                  {showFixBadge && <span className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 text-[7px] sm:text-[9px] bg-red-600 text-white font-bold px-1 sm:px-1.5 py-0.5 animate-pulse z-20">FIX</span>}
                  {dayData && dayData.star && <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] sm:text-[10px] text-yellow-400">★</span>}
                  <span className="text-[10px] sm:text-sm z-10">{day}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => { setSelectedDate(todayStr); const [y, m] = todayStr.split("-"); setCalYear(parseInt(y)); setCalMonth(parseInt(m) - 1); setUnlockedBlankDate(null); setHabitRoute("tracker"); }} className={`w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-[10px] sm:text-sm active:scale-[0.98] flex justify-center items-center ${t.btnPrimary} ${t.fontHeading}`}>JUMP TO TODAY'S LEVEL</button>
        </div>
      </div>
    );
  };

  const renderHabitTracker = () => {
    const isToday = selectedDate === todayStr; const isPast = selectedDate < todayStr;
    const isBlankDayUnlocked = isPast && unlockedBlankDate === selectedDate;
    const currentDayData = trackerData[selectedDate] || { tasks: {}, reasonForO: "", summary: "", taskSnapshot: null };
    const hasFailures = Object.values(currentDayData.tasks).includes("O");
    
    let activeTasksToDisplay = (isToday || isBlankDayUnlocked) ? (profile.customTasks || DEFAULT_TASKS) : (currentDayData.taskSnapshot || DEFAULT_TASKS);
    const currentTaskVals = Object.values(currentDayData.tasks);
    const xCount = currentTaskVals.filter((v) => v === "X").length;
    const maxTasks = activeTasksToDisplay.length;
    const progressPercent = Math.round((xCount / maxTasks) * 100) || 0;
    
    const t4FailedTracker = currentDayData.tasks?.t4 === "O";
    const majorityTracker = Math.floor(maxTasks / 2) + 1;
    let progressColor = "bg-gray-500/50";
    if (currentTaskVals.length > 0) {
      if (t4FailedTracker) progressColor = "bg-red-500";
      else progressColor = xCount >= majorityTracker ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-red-500";
    }

    return (
      <div className="space-y-6 pb-20 max-w-2xl mx-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => { setHabitRoute("arena"); setUnlockedBlankDate(null); }} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-bold ${t.textMain} ${t.fontHeading}`}>{selectedDate}</h2>
          {isToday && <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold tracking-widest uppercase ${t.badge} ${t.textAccent} ${t.fontHeading}`}>Active Level</span>}
        </div>

        <div className={`p-4 sm:p-6 ${t.card} ${isPunished ? 'border-red-500/50 bg-red-900/5' : ''}`}>
          <div className="mb-4 sm:mb-6">
            <div className={`flex justify-between text-[9px] sm:text-xs font-bold mb-1.5 sm:mb-2 uppercase tracking-wide ${t.textMain} ${t.fontHeading}`}>
              <span className={t.textMuted}>Daily Progress</span><span>{progressPercent}%</span>
            </div>
            <div className={`w-full h-2 sm:h-3 overflow-hidden opacity-80 ${t.cardInner}`}>
              <div className={`h-full transition-all duration-700 ease-out ${progressColor}`} style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {activeTasksToDisplay.map((task) => {
              const status = currentDayData.tasks[task.id];
              const canInteract = isToday || (isPast && isEraserActive && status === "O") || isBlankDayUnlocked;
              const displayTitle = isPunished ? `${task.title} (PUNISHED)` : task.title;
              let taskBg = status === "X" ? "bg-green-500/10 border-green-500/30" : status === "O" ? "bg-red-500/10 border-red-500/30" : t.cardInner;

              return (
                <div key={task.id} className={`flex items-center justify-between p-3 sm:p-4 transition-all ${taskBg}`}>
                  <div>
                    <h3 className={`text-[10px] sm:text-sm font-bold ${isPunished ? 'text-red-400' : t.textMain} ${t.fontHeading}`}>{displayTitle}</h3>
                    <p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${t.textMuted} ${t.fontHeading}`}>{task.desc}</p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button onClick={() => handleTaskClick(task.id, "X", activeTasksToDisplay)} disabled={!canInteract} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all ${t.cardInner} ${status === "X" ? "bg-green-500/20 text-green-500 border-green-500" : t.textMuted} ${!canInteract && status !== "X" ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`}><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                    <button onClick={() => handleTaskClick(task.id, "O", activeTasksToDisplay)} disabled={!(isToday || isBlankDayUnlocked)} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all ${t.cardInner} ${status === "O" ? "bg-red-500/20 text-red-500 border-red-500" : t.textMuted} ${!(isToday || isBlankDayUnlocked) && status !== "O" ? "opacity-30 cursor-not-allowed" : "active:scale-90"}`}><XCircle className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 transition-all flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 ${t.cardInner} ${currentDayData.star ? 'border-yellow-500 text-yellow-500' : ''}`}>
            <div className="flex items-center gap-2 sm:gap-3"><span className="text-2xl sm:text-3xl">⭐</span><div><h3 className={`text-[10px] sm:text-sm font-bold ${t.textMain} ${t.fontHeading}`}>Willpower Star</h3><p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${t.textMuted} ${t.fontHeading}`}>Craving killed? Tap here.</p></div></div>
            <button onClick={() => handleStarClick(activeTasksToDisplay)} disabled={!(isToday || isBlankDayUnlocked)} className={`px-4 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold transition-all ${currentDayData.star ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500' : t.btnWarning} ${!(isToday || isBlankDayUnlocked) && "opacity-50"} ${t.fontHeading}`}>{currentDayData.star ? "CLAIMED ★" : "CLAIM +1 ★"}</button>
          </div>
        </div>
        
        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 ${t.cardInner}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-blue-400 font-bold flex items-center gap-2 text-[10px] sm:text-sm ${t.fontHeading}`}><BookOpen size={16} /> Daily Summary</h3>
            <button onClick={() => { saveDayData(selectedDate, currentDayData.tasks, currentDayData.reasonForO, summaryInput, currentDayData.star, activeTasksToDisplay); showMessage("Summary Saved! 📝"); }} disabled={!(isToday || isBlankDayUnlocked)} className={`px-2 py-1 text-[8px] sm:text-[10px] font-bold active:scale-95 transition-all ${t.btnPrimary} ${t.fontHeading}`}>SAVE</button>
          </div>
          <textarea disabled={!(isToday || isBlankDayUnlocked)} value={summaryInput} onChange={(e) => setSummaryInput(e.target.value)} onBlur={() => saveDayData(selectedDate, currentDayData.tasks, currentDayData.reasonForO, summaryInput, currentDayData.star, activeTasksToDisplay)} placeholder="Write your thoughts or confession here..." className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} rows="3" />
        </div>
      </div>
    );
  };

  const renderShop = () => (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Reward Shop</h2>
      </div>
      <div className={`p-3 sm:p-4 flex items-center justify-between shadow-lg ${t.cardInner} ${t.borderAccent}`}>
        <span className={`text-[10px] sm:text-sm font-bold uppercase tracking-widest ${t.textMuted} ${t.fontHeading}`}>Your Wallet:</span>
        <div className="flex items-center gap-1.5 sm:gap-2"><span className="text-lg sm:text-xl">⭐</span><span className={`font-black text-xl sm:text-2xl ${t.textWarning} ${t.fontHeading}`}>{profile.stars}</span></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {(profile.customShopItems || SHOP_ITEMS).map((item) => (
          <div key={item.id} className={`p-4 sm:p-5 flex flex-col justify-between transition-colors shadow-lg ${t.cardInner}`}>
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <span className={`text-2xl sm:text-3xl p-2 sm:p-3 ${t.card}`}>{item.icon}</span>
              <div>
                <h3 className={`font-bold text-xs sm:text-base ${t.textMain} ${t.fontHeading}`}>{item.name}</h3>
                <p className={`text-[9px] sm:text-xs mt-1 ${t.textMuted} ${t.fontHeading}`}>{item.desc}</p>
                <span className={`text-[8px] sm:text-[10px] font-bold mt-2 block uppercase tracking-widest ${t.textAccent} ${t.fontHeading}`}>Expires in {item.expiryHours} Hrs</span>
              </div>
            </div>
            <button onClick={() => buyItem(item)} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-xs flex items-center justify-center gap-2 group active:scale-[0.98] ${t.btnPrimary} ${t.fontHeading}`}><span>BUY FOR {item.cost}</span><span className="group-hover:scale-110 transition-transform">⭐</span></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => {
    const weeklyData = getWeeklyData(weekOffset);
    if (weeklyData.length === 0) return null;
    const weekStart = weeklyData[0]?.date || "";
    const weekEnd = weeklyData[6]?.date || "";

    return (
      <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><BarChart2 className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Analytics Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`p-4 sm:p-5 relative overflow-hidden shadow-lg ${t.cardInner} border border-orange-500/50`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-orange-500"><Flame size={100} /></div>
            <span className="text-orange-500 font-bold flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Flame size={16} /> Perfect Day Streak</span>
            <span className={`text-4xl sm:text-5xl font-black ${t.textMain}`}>{streaks.perfect} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>

          <div className={`p-4 sm:p-5 relative overflow-hidden shadow-lg ${t.cardInner} border border-blue-500/50`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-blue-500"><Target size={100} /></div>
            <span className="text-blue-500 font-bold flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Target size={16} /> Deep Study Streak</span>
            <span className={`text-4xl sm:text-5xl font-black ${t.textMain}`}>{streaks.study} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>

          <div className={`p-4 sm:p-5 relative overflow-hidden shadow-lg ${t.cardInner} border border-yellow-500/50`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-yellow-500"><Shield size={100} /></div>
            <span className="text-yellow-500 font-bold flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Shield size={16} /> Trigger Free Streak</span>
            <span className={`text-4xl sm:text-5xl font-black ${t.textMain}`}>{streaks.trigger} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>
        </div>

        <div className={`p-4 sm:p-6 shadow-xl ${t.card}`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 border-b pb-4 ${t.borderAccent}`}>
            <h3 className={`font-bold text-sm sm:text-lg flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>Weekly Chart Focus</h3>
            <div className={`flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2 ${t.cardInner}`}>
              <button onClick={() => setWeekOffset((prev) => prev + 1)} className={`p-1.5 sm:p-2 active:scale-95 flex items-center gap-1 text-[9px] sm:text-xs font-bold ${t.btnWarning} ${t.fontHeading}`}><ChevronLeft size={16} /> PAST</button>
              <div className="text-center min-w-[100px] sm:min-w-[120px]">
                <p className={`text-[9px] sm:text-xs font-bold tracking-widest ${t.textMain} ${t.fontHeading}`}>{weekStart} <br /><span className={t.textMuted}>to</span><br /> {weekEnd}</p>
              </div>
              <button onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))} disabled={weekOffset === 0} className={`p-1.5 sm:p-2 active:scale-95 flex items-center gap-1 text-[9px] sm:text-xs font-bold ${weekOffset === 0 ? "opacity-30 cursor-not-allowed" : ""} ${t.btnWarning} ${t.fontHeading}`}>NEXT <ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex justify-between items-end h-48 sm:h-64 mb-4 gap-1.5 sm:gap-2 px-1 sm:px-8">
            {weeklyData.map((day, i) => {
              let barColor = t.cardInner.split(' ')[0] + " opacity-50";
              if (day.perfect) barColor = "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
              else if (day.failed) barColor = "bg-red-500";
              else if (day.percent > 0) barColor = "bg-yellow-400";

              return (
                <div key={i} className="flex flex-col items-center w-full group relative h-full justify-end">
                  <div className={`opacity-0 group-hover:opacity-100 absolute bottom-[calc(100%+10px)] p-2 rounded-lg border pointer-events-none transition-all z-10 whitespace-nowrap shadow-xl text-[9px] sm:text-xs ${t.cardInner} ${t.textMain}`}>
                    <span className="block font-bold text-center mb-1 border-b border-current opacity-50 pb-1">{day.date}</span>
                    Score: {day.percent}% <br />Wins: {day.xCount} out of {day.total}
                  </div>
                  <span className={`text-[8px] sm:text-xs mb-1.5 sm:mb-2 font-bold ${t.textMuted}`}>{day.percent}%</span>
                  <div className={`w-full max-w-[30px] sm:max-w-[40px] rounded-t-xl relative flex justify-end flex-col overflow-hidden h-[80%] border-b-2 ${t.borderAccent} ${t.cardInner}`}>
                    <div className={`w-full rounded-t-xl transition-all duration-700 ease-out ${barColor}`} style={{ height: `${day.percent}%`, minHeight: day.percent > 0 ? "4px" : "0" }}></div>
                  </div>
                  <span className={`text-[8px] sm:text-xs mt-2 sm:mt-3 font-bold uppercase tracking-widest ${day.date === todayStr ? t.badge + " px-1 sm:px-2 py-0.5 sm:py-1" : t.textMuted}`}>{day.label}</span>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 text-[9px] sm:text-xs font-bold border-t pt-3 sm:pt-4 ${t.textMuted} border-current opacity-70`}>
            <span className="flex items-center gap-1"><div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-sm"></div> Perfect</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-sm"></div> Partial</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-sm"></div> Failed</span>
            <span className="flex items-center gap-1"><div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm ${t.cardInner}`}></div> Rest</span>
          </div>
        </div>
      </div>
    );
  };

  const renderOngoingPlan = () => {
    const allItems = checkExpirations();
    const activeItems = allItems.filter((i) => i.status === "active");
    const historyItems = allItems.filter((i) => i.status !== "active").reverse();

    return (
      <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Ongoing Plan & History</h2>
        </div>

        <h3 className={`font-bold uppercase tracking-wider text-[10px] sm:text-sm mt-4 border-b border-current opacity-70 pb-2 ${t.textMuted} ${t.fontHeading}`}>Active Perks</h3>
        {activeItems.length === 0 ? (
          <div className={`text-center p-6 sm:p-10 rounded-2xl border border-dashed opacity-70 ${t.cardInner}`}>
            <p className={`font-bold mb-2 text-[10px] sm:text-sm ${t.textMain} ${t.fontHeading}`}>No active perks.</p>
            <p className={`text-[9px] sm:text-xs ${t.textMuted} ${t.fontHeading}`}>Visit the Reward Shop to buy your freedom.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {activeItems.map((item) => {
              const hrsLeft = Math.max(0, Math.floor((new Date(item.expiryTime) - new Date(`${todayStr}T00:00:00`)) / (1000 * 60 * 60)));
              return (
                <div key={item.instanceId} className={`p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-lg ${t.cardInner}`}>
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-current opacity-10 rounded-full blur-xl"></div>
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 z-10">
                    <span className={`text-2xl sm:text-3xl p-2 sm:p-3 ${t.card}`}>{item.icon}</span>
                    <div>
                      <h3 className={`font-bold text-xs sm:text-lg ${t.textMain} ${t.fontHeading}`}>{item.name}</h3>
                      <p className={`text-[9px] sm:text-sm font-bold mt-1 ${hrsLeft < 12 ? "text-red-400 animate-pulse" : t.textAccent} ${t.fontHeading}`}>Expires in {hrsLeft} Hours</p>
                    </div>
                  </div>
                  <button onClick={() => useInventoryItem(item.instanceId, item.name)} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold active:scale-[0.98] transition-all z-10 ${t.btnPrimary} ${t.fontHeading}`}>{item.name === "The Eraser" ? "Arm Eraser" : "Mark as Used"}</button>
                </div>
              );
            })}
          </div>
        )}

        {historyItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h3 className={`font-bold uppercase tracking-wider text-[10px] sm:text-sm mb-4 border-b border-current opacity-70 pb-2 flex items-center gap-2 ${t.textMuted} ${t.fontHeading}`}><History size={16} /> History Log</h3>
            <div className="space-y-2">
              {historyItems.map((item) => (
                <div key={item.instanceId} className={`flex items-center justify-between p-2.5 sm:p-3 shadow-md ${t.cardInner}`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-xl opacity-50 grayscale">{item.icon}</span>
                    <div>
                      <span className={`font-semibold block text-[10px] sm:text-sm ${t.textMain} ${t.fontHeading}`}>{item.name}</span>
                      <span className={`text-[8px] sm:text-[10px] ${t.textMuted} ${t.fontHeading}`}>Claimed ID: {item.instanceId.slice(-6)}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 tracking-widest ${t.fontHeading} ${item.status === "used" ? "bg-green-900/20 text-green-500 border border-green-900" : "bg-red-900/20 text-red-500 border border-red-900"}`}>{item.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVault = () => (
    <div className="space-y-6 max-w-xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Download className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Data Vault</h2>
      </div>
      <div className={`p-4 sm:p-6 shadow-xl ${t.card}`}>
        <p className={`text-[9px] sm:text-sm mb-4 sm:mb-6 ${t.textMuted} ${t.fontHeading}`}>Select your date range and choose how you want to export your data.</p>
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div>
            <label className={`block text-[9px] sm:text-xs font-bold mb-1 uppercase tracking-widest ${t.textMuted} ${t.fontHeading}`}>START DATE</label>
            <input type="date" value={exportStartDate} onChange={(e) => setExportStartDate(e.target.value)} className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
          <div>
            <label className={`block text-[9px] sm:text-xs font-bold mb-1 uppercase tracking-widest ${t.textMuted} ${t.fontHeading}`}>END DATE</label>
            <input type="date" value={exportEndDate} onChange={(e) => setExportEndDate(e.target.value)} className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          <button onClick={downloadExport} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-sm flex justify-center items-center gap-2 active:scale-[0.98] ${t.btnPrimary} ${t.fontHeading}`}><FileDown size={16} className="sm:size-4"/> Download Dark HTML Report</button>
          <button onClick={copyTextExport} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-sm flex justify-center items-center gap-2 active:scale-[0.98] ${copySuccess ? 'bg-green-600 text-white' : t.btnWarning} ${t.fontHeading}`}><Copy size={16} className="sm:size-4"/> {copySuccess ? "Copied to Clipboard!" : "Copy as Plain Text"}</button>
        </div>
      </div>
    </div>
  );

  const renderCoach = () => (
    <div className="flex flex-col h-[75vh] max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Bot className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Habit Tracker Coach</h2>
      </div>
      <div className={`flex-1 flex flex-col overflow-hidden shadow-2xl ${t.card}`}>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-3 sm:p-4 shadow-md text-[10px] sm:text-sm ${t.fontHeading} ${msg.role === "user" ? t.btnPrimary + " rounded-2xl rounded-tr-sm" : t.cardInner + " " + t.textMain + " rounded-2xl rounded-tl-sm"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && <div className={`text-[10px] sm:text-sm font-bold animate-pulse px-4 ${t.textMuted} ${t.fontHeading}`}>Coach is typing...</div>}
        </div>
        <div className={`p-3 sm:p-4 border-t ${t.borderAccent} ${t.cardInner}`}>
          <div className="flex gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && askCoach()} placeholder="Ask for guidance or confession..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={askCoach} disabled={isTyping} className={`px-4 sm:px-5 active:scale-[0.98] transition-all disabled:opacity-50 ${t.btnPrimary}`}><Zap size={18} className="sm:size-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // BRAIN RENDERERS (STYLED WITH THEMES)
  // ==========================================
  const renderBrainDashboard = () => {
    const remainingChapters = brain.stagingTopics.length;
    const pace = remainingChapters > 0 ? (brain.globalDeadlineDays / remainingChapters).toFixed(1) : 0;
    
    let paceStatus = { text: "ON TRACK", color: t.textMain };
    if (pace < 1 && remainingChapters > 0) paceStatus = { text: "DANGER", color: "text-red-500" };
    else if (pace >= 1 && pace <= 1.5) paceStatus = { text: "WARNING", color: "text-yellow-500" };
    else if (remainingChapters === 0) paceStatus = { text: "STANDBY", color: t.textMuted };

    const todaysRevisions = [];
    brain.studyTopics.forEach(topic => {
      topic.schedule.forEach(rev => {
        if (rev.targetDate <= todayStr && !rev.completed) {
          todaysRevisions.push({ topicId: topic.id, title: topic.title, category: topic.category, targetDate: rev.targetDate, dayOffset: rev.dayOffset, isOverdue: rev.targetDate < todayStr });
        }
      });
    });

    const todaysCustomMissions = brain.customMissions.filter(m => m.targetDate <= todayStr && !m.completed);
    const quoteOfTheDay = MORNING_QUOTES[new Date().getDate() % MORNING_QUOTES.length];

    return (
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in zoom-in duration-300">
        
        <div className={`p-4 sm:p-6 ${t.cardInner} border-l-4 ${t.borderAccent}`}>
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-3 sm:mb-4 flex items-center gap-2 border-b pb-2 ${t.textAccent} ${t.fontHeading} border-current opacity-80`}><Zap size={16} /> PROTOCOL INITIATED</h3>
          <p className={`text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug ${t.textMain} ${t.fontHeading}`}>"{quoteOfTheDay}"</p>
        </div>

        <div className={`p-4 sm:p-6 ${t.card} relative overflow-hidden`}>
          <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b pb-2 ${t.textAccent} border-current opacity-50 ${t.fontHeading}`}>GLOBAL DEADLINE</h2>
          <div className="flex justify-between items-end">
            <div className={`flex items-baseline gap-1 sm:gap-2 border-b-2 border-transparent transition-colors focus-within:${t.borderAccent}`}>
              <input type="number" value={brain.globalDeadlineDays} onChange={(e) => updateBrainFirebase({ globalDeadlineDays: Math.max(1, parseInt(e.target.value) || 1) })} className={`w-16 sm:w-24 bg-transparent text-4xl sm:text-6xl font-black tracking-tighter outline-none p-0 m-0 ${t.textMain} ${t.fontHeading}`} />
              <span className={`text-lg sm:text-xl font-black ${t.textAccent} ${t.fontHeading}`}>DAYS</span>
            </div>
            <div className="text-right">
              <p className={`text-[9px] sm:text-[10px] tracking-widest font-bold uppercase mb-1 ${t.textMuted} ${t.fontHeading}`}>PACE DETECTOR</p>
              <p className={`text-xl sm:text-2xl font-black ${paceStatus.color} ${t.fontHeading}`}>{pace} <span className="text-[10px] sm:text-xs">CH/DAY</span></p>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 ${paceStatus.color} ${t.fontHeading}`}>{paceStatus.text}</p>
            </div>
          </div>
          
          {brain.stagingTopics.length > 0 && (
            <div className={`mt-6 sm:mt-8 p-3 sm:p-4 border-2 ${t.cardInner} ${t.borderAccent}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${t.textAccent} ${t.fontHeading}`}>CURRENT STRIKE TARGET</h3>
              <h2 className={`text-lg sm:text-xl font-black uppercase tracking-tight truncate ${t.textMain} ${t.fontHeading}`}>{brain.stagingTopics[0].title}</h2>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 mt-2 inline-block ${t.badge} ${t.fontHeading}`}>{brain.stagingTopics[0].category}</span>
              <button onClick={() => handleStartRevision(brain.stagingTopics[0].id)} className={`w-full mt-4 py-2.5 sm:py-3 text-sm sm:text-base font-black tracking-widest uppercase active:translate-y-1 transition-all ${t.btnPrimary} ${t.fontHeading}`}>TARGET DESTROYED</button>
            </div>
          )}
        </div>

        {todaysCustomMissions.length > 0 && (
          <div className="pt-2 sm:pt-4">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 sm:mb-4 ${t.textAccent} ${t.fontHeading}`}>TODAY'S MISSIONS</h3>
            {todaysCustomMissions.map((mission) => (
              <div key={mission.id} className={`flex items-center justify-between p-3 sm:p-4 mb-2 sm:mb-3 shadow-md ${t.cardInner}`}>
                <span className={`font-bold uppercase tracking-wider text-xs sm:text-sm ${t.textMain} ${t.fontHeading}`}>{mission.text}</span>
                <button onClick={() => {
                  updateBrainFirebase({ customMissions: brain.customMissions.filter(m => m.id !== mission.id) });
                  const remaining = todaysCustomMissions.length - 1;
                  if (remaining === 0) triggerCrossReward(3, "All Daily Missions Cleared!");
                }} className={`transition-colors ${t.textMuted} hover:${t.textAccent}`}><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 sm:pt-4">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 sm:mb-4 ${t.textAccent} ${t.fontHeading}`}>MANDATORY REVISIONS</h3>
          {todaysRevisions.length === 0 ? (
            <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>SYSTEM CLEAR</div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todaysRevisions.map((rev, idx) => (
                <div key={idx} className={`p-3 sm:p-4 flex items-center justify-between shadow-md ${t.cardInner} ${rev.isOverdue ? 'border border-red-500' : ''}`}>
                  <div>
                    <h4 className={`font-black uppercase text-xs sm:text-sm flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>{rev.title} {rev.isOverdue && <span className="text-[8px] sm:text-[9px] bg-red-500 text-white px-2 py-0.5 sm:py-1 tracking-widest">OVERDUE</span>}</h4>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${t.textAccent}`}>{rev.category}</span>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${t.textMuted}`}>DAY {rev.dayOffset}</span>
                    </div>
                  </div>
                  <button onClick={() => markRevisionComplete(rev.topicId, rev.targetDate, rev.dayOffset)} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-colors active:translate-y-1 shrink-0 ${t.btnPrimary}`}><Check size={20} className="sm:size-6 stroke-[3]" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBrainStudy = () => (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-in slide-in-from-right-4 duration-300">
      <div className={`p-4 sm:p-5 ${t.card}`}>
        <div className={`flex justify-between items-center mb-4 sm:mb-6 border-b pb-2 ${t.borderAccent}`}>
           <h3 className={`font-black uppercase tracking-widest flex items-center gap-2 text-xs sm:text-sm ${t.textAccent} ${t.fontHeading}`}>LIQUID STRIKE QUEUE</h3>
           <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Hold to drag</span>
        </div>
        
        <div className="flex gap-2 mb-4 sm:mb-6">
          <input type="text" value={newSyllabusCat} onChange={(e) => setNewSyllabusCat(e.target.value)} placeholder="NEW TAG..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
          <button onClick={handleAddSyllabusCategory} className={`px-3 sm:px-4 font-black uppercase active:translate-y-1 transition-all ${t.btnPrimary}`}><Plus size={18} className="sm:size-5 stroke-[3]" /></button>
        </div>

        {brain.syllabusCategories.length > 1 && (
           <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
             {brain.syllabusCategories.map(cat => (
               <div key={cat} className={`group flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors cursor-pointer border ${t.cardInner} hover:${t.borderAccent} ${t.textMain}`}>
                 {cat}
                 {cat !== "Raw Backlog" && <button onClick={() => handleDeleteSyllabusCategory(cat)} className={`transition-colors ${t.textMuted} hover:text-red-500`}><Trash2 size={12} className="sm:size-4" /></button>}
               </div>
             ))}
           </div>
        )}

        <div className="flex gap-2">
          <select value={selectedSyllabusCat} onChange={(e) => setSelectedSyllabusCat(e.target.value)} className={`w-1/3 px-1 sm:px-2 py-2 sm:py-3 text-[9px] sm:text-xs font-black uppercase tracking-widest outline-none cursor-pointer ${t.input} ${t.textAccent} ${t.fontHeading}`}>
            {brain.syllabusCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddStagingTopic()} placeholder="CHAPTER NAME..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
          <button onClick={handleAddStagingTopic} className={`px-4 sm:px-5 font-black active:translate-y-1 transition-all ${t.btnPrimary}`}><Plus size={18} className="sm:size-5 stroke-[3]" /></button>
        </div>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
          {brain.stagingTopics.length === 0 && <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>QUEUE EMPTY</div>}
          {brain.stagingTopics.map((topic, index) => (
            <LongPressItem key={topic.id} item={topic} onDelete={(id) => updateBrainFirebase({ stagingTopics: brain.stagingTopics.filter(t => t.id !== id) })} t={t}>
              <div draggable onDragStart={() => setDraggedItemIndex(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => {
                if (draggedItemIndex === null) return;
                const items = [...brain.stagingTopics]; const draggedItem = items[draggedItemIndex];
                items.splice(draggedItemIndex, 1); items.splice(index, 0, draggedItem);
                updateBrainFirebase({ stagingTopics: items }); setDraggedItemIndex(null);
              }} className={`p-3 sm:p-4 border flex items-center justify-between cursor-move transition-all select-none ${index === 0 ? t.borderAccent + " " + t.cardInner : t.cardInner} ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <GripVertical size={18} className={`sm:size-5 ${index === 0 ? t.textAccent : t.textMuted}`} />
                  <div>
                    <h4 className={`font-black text-xs sm:text-sm uppercase flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>{topic.title} {index === 0 && <span className={`text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 tracking-widest font-black ${t.badge} ${t.textAccent}`}>NEXT</span>}</h4>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{topic.category}</span>
                  </div>
                </div>
              </div>
            </LongPressItem>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrainHistory = () => (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-in slide-in-from-right-4 duration-300">
      <div className={`p-4 sm:p-5 ${t.card}`}>
        <h3 className={`font-black uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-2 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}>ONGOING CYCLES</h3>
        {brain.studyTopics.length === 0 ? (
          <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>NO ACTIVE CYCLES</div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {brain.studyTopics.map(topic => (
              <LongPressItem key={topic.id} item={topic} onDelete={(id) => updateBrainFirebase({ studyTopics: brain.studyTopics.filter(t => t.id !== id) })} duration={5000} t={t}>
                <div className={`p-4 sm:p-5 shadow-md ${t.cardInner}`}>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h4 className={`font-black text-base sm:text-lg uppercase ${t.textMain} ${t.fontHeading}`}>{topic.title}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 mt-2 inline-block ${t.badge}`}>{topic.category}</span>
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black tracking-widest border px-1 sm:px-2 py-1 ${t.textAccent} border-current opacity-80`}>INIT: {topic.startDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {topic.schedule.map((rev, i) => {
                      const isPending = !rev.completed && rev.targetDate <= todayStr;
                      return (
                        <div key={i} className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 border transition-all ${rev.completed ? t.btnPrimary : isPending ? 'border-red-500 text-red-500 shadow-md' : t.card + ' ' + t.textMuted}`}>
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.fontHeading}`}>D{rev.dayOffset}</span>
                          {rev.completed ? <Check size={14} className="sm:size-4 mt-1 stroke-[4]" /> : <Circle size={14} className={`sm:size-4 mt-1 stroke-[3] ${isPending ? 'animate-pulse' : ''}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        )}
      </div>

      <div className={`p-4 sm:p-6 ${t.card}`}>
        <h3 className={`font-black uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-2 ${t.textMain} ${t.fontHeading} ${t.borderAccent} opacity-80`}>HALL OF FAME (MASTERED)</h3>
        {brain.masteredTopics.length === 0 ? (
          <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>EMPTY VAULT</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {brain.masteredTopics.map(topic => (
              <div key={topic.id} className={`p-3 sm:p-4 border flex items-center gap-3 sm:gap-4 transition-colors ${t.cardInner} hover:${t.borderAccent}`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 border flex items-center justify-center shrink-0 ${t.card} ${t.borderAccent}`}>
                   <Trophy size={18} className={`sm:size-5 ${t.textAccent}`} />
                </div>
                <div>
                  <h4 className={`font-black text-xs sm:text-sm uppercase ${t.textMain} ${t.fontHeading}`}>{topic.title}</h4>
                  <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 ${t.textMuted} ${t.fontHeading}`}>{topic.category} • {topic.masteredDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBrainWisdom = () => {
    if (expandedWisdomCategory) {
      const filteredNotes = brain.wisdomNotes.filter(n => n.category === expandedWisdomCategory);
      return (
        <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedWisdomCategory(null)} className={`p-2 sm:p-3 active:translate-y-1 ${t.btnPrimary}`}><ChevronLeft size={20} className="sm:size-6 stroke-[3]"/></button>
            <h2 className={`text-lg sm:text-xl font-black uppercase tracking-widest flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><FolderOpen size={20} className={`sm:size-6 ${t.textMuted}`} /> {expandedWisdomCategory}</h2>
          </div>
          <div className="flex gap-2 mb-6 sm:mb-8">
            <input type="text" value={newWisdom} onChange={(e) => setNewWisdom(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddWisdom()} placeholder="DUMP KNOWLEDGE..." className={`flex-1 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
            <button onClick={handleAddWisdom} className={`px-4 sm:px-6 font-black transition-all active:scale-95 ${t.btnPrimary}`}><Plus size={20} className="sm:size-6 stroke-[4]" /></button>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {filteredNotes.length === 0 && <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>EMPTY FOLDER</div>}
            {filteredNotes.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => updateBrainFirebase({ wisdomNotes: brain.wisdomNotes.filter(n => n.id !== id) })} t={t}>
                <div className={`p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 group transition-colors cursor-pointer border ${t.cardInner} hover:${t.borderAccent}`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                     <Mic size={16} className={`sm:size-4 mt-1 flex-shrink-0 ${t.textMuted}`} />
                     <p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{note.text}</p>
                  </div>
                  <div className={`flex justify-between items-center pt-3 sm:pt-4 border-t ${t.borderAccent}`}>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>{note.date}</span>
                    <div className="flex items-center gap-2">
                       <MoveRight size={12} className={`sm:size-3 opacity-0 group-hover:opacity-100 transition-opacity ${t.textMuted}`} />
                       <select onChange={(e) => updateBrainFirebase({ wisdomNotes: brain.wisdomNotes.map(n => n.id === note.id ? { ...n, category: e.target.value } : n) })} value={note.category} className={`text-[9px] sm:text-[10px] font-black uppercase px-1 sm:px-2 py-1 outline-none cursor-pointer ${t.badge} ${t.fontHeading}`}>
                         {brain.wisdomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in slide-in-from-right-4 duration-300">
        <div className={`p-4 sm:p-6 ${t.card}`}>
          <h3 className={`font-black uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm border-b pb-2 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><Sparkles size={16} className="sm:size-5" /> ASK THE ORACLE</h3>
          <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-3 sm:mb-4 ${t.textMuted}`}>Chat with your Second Brain. Uses your saved Wisdom.</p>
          <div className="flex gap-2">
            <input type="text" value={oracleQuery} onChange={(e) => setOracleQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')} placeholder="QUERY..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
            <button onClick={() => handleAskOracle('wisdom')} disabled={isOracleThinking} className={`px-4 sm:px-6 font-black uppercase active:translate-y-1 transition-all disabled:opacity-50 ${t.btnPrimary}`}>{isOracleThinking ? <Circle size={18} className="sm:size-5 animate-pulse stroke-[4]" /> : <Send size={18} className="sm:size-5 stroke-[3]" />}</button>
          </div>
          {oracleResponse && <div className={`mt-4 sm:mt-6 p-4 sm:p-5 border-l-4 ${t.cardInner} ${t.borderAccent}`}><p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{oracleResponse}</p></div>}
        </div>

        <div className={`p-4 sm:p-6 ${t.card}`}>
          <h3 className={`font-black uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-2 ${t.textMain} ${t.fontHeading} ${t.borderAccent} opacity-80`}><Folder size={16} className="sm:size-5" /> WISDOM FOLDERS</h3>
          <div className="flex gap-2 mb-6 sm:mb-8">
            <input type="text" value={newWisdomCat} onChange={(e) => setNewWisdomCat(e.target.value)} placeholder="NEW FOLDER..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
            <button onClick={() => { if (newWisdomCat.trim() && !brain.wisdomCategories.includes(newWisdomCat.trim())) { updateBrainFirebase({ wisdomCategories: [...brain.wisdomCategories, newWisdomCat.trim()] }); setNewWisdomCat(""); } }} className={`px-4 sm:px-5 font-black transition-colors ${t.btnPrimary}`}><Plus size={18} className="sm:size-5 stroke-[3]" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {brain.wisdomCategories.map(cat => {
              const count = brain.wisdomNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button onClick={() => setExpandedWisdomCategory(cat)} className={`w-full p-4 sm:p-5 flex flex-col items-start gap-3 sm:gap-4 transition-all text-left active:translate-y-1 h-full border ${t.cardInner} hover:${t.borderAccent}`}>
                    <FolderOpen size={24} className={`sm:size-8 transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm uppercase truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Quick Thoughts" && <button onClick={(e) => { e.stopPropagation(); updateBrainFirebase({ wisdomCategories: brain.wisdomCategories.filter(c => c !== cat), wisdomNotes: brain.wisdomNotes.map(n => n.category === cat ? { ...n, category: "Quick Thoughts" } : n) }); }} className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 transition-colors ${t.textMuted} hover:text-red-500`}><Trash2 size={14} className="sm:size-4" /></button>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBrainVault = () => {
    if (expandedVaultCategory) {
      const notesInCat = brain.vaultNotes.filter(n => n.category === expandedVaultCategory);
      return (
        <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedVaultCategory(null)} className={`p-2 sm:p-3 active:translate-y-1 ${t.btnPrimary}`}><ChevronLeft size={20} className="sm:size-6 stroke-[3]"/></button>
            <h2 className={`text-lg sm:text-xl font-black uppercase tracking-widest flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><FolderOpen size={20} className={`sm:size-6 ${t.textMuted}`} /> {expandedVaultCategory}</h2>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {notesInCat.length === 0 && <div className={`text-center py-8 sm:py-10 border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current opacity-50`}>EMPTY FOLDER</div>}
            {notesInCat.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => updateBrainFirebase({ vaultNotes: brain.vaultNotes.filter(n => n.id !== id) })} t={t}>
                <div className={`p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-colors group cursor-pointer border ${t.cardInner} hover:${t.borderAccent}`}>
                  <BrainCircuit size={18} className={`sm:size-5 mt-1 shrink-0 transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{note.text}</p>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2 sm:mt-3 block ${t.textMuted} ${t.fontHeading}`}>{note.date}</span>
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in slide-in-from-right-4 duration-300">
        <div className={`p-4 sm:p-6 ${t.card}`}>
          <h3 className={`font-black uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm border-b pb-2 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><Sparkles size={16} className="sm:size-5" /> ASK THE ORACLE</h3>
          <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-3 sm:mb-4 ${t.textMuted}`}>Chat with your Second Brain. Uses your saved Dump notes.</p>
          <div className="flex gap-2">
            <input type="text" value={oracleQuery} onChange={(e) => setOracleQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('vault')} placeholder="QUERY..." className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
            <button onClick={() => handleAskOracle('vault')} disabled={isOracleThinking} className={`px-4 sm:px-6 font-black uppercase active:translate-y-1 transition-all disabled:opacity-50 ${t.btnPrimary}`}>{isOracleThinking ? <Circle size={18} className="sm:size-5 animate-pulse stroke-[4]" /> : <Send size={18} className="sm:size-5 stroke-[3]" />}</button>
          </div>
          {oracleResponse && <div className={`mt-4 sm:mt-6 p-4 sm:p-5 border-l-4 ${t.cardInner} ${t.borderAccent}`}><p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{oracleResponse}</p></div>}
        </div>

        <div className={`p-4 sm:p-6 ${t.card}`}>
          <div className={`flex justify-between items-center mb-3 sm:mb-4 border-b pb-2 ${t.borderAccent} opacity-80`}>
            <h3 className={`font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><BrainCircuit size={16} className="sm:size-5" /> BRAIN DUMP (INBOX)</h3>
            {isVaultSorting && <span className={`text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-1 font-black uppercase tracking-widest animate-pulse flex items-center ${t.badge} ${t.textAccent}`}><Sparkles size={10} className="inline mr-1" /> AI SORTING</span>}
          </div>
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-4 sm:mb-5 leading-relaxed ${t.textMuted}`}>Fast-capture raw ideas. Add 3 similar thoughts, and AI builds a new folder.</p>
          <div className="flex gap-2 relative">
            <button onClick={() => {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SR) { alert("Voice typing not supported."); return; }
                const rec = new SR(); rec.onstart = () => setIsListening(true);
                rec.onresult = (e) => setNewNote(p => p + (p ? " " : "") + e.results[e.resultIndex][0].transcript);
                rec.onerror = () => setIsListening(false); rec.onend = () => setIsListening(false); rec.start();
              }} className={`p-2 sm:p-3 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : t.cardInner + ' ' + t.textMuted}`}><Mic size={20} className="sm:size-6" /></button>
            <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddNote()} placeholder={isListening ? "SPEAKING..." : "RAW THOUGHT..."} className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase outline-none ${t.input} ${t.fontHeading}`} />
            <button onClick={handleAddNote} disabled={isVaultSorting} className={`px-4 sm:px-5 font-black uppercase active:translate-y-1 transition-all disabled:opacity-50 ${t.btnPrimary}`}><Send size={18} className="sm:size-5 stroke-[3]" /></button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className={`font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 px-1 ${t.textMain} ${t.fontHeading}`}><Folder size={16} className="sm:size-5" /> VAULT FOLDERS</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {brain.vaultCategories.map(cat => {
              const count = brain.vaultNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button onClick={() => setExpandedVaultCategory(cat)} className={`w-full p-4 sm:p-5 flex flex-col items-start gap-3 sm:gap-4 transition-all text-left active:translate-y-1 h-full border ${t.cardInner} hover:${t.borderAccent}`}>
                    <FolderOpen size={24} className={`sm:size-8 transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm uppercase truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Others" && <button onClick={(e) => { e.stopPropagation(); updateBrainFirebase({ vaultCategories: brain.vaultCategories.filter(c => c !== cat), vaultNotes: brain.vaultNotes.map(n => n.category === cat ? { ...n, category: "Others" } : n) }); }} className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 transition-colors ${t.textMuted} hover:text-red-500`}><Trash2 size={14} className="sm:size-4" /></button>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderHabitSettings = () => {
    if (settingsRoute === "menu") {
      return (
        <div className="space-y-6 max-w-xl mx-auto pb-20 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
            <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Command Center</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button onClick={() => setSettingsRoute("todo")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner} hover:${t.borderAccent} border border-transparent`}>
              <Edit3 className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Edit To-Do List</h2>
            </button>
            <button onClick={() => setSettingsRoute("shop")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner} hover:${t.borderAccent} border border-transparent`}>
              <ShoppingCart className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Edit Reward Shop</h2>
            </button>
            <button onClick={() => setSettingsRoute("theme")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner} hover:${t.borderAccent} border border-transparent`}>
              <Sparkles className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>App Theme Engine</h2>
            </button>
            <button onClick={() => setSettingsRoute("profile")} className={`p-5 sm:p-6 text-left group relative overflow-hidden active:scale-[0.98] ${t.cardInner} hover:${t.borderAccent} border border-transparent`}>
              <User className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-bold relative z-10 ${t.textMain} ${t.fontHeading}`}>Profile Config</h2>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-xl mx-auto pb-20 animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setSettingsRoute("menu")} className={`p-2 sm:p-3 active:scale-95 ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>
            {settingsRoute === "todo" && <><Edit3 className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Edit To-Do List</>}
            {settingsRoute === "shop" && <><ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Edit Reward Shop</>}
            {settingsRoute === "theme" && <><Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Theme Engine</>}
            {settingsRoute === "profile" && <><User className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> Profile Config</>}
          </h2>
        </div>

        {settingsRoute === "todo" && (
          <div className={`p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl ${t.card}`}>
             <h3 className={`font-bold mb-4 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest border-b-2 border-current pb-2 opacity-80 ${t.textAccent} ${t.fontHeading}`}><Edit3 className="w-5 h-5" /> Edit To-Do List</h3>
             <div className={`p-3 sm:p-4 mb-4 border border-current opacity-90 ${t.cardInner}`}>
               <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Task Heading" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors mb-2 sm:mb-3 ${t.input} ${t.fontHeading}`} />
               <input type="text" value={newDesc} onChange={(e)=>setNewDesc(e.target.value)} placeholder="Condition (e.g. 10 Pages)" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors mb-3 sm:mb-4 ${t.input} ${t.fontHeading}`} />
               <button onClick={() => {
                  if (!newTitle.trim() || !newDesc.trim()) { showMessage("Fill both!"); return; }
                  updateProfileFirebase({ customTasks: [...(profile.customTasks || DEFAULT_TASKS), { id: `t_${Date.now()}`, title: newTitle.trim(), desc: newDesc.trim(), isLocked: false }] });
                  setNewTitle(""); setNewDesc(""); showMessage("Task Added!");
               }} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-sm active:scale-[0.98] flex justify-center items-center gap-2 ${t.btnPrimary} ${t.fontHeading}`}><Plus size={16}/> ADD TASK</button>
             </div>
             <div className="space-y-2 sm:space-y-3">
               {(profile.customTasks || DEFAULT_TASKS).map(task => (
                 <RemovableTask key={task.id} task={task} t={t} onDelete={(id) => {
                    updateProfileFirebase({ customTasks: (profile.customTasks || DEFAULT_TASKS).filter(t => t.id !== id) });
                    showMessage("Deleted Safely.");
                 }} />
               ))}
             </div>
          </div>
        )}

        {settingsRoute === "shop" && (
          <div className={`p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl ${t.card}`}>
             <h3 className={`font-bold mb-4 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest border-b-2 border-current pb-2 opacity-80 ${t.textAccent} ${t.fontHeading}`}><ShoppingCart className="w-5 h-5" /> Edit Reward Shop</h3>
             <div className={`p-3 sm:p-4 mb-4 border border-current opacity-90 ${t.cardInner}`}>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                   <input type="text" value={newShopName} onChange={(e)=>setNewShopName(e.target.value)} placeholder="Name" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                   <input type="text" value={newShopIcon} onChange={(e)=>setNewShopIcon(e.target.value)} placeholder="Emoji" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                   <input type="number" value={newShopCost} onChange={(e)=>setNewShopCost(e.target.value)} placeholder="Cost" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                   <input type="number" value={newShopExpiry} onChange={(e)=>setNewShopExpiry(e.target.value)} placeholder="Expiry (Hr)" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                </div>
                <input type="text" value={newShopDesc} onChange={(e)=>setNewShopDesc(e.target.value)} placeholder="Description" className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors mb-3 sm:mb-4 ${t.input} ${t.fontHeading}`} />
                <button onClick={() => {
                  if (!newShopName.trim() || !newShopDesc.trim() || !newShopCost || !newShopExpiry || !newShopIcon.trim()) { showMessage("Fill all fields!"); return; }
                  updateProfileFirebase({ customShopItems: [...(profile.customShopItems || SHOP_ITEMS), { id: `s_${Date.now()}`, name: newShopName.trim(), desc: newShopDesc.trim(), cost: parseInt(newShopCost, 10), expiryHours: parseInt(newShopExpiry, 10), icon: newShopIcon.trim() }] });
                  setNewShopName(""); setNewShopDesc(""); setNewShopCost(""); setNewShopExpiry(""); setNewShopIcon(""); showMessage("Reward Added!");
                }} className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-sm active:scale-[0.98] flex justify-center items-center gap-2 ${t.btnPrimary} ${t.fontHeading}`}><Plus size={16}/> ADD REWARD</button>
             </div>
             <div className="space-y-2 sm:space-y-3">
               {(profile.customShopItems || SHOP_ITEMS).map(item => (
                 <RemovableShopItem key={item.id} item={item} t={t} onDelete={(id) => {
                    updateProfileFirebase({ customShopItems: (profile.customShopItems || SHOP_ITEMS).filter(s => s.id !== id) });
                 }} />
               ))}
             </div>
          </div>
        )}

        {settingsRoute === "theme" && (
          <div className={`p-4 sm:p-6 shadow-xl ${t.card}`}>
            <h3 className={`font-bold uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-2 text-[10px] sm:text-sm border-b-2 border-current pb-2 opacity-80 ${t.textAccent} ${t.fontHeading}`}>APP THEME ENGINE</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {Object.values(THEMES).map(themeOption => (
                <button key={themeOption.id} onClick={() => updateProfileFirebase({ activeTheme: themeOption.id })} className={`p-3 sm:p-4 transition-all flex flex-col items-center gap-2 sm:gap-3 cursor-pointer ${t.cardInner} ${profile.activeTheme === themeOption.id ? t.borderAccent + ' opacity-100 scale-[1.02] ring-2 ring-current' : 'opacity-70 hover:opacity-100 border-transparent'}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center border border-white/20 ${themeOption.appBg.split(' ')[0]}`}>
                     {profile.activeTheme === themeOption.id && <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${themeOption.textAccent ? themeOption.textAccent : 'text-white'}`} />}
                  </div>
                  <span className={`text-[8px] sm:text-[10px] text-center ${t.textMain} ${t.fontHeading}`}>{themeOption.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {settingsRoute === "profile" && (
          <div className={`p-4 sm:p-6 shadow-xl ${t.card}`}>
            <h3 className={`font-bold mb-2 flex items-center gap-2 text-xs sm:text-sm ${t.textMain} ${t.fontHeading}`}><Camera className="w-4 h-4 sm:w-5 sm:h-5" /> Profile Config</h3>
            <div className={`flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 p-3 sm:p-4 border border-current opacity-90 ${t.cardInner}`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-lg ${t.card} ${t.borderAccent}`}>
                {profile.dp ? <img src={profile.dp} alt="DP" className="w-full h-full object-cover" /> : <span className="text-xl sm:text-2xl">🦊</span>}
              </div>
              <div className="flex-1">
                <label className={`block w-full text-center py-2 sm:py-2.5 px-3 sm:px-4 text-[10px] sm:text-sm cursor-pointer active:scale-95 ${t.btnPrimary} ${t.fontHeading}`}>CHOOSE IMAGE<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                <p className={`text-[8px] sm:text-[10px] mt-1.5 sm:mt-2 text-center uppercase tracking-widest font-bold ${t.textMuted} ${t.fontHeading}`}>Auto-crops to circle</p>
              </div>
            </div>
            <h3 className={`font-bold mb-1.5 sm:mb-2 text-xs sm:text-sm uppercase tracking-widest ${t.textMain} ${t.fontHeading}`}>Player Name</h3>
            <input type="text" value={profile.name} onChange={(e) => updateProfileFirebase({ name: e.target.value })} className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors mb-5 sm:mb-6 ${t.input} ${t.fontHeading}`} />
            <h3 className={`font-bold mb-1.5 sm:mb-2 text-xs sm:text-sm uppercase tracking-widest ${t.textMain} ${t.fontHeading}`}>Groq API Key (AI Core)</h3>
            <input type="password" value={profile.geminiKey} onChange={(e) => updateProfileFirebase({ geminiKey: e.target.value })} placeholder="Paste API key here..." className={`w-full p-2.5 sm:p-3 text-[10px] sm:text-sm outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
        )}
      </div>
    );
  };
  const renderBrainUrge = () => (
    <div className="space-y-8 sm:space-y-10 pb-20 pt-4 text-center max-w-md mx-auto animate-in slide-in-from-right-4 duration-300">
      <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-widest flex justify-center items-center gap-2 sm:gap-3 ${t.textMain} ${t.fontHeading}`}><ShieldAlert className={`${t.textAccent} stroke-[3]`} size={28} /> INTERCEPTOR</h2>
      <p className={`font-black uppercase tracking-widest text-[9px] sm:text-[10px] px-4 sm:px-8 ${t.textMuted} ${t.fontHeading}`}>Trigger this protocol if you are about to break discipline.</p>

      {!isUrgeActive ? (
        <button onClick={triggerUrgeInterceptor} className={`w-full aspect-square max-w-[220px] sm:max-w-[280px] mx-auto border-8 active:translate-y-2 transition-all flex flex-col items-center justify-center gap-4 sm:gap-6 group mt-8 ${t.btnPrimary} ${t.fontHeading} ${t.borderAccent}`}>
          <Skull size={60} className="sm:size-20 stroke-[2] group-hover:scale-110 transition-transform" />
          <span className="font-black text-2xl sm:text-3xl uppercase tracking-widest text-center px-4">I HAVE AN URGE</span>
        </button>
      ) : (
        <div className={`p-6 sm:p-8 relative mt-8 border-4 ${t.card} ${t.borderAccent}`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${t.cardInner}`}><div className={`h-full transition-all duration-1000 ease-linear bg-current ${t.textAccent}`} style={{ width: `${(urgeTimer / 90) * 100}%` }}></div></div>
          <h3 className={`font-black mt-2 sm:mt-4 mb-4 sm:mb-6 uppercase tracking-[0.2em] text-[10px] sm:text-xs ${t.textAccent} ${t.fontHeading}`}>FRICTION ZONE ACTIVE</h3>
          <div className={`text-6xl sm:text-8xl font-black mb-6 sm:mb-8 tabular-nums tracking-tighter ${t.textMain}`}>{urgeTimer}s</div>
          <div className={`min-h-[80px] sm:min-h-[100px] flex items-center justify-center border-t pt-4 sm:pt-6 ${t.borderAccent}`}>
            <p className={`font-bold text-base sm:text-lg uppercase tracking-wider leading-relaxed px-2 ${t.textMain} ${t.fontHeading}`} key={currentQuoteIndex}>"{urgeQuotes[currentQuoteIndex] || 'STAY STRONG. DO NOT GIVE IN.'}"</p>
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // TOP BAR & APP WRAPPER
  // ==========================================
  return (
    <div className={`min-h-screen ${t.appBg} ${t.fontHeading} transition-colors duration-500 relative`}>
      {testMode && (
        <div className={`fixed top-0 left-0 w-full z-50 p-2 flex flex-wrap justify-center items-center gap-2 sm:gap-4 shadow-lg ${t.devBar} ${t.fontHeading} text-[9px] sm:text-xs`}>
          <span className="font-black tracking-widest hidden sm:inline">DEV Mode:</span>
          <button onClick={() => { const d = new Date(todayStr); d.setDate(d.getDate() - 1); setTodayStr(formatDate(d)); }} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black/20 hover:bg-black/40 border border-current active:scale-95 transition-all rounded">- DAY</button>
          
          {/* Custom Date Picker for Devs */}
          <input 
            type="date" 
            value={todayStr} 
            onChange={(e) => { if(e.target.value) setTodayStr(e.target.value); }} 
            className="px-1 sm:px-2 py-1 sm:py-1.5 bg-black/30 border border-current rounded text-inherit outline-none"
          />

          <button onClick={() => { const d = new Date(todayStr); d.setDate(d.getDate() + 1); setTodayStr(formatDate(d)); }} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black/20 hover:bg-black/40 border border-current active:scale-95 transition-all rounded">+ DAY</button>
          <button onClick={() => setTodayStr(getRealTodayStr())} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-black/20 hover:bg-black/40 border border-current active:scale-95 transition-all rounded">TODAY</button>
          
          {/* Star Boost for testing shop */}
          <button onClick={() => updateProfileFirebase({ stars: profile.stars + 50 })} className="px-2 py-1 bg-yellow-500 text-black hover:bg-yellow-400 border border-black active:scale-95 transition-all rounded font-bold">+50 ⭐</button>
        </div>
      )}

      {/* TOP BAR SWITCH */}
      <div className={`fixed ${testMode ? 'top-10 sm:top-12' : 'top-0'} left-0 w-full z-40 p-3 sm:p-4 bg-inherit backdrop-blur-sm border-b ${t.borderAccent} opacity-95 flex justify-center items-center`}>
        <div className={`flex w-full max-w-sm rounded-full p-1 border shadow-xl ${t.cardInner} ${t.borderAccent}`}>
          <button onClick={() => setAppMode("habit")} className={`flex-1 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full transition-all ${appMode === 'habit' ? t.btnPrimary : t.textMuted + ' hover:' + t.textMain}`}>HABIT OS</button>
          <button onClick={() => setAppMode("brain")} className={`flex-1 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full transition-all ${appMode === 'brain' ? t.btnPrimary : t.textMuted + ' hover:' + t.textMain}`}>SECOND BRAIN</button>
        </div>
      </div>

      <div className={`p-4 md:p-8 relative pt-24 sm:pt-28 ${testMode ? 'mt-8 sm:mt-12' : ''}`}>
        {toast && (
          <div className={`fixed top-28 sm:top-32 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 shadow-2xl z-[100] animate-bounce flex items-center gap-2 text-[10px] sm:text-sm uppercase tracking-widest ${t.badge} ${t.fontHeading}`}>
            <Check size={16} className={`sm:size-5 ${t.textAccent ? t.textAccent : 'text-current'}`} /> {toast}
          </div>
        )}
        {errorMsg && (
          <div className={`max-w-5xl mx-auto p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 shadow-lg text-[10px] sm:text-sm uppercase tracking-widest bg-red-900/80 text-white ${t.fontHeading}`}>
            <AlertTriangle size={18} className="sm:size-5 mt-0.5 flex-shrink-0" />
            <span className="flex-1 leading-relaxed">{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="hover:opacity-70 active:scale-90"><X size={16} className="sm:size-5" /></button>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {appMode === 'habit' && (
            <>
              {habitRoute === "hub" && renderHabitHub()}
              {habitRoute === "arena" && renderHabitArena()}
              {habitRoute === "tracker" && renderHabitTracker()}
              {habitRoute === "shop" && renderShop()}
              {habitRoute === "settings" && renderHabitSettings()}
              {habitRoute === "analysis" && renderAnalysis()}
              {habitRoute === "plan" && renderOngoingPlan()}
              {habitRoute === "vault" && renderVault()}
              {habitRoute === "coach" && renderCoach()}
            </>
          )}

          {appMode === 'brain' && (
            <>
              {brainTab === 'dashboard' && renderBrainDashboard()}
              {brainTab === 'study' && renderBrainStudy()}
              {brainTab === 'history' && renderBrainHistory()}
              {brainTab === 'wisdom' && renderBrainWisdom()}
              {brainTab === 'vault' && renderBrainVault()}
              {brainTab === 'urge' && renderBrainUrge()}

              {/* Night Shift Widget */}
              {isNightTime && (
                <div className="fixed bottom-24 sm:bottom-28 right-4 z-40 flex flex-col items-end">
                  {!isNightShiftOpen ? (
                    <button onClick={() => setIsNightShiftOpen(true)} className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-widest active:translate-y-1 transition-all ${t.btnWarning} ${t.fontHeading}`}><Moon size={18} className="sm:size-5 stroke-[3]" /> PLAN TOMORROW</button>
                  ) : (
                    <div className={`p-4 sm:p-6 w-[280px] sm:w-[320px] shadow-2xl border-t-4 ${t.card} ${t.borderAccent}`}>
                       <div className={`flex justify-between items-center mb-4 sm:mb-6 border-b pb-2 sm:pb-3 ${t.borderAccent} opacity-80`}>
                         <h3 className={`font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 ${t.textAccent}`}><Moon size={14} className="sm:size-4 stroke-[3]"/> NIGHT SHIFT INBOX</h3>
                         <button onClick={() => setIsNightShiftOpen(false)} className={`transition-colors ${t.textMuted} hover:text-red-500`}><X size={16} className="sm:size-5 stroke-[3]"/></button>
                       </div>
                       <p className={`text-[9px] sm:text-[10px] font-bold mb-3 sm:mb-4 ${t.textMuted}`}>Add tasks for tomorrow, or pin a queue target.</p>
                       <div className="flex gap-2 mb-4 sm:mb-6">
                         <input type="text" value={newCustomMission} onChange={(e) => setNewCustomMission(e.target.value)} onKeyPress={(e) => {
                              if(e.key === 'Enter' && newCustomMission.trim()) {
                                 updateBrainFirebase({ customMissions: [...brain.customMissions, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }] });
                                 setNewCustomMission("");
                              }
                           }} placeholder="CUSTOM TASK..." className={`flex-1 px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-xs font-black uppercase outline-none ${t.input}`} />
                         <button onClick={() => {
                              if(newCustomMission.trim()) {
                                 updateBrainFirebase({ customMissions: [...brain.customMissions, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }] });
                                 setNewCustomMission("");
                              }
                           }} className={`px-3 sm:px-4 active:translate-y-1 transition-all ${t.btnPrimary}`}><Send size={14} className="sm:size-4 stroke-[3]" /></button>
                       </div>
                       {brain.customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).length > 0 && (
                          <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
                            {brain.customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).map(m => (
                               <div key={m.id} className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 sm:px-3 py-1.5 sm:py-2 flex justify-between items-center border ${t.cardInner} ${t.textMain} ${t.borderAccent}`}>
                                 <span className="truncate pr-2">• {m.text}</span>
                                 <button onClick={() => updateBrainFirebase({ customMissions: brain.customMissions.filter(task => task.id !== m.id) })} className={`transition-colors ${t.textMuted} hover:text-red-500 shrink-0`}><Trash2 size={12} className="sm:size-3 stroke-[3]" /></button>
                               </div>
                            ))}
                          </div>
                       )}
                       {brain.stagingTopics.length > 0 && (
                         <>
                           <div className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-3 border-t pt-3 sm:pt-4 ${t.textAccent} ${t.borderAccent} opacity-80`}>PIN SYLLABUS TARGET</div>
                           <div className="space-y-1.5 sm:space-y-2 max-h-32 overflow-y-auto hide-scrollbar pr-1">
                             {brain.stagingTopics.slice(0, 3).map((topic, idx) => (
                               <button key={topic.id} onClick={() => {
                                   const items = [...brain.stagingTopics]; const clickedItem = items.splice(idx, 1)[0]; items.unshift(clickedItem);
                                   updateBrainFirebase({ stagingTopics: items });
                                 }} className={`w-full text-left p-2 sm:p-3 transition-colors flex items-center justify-between group border ${t.cardInner} hover:${t.borderAccent}`}>
                                 <span className={`font-black text-[9px] sm:text-[10px] uppercase truncate pr-2 tracking-widest ${t.textMain}`}>{topic.title}</span>
                                 <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${t.badge} ${t.textAccent}`}>PIN</span>
                               </button>
                             ))}
                           </div>
                         </>
                       )}
                    </div>
                  )}
                </div>
              )}

              {/* Second Brain Bottom Nav */}
              <div className={`fixed bottom-0 left-0 w-full border-t-2 z-50 overflow-x-auto hide-scrollbar ${t.header} ${t.borderAccent}`}>
                <div className="max-w-2xl mx-auto flex justify-between px-1 sm:px-2 py-2 sm:py-3 min-w-[320px]">
                  {[{ id: 'dashboard', icon: CalendarIcon, label: 'MISSION' }, { id: 'study', icon: Activity, label: 'QUEUE' }, { id: 'history', icon: History, label: 'HISTORY' }, { id: 'wisdom', icon: Folder, label: 'WISDOM' }, { id: 'vault', icon: BrainCircuit, label: 'DUMP' }, { id: 'urge', icon: ShieldAlert, label: 'URGE' }].map(tab => (
                    <button key={tab.id} onClick={() => setBrainTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-2 transition-colors border-b-2 ${brainTab === tab.id ? t.textAccent + ' border-current' : t.textMuted + ' border-transparent hover:' + t.textMain}`}>
                      <tab.icon size={20} className={`sm:size-[22px] ${brainTab === tab.id ? 'stroke-[2.5]' : 'stroke-2'}`} />
                      <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
