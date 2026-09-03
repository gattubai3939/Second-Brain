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
  ShieldAlert, Mic, Clock
} from "lucide-react";

declare const __initial_auth_token: any;

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
// UTILS & DEFENSIVE PARSERS
// ==========================================
const getRealTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = (d: Date): string => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const addDays = (dateStr: string, days: number): string => {
  const parts = dateStr.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2] + days);
  return formatDate(date);
};

const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn("Storage parse error, fallback used:", e);
    return fallback;
  }
};

const extractJsonFromAiResponse = <T,>(rawText: string, fallback: T): T => {
  if (!rawText) return fallback;
  try {
    const clean = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const jsonStr = match ? match[0] : clean;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("Failed to extract JSON from AI response:", e);
    return fallback;
  }
};

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
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startLongPress) {
      timerId = setTimeout(() => {
        callbackRef.current();
      }, ms);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [ms, startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
    onTouchCancel: () => setStartLongPress(false)
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
  const [trackerData, setTrackerData] = useState(() => safeJsonParse<Record<string, any>>(localStorage.getItem('apex_tracker_v5'), {}));
  const [profile, setProfile] = useState(() => {
    const local = safeJsonParse<Record<string, any>>(localStorage.getItem('apex_profile_v5'), {});
    const oldV4 = safeJsonParse<Record<string, any>>(localStorage.getItem('apexMindData_Final_V4'), {});

    return {
      name: local.name || oldV4.userName || "Prateek Maurya",
      stars: typeof local.stars === "number" ? local.stars : 0,
      geminiKey: local.geminiKey || oldV4.groqKey || "",
      inventory: Array.isArray(local.inventory) ? local.inventory : [],
      dp: local.dp || oldV4.profilePic || "",
      activeTheme: local.activeTheme || oldV4.activeTheme || "brutalist",
      customTasks: Array.isArray(local.customTasks) && local.customTasks.length > 0 ? local.customTasks : DEFAULT_TASKS,
      customShopItems: Array.isArray(local.customShopItems) && local.customShopItems.length > 0 ? local.customShopItems : SHOP_ITEMS
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
    const local = safeJsonParse<Record<string, any>>(localStorage.getItem('apex_brain_v5'), {});
    const oldV4 = safeJsonParse<Record<string, any>>(localStorage.getItem('apexMindData_Final_V4'), {});

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
      setTrackerData((prev) => {
        const dataMap = { ...prev };
        let changed = false;
        snapshot.forEach((docSnap) => {
          if (!dataMap[docSnap.id] || JSON.stringify(dataMap[docSnap.id]) !== JSON.stringify(docSnap.data())) {
            dataMap[docSnap.id] = docSnap.data();
            changed = true;
          }
        });
        if (changed) {
          try {
            localStorage.setItem('apex_tracker_v5', JSON.stringify(dataMap));
          } catch (e) {
            console.warn("Storage write error:", e);
          }
          return dataMap;
        }
        return prev;
      });
    });

    const profileRef = doc(db, "artifacts", appId, "users", user.uid, "rpg_profile", "data");
    const unsubsProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.customTasks || data.customTasks.length === 0) data.customTasks = DEFAULT_TASKS;
        if (!data.customShopItems || data.customShopItems.length === 0) data.customShopItems = SHOP_ITEMS;
        setProfile((prev) => {
          const merged = { ...prev, ...data };
          try {
            localStorage.setItem('apex_profile_v5', JSON.stringify(merged));
          } catch (e) {
            console.warn("Storage write error:", e);
          }
          return merged;
        });
      } else {
        setProfile((currentProfile) => {
          setDoc(profileRef, currentProfile);
          return currentProfile;
        });
      }
    });

    const brainRef = doc(db, "artifacts", appId, "users", user.uid, "second_brain", "data");
    const unsubsBrain = onSnapshot(brainRef, (docSnap) => {
      if (docSnap.exists()) {
        setBrain((prev) => {
          const merged = { ...prev, ...docSnap.data() };
          try {
            localStorage.setItem('apex_brain_v5', JSON.stringify(merged));
          } catch (e) {
            console.warn("Storage write error:", e);
          }
          return merged;
        });
      } else {
        setBrain((currentBrain) => {
          setDoc(brainRef, currentBrain);
          return currentBrain;
        });
      }
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
      const dOld = new Date(parseInt(partsOld[0]), parseInt(partsOld[1]) - 1, parseInt(partsOld[2]));
      const dNow = new Date(parseInt(partsNow[0]), parseInt(partsNow[1]) - 1, parseInt(partsNow[2]));
      const diffDays = Math.floor((dNow.getTime() - dOld.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        updateBrainFirebase({
          globalDeadlineDays: Math.max(1, brain.globalDeadlineDays - diffDays),
          lastActiveDate: todayStr
        });
      }
    }
  }, [brain.lastActiveDate, todayStr]);

  const toastTimerRef = useRef<any>(null);
  const showMessage = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  };

  // ==========================================
  // DUAL SAVE WRAPPERS
  // ==========================================
  const updateProfileFirebase = async (updates: any) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    try {
      localStorage.setItem('apex_profile_v5', JSON.stringify(newProfile));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    if (user && db) { await setDoc(doc(db, "artifacts", appId, "users", user.uid, "rpg_profile", "data"), newProfile, { merge: true }); }
  };

  const updateBrainFirebase = async (updates: any) => {
    const newBrain = { ...brain, ...updates };
    setBrain(newBrain);
    try {
      localStorage.setItem('apex_brain_v5', JSON.stringify(newBrain));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    if (user && db) { await setDoc(doc(db, "artifacts", appId, "users", user.uid, "second_brain", "data"), newBrain, { merge: true }); }
  };

  const saveDayData = async (dateStr: string, tasks: any, reason?: string, summary?: string, star?: boolean, snapshot?: any) => {
    const updatedDay = { tasks, reasonForO: reason || "", summary: summary || "", star: !!star, taskSnapshot: snapshot || (profile.customTasks || DEFAULT_TASKS) };
    const newTrackerData = { ...trackerData, [dateStr]: updatedDay };
    setTrackerData(newTrackerData);
    try {
      localStorage.setItem('apex_tracker_v5', JSON.stringify(newTrackerData));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
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

  const handleImageUpload = (e: any) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image too large! Max 5MB allowed. 📸");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            showMessage("Canvas context unavailable.");
            return;
          }
          let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
          if (img.width > img.height) {
            sourceWidth = img.height;
            sourceX = (img.width - img.height) / 2;
          } else {
            sourceHeight = img.width;
            sourceY = (img.height - img.width) / 2;
          }
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);
          updateProfileFirebase({ dp: canvas.toDataURL("image/jpeg", 0.8) });
          showMessage("Profile Picture Updated! 📸");
        } catch (err) {
          console.error("Canvas processing error:", err);
          showMessage("Error processing image.");
        }
      };
      img.onerror = () => {
        showMessage("Failed to load image file.");
      };
      img.src = (event.target?.result as string) || "";
    };
    reader.onerror = () => {
      showMessage("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const checkPunishment = () => {
    const data1 = trackerData[addDays(todayStr, -1)];
    const data2 = trackerData[addDays(todayStr, -2)];
    const hasFail1 = data1 && Object.values(data1.tasks || {}).includes("O");
    const hasFail2 = data2 && Object.values(data2.tasks || {}).includes("O");
    return !!(hasFail1 && hasFail2);
  };
  const isPunished = checkPunishment();

  const checkPerfectDayBonus = (dateStr: string, tasks: any, totalActiveTasks: number) => {
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

  let cachedGeminiModels: { apiVersion: string; modelName: string }[] | null = null;

  const fetchAvailableGeminiModels = async (key: string): Promise<{ apiVersion: string; modelName: string }[]> => {
    if (cachedGeminiModels && cachedGeminiModels.length > 0) {
      return cachedGeminiModels;
    }

    const versions = ["v1beta", "v1"];
    const foundModels: { apiVersion: string; modelName: string }[] = [];

    for (const ver of versions) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${key}`);
        const data = await res.json();
        if (res.ok && data.models && Array.isArray(data.models)) {
          const valid = data.models
            .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map((m: any) => ({
              apiVersion: ver,
              modelName: m.name.replace(/^models\//, "")
            }));

          // Sort flash models to the top
          valid.sort((a: any, b: any) => {
            const aFlash = a.modelName.toLowerCase().includes("flash") ? 1 : 0;
            const bFlash = b.modelName.toLowerCase().includes("flash") ? 1 : 0;
            return bFlash - aFlash;
          });

          foundModels.push(...valid);
        }
      } catch (e) {
        console.warn(`[Gemini API] Failed to list models for ${ver}:`, e);
      }
    }

    if (foundModels.length > 0) {
      cachedGeminiModels = foundModels;
      return foundModels;
    }

    // Static fallback list if ListModels is restricted
    return [
      { apiVersion: "v1beta", modelName: "gemini-1.5-flash" },
      { apiVersion: "v1beta", modelName: "gemini-1.5-flash-latest" },
      { apiVersion: "v1beta", modelName: "gemini-2.0-flash" },
      { apiVersion: "v1beta", modelName: "gemini-2.0-flash-exp" },
      { apiVersion: "v1", modelName: "gemini-1.5-flash" },
      { apiVersion: "v1", modelName: "gemini-pro" }
    ];
  };

  const callGeminiApi = async (apiKey: string, contents: any[], systemInstruction = "", responseJson = false) => {
    if (!apiKey) throw new Error("API Key is missing.");
    const key = apiKey.trim().replace(/^["']|["']$/g, '');

    const candidateModels = await fetchAvailableGeminiModels(key);
    let lastError: any = null;

    for (const { apiVersion, modelName } of candidateModels) {
      try {
        const payload: any = { contents };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        if (responseJson) {
          payload.generationConfig = {
            responseMimeType: "application/json"
          };
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          const errMsg = data?.error?.message || `HTTP Error ${response.status}`;
          if (
            (data?.error?.status === "INVALID_ARGUMENT" && errMsg.toLowerCase().includes("api key not valid")) ||
            errMsg.toLowerCase().includes("api key not valid") ||
            response.status === 401
          ) {
            throw new Error("Invalid API key. Please verify your Google Gemini API key in Command Center.");
          }

          // If systemInstruction or generationConfig was rejected, try fallback with inline instruction
          if (systemInstruction && (errMsg.includes("systemInstruction") || errMsg.includes("system_instruction") || response.status === 400)) {
            const modifiedContents = JSON.parse(JSON.stringify(contents));
            if (modifiedContents.length > 0 && modifiedContents[0].parts && modifiedContents[0].parts.length > 0) {
              modifiedContents[0].parts[0].text = `[System Instructions: ${systemInstruction}]\n\n` + modifiedContents[0].parts[0].text;
            }
            const retryPayload: any = { contents: modifiedContents };
            if (responseJson) retryPayload.generationConfig = { responseMimeType: "application/json" };

            const retryRes = await fetch(`https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${key}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(retryPayload)
            });
            const retryData = await retryRes.json();
            if (retryRes.ok && !retryData.error) {
              const text = retryData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text !== undefined && text !== null) return text;
            }
          }

          console.warn(`[Gemini API] ${apiVersion}/${modelName} failed:`, errMsg);
          throw new Error(errMsg);
        }

        const candidate = data?.candidates?.[0];
        if (candidate?.finishReason === "SAFETY") {
          throw new Error("Response was blocked due to safety guidelines.");
        }

        const text = candidate?.content?.parts?.[0]?.text;
        if (text !== undefined && text !== null) {
          return text;
        }
      } catch (err: any) {
        if (err.message && err.message.includes("Invalid API key")) {
          throw err;
        }
        lastError = err;
      }
    }

    cachedGeminiModels = null;
    throw lastError || new Error("Gemini API call failed");
  };

  const askCoach = async () => {
    if (!chatInput.trim()) return;
    if (!profile.geminiKey) { showMessage("Please enter your Gemini API Key in Command Center first!"); setHabitRoute("settings"); return; }

    const userMessage = { role: "user", text: chatInput };
    const todayTasks = trackerData[todayStr]?.tasks || {};
    const todayCompleted = Object.values(todayTasks).filter((v) => v === "X").length;
    const activePerks = (profile.inventory || []).filter((i) => i.status === "active").map((i) => i.name).join(", ") || "None";

    const systemPrompt = `You are a wise Habit Coach for ${profile.name}.
    Status: ${profile.stars} Stars, Perfect Streak: ${streaks.perfect}, Study Streak: ${streaks.study}, Progress: ${todayCompleted}/${(profile.customTasks || DEFAULT_TASKS).length}. Perks: ${activePerks}.
    Keep it impactful, firm yet caring.`;

    // Build properly alternating history without error notices or leading assistant messages
    const formattedHistory: any[] = [];
    for (const msg of chatMessages) {
      if (msg.role === "ai" && (msg.text.startsWith("Coach is offline") || msg.text.startsWith("I am your Habit Tracker Coach"))) {
        continue;
      }
      if (msg.role === "user") {
        if (formattedHistory.length === 0 || formattedHistory[formattedHistory.length - 1].role === "model") {
          formattedHistory.push({ role: "user", parts: [{ text: msg.text }] });
        } else {
          formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + msg.text;
        }
      } else if (msg.role === "ai" && formattedHistory.length > 0) {
        if (formattedHistory[formattedHistory.length - 1].role === "user") {
          formattedHistory.push({ role: "model", parts: [{ text: msg.text }] });
        }
      }
    }

    if (formattedHistory.length === 0 || formattedHistory[formattedHistory.length - 1].role === "model") {
      formattedHistory.push({ role: "user", parts: [{ text: userMessage.text }] });
    } else {
      formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + userMessage.text;
    }

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const reply = await callGeminiApi(profile.geminiKey, formattedHistory, systemPrompt, false);
      setChatMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (e: any) {
      console.error("Coach Error:", e);
      setChatMessages((prev) => [...prev, { role: "ai", text: `Coach is offline (${e?.message || "Check API Key or connection"}).` }]);
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

      const rawJson = await callGeminiApi(
        profile.geminiKey,
        [{ role: "user", parts: [{ text: prompt }] }],
        "You are an AI brain sorter. Respond with valid JSON only.",
        true
      );

      const aiResponse = extractJsonFromAiResponse<{ assignedCategory?: string; extractedIdsFromOthers?: string[] }>(rawJson, {});

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

  const handleAskOracle = async (querySource: any) => {
    if (!profile.geminiKey) { setOracleResponse("ERROR: API KEY MISSING. CONFIGURE IN COMMAND CENTER."); return; }
    if (!oracleQuery.trim()) return;
    setIsOracleThinking(true); setOracleResponse("");

    try {
      const allNotes = [...brain.wisdomNotes.map(n => `[Wisdom: ${n.category}] ${n.text}`), ...brain.vaultNotes.map(n => `[Dump: ${n.category}] ${n.text}`)].join("\n");
      const prompt = `You are "The Oracle", an AI synthesizing the user's notes. Knowledge Base: ${allNotes}. Question: "${oracleQuery}".
      RULES: 1. Answer strictly based on Knowledge Base. 2. Keep it concise, punchy, actionable.`;

      const responseText = await callGeminiApi(
        profile.geminiKey,
        [{ role: "user", parts: [{ text: prompt }] }],
        "You are The Oracle. Answer strictly based on the provided knowledge base."
      );
      setOracleResponse(responseText);
    } catch (error: any) {
      console.error("Oracle Error:", error);
      setOracleResponse(`CONNECTION DISRUPTED: ${error?.message || "Check Gemini API key."}`);
    }
    setIsOracleThinking(false);
  };

  // Urge Countdown Timer
  useEffect(() => {
    if (!isUrgeActive) return;
    if (urgeTimer === 0) {
      setIsUrgeActive(false);
      return;
    }
    const timer = setInterval(() => {
      setUrgeTimer((prev: any) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isUrgeActive, urgeTimer]);

  // Urge Quote Rotation (Rotates every 7 seconds smoothly)
  useEffect(() => {
    if (!isUrgeActive || urgeQuotes.length === 0) return;
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % urgeQuotes.length);
    }, 7000);
    return () => clearInterval(quoteInterval);
  }, [isUrgeActive, urgeQuotes.length]);

  const triggerUrgeInterceptor = async () => {
    setIsUrgeActive(true);
    setUrgeTimer(90);
    setCurrentQuoteIndex(0);
    const defQuotes = [
      "Don't trade long-term goals for cheap dopamine. Breathe.",
      "Pain of discipline > Pain of regret.",
      "Your brain is lying to you right now. Stand your ground.",
      "You survived 100% of bad days. This will pass."
    ];
    setUrgeQuotes(defQuotes);
    if (profile.geminiKey) {
      try {
        const prompt = "Generate exactly 10 short, brutal motivational sentences (max 15 words) to stop streak break. Output JSON array of strings: [\"s1\", \"s2\"]";
        const rawJson = await callGeminiApi(
          profile.geminiKey,
          [{ role: "user", parts: [{ text: prompt }] }],
          "Respond strictly with a JSON array of strings.",
          true
        );
        const aiQuotes = extractJsonFromAiResponse<any>(rawJson, null);
        if (Array.isArray(aiQuotes) && aiQuotes.length > 0) {
          setUrgeQuotes(aiQuotes);
        } else if (typeof aiQuotes === "object" && aiQuotes !== null) {
          const firstVal = Object.values(aiQuotes)[0];
          if (Array.isArray(firstVal) && firstVal.length > 0) {
            setUrgeQuotes(firstVal as string[]);
          }
        }
      } catch (e) {
        console.error("AI Quote failed", e);
      }
    }
  };

  // ==========================================
  // HABIT RENDERERS
  // ==========================================
  const renderHabitHub = () => {
    const currentLvl = Math.floor(profile.stars / 10) + 1;
    const currentLvlStars = (currentLvl - 1) * 10;
    const starsInLvl = profile.stars - currentLvlStars;
    const lvlProgress = Math.min(100, Math.max(0, (starsInLvl / 10) * 100));

    return (
      <div className="space-y-6 sm:space-y-8 pb-10 animate-in fade-in zoom-in duration-300">
        {/* HERO PROFILE & XP PROGRESS CARD */}
        <div className={`p-5 sm:p-7 relative overflow-hidden shadow-2xl transition-all ${t.header} border-2 ${t.borderAccent}`}>
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3 sm:gap-5 flex-shrink min-w-0">
              <div className={`w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-lg transition-transform duration-300 hover:scale-105 ${t.borderAccent} ring-2 ring-current ring-offset-2 ring-offset-black/40`}>
                {profile.dp ? (
                  <img src={profile.dp} alt="User DP" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl animate-bounce-subtle">🦊</span>
                )}
              </div>
              <div className="min-w-0 overflow-hidden">
                <h1 className={`text-lg sm:text-3xl font-black truncate tracking-tight ${t.textMain} ${t.fontHeading}`}>{profile.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] sm:text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.badge} ${t.fontHeading}`}>
                    {playerTitle}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${t.textAccent} ${t.fontHeading}`}>
                    Level {currentLvl}
                  </span>
                </div>
              </div>
            </div>

            {/* Star Counter Pill with Glow */}
            <div className={`px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl flex items-center gap-2 sm:gap-3 flex-shrink-0 shadow-lg border glow-gold-pulse tap-effect cursor-pointer ${t.cardInner} ${t.borderAccent}`}>
              <span className="text-xl sm:text-3xl animate-float">⭐</span>
              <div className="text-right">
                <span className={`text-xl sm:text-3xl font-black block leading-none ${t.textWarning} ${t.fontHeading}`}>{profile.stars}</span>
                <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${t.textMuted}`}>Stars Wallet</span>
              </div>
            </div>
          </div>

          {/* Dynamic XP Progress Bar */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-current/20">
            <div className="flex justify-between items-center text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              <span className={`flex items-center gap-1.5 ${t.textMain}`}>
                <Sparkles size={13} className={t.textAccent} /> Level {currentLvl} Mastery Progress
              </span>
              <span className={t.textAccent}>{starsInLvl} / 10 ⭐ ({lvlProgress}%)</span>
            </div>
            <div className={`w-full h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border ${t.cardInner} ${t.borderAccent}`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out animate-shimmer ${t.btnPrimary}`}
                style={{ width: `${Math.max(4, lvlProgress)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 8 FEATURE ACTION TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
          <button onClick={() => setHabitRoute("arena")} className={`p-5 sm:p-6 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-xl border ${t.cardInner} hover:${t.borderAccent}`}>
            <Swords className={`absolute -right-4 -bottom-4 w-28 h-28 sm:w-36 sm:h-36 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 ${t.textAccent}`} />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-md border ${t.card} ${t.borderAccent}`}>
              <Swords className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${t.textAccent} group-hover:${t.textMain}`} />
            </div>
            <h2 className={`text-lg sm:text-2xl font-black relative z-10 tracking-tight ${t.textMain} ${t.fontHeading}`}>Enter Arena</h2>
            <p className={`text-[10px] sm:text-sm mt-1 relative z-10 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Execute daily tasks & conquer calendar levels.</p>
          </button>

          <button onClick={() => setHabitRoute("shop")} className={`p-5 sm:p-6 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-xl border ${t.cardInner} hover:${t.borderAccent}`}>
            <ShoppingCart className={`absolute -right-4 -bottom-4 w-28 h-28 sm:w-36 sm:h-36 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 ${t.textAccent}`} />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-md border ${t.card} ${t.borderAccent}`}>
              <ShoppingCart className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${t.textAccent} group-hover:${t.textMain}`} />
            </div>
            <h2 className={`text-lg sm:text-2xl font-black relative z-10 tracking-tight ${t.textMain} ${t.fontHeading}`}>Reward Shop</h2>
            <p className={`text-[10px] sm:text-sm mt-1 relative z-10 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Spend earned stars on guilt-free perks.</p>
          </button>

          <button onClick={() => setHabitRoute("analysis")} className={`col-span-1 sm:col-span-2 p-5 sm:p-6 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-xl border ${t.cardInner} hover:${t.borderAccent}`}>
            <BarChart2 className={`absolute -right-4 -bottom-4 w-32 h-32 sm:w-44 sm:h-44 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 ${t.textAccent}`} />
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg border transition-transform group-hover:scale-105 ${t.card} ${t.borderAccent}`}>
                <BarChart2 className={`w-7 h-7 sm:w-9 sm:h-9 ${t.textAccent}`} />
              </div>
              <div>
                <h2 className={`text-base sm:text-2xl font-black tracking-tight ${t.textMain} ${t.fontHeading}`}>Performance Analytics</h2>
                <p className={`text-[10px] sm:text-sm mt-0.5 sm:mt-1 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Track perfect day streaks, completion ratios & weekly trends.</p>
              </div>
            </div>
          </button>

          <button onClick={() => setHabitRoute("plan")} className={`p-5 sm:p-6 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-xl border ${t.cardInner} hover:${t.borderAccent}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-md border ${t.card} ${t.borderAccent}`}>
              <Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} />
            </div>
            <h2 className={`text-sm sm:text-lg font-black relative z-10 tracking-tight ${t.textMain} ${t.fontHeading}`}>Ongoing Plan</h2>
            <p className={`text-[9px] sm:text-xs mt-1 relative z-10 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Active perks, countdown timers & history log.</p>
          </button>

          <button onClick={() => setHabitRoute("coach")} className={`p-5 sm:p-6 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-xl border ${t.cardInner} hover:${t.borderAccent}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-md border ${t.card} ${t.borderAccent}`}>
              <Bot className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} />
            </div>
            <h2 className={`text-sm sm:text-lg font-black relative z-10 tracking-tight ${t.textMain} ${t.fontHeading}`}>AI Habit Coach</h2>
            <p className={`text-[9px] sm:text-xs mt-1 relative z-10 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Your personal AI discipline strategist & mentor.</p>
          </button>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <button onClick={() => setHabitRoute("vault")} className={`p-4 sm:p-5 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-lg flex items-center justify-center sm:justify-start gap-3.5 border ${t.cardInner} hover:${t.borderAccent}`}>
              <div className={`p-2.5 rounded-xl border ${t.card} ${t.borderAccent}`}>
                <Download className={`w-5 h-5 ${t.textAccent}`} />
              </div>
              <div>
                <span className={`text-xs sm:text-sm font-black block ${t.textMain} ${t.fontHeading}`}>Data Vault</span>
                <span className={`text-[8px] sm:text-[10px] ${t.textMuted}`}>Export dark HTML & backup</span>
              </div>
            </button>

            <button onClick={() => setHabitRoute("settings")} className={`p-4 sm:p-5 text-left group relative overflow-hidden tap-effect hover-lift rounded-2xl shadow-lg flex items-center justify-center sm:justify-start gap-3.5 border ${t.cardInner} hover:${t.borderAccent}`}>
              <div className={`p-2.5 rounded-xl border ${t.card} ${t.borderAccent}`}>
                <Settings className={`w-5 h-5 ${t.textAccent}`} />
              </div>
              <div>
                <span className={`text-xs sm:text-sm font-black block ${t.textMain} ${t.fontHeading}`}>Command Center</span>
                <span className={`text-[8px] sm:text-[10px] ${t.textMuted}`}>Custom tasks, themes & keys</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHabitArena = () => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="space-y-6 pb-20 max-w-xl mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Swords className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Level Map</h2>
        </div>

        {isEraserActive && (
          <div className="bg-red-900/80 text-white font-bold p-3.5 sm:p-4 text-[10px] sm:text-sm text-center rounded-2xl border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
            🧽 THE ERASER ARMED: Click on any past date marked with <span className="text-red-300 bg-red-950 px-1.5 py-0.5 rounded-md font-black mx-1">FIX</span> to rewrite history.
          </div>
        )}

        <div className={`p-4 sm:p-6 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); } else setCalMonth((m) => m - 1); }} className={`p-2 sm:p-2.5 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <h2 className={`text-sm sm:text-lg font-black uppercase tracking-wider ${t.textMain} ${t.fontHeading}`}>{monthNames[calMonth]} {calYear}</h2>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); } else setCalMonth((m) => m + 1); }} className={`p-2 sm:p-2.5 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></button>
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

              let bgColor = t.cardInner.split(' ')[0] + ' opacity-60';
              let textColor = t.textMuted; let borderClass = 'border border-white/5';
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

                  if (t4Failed) { bgColor = "bg-red-500/20"; borderClass = "border border-red-500/60"; textColor = "text-red-400 font-bold"; }
                  else {
                    if (xCount >= majority) { bgColor = "bg-green-500/20"; borderClass = "border border-green-500/60 shadow-[0_0_10px_rgba(34,197,94,0.3)]"; textColor = "text-green-400 font-black"; }
                    else { bgColor = "bg-red-500/20"; borderClass = "border border-red-500/60"; textColor = "text-red-400 font-bold"; }
                  }
                }
              }

              if (isDayToday) { bgColor = t.btnPrimary.split(' ')[0]; borderClass = `border-2 ${t.borderAccent} ring-2 ring-yellow-400/50 shadow-lg`; textColor = "text-white font-black"; }
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
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 ${t.fontHeading} ${isFuture ? "opacity-25 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95 tap-effect"} ${bgColor} ${borderClass} ${textColor} ${showFixBadge ? "ring-2 ring-red-500 scale-105 z-10" : ""}`}
                >
                  {showFixBadge && <span className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 text-[7px] sm:text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse z-20">FIX</span>}
                  {dayData && dayData.star && <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-[8px] sm:text-[10px] text-yellow-400">★</span>}
                  <span className="text-[10px] sm:text-sm z-10">{day}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => { setSelectedDate(todayStr); const [y, m] = todayStr.split("-"); setCalYear(parseInt(y)); setCalMonth(parseInt(m) - 1); setUnlockedBlankDate(null); setHabitRoute("tracker"); }} className={`w-full mt-5 sm:mt-7 py-3 text-[10px] sm:text-sm tap-effect rounded-2xl flex justify-center items-center font-black uppercase tracking-wider ${t.btnPrimary} ${t.fontHeading}`}>JUMP TO TODAY'S LEVEL</button>
        </div>
      </div>
    );
  };

  const renderHabitTracker = () => {
    const isToday = selectedDate === todayStr; const isPast = selectedDate < todayStr;
    const isBlankDayUnlocked = isPast && unlockedBlankDate === selectedDate;
    const currentDayData = trackerData[selectedDate] || { tasks: {}, reasonForO: "", summary: "", taskSnapshot: null };

    let activeTasksToDisplay = (isToday || isBlankDayUnlocked) ? (profile.customTasks || DEFAULT_TASKS) : (currentDayData.taskSnapshot || DEFAULT_TASKS);
    const currentTaskVals = Object.values(currentDayData.tasks);
    const xCount = currentTaskVals.filter((v) => v === "X").length;
    const maxTasks = activeTasksToDisplay.length;
    const progressPercent = Math.round((xCount / maxTasks) * 100) || 0;

    const t4FailedTracker = currentDayData.tasks?.t4 === "O";
    const majorityTracker = Math.floor(maxTasks / 2) + 1;
    let progressColor = "bg-gray-500/50";
    if (currentTaskVals.length > 0) {
      if (t4FailedTracker) progressColor = "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
      else progressColor = xCount >= majorityTracker ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-red-500";
    }

    return (
      <div className="space-y-6 pb-20 max-w-2xl mx-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => { setHabitRoute("arena"); setUnlockedBlankDate(null); }} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-black ${t.textMain} ${t.fontHeading}`}>{selectedDate}</h2>
          {isToday && <span className={`text-[8px] sm:text-[10px] px-2.5 py-1 font-black tracking-widest uppercase rounded-full ${t.badge} ${t.textAccent} ${t.fontHeading}`}>Active Level</span>}
        </div>

        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${isPunished ? 'border-red-500/60 bg-red-950/20' : t.borderAccent}`}>
          {/* Progress Header */}
          <div className="mb-5 sm:mb-6">
            <div className={`flex justify-between text-[10px] sm:text-xs font-black mb-2 uppercase tracking-wider ${t.textMain} ${t.fontHeading}`}>
              <span className={`flex items-center gap-1.5 ${t.textMuted}`}><Target size={14} className={t.textAccent} /> Daily Completion</span>
              <span className={t.textAccent}>{xCount} / {maxTasks} ({progressPercent}%)</span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${t.cardInner} ${t.borderAccent}`}>
              <div className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`} style={{ width: `${Math.max(3, progressPercent)}%` }}></div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {activeTasksToDisplay.map((task) => {
              const status = currentDayData.tasks[task.id];
              const canInteract = isToday || (isPast && isEraserActive && status === "O") || isBlankDayUnlocked;
              const displayTitle = isPunished ? `${task.title} (PUNISHED)` : task.title;
              let taskBg = status === "X" ? "bg-green-500/10 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : status === "O" ? "bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : `${t.cardInner} border-white/5`;

              return (
                <div key={task.id} className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all hover:scale-[1.01] ${taskBg}`}>
                  <div className="pr-3">
                    <h3 className={`text-xs sm:text-sm font-black ${isPunished ? 'text-red-400' : t.textMain} ${t.fontHeading}`}>{displayTitle}</h3>
                    <p className={`text-[9px] sm:text-xs mt-0.5 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>{task.desc}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTaskClick(task.id, "X", activeTasksToDisplay)}
                      disabled={!canInteract}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all tap-effect border ${t.cardInner} ${status === "X" ? "bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105" : t.textMuted} ${!canInteract && status !== "X" ? "opacity-30 cursor-not-allowed" : "hover:border-green-400"}`}
                    >
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => handleTaskClick(task.id, "O", activeTasksToDisplay)}
                      disabled={!(isToday || isBlankDayUnlocked)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all tap-effect border ${t.cardInner} ${status === "O" ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105" : t.textMuted} ${!(isToday || isBlankDayUnlocked) && status !== "O" ? "opacity-30 cursor-not-allowed" : "hover:border-red-400"}`}
                    >
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Willpower Star Claim Box */}
          <div className={`mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${t.cardInner} ${currentDayData.star ? 'border-yellow-400 bg-yellow-400/10 glow-gold-pulse' : 'border-white/10'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-float">⭐</span>
              <div>
                <h3 className={`text-xs sm:text-sm font-black ${t.textMain} ${t.fontHeading}`}>Willpower Star</h3>
                <p className={`text-[9px] sm:text-xs mt-0.5 ${t.textMuted} ${t.fontHeading}`}>Crushed an urge today? Claim +1 Star.</p>
              </div>
            </div>
            <button
              onClick={() => handleStarClick(activeTasksToDisplay)}
              disabled={!(isToday || isBlankDayUnlocked)}
              className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase rounded-xl transition-all tap-effect ${currentDayData.star ? 'bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : t.btnWarning} ${!(isToday || isBlankDayUnlocked) && "opacity-50"} ${t.fontHeading}`}
            >
              {currentDayData.star ? "CLAIMED ★" : "CLAIM +1 ★"}
            </button>
          </div>
        </div>

        {/* Daily Summary Card */}
        <div className={`p-4 sm:p-6 rounded-3xl shadow-xl border ${t.cardInner} ${t.borderAccent}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-black flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider ${t.textAccent} ${t.fontHeading}`}><BookOpen size={16} /> Daily Reflection & Notes</h3>
            <button onClick={() => { saveDayData(selectedDate, currentDayData.tasks, currentDayData.reasonForO, summaryInput, currentDayData.star, activeTasksToDisplay); showMessage("Summary Saved! 📝"); }} disabled={!(isToday || isBlankDayUnlocked)} className={`px-3 py-1.5 text-[9px] sm:text-xs font-black uppercase rounded-lg tap-effect ${t.btnPrimary} ${t.fontHeading}`}>SAVE</button>
          </div>
          <textarea disabled={!(isToday || isBlankDayUnlocked)} value={summaryInput} onChange={(e) => setSummaryInput(e.target.value)} onBlur={() => saveDayData(selectedDate, currentDayData.tasks, currentDayData.reasonForO, summaryInput, currentDayData.star, activeTasksToDisplay)} placeholder="Write your thoughts, victory or confession for this level..." className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} rows={3} />
        </div>
      </div>
    );
  };

  const renderShop = () => (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Reward Shop</h2>
      </div>

      <div className={`p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl border glow-gold-pulse ${t.cardInner} ${t.borderAccent}`}>
        <div>
          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest block ${t.textMuted} ${t.fontHeading}`}>Available Stars Balance:</span>
          <span className={`text-[9px] sm:text-[10px] ${t.textMuted}`}>Earn stars by completing full day levels</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl animate-float">⭐</span>
          <span className={`font-black text-2xl sm:text-3xl ${t.textWarning} ${t.fontHeading}`}>{profile.stars}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {(profile.customShopItems || SHOP_ITEMS).map((item) => (
          <div key={item.id} className={`p-5 sm:p-6 rounded-3xl flex flex-col justify-between transition-all shadow-xl border tap-effect hover-lift ${t.cardInner} hover:${t.borderAccent}`}>
            <div className="flex items-start gap-4 mb-4">
              <span className={`text-3xl sm:text-4xl p-3 rounded-2xl shadow-md border ${t.card} ${t.borderAccent}`}>{item.icon}</span>
              <div>
                <h3 className={`font-black text-sm sm:text-lg ${t.textMain} ${t.fontHeading}`}>{item.name}</h3>
                <p className={`text-[10px] sm:text-xs mt-1 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>{item.desc}</p>
                <span className={`text-[8px] sm:text-[10px] font-black mt-2 inline-block px-2 py-0.5 rounded-full uppercase tracking-widest ${t.badge} ${t.textAccent} ${t.fontHeading}`}>Valid {item.expiryHours} Hrs</span>
              </div>
            </div>
            <button onClick={() => buyItem(item)} className={`w-full py-3 text-xs sm:text-sm font-black rounded-2xl flex items-center justify-center gap-2 group tap-effect shadow-md uppercase tracking-wider ${t.btnPrimary} ${t.fontHeading}`}>
              <span>BUY FOR {item.cost}</span>
              <span className="group-hover:scale-125 transition-transform">⭐</span>
            </button>
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
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><BarChart2 className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Analytics Dashboard</h2>
        </div>

        {/* TOP 3 STREAK STAT TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-4 sm:mb-6">
          <div className={`p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl ${t.cardInner} border border-orange-500/40 hover-lift`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-orange-500 animate-float"><Flame size={110} /></div>
            <span className="text-orange-400 font-black flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Flame size={18} className="animate-pulse" /> Perfect Day Streak</span>
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${t.textMain}`}>{streaks.perfect} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>

          <div className={`p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl ${t.cardInner} border border-blue-500/40 hover-lift`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-blue-500 animate-float"><Target size={110} /></div>
            <span className="text-blue-400 font-black flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Target size={18} /> Deep Study Streak</span>
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${t.textMain}`}>{streaks.study} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>

          <div className={`p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-xl ${t.cardInner} border border-yellow-500/40 hover-lift`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-yellow-500 animate-float"><Shield size={110} /></div>
            <span className="text-yellow-400 font-black flex items-center gap-2 mb-1 uppercase tracking-wider text-[10px] sm:text-xs"><Shield size={18} /> Trigger Free Streak</span>
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${t.textMain}`}>{streaks.trigger} <span className={`text-sm sm:text-lg font-normal ${t.textMuted}`}>days</span></span>
          </div>
        </div>

        {/* WEEKLY BAR CHART FOCUS */}
        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 border-b pb-4 ${t.borderAccent}`}>
            <div>
              <h3 className={`font-black text-sm sm:text-lg flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>Weekly Performance Trend</h3>
              <p className={`text-[10px] sm:text-xs mt-0.5 ${t.textMuted}`}>Daily completion ratios & target clearance</p>
            </div>
            <div className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl border ${t.cardInner} ${t.borderAccent}`}>
              <button onClick={() => setWeekOffset((prev) => prev + 1)} className={`p-2 tap-effect rounded-xl flex items-center gap-1 text-[9px] sm:text-xs font-black ${t.btnWarning} ${t.fontHeading}`}><ChevronLeft size={16} /> PAST</button>
              <div className="text-center min-w-[110px] sm:min-w-[130px]">
                <p className={`text-[9px] sm:text-xs font-black tracking-wider ${t.textMain} ${t.fontHeading}`}>{weekStart} <br /><span className={t.textMuted}>to</span><br /> {weekEnd}</p>
              </div>
              <button onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))} disabled={weekOffset === 0} className={`p-2 tap-effect rounded-xl flex items-center gap-1 text-[9px] sm:text-xs font-black ${weekOffset === 0 ? "opacity-30 cursor-not-allowed" : ""} ${t.btnWarning} ${t.fontHeading}`}>NEXT <ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex justify-between items-end h-52 sm:h-68 mb-4 gap-2 sm:gap-4 px-1 sm:px-6">
            {weeklyData.map((day, i) => {
              let barColor = t.cardInner.split(' ')[0] + " opacity-50";
              if (day.perfect) barColor = "bg-green-500 shadow-[0_0_18px_rgba(34,197,94,0.7)]";
              else if (day.failed) barColor = "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
              else if (day.percent > 0) barColor = "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]";

              return (
                <div key={i} className="flex flex-col items-center w-full group relative h-full justify-end">
                  <div className={`opacity-0 group-hover:opacity-100 absolute bottom-[calc(100%+12px)] p-2.5 rounded-xl border pointer-events-none transition-all z-20 whitespace-nowrap shadow-2xl text-[9px] sm:text-xs ${t.cardInner} ${t.textMain} ${t.borderAccent}`}>
                    <span className="block font-black text-center mb-1 border-b border-current opacity-60 pb-1">{day.date}</span>
                    <span className="font-bold">Score: {day.percent}%</span><br />
                    <span className="text-[9px] opacity-80">Wins: {day.xCount} / {day.total} tasks</span>
                  </div>
                  <span className={`text-[9px] sm:text-xs mb-2 font-black ${t.textMuted}`}>{day.percent}%</span>
                  <div className={`w-full max-w-[32px] sm:max-w-[48px] rounded-t-2xl relative flex justify-end flex-col overflow-hidden h-[80%] border-b-2 ${t.borderAccent} ${t.cardInner}`}>
                    <div className={`w-full rounded-t-2xl transition-all duration-700 ease-out ${barColor}`} style={{ height: `${day.percent}%`, minHeight: day.percent > 0 ? "6px" : "0" }}></div>
                  </div>
                  <span className={`text-[8px] sm:text-xs mt-2.5 sm:mt-3 font-black uppercase tracking-widest ${day.date === todayStr ? t.badge + " px-2 py-0.5 rounded-full" : t.textMuted}`}>{day.label}</span>
                </div>
              );
            })}
          </div>
          <div className={`mt-5 sm:mt-7 flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-black border-t pt-4 ${t.textMuted} border-current/20`}>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Perfect (100%)</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div> Partial (&ge;50%)</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Failed</span>
            <span className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full border ${t.cardInner}`}></div> Rest</span>
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
          <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Briefcase className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Ongoing Plan & History</h2>
        </div>

        <h3 className={`font-black uppercase tracking-wider text-xs sm:text-sm mt-4 border-b border-current/20 pb-2 ${t.textMuted} ${t.fontHeading}`}>Active Perks Inventory</h3>
        {activeItems.length === 0 ? (
          <div className={`text-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-white/10 ${t.cardInner}`}>
            <span className="text-3xl sm:text-4xl block mb-2 opacity-60 animate-float">🎁</span>
            <p className={`font-black mb-1 text-xs sm:text-sm ${t.textMain} ${t.fontHeading}`}>No active perks at the moment.</p>
            <p className={`text-[10px] sm:text-xs ${t.textMuted} ${t.fontHeading}`}>Visit the Reward Shop to unlock guilt-free perks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {activeItems.map((item) => {
              const hrsLeft = Math.max(0, Math.floor((new Date(item.expiryTime).getTime() - new Date(`${todayStr}T00:00:00`).getTime()) / (1000 * 60 * 60)));
              return (
                <div key={item.instanceId} className={`p-5 sm:p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl border tap-effect hover-lift ${t.cardInner} ${t.borderAccent}`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-start gap-4 mb-4 z-10">
                    <span className={`text-3xl sm:text-4xl p-3 rounded-2xl shadow-md border ${t.card} ${t.borderAccent}`}>{item.icon}</span>
                    <div>
                      <h3 className={`font-black text-sm sm:text-lg ${t.textMain} ${t.fontHeading}`}>{item.name}</h3>
                      <p className={`text-[10px] sm:text-xs font-black mt-1 ${hrsLeft < 12 ? "text-red-400 animate-pulse" : t.textAccent} ${t.fontHeading}`}>
                        Expires in {hrsLeft} Hours
                      </p>
                      <p className={`text-[8px] sm:text-[10px] ${t.textMuted} mt-0.5`}>Claimed: {item.purchasedAt}</p>
                    </div>
                  </div>
                  <button onClick={() => useInventoryItem(item.instanceId, item.name)} className={`w-full py-3 text-[10px] sm:text-xs font-black rounded-2xl tap-effect uppercase tracking-wider z-10 ${t.btnPrimary} ${t.fontHeading}`}>
                    {item.name === "The Eraser" ? "Arm Eraser" : "Mark as Used"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {historyItems.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h3 className={`font-black uppercase tracking-wider text-xs sm:text-sm mb-4 border-b border-current/20 pb-2 flex items-center gap-2 ${t.textMuted} ${t.fontHeading}`}><History size={16} /> History Log</h3>
            <div className="space-y-2.5">
              {historyItems.map((item) => (
                <div key={item.instanceId} className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl shadow-md border border-white/5 ${t.cardInner}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl opacity-50 grayscale">{item.icon}</span>
                    <div>
                      <span className={`font-black block text-xs sm:text-sm ${t.textMain} ${t.fontHeading}`}>{item.name}</span>
                      <span className={`text-[8px] sm:text-[10px] ${t.textMuted} ${t.fontHeading}`}>Claimed ID: {item.instanceId.slice(-6)} • {item.purchasedAt}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] sm:text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest ${t.fontHeading} ${item.status === "used" ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-red-900/30 text-red-400 border border-red-800"}`}>
                    {item.status.toUpperCase()}
                  </span>
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
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Download className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Data Vault</h2>
      </div>
      <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
        <p className={`text-[10px] sm:text-sm mb-5 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Select your date range and export your complete performance ledger.</p>
        <div className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
          <div>
            <label className={`block text-[9px] sm:text-xs font-black mb-1.5 uppercase tracking-widest ${t.textMuted} ${t.fontHeading}`}>START DATE</label>
            <input type="date" value={exportStartDate} onChange={(e) => setExportStartDate(e.target.value)} className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
          <div>
            <label className={`block text-[9px] sm:text-xs font-black mb-1.5 uppercase tracking-widest ${t.textMuted} ${t.fontHeading}`}>END DATE</label>
            <input type="date" value={exportEndDate} onChange={(e) => setExportEndDate(e.target.value)} className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={downloadExport} className={`w-full py-3.5 text-xs sm:text-sm rounded-2xl flex justify-center items-center gap-2 tap-effect font-black uppercase tracking-wider ${t.btnPrimary} ${t.fontHeading}`}><FileDown size={18} /> Download Dark HTML Report</button>
          <button onClick={copyTextExport} className={`w-full py-3.5 text-xs sm:text-sm rounded-2xl flex justify-center items-center gap-2 tap-effect font-black uppercase tracking-wider ${copySuccess ? 'bg-green-600 text-white' : t.btnWarning} ${t.fontHeading}`}><Copy size={18} /> {copySuccess ? "Copied to Clipboard!" : "Copy as Plain Text"}</button>
        </div>
      </div>
    </div>
  );

  const renderCoach = () => (
    <div className="flex flex-col h-[75vh] max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <button onClick={() => setHabitRoute("hub")} className={`p-2 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
        <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Bot className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> AI Habit Coach</h2>
      </div>
      <div className={`flex-1 flex flex-col overflow-hidden rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-3.5 sm:p-4 shadow-lg text-xs sm:text-sm leading-relaxed ${t.fontHeading} ${msg.role === "user" ? t.btnPrimary + " rounded-2xl rounded-tr-sm" : t.cardInner + " " + t.textMain + " rounded-2xl rounded-tl-sm border " + t.borderAccent}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl w-fit ${t.cardInner} border ${t.borderAccent}`}>
              <div className={`w-2 h-2 rounded-full bg-current ${t.textAccent} typing-dot-1`}></div>
              <div className={`w-2 h-2 rounded-full bg-current ${t.textAccent} typing-dot-2`}></div>
              <div className={`w-2 h-2 rounded-full bg-current ${t.textAccent} typing-dot-3`}></div>
              <span className={`text-[10px] font-black uppercase tracking-wider ml-2 ${t.textMuted} ${t.fontHeading}`}>Coach Strategizing...</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 sm:p-4 border-t ${t.borderAccent} ${t.cardInner}`}>
          <div className="flex gap-2.5">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && askCoach()} placeholder="Ask for habit guidance, confession or strategy..." className={`flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={askCoach} disabled={isTyping} className={`px-5 rounded-2xl tap-effect transition-all disabled:opacity-50 flex items-center justify-center ${t.btnPrimary}`}><Zap size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
  // ==========================================
  // BRAIN RENDERERS (STYLED WITH MODERN THEMES & GLASSMORPHISM)
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
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">

        {/* DAILY PROTOCOL QUOTE BANNER */}
        <div className={`p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-2xl border ${t.cardInner} ${t.borderAccent} hover-lift`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${t.badge} flex items-center gap-1.5`}>
              <Zap size={13} className="animate-pulse" /> PROTOCOL INITIATED
            </span>
          </div>
          <p className={`text-lg sm:text-2xl font-black uppercase tracking-tight leading-snug ${t.textMain} ${t.fontHeading}`}>
            "{quoteOfTheDay}"
          </p>
        </div>

        {/* GLOBAL DEADLINE & PACE */}
        <div className={`p-6 sm:p-8 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <div className={`flex justify-between items-center mb-5 border-b pb-3 ${t.borderAccent}`}>
            <h2 className={`text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 ${t.textAccent} ${t.fontHeading}`}>
              <Clock size={16} /> GLOBAL DEADLINE & VELOCITY
            </h2>
            <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${t.badge}`}>STRATEGY ENGINE</span>
          </div>

          <div className="flex justify-between items-end gap-4">
            <div className="flex flex-col">
              <label className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1.5 ${t.textMuted} ${t.fontHeading}`}>REMAINING TIMELINE</label>
              <div className={`flex items-baseline gap-2 border-b-2 border-transparent transition-colors focus-within:${t.borderAccent}`}>
                <input
                  type="number"
                  value={brain.globalDeadlineDays}
                  onChange={(e) => updateBrainFirebase({ globalDeadlineDays: Math.max(1, parseInt(e.target.value) || 1) })}
                  className={`w-20 sm:w-28 bg-transparent text-4xl sm:text-6xl font-black tracking-tighter outline-none p-0 m-0 ${t.textMain} ${t.fontHeading}`}
                />
                <span className={`text-base sm:text-xl font-black uppercase ${t.textAccent} ${t.fontHeading}`}>DAYS</span>
              </div>
            </div>

            <div className={`text-right p-3 sm:p-4 rounded-2xl border ${t.cardInner} ${t.borderAccent}`}>
              <p className={`text-[9px] sm:text-[10px] tracking-widest font-black uppercase mb-1 ${t.textMuted} ${t.fontHeading}`}>PACE DETECTOR</p>
              <p className={`text-xl sm:text-3xl font-black ${paceStatus.color} ${t.fontHeading}`}>{pace} <span className="text-[10px] sm:text-xs font-normal">CH/DAY</span></p>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded-full ${paceStatus.color} bg-current/10 ${t.fontHeading}`}>{paceStatus.text}</span>
            </div>
          </div>

          {brain.stagingTopics.length > 0 && (
            <div className={`mt-6 sm:mt-8 p-5 rounded-2xl border ${t.cardInner} ${t.borderAccent} hover-lift`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${t.textAccent} ${t.fontHeading}`}>CURRENT STRIKE TARGET</h3>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${t.badge} ${t.fontHeading}`}>{brain.stagingTopics[0].category}</span>
              </div>
              <h2 className={`text-base sm:text-xl font-black uppercase tracking-tight truncate mb-4 ${t.textMain} ${t.fontHeading}`}>{brain.stagingTopics[0].title}</h2>
              <button
                onClick={() => handleStartRevision(brain.stagingTopics[0].id)}
                className={`w-full py-3 sm:py-3.5 text-xs sm:text-sm font-black tracking-widest uppercase rounded-xl tap-effect shadow-lg flex items-center justify-center gap-2 ${t.btnPrimary} ${t.fontHeading}`}
              >
                <CheckCircle2 size={18} /> TARGET DESTROYED (MOVE TO QUEUE)
              </button>
            </div>
          )}
        </div>

        {/* TODAY'S CUSTOM MISSIONS */}
        {todaysCustomMissions.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-1 flex items-center gap-2 ${t.textAccent} ${t.fontHeading}`}>
              <Target size={15} /> TODAY'S MISSIONS ({todaysCustomMissions.length})
            </h3>
            {todaysCustomMissions.map((mission) => (
              <div key={mission.id} className={`flex items-center justify-between p-4 rounded-2xl shadow-md border ${t.cardInner} ${t.borderAccent} hover-lift`}>
                <span className={`font-black uppercase tracking-wider text-xs sm:text-sm ${t.textMain} ${t.fontHeading}`}>{mission.text}</span>
                <button
                  onClick={() => {
                    updateBrainFirebase({ customMissions: brain.customMissions.filter(m => m.id !== mission.id) });
                    const remaining = todaysCustomMissions.length - 1;
                    if (remaining === 0) triggerCrossReward(3, "All Daily Missions Cleared!");
                  }}
                  className={`p-2 rounded-xl tap-effect transition-colors ${t.textMuted} hover:${t.textAccent} bg-white/5`}
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MANDATORY REVISIONS */}
        <div className="space-y-3">
          <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-1 flex items-center gap-2 ${t.textAccent} ${t.fontHeading}`}>
            <Flame size={15} /> MANDATORY REVISIONS
          </h3>
          {todaysRevisions.length === 0 ? (
            <div className={`text-center py-10 sm:py-12 rounded-3xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>
              SYSTEM CLEAR • ALL REVISIONS UP TO DATE
            </div>
          ) : (
            <div className="space-y-3">
              {todaysRevisions.map((rev, idx) => (
                <div key={idx} className={`p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg border ${t.cardInner} ${rev.isOverdue ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : t.borderAccent} hover-lift`}>
                  <div>
                    <h4 className={`font-black uppercase text-xs sm:text-sm flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>
                      {rev.title} {rev.isOverdue && <span className="text-[8px] sm:text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full tracking-widest font-black animate-pulse">OVERDUE</span>}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${t.badge}`}>{rev.category}</span>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${t.card}`}>DAY {rev.dayOffset}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => markRevisionComplete(rev.topicId, rev.targetDate, rev.dayOffset)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center tap-effect shrink-0 shadow-md ${t.btnPrimary}`}
                  >
                    <Check size={22} className="stroke-[3]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBrainStudy = () => (
    <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
        <div className={`flex justify-between items-center mb-5 sm:mb-6 border-b pb-3 ${t.borderAccent}`}>
           <h3 className={`font-black uppercase tracking-widest flex items-center gap-2 text-xs sm:text-sm ${t.textAccent} ${t.fontHeading}`}>
             <Activity size={16} /> LIQUID STRIKE QUEUE
           </h3>
           <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${t.cardInner} ${t.textMuted}`}>Drag to prioritize</span>
        </div>

        {/* NEW TAG INPUT */}
        <div className="flex gap-2.5 mb-4 sm:mb-5">
          <input
            type="text"
            value={newSyllabusCat}
            onChange={(e) => setNewSyllabusCat(e.target.value)}
            placeholder="NEW CATEGORY TAG..."
            className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`}
          />
          <button
            onClick={handleAddSyllabusCategory}
            className={`px-5 rounded-2xl font-black uppercase tap-effect flex items-center justify-center ${t.btnPrimary}`}
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>

        {brain.syllabusCategories.length > 1 && (
           <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
             {brain.syllabusCategories.map(cat => (
               <div key={cat} className={`group flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all border ${t.cardInner} ${t.textMain} hover:${t.borderAccent}`}>
                 {cat}
                 {cat !== "Raw Backlog" && (
                   <button
                     onClick={() => handleDeleteSyllabusCategory(cat)}
                     className={`transition-colors ${t.textMuted} hover:text-red-500`}
                   >
                     <Trash2 size={13} />
                   </button>
                 )}
               </div>
             ))}
           </div>
        )}

        {/* ADD CHAPTER / TOPIC */}
        <div className="flex gap-2.5 mb-6 sm:mb-8">
          <select
            value={selectedSyllabusCat}
            onChange={(e) => setSelectedSyllabusCat(e.target.value)}
            className={`w-1/3 px-3 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl outline-none cursor-pointer ${t.input} ${t.textAccent} ${t.fontHeading}`}
          >
            {brain.syllabusCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStagingTopic()}
            placeholder="CHAPTER / TOPIC NAME..."
            className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`}
          />
          <button
            onClick={handleAddStagingTopic}
            className={`px-5 rounded-2xl font-black tap-effect flex items-center justify-center ${t.btnPrimary}`}
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {brain.stagingTopics.length === 0 && (
            <div className={`text-center py-10 sm:py-12 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>
              QUEUE EMPTY • ADD TOPICS TO COMMENCE
            </div>
          )}
          {brain.stagingTopics.map((topic, index) => (
            <LongPressItem key={topic.id} item={topic} onDelete={(id) => updateBrainFirebase({ stagingTopics: brain.stagingTopics.filter(t => t.id !== id) })} t={t}>
              <div
                draggable
                onDragStart={() => setDraggedItemIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedItemIndex === null || draggedItemIndex === index) {
                    setDraggedItemIndex(null);
                    return;
                  }
                  const items = [...brain.stagingTopics];
                  if (!items[draggedItemIndex] || index < 0 || index >= items.length) {
                    setDraggedItemIndex(null);
                    return;
                  }
                  const [draggedItem] = items.splice(draggedItemIndex, 1);
                  if (draggedItem) {
                    items.splice(index, 0, draggedItem);
                    updateBrainFirebase({ stagingTopics: items });
                  }
                  setDraggedItemIndex(null);
                }}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-move transition-all select-none shadow-md ${index === 0 ? t.borderAccent + " " + t.cardInner : t.cardInner} ${draggedItemIndex === index ? 'opacity-40 scale-95' : 'opacity-100'} hover-lift`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <GripVertical size={20} className={index === 0 ? t.textAccent : t.textMuted} />
                  <div>
                    <h4 className={`font-black text-xs sm:text-sm uppercase flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>
                      {topic.title}
                      {index === 0 && <span className={`text-[8px] sm:text-[9px] px-2 py-0.5 tracking-widest font-black rounded-full ${t.badge} ${t.textAccent}`}>NEXT</span>}
                    </h4>
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
    <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
        <h3 className={`font-black uppercase tracking-widest mb-5 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}>
          <History size={16} /> ONGOING SPACED REPETITION CYCLES
        </h3>
        {brain.studyTopics.length === 0 ? (
          <div className={`text-center py-10 sm:py-12 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>
            NO ACTIVE CYCLES
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {brain.studyTopics.map(topic => (
              <LongPressItem key={topic.id} item={topic} onDelete={(id) => updateBrainFirebase({ studyTopics: brain.studyTopics.filter(t => t.id !== id) })} duration={5000} t={t}>
                <div className={`p-5 rounded-2xl shadow-lg border ${t.cardInner} ${t.borderAccent} hover-lift`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`font-black text-sm sm:text-lg uppercase ${t.textMain} ${t.fontHeading}`}>{topic.title}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 mt-1.5 inline-block rounded-full ${t.badge}`}>{topic.category}</span>
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full ${t.card} ${t.textAccent} border ${t.borderAccent}`}>INIT: {topic.startDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {topic.schedule.map((rev, i) => {
                      const isPending = !rev.completed && rev.targetDate <= todayStr;
                      return (
                        <div key={i} className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl border transition-all ${rev.completed ? t.btnPrimary + ' shadow-sm' : isPending ? 'border-red-500 text-red-500 bg-red-900/20 shadow-md animate-pulse' : t.card + ' ' + t.textMuted}`}>
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.fontHeading}`}>D{rev.dayOffset}</span>
                          {rev.completed ? <Check size={14} className="mt-1 stroke-[4]" /> : <Circle size={14} className={`mt-1 stroke-[3] ${isPending ? 'animate-pulse' : ''}`} />}
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

      <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
        <h3 className={`font-black uppercase tracking-widest mb-5 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textMain} ${t.fontHeading} ${t.borderAccent}`}>
          <Trophy size={16} className={t.textAccent} /> HALL OF FAME (MASTERED ARCHIVES)
        </h3>
        {brain.masteredTopics.length === 0 ? (
          <div className={`text-center py-10 sm:py-12 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>
            EMPTY VAULT • COMPLETE A SPACED CYCLE TO ARCHIVE
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {brain.masteredTopics.map(topic => (
              <div key={topic.id} className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-md transition-all ${t.cardInner} hover:${t.borderAccent} hover-lift`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${t.card} ${t.borderAccent}`}>
                   <Trophy size={20} className={t.textAccent} />
                </div>
                <div>
                  <h4 className={`font-black text-xs sm:text-sm uppercase ${t.textMain} ${t.fontHeading}`}>{topic.title}</h4>
                  <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-0.5 ${t.textMuted} ${t.fontHeading}`}>{topic.category} • {topic.masteredDate}</p>
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
        <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedWisdomCategory(null)} className={`p-2.5 sm:p-3 tap-effect rounded-xl ${t.btnPrimary}`}><ChevronLeft size={20} className="stroke-[3]"/></button>
            <h2 className={`text-lg sm:text-xl font-black uppercase tracking-widest flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><FolderOpen size={20} className={t.textAccent} /> {expandedWisdomCategory}</h2>
          </div>
          <div className="flex gap-2.5 mb-6 sm:mb-8">
            <input type="text" value={newWisdom} onChange={(e) => setNewWisdom(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddWisdom()} placeholder="DUMP KNOWLEDGE / MODEL..." className={`flex-1 px-4 py-3.5 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={handleAddWisdom} className={`px-6 font-black rounded-2xl tap-effect flex items-center justify-center ${t.btnPrimary}`}><Plus size={22} className="stroke-[4]" /></button>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {filteredNotes.length === 0 && <div className={`text-center py-10 sm:py-12 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>EMPTY FOLDER</div>}
            {filteredNotes.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => updateBrainFirebase({ wisdomNotes: brain.wisdomNotes.filter(n => n.id !== id) })} t={t}>
                <div className={`p-5 rounded-2xl flex flex-col gap-3 group transition-all cursor-pointer border shadow-md ${t.cardInner} hover:${t.borderAccent} hover-lift`}>
                  <div className="flex items-start gap-3">
                     <Mic size={16} className={`mt-1 flex-shrink-0 ${t.textMuted}`} />
                     <p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{note.text}</p>
                  </div>
                  <div className={`flex justify-between items-center pt-3 border-t ${t.borderAccent}`}>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>{note.date}</span>
                    <div className="flex items-center gap-2">
                       <MoveRight size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${t.textMuted}`} />
                       <select onChange={(e) => updateBrainFirebase({ wisdomNotes: brain.wisdomNotes.map(n => n.id === note.id ? { ...n, category: e.target.value } : n) })} value={note.category} className={`text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded-full outline-none cursor-pointer ${t.badge} ${t.fontHeading}`}>
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
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <h3 className={`font-black uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><Sparkles size={16} /> ASK THE ORACLE</h3>
          <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-3 sm:mb-4 ${t.textMuted}`}>Query your Second Brain knowledge base with Gemini AI.</p>
          <div className="flex gap-2.5">
            <input type="text" value={oracleQuery} onChange={(e) => setOracleQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')} placeholder="ASK A QUESTION..." className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={() => handleAskOracle('wisdom')} disabled={isOracleThinking} className={`px-5 font-black uppercase rounded-2xl tap-effect disabled:opacity-50 flex items-center justify-center ${t.btnPrimary}`}>{isOracleThinking ? <Circle size={18} className="animate-pulse stroke-[4]" /> : <Send size={18} className="stroke-[3]" />}</button>
          </div>
          {oracleResponse && <div className={`mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl border-l-4 shadow-lg ${t.cardInner} ${t.borderAccent}`}><p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{oracleResponse}</p></div>}
        </div>

        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <h3 className={`font-black uppercase tracking-widest mb-5 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textMain} ${t.fontHeading} ${t.borderAccent}`}><Folder size={16} className={t.textAccent} /> WISDOM FOLDERS</h3>
          <div className="flex gap-2.5 mb-6 sm:mb-8">
            <input type="text" value={newWisdomCat} onChange={(e) => setNewWisdomCat(e.target.value)} placeholder="NEW FOLDER NAME..." className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={() => { if (newWisdomCat.trim() && !brain.wisdomCategories.includes(newWisdomCat.trim())) { updateBrainFirebase({ wisdomCategories: [...brain.wisdomCategories, newWisdomCat.trim()] }); setNewWisdomCat(""); } }} className={`px-5 rounded-2xl font-black tap-effect flex items-center justify-center ${t.btnPrimary}`}><Plus size={20} className="stroke-[3]" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {brain.wisdomCategories.map(cat => {
              const count = brain.wisdomNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button onClick={() => setExpandedWisdomCategory(cat)} className={`w-full p-5 rounded-2xl flex flex-col items-start gap-3 transition-all text-left shadow-md border ${t.cardInner} hover:${t.borderAccent} hover-lift`}>
                    <FolderOpen size={28} className={`transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm uppercase truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Quick Thoughts" && <button onClick={(e) => { e.stopPropagation(); updateBrainFirebase({ wisdomCategories: brain.wisdomCategories.filter(c => c !== cat), wisdomNotes: brain.wisdomNotes.map(n => n.category === cat ? { ...n, category: "Quick Thoughts" } : n) }); }} className={`absolute top-3 right-3 p-2 rounded-xl transition-colors ${t.textMuted} hover:text-red-500 bg-white/5`}><Trash2 size={14} /></button>}
                </div>
              );
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
        <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedVaultCategory(null)} className={`p-2.5 sm:p-3 tap-effect rounded-xl ${t.btnPrimary}`}><ChevronLeft size={20} className="stroke-[3]"/></button>
            <h2 className={`text-lg sm:text-xl font-black uppercase tracking-widest flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><FolderOpen size={20} className={t.textAccent} /> {expandedVaultCategory}</h2>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {notesInCat.length === 0 && <div className={`text-center py-10 sm:py-12 rounded-2xl border-2 border-dashed font-black uppercase tracking-widest text-xs sm:text-sm ${t.cardInner} ${t.textMuted} border-current/20`}>EMPTY FOLDER</div>}
            {notesInCat.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => updateBrainFirebase({ vaultNotes: brain.vaultNotes.filter(n => n.id !== id) })} t={t}>
                <div className={`p-5 rounded-2xl flex items-start gap-3.5 transition-all group cursor-pointer border shadow-md ${t.cardInner} hover:${t.borderAccent} hover-lift`}>
                  <BrainCircuit size={18} className={`mt-1 shrink-0 transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                  <div>
                    <p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{note.text}</p>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-2 block ${t.textMuted} ${t.fontHeading}`}>{note.date}</span>
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-300 max-w-4xl mx-auto">
        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <h3 className={`font-black uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><Sparkles size={16} /> ASK THE ORACLE</h3>
          <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-3 sm:mb-4 ${t.textMuted}`}>Query your Brain Dump inbox with Gemini AI.</p>
          <div className="flex gap-2.5">
            <input type="text" value={oracleQuery} onChange={(e) => setOracleQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('vault')} placeholder="QUERY DUMP NOTES..." className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={() => handleAskOracle('vault')} disabled={isOracleThinking} className={`px-5 font-black uppercase rounded-2xl tap-effect disabled:opacity-50 flex items-center justify-center ${t.btnPrimary}`}>{isOracleThinking ? <Circle size={18} className="animate-pulse stroke-[4]" /> : <Send size={18} className="stroke-[3]" />}</button>
          </div>
          {oracleResponse && <div className={`mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl border-l-4 shadow-lg ${t.cardInner} ${t.borderAccent}`}><p className={`text-xs sm:text-sm font-bold leading-relaxed ${t.textMain}`}>{oracleResponse}</p></div>}
        </div>

        <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
          <div className={`flex justify-between items-center mb-4 border-b pb-3 ${t.borderAccent}`}>
            <h3 className={`font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><BrainCircuit size={16} className={t.textAccent} /> BRAIN DUMP (INBOX)</h3>
            {isVaultSorting && <span className={`text-[9px] sm:text-[10px] px-2.5 py-1 font-black uppercase tracking-widest animate-pulse rounded-full flex items-center gap-1 ${t.badge} ${t.textAccent}`}><Sparkles size={11} /> AI SORTING</span>}
          </div>
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-4 sm:mb-5 leading-relaxed ${t.textMuted}`}>Fast-capture raw ideas. AI auto-sorts into folders when patterns emerge.</p>
          <div className="flex gap-2.5 relative">
            <button onClick={() => {
                try {
                  const win = window as any;
                  const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
                  if (!SR) { showMessage("Voice typing not supported in this browser."); return; }
                  const rec = new SR();
                  rec.onstart = () => setIsListening(true);
                  rec.onresult = (e: any) => {
                    const transcript = e.results?.[e.resultIndex]?.[0]?.transcript || "";
                    setNewNote(p => p + (p ? " " : "") + transcript);
                  };
                  rec.onerror = (err: any) => {
                    console.warn("Speech recognition error:", err);
                    setIsListening(false);
                  };
                  rec.onend = () => setIsListening(false);
                  rec.start();
                } catch (e) {
                  console.warn("Speech recognition exception:", e);
                  setIsListening(false);
                }
              }} className={`p-3 rounded-2xl transition-all tap-effect ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : t.cardInner + ' ' + t.textMuted}`}><Mic size={20} /></button>
            <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddNote()} placeholder={isListening ? "SPEAKING..." : "RAW THOUGHT..."} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-black uppercase rounded-2xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
            <button onClick={handleAddNote} disabled={isVaultSorting} className={`px-5 rounded-2xl font-black uppercase tap-effect disabled:opacity-50 flex items-center justify-center ${t.btnPrimary}`}><Send size={18} className="stroke-[3]" /></button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <h3 className={`font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 px-1 ${t.textMain} ${t.fontHeading}`}><Folder size={16} className={t.textAccent} /> VAULT FOLDERS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {brain.vaultCategories.map(cat => {
              const count = brain.vaultNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button onClick={() => setExpandedVaultCategory(cat)} className={`w-full p-5 rounded-2xl flex flex-col items-start gap-3 transition-all text-left shadow-md border ${t.cardInner} hover:${t.borderAccent} hover-lift`}>
                    <FolderOpen size={28} className={`transition-colors ${t.textMuted} group-hover:${t.textAccent}`} />
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm uppercase truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Others" && <button onClick={(e) => { e.stopPropagation(); updateBrainFirebase({ vaultCategories: brain.vaultCategories.filter(c => c !== cat), vaultNotes: brain.vaultNotes.map(n => n.category === cat ? { ...n, category: "Others" } : n) }); }} className={`absolute top-3 right-3 p-2 rounded-xl transition-colors ${t.textMuted} hover:text-red-500 bg-white/5`}><Trash2 size={14} /></button>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderHabitSettings = () => {
    if (settingsRoute === "menu") {
      return (
        <div className="space-y-6 max-w-xl mx-auto pb-20 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
            <button onClick={() => setHabitRoute("hub")} className={`p-2.5 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}><Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Command Center</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button onClick={() => setSettingsRoute("todo")} className={`p-6 sm:p-7 text-left group relative overflow-hidden rounded-3xl tap-effect border ${t.cardInner} hover:${t.borderAccent} ${t.borderAccent}`}>
              <Edit3 className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-black relative z-10 ${t.textMain} ${t.fontHeading}`}>Edit To-Do List</h2>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 relative z-10 ${t.textMuted}`}>Manage daily missions</p>
            </button>
            <button onClick={() => setSettingsRoute("shop")} className={`p-6 sm:p-7 text-left group relative overflow-hidden rounded-3xl tap-effect border ${t.cardInner} hover:${t.borderAccent} ${t.borderAccent}`}>
              <ShoppingCart className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-black relative z-10 ${t.textMain} ${t.fontHeading}`}>Edit Reward Shop</h2>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 relative z-10 ${t.textMuted}`}>Customize perks</p>
            </button>
            <button onClick={() => setSettingsRoute("theme")} className={`p-6 sm:p-7 text-left group relative overflow-hidden rounded-3xl tap-effect border ${t.cardInner} hover:${t.borderAccent} ${t.borderAccent}`}>
              <Sparkles className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-black relative z-10 ${t.textMain} ${t.fontHeading}`}>App Theme Engine</h2>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 relative z-10 ${t.textMuted}`}>Visual aesthetics</p>
            </button>
            <button onClick={() => setSettingsRoute("profile")} className={`p-6 sm:p-7 text-left group relative overflow-hidden rounded-3xl tap-effect border ${t.cardInner} hover:${t.borderAccent} ${t.borderAccent}`}>
              <User className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 relative z-10 transition-colors ${t.textAccent}`} />
              <h2 className={`text-sm sm:text-lg font-black relative z-10 ${t.textMain} ${t.fontHeading}`}>Profile Config</h2>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1 relative z-10 ${t.textMuted}`}>Name, avatar & API key</p>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-xl mx-auto pb-20 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
          <button onClick={() => setSettingsRoute("menu")} className={`p-2.5 sm:p-3 tap-effect rounded-xl ${t.cardInner} ${t.textMain}`}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <h2 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${t.textMain} ${t.fontHeading}`}>
            {settingsRoute === "todo" && <><Edit3 className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Edit To-Do List</>}
            {settingsRoute === "shop" && <><ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Edit Reward Shop</>}
            {settingsRoute === "theme" && <><Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Theme Engine</>}
            {settingsRoute === "profile" && <><User className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textAccent}`} /> Profile Config</>}
          </h2>
        </div>

        {settingsRoute === "todo" && (
          <div className={`p-5 sm:p-7 mb-4 sm:mb-6 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
             <h3 className={`font-black mb-4 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><Edit3 className="w-5 h-5" /> Edit To-Do List</h3>
             <div className={`p-4 mb-4 rounded-2xl border ${t.cardInner} ${t.borderAccent}`}>
               <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Task Heading" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors mb-2.5 ${t.input} ${t.fontHeading}`} />
               <input type="text" value={newDesc} onChange={(e)=>setNewDesc(e.target.value)} placeholder="Condition (e.g. 10 Pages)" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors mb-3.5 ${t.input} ${t.fontHeading}`} />
               <button onClick={() => {
                  if (!newTitle.trim() || !newDesc.trim()) { showMessage("Fill both!"); return; }
                  updateProfileFirebase({ customTasks: [...(profile.customTasks || DEFAULT_TASKS), { id: `t_${Date.now()}`, title: newTitle.trim(), desc: newDesc.trim(), isLocked: false }] });
                  setNewTitle(""); setNewDesc(""); showMessage("Task Added!");
               }} className={`w-full py-3 text-xs sm:text-sm rounded-2xl tap-effect flex justify-center items-center gap-2 ${t.btnPrimary} ${t.fontHeading}`}><Plus size={18}/> ADD TASK</button>
             </div>
             <div className="space-y-2.5">
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
          <div className={`p-5 sm:p-7 mb-4 sm:mb-6 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
             <h3 className={`font-black mb-4 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}><ShoppingCart className="w-5 h-5" /> Edit Reward Shop</h3>
             <div className={`p-4 mb-4 rounded-2xl border ${t.cardInner} ${t.borderAccent}`}>
                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                   <input type="text" value={newShopName} onChange={(e)=>setNewShopName(e.target.value)} placeholder="Name" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                   <input type="text" value={newShopIcon} onChange={(e)=>setNewShopIcon(e.target.value)} placeholder="Emoji" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                   <input type="number" value={newShopCost} onChange={(e)=>setNewShopCost(e.target.value)} placeholder="Cost (Stars)" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                   <input type="number" value={newShopExpiry} onChange={(e)=>setNewShopExpiry(e.target.value)} placeholder="Expiry (Hr)" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
                </div>
                <input type="text" value={newShopDesc} onChange={(e)=>setNewShopDesc(e.target.value)} placeholder="Description" className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors mb-3.5 ${t.input} ${t.fontHeading}`} />
                <button onClick={() => {
                  if (!newShopName.trim() || !newShopDesc.trim() || !newShopCost || !newShopExpiry || !newShopIcon.trim()) { showMessage("Fill all fields!"); return; }
                  updateProfileFirebase({ customShopItems: [...(profile.customShopItems || SHOP_ITEMS), { id: `s_${Date.now()}`, name: newShopName.trim(), desc: newShopDesc.trim(), cost: parseInt(newShopCost, 10), expiryHours: parseInt(newShopExpiry, 10), icon: newShopIcon.trim() }] });
                  setNewShopName(""); setNewShopDesc(""); setNewShopCost(""); setNewShopExpiry(""); setNewShopIcon(""); showMessage("Reward Added!");
                }} className={`w-full py-3 text-xs sm:text-sm rounded-2xl tap-effect flex justify-center items-center gap-2 ${t.btnPrimary} ${t.fontHeading}`}><Plus size={18}/> ADD REWARD</button>
             </div>
             <div className="space-y-2.5">
               {(profile.customShopItems || SHOP_ITEMS).map(item => (
                 <RemovableShopItem key={item.id} item={item} t={t} onDelete={(id) => {
                    updateProfileFirebase({ customShopItems: (profile.customShopItems || SHOP_ITEMS).filter(s => s.id !== id) });
                 }} />
               ))}
             </div>
          </div>
        )}

        {settingsRoute === "theme" && (
          <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
            <h3 className={`font-black uppercase tracking-widest mb-5 flex items-center gap-2 text-xs sm:text-sm border-b pb-3 ${t.textAccent} ${t.fontHeading} ${t.borderAccent}`}>APP THEME ENGINE</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Object.values(THEMES).map(themeOption => (
                <button key={themeOption.id} onClick={() => updateProfileFirebase({ activeTheme: themeOption.id })} className={`p-4 rounded-2xl transition-all tap-effect flex flex-col items-center gap-2.5 cursor-pointer shadow-md ${t.cardInner} ${profile.activeTheme === themeOption.id ? t.borderAccent + ' opacity-100 scale-[1.03] ring-2 ring-current shadow-lg' : 'opacity-70 hover:opacity-100 border-transparent'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center border border-white/20 ${themeOption.appBg.split(' ')[0]}`}>
                     {profile.activeTheme === themeOption.id && <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 ${themeOption.textAccent ? themeOption.textAccent : 'text-white'}`} />}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-black text-center uppercase tracking-wider ${t.textMain} ${t.fontHeading}`}>{themeOption.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {settingsRoute === "profile" && (
          <div className={`p-5 sm:p-7 rounded-3xl shadow-2xl border ${t.card} ${t.borderAccent}`}>
            <h3 className={`font-black mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest ${t.textMain} ${t.fontHeading}`}><Camera className="w-5 h-5" /> Profile Config</h3>
            <div className={`flex items-center gap-4 mb-6 p-4 rounded-2xl border ${t.cardInner} ${t.borderAccent}`}>
              <div className={`w-14 h-14 sm:w-18 sm:h-18 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-2xl border-2 shadow-lg ${t.card} ${t.borderAccent}`}>
                {profile.dp ? <img src={profile.dp} alt="DP" className="w-full h-full object-cover" /> : <span className="text-2xl sm:text-3xl">🦊</span>}
              </div>
              <div className="flex-1">
                <label className={`block w-full text-center py-2.5 px-4 text-[10px] sm:text-sm rounded-2xl cursor-pointer tap-effect ${t.btnPrimary} ${t.fontHeading}`}>CHOOSE IMAGE<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                <p className={`text-[9px] sm:text-[10px] mt-2 text-center uppercase tracking-widest font-black ${t.textMuted} ${t.fontHeading}`}>Auto-crops to circle</p>
              </div>
            </div>
            <h3 className={`font-black mb-2 text-xs sm:text-sm uppercase tracking-widest ${t.textMain} ${t.fontHeading}`}>Player Name</h3>
            <input type="text" value={profile.name} onChange={(e) => updateProfileFirebase({ name: e.target.value })} className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors mb-6 ${t.input} ${t.fontHeading}`} />
            <h3 className={`font-black mb-2 text-xs sm:text-sm uppercase tracking-widest ${t.textMain} ${t.fontHeading}`}>Gemini API Key (AI Core)</h3>
            <input type="password" value={profile.geminiKey} onChange={(e) => { cachedGeminiModels = null; updateProfileFirebase({ geminiKey: e.target.value }); }} placeholder="Paste Gemini API key from Google AI Studio..." className={`w-full p-3 text-xs sm:text-sm rounded-xl outline-none transition-colors ${t.input} ${t.fontHeading}`} />
          </div>
        )}
      </div>
    );
  };

  const renderBrainUrge = () => (
    <div className="space-y-8 sm:space-y-10 pb-20 pt-4 text-center max-w-md mx-auto animate-in fade-in duration-300">
      <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-widest flex justify-center items-center gap-2 sm:gap-3 ${t.textMain} ${t.fontHeading}`}><ShieldAlert className={`${t.textAccent} stroke-[3]`} size={28} /> INTERCEPTOR</h2>
      <p className={`font-black uppercase tracking-widest text-[9px] sm:text-[10px] px-4 sm:px-8 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>Trigger this emergency protocol if you are about to break discipline. A friction timer will cool your impulse.</p>

      {!isUrgeActive ? (
        <button onClick={triggerUrgeInterceptor} className={`w-full aspect-square max-w-[220px] sm:max-w-[280px] mx-auto border-8 rounded-3xl tap-effect flex flex-col items-center justify-center gap-5 sm:gap-6 group mt-8 ${t.btnPrimary} ${t.fontHeading} ${t.borderAccent} hover-lift`}>
          <Skull size={60} className="sm:size-20 stroke-[2] group-hover:scale-110 transition-transform duration-300" />
          <span className="font-black text-xl sm:text-3xl uppercase tracking-widest text-center px-4">I HAVE AN URGE</span>
        </button>
      ) : (
        <div className={`p-6 sm:p-8 relative mt-8 rounded-3xl border-2 ${t.card} ${t.borderAccent} shadow-2xl`}>
          <div className={`absolute top-0 left-0 w-full h-2.5 rounded-t-3xl overflow-hidden ${t.cardInner}`}>
            <div
              className={`h-full transition-all duration-1000 ease-linear bg-current ${t.textAccent} animate-shimmer`}
              style={{ width: `${(urgeTimer / 90) * 100}%` }}
            ></div>
          </div>
          <h3 className={`font-black mt-3 sm:mt-4 mb-4 sm:mb-6 uppercase tracking-[0.2em] text-[10px] sm:text-xs ${t.textAccent} ${t.fontHeading} animate-pulse`}>FRICTION ZONE ACTIVE</h3>
          <div className={`text-6xl sm:text-8xl font-black mb-6 sm:mb-8 tabular-nums tracking-tighter ${t.textMain}`}>{urgeTimer}s</div>
          <div className={`min-h-[80px] sm:min-h-[100px] flex items-center justify-center border-t pt-4 sm:pt-6 ${t.borderAccent}`}>
            <p className={`font-bold text-sm sm:text-lg uppercase tracking-wider leading-relaxed px-2 ${t.textMain} ${t.fontHeading}`} key={currentQuoteIndex}>
              "{urgeQuotes[currentQuoteIndex] || 'STAY STRONG. DO NOT GIVE IN.'}"
            </p>
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
      <div className={`fixed ${testMode ? 'top-10 sm:top-12' : 'top-0'} left-0 w-full z-40 p-3 sm:p-4 bg-inherit/80 backdrop-blur-xl border-b ${t.borderAccent} opacity-95 flex justify-center items-center`}>
        <div className={`flex w-full max-w-sm rounded-3xl p-1.5 border-2 shadow-2xl shadow-black/20 ${t.cardInner} ${t.borderAccent}`}>
          <button onClick={() => setAppMode("habit")} className={`flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 tap-effect ${appMode === 'habit' ? t.btnPrimary : t.textMuted + ' hover:' + t.textMain}`}>HABIT OS</button>
          <button onClick={() => setAppMode("brain")} className={`flex-1 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 tap-effect ${appMode === 'brain' ? t.btnPrimary : t.textMuted + ' hover:' + t.textMain}`}>SECOND BRAIN</button>
        </div>
      </div>

      <div className={`p-4 md:p-8 relative pt-24 sm:pt-28 ${testMode ? 'mt-8 sm:mt-12' : ''}`}>
        {toast && (
          <div className={`fixed top-28 sm:top-32 left-1/2 transform -translate-x-1/2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl shadow-black/40 z-[100] animate-bounce flex items-center gap-3 text-[10px] sm:text-sm uppercase tracking-widest ${t.badge} ${t.fontHeading} ${t.cardBorder}`}>
            <Check size={18} className={`sm:size-5 ${t.textAccent ? t.textAccent : 'text-current'}`} /> {toast}
          </div>
        )}
        {errorMsg && (
          <div className={`max-w-5xl mx-auto p-3 sm:p-4 mb-4 sm:mb-6 rounded-2xl flex items-start gap-3 shadow-2xl text-[10px] sm:text-sm uppercase tracking-widest bg-red-900/90 backdrop-blur-xl text-white ${t.fontHeading}`}>
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
                <div className="fixed bottom-28 sm:bottom-32 right-4 z-40 flex flex-col items-end">
                  {!isNightShiftOpen ? (
                    <button onClick={() => setIsNightShiftOpen(true)} className={`px-5 sm:px-7 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-widest rounded-2xl tap-effect hover-lift transition-all shadow-2xl ${t.btnWarning} ${t.fontHeading}`}><Moon size={18} className="sm:size-5 stroke-[3]" /> PLAN TOMORROW</button>
                  ) : (
                    <div className={`p-5 sm:p-7 w-[290px] sm:w-[330px] shadow-2xl shadow-black/40 rounded-3xl border-2 backdrop-blur-xl ${t.card} ${t.borderAccent}`}>
                       <div className={`flex justify-between items-center mb-5 sm:mb-6 border-b pb-3 sm:pb-4 ${t.borderAccent} opacity-80`}>
                         <h3 className={`font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 ${t.textAccent}`}><Moon size={14} className="sm:size-4 stroke-[3]"/> NIGHT SHIFT INBOX</h3>
                         <button onClick={() => setIsNightShiftOpen(false)} className={`transition-colors ${t.textMuted} hover:text-red-500 tap-effect`}><X size={16} className="sm:size-5 stroke-[3]"/></button>
                       </div>
                       <p className={`text-[9px] sm:text-[10px] font-bold mb-4 sm:mb-5 uppercase tracking-wider ${t.textMuted}`}>Add tasks for tomorrow, or pin a queue target.</p>
                       <div className="flex gap-2 mb-5 sm:mb-6">
                         <input type="text" value={newCustomMission} onChange={(e) => setNewCustomMission(e.target.value)} onKeyPress={(e) => {
                              if(e.key === 'Enter' && newCustomMission.trim()) {
                                 updateBrainFirebase({ customMissions: [...brain.customMissions, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }] });
                                 setNewCustomMission("");
                              }
                           }} placeholder="CUSTOM TASK..." className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase outline-none rounded-xl ${t.input}`} />
                         <button onClick={() => {
                              if(newCustomMission.trim()) {
                                 updateBrainFirebase({ customMissions: [...brain.customMissions, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }] });
                                 setNewCustomMission("");
                              }
                           }} className={`px-4 sm:px-5 py-2.5 rounded-xl tap-effect transition-all ${t.btnPrimary}`}><Send size={14} className="sm:size-4 stroke-[3]" /></button>
                       </div>
                       {brain.customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).length > 0 && (
                          <div className="mb-5 sm:mb-6 space-y-2">
                            {brain.customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).map(m => (
                               <div key={m.id} className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl flex justify-between items-center border ${t.cardInner} ${t.textMain} ${t.borderAccent}`}>
                                 <span className="truncate pr-2">• {m.text}</span>
                                 <button onClick={() => updateBrainFirebase({ customMissions: brain.customMissions.filter(task => task.id !== m.id) })} className={`transition-colors tap-effect ${t.textMuted} hover:text-red-500 shrink-0`}><Trash2 size={12} className="sm:size-3 stroke-[3]" /></button>
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
                                 }} className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between group border ${t.cardInner} hover:${t.borderAccent} tap-effect`}>
                                 <span className={`font-black text-[9px] sm:text-[10px] uppercase truncate pr-2 tracking-widest ${t.textMain}`}>{topic.title}</span>
                                 <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${t.badge} ${t.textAccent}`}>PIN</span>
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
              <div className={`fixed bottom-0 left-0 w-full border-t-2 z-50 overflow-x-auto hide-scrollbar backdrop-blur-xl ${t.header} ${t.borderAccent}`}>
                <div className="max-w-2xl mx-auto flex justify-between px-2 sm:px-3 py-2.5 sm:py-3 min-w-[320px]">
                  {[{ id: 'dashboard', icon: CalendarIcon, label: 'MISSION' }, { id: 'study', icon: Activity, label: 'QUEUE' }, { id: 'history', icon: History, label: 'HISTORY' }, { id: 'wisdom', icon: Folder, label: 'WISDOM' }, { id: 'vault', icon: BrainCircuit, label: 'DUMP' }, { id: 'urge', icon: ShieldAlert, label: 'URGE' }].map(tab => (
                    <button key={tab.id} onClick={() => setBrainTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl transition-all duration-300 tap-effect ${brainTab === tab.id ? t.textAccent + ' bg-current/10 shadow-lg shadow-current/10' : t.textMuted + ' hover:' + t.textMain + ' hover:bg-current/5'}`}>
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
