import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit, BookOpen, Mic, ShieldAlert, Calendar, CheckCircle2, Circle, Plus, Zap, Send, Skull, Trophy, FolderOpen, MoveRight, History, Sparkles, Activity, GripVertical, Moon, Flame, X, Settings, User, Image as ImageIcon, Lock, Search, Trash2, ChevronLeft, Check, Folder, Palette
} from "lucide-react";

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
    // DIRECT HOOK TO V4: Guaranteeing zero data loss.
    const local = localStorage.getItem('apexMindData_Final_V4');
    if (local) return JSON.parse(local);
  } catch (e) {
    console.error("Storage error", e);
  }
  return {};
};

const savedData = loadLocalData();

const THEMES = {
  brutalist: {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    appBg: 'bg-black text-white font-mono uppercase tracking-wider selection:bg-yellow-400 selection:text-black',
    devBar: 'bg-yellow-400 text-black border-b-4 border-white font-black',
    header: 'bg-black text-white border-b-4 border-white rounded-none',
    alertCard: 'bg-yellow-400 text-black border-4 border-white shadow-[4px_4px_0px_white] sm:shadow-[8px_8px_0px_white] rounded-none transform rotate-1 hover:rotate-0 transition-transform',
    primaryCard: 'bg-black text-white border-4 border-white shadow-[4px_4px_0px_white] sm:shadow-[8px_8px_0px_white] rounded-none',
    card: 'bg-black border-4 border-white shadow-[4px_4px_0px_white] sm:shadow-[8px_8px_0px_white] rounded-none',
    cardInner: 'bg-black border-2 border-white shadow-[2px_2px_0px_white] sm:shadow-[4px_4px_0px_white] hover:border-yellow-400 hover:shadow-[2px_2px_0px_#facc15] sm:hover:shadow-[4px_4px_0px_#facc15] transition-all rounded-none',
    textMain: 'text-white',
    textMuted: 'text-zinc-500',
    textAccent: 'text-yellow-400',
    textWarning: 'text-yellow-400',
    borderAccent: 'border-yellow-400',
    borderDanger: 'border-red-500 shadow-[2px_2px_0px_#ef4444] sm:shadow-[4px_4px_0px_#ef4444]',
    input: 'bg-black border-2 sm:border-4 border-white text-white placeholder:text-zinc-600 focus:border-yellow-400 rounded-none',
    btnPrimary: 'bg-white text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0px_white] sm:shadow-[4px_4px_0px_white] hover:shadow-[2px_2px_0px_#facc15] sm:hover:shadow-[4px_4px_0px_#facc15] active:translate-y-1 rounded-none disabled:opacity-50',
    btnWarning: 'bg-yellow-400 text-black border-2 sm:border-4 border-white hover:bg-white active:translate-y-1 shadow-[2px_2px_0px_white] sm:shadow-[4px_4px_0px_white] rounded-none disabled:opacity-50',
    btnDanger: 'bg-red-500 text-white border-2 sm:border-4 border-white hover:bg-red-600 shadow-[2px_2px_0px_white] sm:shadow-[4px_4px_0px_white] active:translate-y-1 rounded-none',
    navBg: 'bg-black border-t-4 border-white rounded-none',
    navItemActive: 'text-yellow-400 border-b-4 border-yellow-400 rounded-none',
    navItemInactive: 'text-zinc-600 border-b-4 border-transparent hover:text-white rounded-none',
    badge: 'bg-white text-black font-black border-2 border-black rounded-none',
    urgeBtn: 'bg-yellow-400 hover:bg-white text-black border-[6px] sm:border-8 border-black outline outline-2 sm:outline-4 outline-yellow-400 shadow-[8px_8px_0px_white] sm:shadow-[12px_12px_0px_white] active:translate-y-2 active:shadow-none rounded-none',
    fontHeading: 'font-black tracking-widest uppercase',
    iconBase: 'stroke-[2]',
    iconActive: 'stroke-[3]'
  },
  doraemonDark: {
    id: 'doraemonDark',
    name: 'Doraemon Dark',
    appBg: 'bg-[#09111e] text-slate-200 font-sans selection:bg-[#0096FE] selection:text-white',
    devBar: 'bg-[#FFD900] text-slate-900 border-b border-[#E6C300] font-bold',
    header: 'bg-gradient-to-r from-[#0096FE] to-[#0077CC] text-white border border-[#0096FE]/50 shadow-[0_10px_30px_rgba(0,150,254,0.3)] rounded-3xl',
    alertCard: 'bg-gradient-to-r from-[#FFD900] to-[#E6C300] text-slate-900 rounded-3xl shadow-[0_0_25px_rgba(255,217,0,0.15)]',
    primaryCard: 'bg-gradient-to-br from-[#0096FE] to-[#0077CC] text-white rounded-3xl shadow-lg',
    card: 'bg-[#152238] border border-[#1E3A5F] shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-3xl',
    cardInner: 'bg-[#0B132B] border border-[#1E3A5F] hover:border-[#0096FE]/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-slate-200',
    textMuted: 'text-slate-400',
    textAccent: 'text-[#0096FE]',
    textWarning: 'text-[#FFD900]',
    borderAccent: 'border-[#0096FE]',
    borderDanger: 'border-[#E50020] shadow-[0_0_15px_rgba(229,0,32,0.15)]',
    input: 'bg-[#0B132B] border border-[#1E3A5F] text-slate-200 placeholder:text-slate-600 focus:border-[#0096FE] focus:ring-2 focus:ring-[#0096FE]/30 rounded-full',
    btnPrimary: 'bg-[#0096FE] text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(0,150,254,0.3)] rounded-full disabled:opacity-50',
    btnWarning: 'bg-[#FFD900] text-slate-900 hover:bg-yellow-400 shadow-[0_4px_15px_rgba(255,217,0,0.3)] rounded-full disabled:opacity-50',
    btnDanger: 'bg-[#E50020] text-white hover:bg-red-500 shadow-[0_0_15px_rgba(229,0,32,0.3)] rounded-full',
    navBg: 'bg-[#111827]/90 border-t border-[#0096FE]/30 shadow-[0_-10px_40px_rgba(0,150,254,0.15)] rounded-t-2xl sm:rounded-t-3xl backdrop-blur-md',
    navItemActive: 'bg-[#0096FE] text-white shadow-[0_0_15px_rgba(0,150,254,0.4)] rounded-full',
    navItemInactive: 'text-slate-400 hover:bg-[#1E293B] hover:text-[#33AAFF] rounded-full',
    badge: 'bg-[#0B132B] text-slate-400 border border-[#1E3A5F] rounded-full',
    urgeBtn: 'bg-gradient-to-br from-[#E50020] to-[#B30019] hover:from-[#FF1A38] hover:to-[#E50020] text-white border-[6px] sm:border-8 border-[#09111e] outline outline-2 sm:outline-4 outline-[#E50020]/50 shadow-[0_0_40px_rgba(229,0,32,0.5)] rounded-full',
    fontHeading: 'font-bold tracking-normal uppercase sm:capitalize',
    iconBase: 'stroke-[2]',
    iconActive: 'stroke-[2.5]'
  },
  doraemonLight: {
    id: 'doraemonLight',
    name: 'Doraemon Light',
    appBg: 'bg-[#FAFAFA] text-slate-800 font-sans selection:bg-[#0096FE] selection:text-white',
    devBar: 'bg-[#FFD900] text-slate-900 border-b border-[#E6C300] font-bold',
    header: 'bg-gradient-to-r from-[#0096FE] to-[#33AAFF] text-white shadow-lg rounded-3xl',
    alertCard: 'bg-gradient-to-r from-[#FFD900] to-[#FFEA75] text-slate-900 rounded-3xl shadow-md',
    primaryCard: 'bg-gradient-to-br from-[#0096FE] to-[#33AAFF] text-white rounded-3xl shadow-lg',
    card: 'bg-white border border-[#E2E8F0] shadow-xl rounded-3xl',
    cardInner: 'bg-slate-50 border border-[#E2E8F0] hover:border-[#0096FE]/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-slate-800',
    textMuted: 'text-slate-500',
    textAccent: 'text-[#0096FE]',
    textWarning: 'text-[#E50020]',
    borderAccent: 'border-[#0096FE]',
    borderDanger: 'border-[#E50020] shadow-sm',
    input: 'bg-slate-50 border border-[#E2E8F0] text-slate-800 placeholder:text-slate-400 focus:border-[#0096FE] focus:ring-2 focus:ring-[#0096FE]/30 rounded-full',
    btnPrimary: 'bg-[#0096FE] text-white hover:bg-blue-600 shadow-md rounded-full disabled:opacity-50',
    btnWarning: 'bg-[#FFD900] text-slate-900 hover:bg-yellow-500 shadow-md rounded-full disabled:opacity-50',
    btnDanger: 'bg-[#E50020] text-white hover:bg-red-600 shadow-md rounded-full',
    navBg: 'bg-white/90 border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-2xl sm:rounded-t-3xl backdrop-blur-md',
    navItemActive: 'bg-[#0096FE] text-white shadow-md rounded-full',
    navItemInactive: 'text-slate-500 hover:bg-slate-100 hover:text-[#0096FE] rounded-full',
    badge: 'bg-slate-100 text-slate-600 border border-slate-200 rounded-full',
    urgeBtn: 'bg-gradient-to-br from-[#E50020] to-[#B30019] text-white border-[6px] sm:border-8 border-white outline outline-2 sm:outline-4 outline-[#E50020]/50 shadow-xl hover:scale-105 active:scale-95 transition-all rounded-full',
    fontHeading: 'font-bold text-slate-900 tracking-normal uppercase sm:capitalize',
    iconBase: 'stroke-[2]',
    iconActive: 'stroke-[2.5]'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber-Glass',
    appBg: 'bg-[#050b14] text-cyan-50 font-sans selection:bg-cyan-500 selection:text-white',
    devBar: 'bg-cyan-900 text-cyan-100 border-b border-cyan-500 font-bold',
    header: 'bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-3xl',
    alertCard: 'bg-[#0a192f] border border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)] rounded-3xl',
    primaryCard: 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-100 rounded-3xl shadow-lg',
    card: 'bg-[#0a192f]/60 backdrop-blur-lg border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl',
    cardInner: 'bg-[#050b14]/50 border border-cyan-500/10 hover:border-cyan-500/40 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-cyan-50',
    textMuted: 'text-cyan-600/80',
    textAccent: 'text-cyan-400',
    textWarning: 'text-teal-400',
    borderAccent: 'border-cyan-500/50',
    borderDanger: 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    input: 'bg-[#050b14]/50 border border-cyan-500/20 text-cyan-50 placeholder:text-cyan-800 focus:border-cyan-400 rounded-xl',
    btnPrimary: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl disabled:opacity-50',
    btnWarning: 'bg-teal-500/20 text-teal-300 border border-teal-500/50 hover:bg-teal-500/40 rounded-xl disabled:opacity-50',
    btnDanger: 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/40 rounded-xl',
    navBg: 'bg-[#0a192f]/90 backdrop-blur-xl border-t border-cyan-500/30 rounded-t-2xl sm:rounded-t-3xl',
    navItemActive: 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 rounded-xl',
    navItemInactive: 'text-cyan-800 hover:text-cyan-500',
    badge: 'bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-md',
    urgeBtn: 'bg-[#050b14] text-red-400 border-[6px] sm:border-4 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] rounded-3xl',
    fontHeading: 'font-sans tracking-wide uppercase',
    iconBase: 'stroke-[1.5]',
    iconActive: 'stroke-[2]'
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Bento',
    appBg: 'bg-[#0b0914] text-fuchsia-50 font-sans selection:bg-fuchsia-500 selection:text-white',
    devBar: 'bg-fuchsia-900 text-fuchsia-100 border-b border-fuchsia-500/50 font-bold',
    header: 'bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 backdrop-blur-xl border border-white/10 text-white rounded-2xl sm:rounded-[2rem] shadow-xl',
    alertCard: 'bg-white/5 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-200 rounded-2xl sm:rounded-[2rem]',
    primaryCard: 'bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80 border border-white/20 text-white rounded-2xl sm:rounded-[2rem] shadow-lg',
    card: 'bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl sm:rounded-[2rem]',
    cardInner: 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 rounded-xl sm:rounded-2xl transition-all',
    textMain: 'text-fuchsia-50',
    textMuted: 'text-fuchsia-200/40',
    textAccent: 'text-fuchsia-400',
    textWarning: 'text-violet-300',
    borderAccent: 'border-fuchsia-500/50',
    borderDanger: 'border-rose-500/50',
    input: 'bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:border-fuchsia-400 rounded-xl sm:rounded-2xl',
    btnPrimary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 shadow-[0_4px_20px_rgba(192,38,211,0.3)] rounded-xl sm:rounded-2xl disabled:opacity-50',
    btnWarning: 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white hover:opacity-90 rounded-xl sm:rounded-2xl disabled:opacity-50',
    btnDanger: 'bg-gradient-to-r from-rose-600/80 to-pink-600/80 text-white hover:opacity-90 rounded-xl sm:rounded-2xl',
    navBg: 'bg-[#0b0914]/80 backdrop-blur-3xl border-t border-white/10 rounded-t-2xl sm:rounded-t-[2.5rem]',
    navItemActive: 'text-fuchsia-300 bg-white/10 rounded-xl sm:rounded-2xl',
    navItemInactive: 'text-white/30 hover:text-white/60',
    badge: 'bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-700/50 rounded-lg sm:rounded-xl',
    urgeBtn: 'bg-gradient-to-br from-rose-600 to-purple-900 text-white rounded-full shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 transition-all',
    fontHeading: 'font-sans font-medium tracking-normal',
    iconBase: 'stroke-[2]',
    iconActive: 'stroke-[2.5]'
  },
  zen: {
    id: 'zen',
    name: 'Zen Minimalist',
    appBg: 'bg-[#fafafa] text-zinc-900 font-serif selection:bg-zinc-200 selection:text-black',
    devBar: 'bg-zinc-100 text-zinc-500 border-b border-zinc-200 font-medium',
    header: 'bg-white text-zinc-900 border border-zinc-200 shadow-sm rounded-none',
    alertCard: 'bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-none',
    primaryCard: 'bg-zinc-900 text-white rounded-none shadow-md',
    card: 'bg-white border border-zinc-200 shadow-sm rounded-none',
    cardInner: 'bg-zinc-50/50 border border-zinc-100 hover:border-zinc-300 rounded-none transition-all',
    textMain: 'text-zinc-900',
    textMuted: 'text-zinc-400',
    textAccent: 'text-zinc-900 font-bold',
    textWarning: 'text-zinc-600',
    borderAccent: 'border-zinc-900',
    borderDanger: 'border-red-200 text-red-700',
    input: 'bg-transparent border-b border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 rounded-none px-2 py-2',
    btnPrimary: 'bg-zinc-900 text-white hover:bg-zinc-800 rounded-none disabled:opacity-50',
    btnWarning: 'bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 rounded-none disabled:opacity-50',
    btnDanger: 'bg-red-50 text-red-700 hover:bg-red-100 rounded-none',
    navBg: 'bg-white/95 backdrop-blur border-t border-zinc-200',
    navItemActive: 'text-zinc-900 border-b-2 border-zinc-900',
    navItemInactive: 'text-zinc-400 hover:text-zinc-600',
    badge: 'bg-zinc-100 text-zinc-600 rounded-none px-2 py-0.5 text-[10px] sm:text-xs',
    urgeBtn: 'bg-white text-zinc-900 border border-zinc-300 shadow-sm hover:shadow-md active:scale-95 transition-all rounded-full',
    fontHeading: 'font-serif tracking-tight',
    iconBase: 'stroke-[1.5]',
    iconActive: 'stroke-[2]'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stealth',
    appBg: 'bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-amber-500/30 selection:text-amber-200',
    devBar: 'bg-amber-500/10 text-amber-500 border-b border-amber-500/20 font-bold',
    header: 'bg-[#0a0a0a] text-amber-500 border border-white/5 rounded-xl shadow-2xl',
    alertCard: 'bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-xl',
    primaryCard: 'bg-[#111] border border-amber-500/30 text-zinc-200 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.05)]',
    card: 'bg-[#111] border border-white/5 shadow-2xl rounded-xl',
    cardInner: 'bg-[#161616] border border-white/5 hover:border-amber-500/30 rounded-lg sm:rounded-xl transition-colors',
    textMain: 'text-zinc-300',
    textMuted: 'text-zinc-600',
    textAccent: 'text-amber-500',
    textWarning: 'text-amber-300',
    borderAccent: 'border-amber-500/50',
    borderDanger: 'border-red-900/50 text-red-500',
    input: 'bg-[#0a0a0a] border border-white/10 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50 rounded-lg',
    btnPrimary: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg disabled:opacity-50',
    btnWarning: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg disabled:opacity-50',
    btnDanger: 'bg-red-950/30 text-red-500 border border-red-900/30 hover:bg-red-900/50 rounded-lg',
    navBg: 'bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 rounded-t-xl',
    navItemActive: 'text-amber-500 bg-amber-500/10 rounded-lg',
    navItemInactive: 'text-zinc-600 hover:text-zinc-400',
    badge: 'bg-[#0a0a0a] text-amber-500/70 border border-white/5 rounded',
    urgeBtn: 'bg-[#0a0a0a] text-amber-500 border border-amber-500/20 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[inset_0_0_40px_rgba(245,158,11,0.2)] rounded-2xl transition-all',
    fontHeading: 'font-mono tracking-wider uppercase',
    iconBase: 'stroke-[1.5]',
    iconActive: 'stroke-[2]'
  },
  shinchan: {
    id: 'shinchan',
    name: 'Action Kamen (Shinchan)',
    appBg: 'bg-[#ffeb3b] text-[#111] font-sans selection:bg-[#ff0000] selection:text-white',
    devBar: 'bg-[#ff0000] text-white border-b-4 border-black font-black',
    header: 'bg-[#00a8ff] text-white border-[3px] sm:border-4 border-black rounded-full m-2 shadow-[2px_2px_0px_#111] sm:shadow-[4px_4px_0px_#111]',
    alertCard: 'bg-[#ff0000] text-white border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#111] sm:shadow-[6px_6px_0px_#111] rounded-2xl sm:rounded-3xl transform -rotate-1',
    primaryCard: 'bg-[#00a8ff] text-white border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#111] sm:shadow-[6px_6px_0px_#111] rounded-2xl sm:rounded-3xl',
    card: 'bg-white border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#111] sm:shadow-[6px_6px_0px_#111] rounded-2xl sm:rounded-3xl',
    cardInner: 'bg-[#fff9c4] border-2 border-black hover:bg-[#ffeb3b] transition-all rounded-xl sm:rounded-2xl',
    textMain: 'text-black',
    textMuted: 'text-zinc-600',
    textAccent: 'text-[#ff0000]',
    textWarning: 'text-[#00a8ff]',
    borderAccent: 'border-[#ff0000]',
    borderDanger: 'border-[#ff0000] shadow-[2px_2px_0px_#ff0000] sm:shadow-[4px_4px_0px_#ff0000]',
    input: 'bg-white border-[3px] sm:border-4 border-black text-black placeholder:text-zinc-500 focus:border-[#ff0000] focus:ring-2 sm:focus:ring-4 focus:ring-[#ff0000]/20 rounded-full',
    btnPrimary: 'bg-[#00a8ff] text-white font-black border-[3px] sm:border-4 border-black hover:bg-[#008bcb] shadow-[2px_2px_0px_#111] sm:shadow-[4px_4px_0px_#111] active:translate-y-1 active:shadow-none rounded-full',
    btnWarning: 'bg-[#ffeb3b] text-black font-black border-[3px] sm:border-4 border-black hover:bg-[#fbc02d] shadow-[2px_2px_0px_#111] sm:shadow-[4px_4px_0px_#111] active:translate-y-1 active:shadow-none rounded-full',
    btnDanger: 'bg-[#ff0000] text-white font-black border-[3px] sm:border-4 border-black hover:bg-[#cc0000] shadow-[2px_2px_0px_#111] sm:shadow-[4px_4px_0px_#111] rounded-full',
    navBg: 'bg-white/90 border-t-[3px] sm:border-t-4 border-black rounded-t-2xl sm:rounded-t-3xl backdrop-blur-md',
    navItemActive: 'bg-[#ff0000] text-white shadow-[2px_2px_0px_#111] sm:shadow-[4px_4px_0px_#111] rounded-full',
    navItemInactive: 'text-zinc-500 hover:text-black',
    badge: 'bg-[#ffeb3b] text-black border-2 border-black font-black rounded-full',
    urgeBtn: 'bg-[#ff0000] text-white border-[6px] sm:border-8 border-black outline outline-2 sm:outline-4 outline-[#00a8ff] shadow-[8px_8px_0px_#111] sm:shadow-[12px_12px_0px_#111] active:translate-y-2 active:shadow-none rounded-2xl sm:rounded-3xl',
    fontHeading: 'font-black tracking-wide uppercase',
    iconBase: 'stroke-[2.5]',
    iconActive: 'stroke-[3]'
  },
  squid: {
    id: 'squid',
    name: 'Frontman (Squid Game)',
    appBg: 'bg-[#111] text-[#eee] font-sans selection:bg-[#ff0055] selection:text-white',
    devBar: 'bg-[#ff0055] text-white border-b-2 border-black font-bold tracking-widest',
    header: 'bg-[#ff0055] text-white border-b-4 border-black rounded-none shadow-[0_4px_20px_rgba(255,0,85,0.4)]',
    alertCard: 'bg-[#ff0055] text-white border-2 border-[#ff0055] rounded-none shadow-[0_0_15px_rgba(255,0,85,0.5)]',
    primaryCard: 'bg-[#00c896] text-black border-2 border-[#00c896] rounded-none shadow-[0_0_15px_rgba(0,200,150,0.4)]',
    card: 'bg-[#1a1a1a] border-2 border-[#333] shadow-2xl rounded-none',
    cardInner: 'bg-[#222] border border-[#444] hover:border-[#ff0055] transition-all rounded-none',
    textMain: 'text-[#eee]',
    textMuted: 'text-[#888]',
    textAccent: 'text-[#00c896]',
    textWarning: 'text-[#ff0055]',
    borderAccent: 'border-[#ff0055]',
    borderDanger: 'border-[#ff0055] shadow-[0_0_10px_rgba(255,0,85,0.5)]',
    input: 'bg-[#111] border-2 border-[#444] text-white placeholder:text-[#666] focus:border-[#00c896] rounded-none',
    btnPrimary: 'bg-[#00c896] text-black font-black border-none hover:bg-[#00e6aa] shadow-[0_0_15px_rgba(0,200,150,0.4)] rounded-none',
    btnWarning: 'bg-[#111] text-[#00c896] border-2 border-[#00c896] hover:bg-[#00c896] hover:text-black rounded-none',
    btnDanger: 'bg-[#ff0055] text-white font-black hover:bg-[#cc0044] rounded-none',
    navBg: 'bg-[#111]/95 border-t-2 border-[#333] backdrop-blur-md rounded-none',
    navItemActive: 'text-[#ff0055] border-t-2 sm:border-t-4 border-[#ff0055]',
    navItemInactive: 'text-[#666] hover:text-[#00c896]',
    badge: 'bg-[#ff0055] text-white font-bold rounded-sm px-2',
    urgeBtn: 'bg-[#1a1a1a] text-[#ff0055] border-4 border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.4)] sm:shadow-[0_0_40px_rgba(255,0,85,0.6)] hover:bg-[#ff0055] hover:text-white transition-colors rounded-full',
    fontHeading: 'font-bold tracking-widest uppercase',
    iconBase: 'stroke-[2]',
    iconActive: 'stroke-[2.5]'
  },
  matrix: {
    id: 'matrix',
    name: 'The Matrix',
    appBg: 'bg-[#000] text-[#00ff00] font-mono selection:bg-[#00ff00] selection:text-black',
    devBar: 'bg-[#003300] text-[#00ff00] border-b border-[#00ff00] font-normal',
    header: 'bg-[#000] text-[#00ff00] border border-[#00ff00] rounded-none m-2',
    alertCard: 'bg-[#002200] text-[#00ff00] border border-[#00ff00] shadow-[0_0_15px_#00ff00] rounded-none',
    primaryCard: 'bg-[#001100] text-[#00ff00] border border-[#00ff00] rounded-none',
    card: 'bg-[#000] border border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.2)] rounded-none',
    cardInner: 'bg-[#000] border border-[#005500] hover:border-[#00ff00] transition-colors rounded-none',
    textMain: 'text-[#00ff00]',
    textMuted: 'text-[#008800]',
    textAccent: 'text-[#00ff00]',
    textWarning: 'text-[#00ff00]',
    borderAccent: 'border-[#00ff00]',
    borderDanger: 'border-[#ff0000] text-[#ff0000]',
    input: 'bg-[#000] border border-[#00ff00] text-[#00ff00] placeholder:text-[#005500] focus:ring-1 focus:ring-[#00ff00] rounded-none',
    btnPrimary: 'bg-[#000] text-[#00ff00] border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-colors rounded-none',
    btnWarning: 'bg-[#003300] text-[#00ff00] border border-[#00ff00] hover:bg-[#00ff00] hover:text-black rounded-none',
    btnDanger: 'bg-[#330000] text-[#ff0000] border border-[#ff0000] rounded-none',
    navBg: 'bg-[#000]/90 border-t border-[#00ff00] backdrop-blur-sm rounded-none',
    navItemActive: 'bg-[#00ff00] text-black',
    navItemInactive: 'text-[#008800] hover:text-[#00ff00]',
    badge: 'bg-[#00ff00] text-black rounded-none',
    urgeBtn: 'bg-[#000] text-[#00ff00] border border-[#00ff00] shadow-[0_0_10px_#00ff00] sm:shadow-[0_0_20px_#00ff00] animate-pulse rounded-none',
    fontHeading: 'font-mono tracking-widest uppercase',
    iconBase: 'stroke-[1]',
    iconActive: 'stroke-[2]'
  },
  deepSpace: {
    id: 'deepSpace',
    name: 'Deep Space',
    appBg: 'bg-[#02000a] text-[#e0e7ff] font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e004a] via-[#02000a] to-[#000000] selection:bg-cyan-500 selection:text-white',
    devBar: 'bg-cyan-950 text-cyan-200 border-b border-cyan-800 font-bold',
    header: 'bg-black/40 backdrop-blur-md border border-white/10 text-cyan-100 rounded-2xl sm:rounded-3xl m-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    alertCard: 'bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border border-fuchsia-500/30 text-fuchsia-100 rounded-2xl sm:rounded-3xl',
    primaryCard: 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 text-cyan-50 rounded-2xl sm:rounded-3xl',
    card: 'bg-[#0a0514]/60 backdrop-blur-lg border border-white/5 shadow-2xl rounded-2xl sm:rounded-3xl',
    cardInner: 'bg-[#130b24]/50 border border-white/5 hover:border-cyan-500/30 hover:bg-[#1a0f30]/80 transition-all rounded-xl sm:rounded-2xl',
    textMain: 'text-[#e0e7ff]',
    textMuted: 'text-[#6366f1]',
    textAccent: 'text-cyan-400',
    textWarning: 'text-fuchsia-400',
    borderAccent: 'border-cyan-500/50',
    borderDanger: 'border-rose-500/50',
    input: 'bg-[#000]/50 border border-white/10 text-cyan-100 placeholder:text-indigo-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl sm:rounded-2xl',
    btnPrimary: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-none shadow-[0_0_15px_rgba(6,182,212,0.4)] sm:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] rounded-xl sm:rounded-2xl',
    btnWarning: 'bg-indigo-900/50 text-cyan-300 border border-cyan-800 hover:bg-cyan-900/50 rounded-xl sm:rounded-2xl',
    btnDanger: 'bg-rose-900/50 text-rose-200 border border-rose-800 rounded-xl sm:rounded-2xl',
    navBg: 'bg-[#02000a]/80 border-t border-white/10 backdrop-blur-xl rounded-t-2xl sm:rounded-t-3xl',
    navItemActive: 'text-cyan-300 bg-cyan-950/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] rounded-lg sm:rounded-xl',
    navItemInactive: 'text-indigo-500 hover:text-cyan-400',
    badge: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-md sm:rounded-lg',
    urgeBtn: 'bg-[#000] text-fuchsia-500 border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.5)] sm:shadow-[0_0_50px_rgba(217,70,239,0.5)] hover:shadow-[0_0_80px_rgba(217,70,239,0.8)] rounded-full transition-all',
    fontHeading: 'font-medium tracking-widest uppercase',
    iconBase: 'stroke-[1.5]',
    iconActive: 'stroke-[2]'
  },
  parchment: {
    id: 'parchment',
    name: 'Scholar Parchment',
    appBg: 'bg-[#f4ebd8] text-[#3e2723] font-serif selection:bg-[#795548] selection:text-[#f4ebd8]',
    devBar: 'bg-[#3e2723] text-[#d7ccc8] font-bold',
    header: 'bg-[#efebe9] text-[#3e2723] border-b border-[#d7ccc8] rounded-none',
    alertCard: 'bg-[#ffecb3] text-[#e65100] border border-[#ffca28] rounded-md shadow-sm',
    primaryCard: 'bg-[#4e342e] text-[#efebe9] rounded-md shadow-md',
    card: 'bg-[#fdf8ed] border border-[#d7ccc8] shadow-sm rounded-md',
    cardInner: 'bg-[#fffcf7] border border-[#efebe9] hover:border-[#8d6e63] transition-colors rounded-sm',
    textMain: 'text-[#3e2723]',
    textMuted: 'text-[#8d6e63]',
    textAccent: 'text-[#bf360c]',
    textWarning: 'text-[#e65100]',
    borderAccent: 'border-[#5d4037]',
    borderDanger: 'border-[#c62828]',
    input: 'bg-transparent border-b-2 border-[#bcaaa4] text-[#3e2723] placeholder:text-[#bcaaa4] focus:border-[#3e2723] rounded-none px-2',
    btnPrimary: 'bg-[#3e2723] text-[#d7ccc8] hover:bg-[#5d4037] rounded-sm',
    btnWarning: 'bg-[#d7ccc8] text-[#3e2723] hover:bg-[#bcaaa4] rounded-sm',
    btnDanger: 'bg-[#c62828] text-white hover:bg-[#b71c1c] rounded-sm',
    navBg: 'bg-[#f4ebd8]/95 border-t border-[#d7ccc8] backdrop-blur',
    navItemActive: 'text-[#bf360c] border-b-2 border-[#bf360c]',
    navItemInactive: 'text-[#8d6e63] hover:text-[#3e2723]',
    badge: 'bg-[#e7ceb5] text-[#3e2723] font-bold rounded-sm border border-[#d7ccc8]',
    urgeBtn: 'bg-[#fffcf7] text-[#c62828] border-2 border-[#c62828] hover:bg-[#c62828] hover:text-white rounded-full shadow-lg transition-colors',
    fontHeading: 'font-serif font-bold tracking-tight',
    iconBase: 'stroke-[1.5]',
    iconActive: 'stroke-[2]'
  }
};

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
  
  const baseDate = new Date();
  const todayStr = formatDate(baseDate);

  const [activeTheme, setActiveTheme] = useState(savedData.activeTheme ?? 'brutalist');
  const t = THEMES[activeTheme] || THEMES['brutalist'];

  const [userName, setUserName] = useState(savedData.userName ?? "Prateek Maurya");
  const [profilePic, setProfilePic] = useState(savedData.profilePic ?? null);

  const [syllabusCategories, setSyllabusCategories] = useState(savedData.syllabusCategories ?? ["Raw Backlog"]);
  const [stagingTopics, setStagingTopics] = useState(savedData.stagingTopics ?? []);
  const [studyTopics, setStudyTopics] = useState(savedData.studyTopics ?? []);
  const [masteredTopics, setMasteredTopics] = useState(savedData.masteredTopics ?? []);

  const [wisdomCategories, setWisdomCategories] = useState(savedData.wisdomCategories ?? ["Quick Thoughts"]);
  const [wisdomNotes, setWisdomNotes] = useState(savedData.wisdomNotes ?? []);
  const [expandedWisdomCategory, setExpandedWisdomCategory] = useState(null);
  
  const [vaultNotes, setVaultNotes] = useState(savedData.vaultNotes ?? []);
  const [vaultCategories, setVaultCategories] = useState(savedData.vaultCategories ?? ["Others"]);
  const [expandedVaultCategory, setExpandedVaultCategory] = useState(null);
  const [isVaultSorting, setIsVaultSorting] = useState(false);
  
  const [newSyllabusCat, setNewSyllabusCat] = useState("");
  const [selectedSyllabusCat, setSelectedSyllabusCat] = useState("Raw Backlog");
  const [newTopic, setNewTopic] = useState("");
  
  const [newWisdomCat, setNewWisdomCat] = useState("");
  const [selectedWisdomCat, setSelectedWisdomCat] = useState("Quick Thoughts");
  const [newWisdom, setNewWisdom] = useState("");
  const [newNote, setNewNote] = useState("");
  
  const [groqKey, setGroqKey] = useState(savedData.groqKey ?? "");

  const [urgeTimer, setUrgeTimer] = useState(null);
  const [isUrgeActive, setIsUrgeActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [urgeQuotes, setUrgeQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState("");
  const [isOracleThinking, setIsOracleThinking] = useState(false);

  const [globalDeadlineDays, setGlobalDeadlineDays] = useState(savedData.globalDeadlineDays ?? 30);
  const [lastActiveDate, setLastActiveDate] = useState(savedData.lastActiveDate ?? todayStr);
  
  const [isNightTime, setIsNightTime] = useState(
    new Date().getHours() >= 21 || new Date().getHours() < 4
  );

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const [customMissions, setCustomMissions] = useState(savedData.customMissions ?? []);
  const [isNightShiftOpen, setIsNightShiftOpen] = useState(false);
  const [newCustomMission, setNewCustomMission] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      setIsNightTime(hour >= 21 || hour < 4);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🚀 BULLETPROOF V4 SAVE ENGINE 🚀
  // Always write directly to V4 locker so no data gets lost between themes.
  useEffect(() => {
    const dataPayload = {
      userName, profilePic, syllabusCategories, stagingTopics, studyTopics,
      masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories,
      globalDeadlineDays, customMissions, groqKey, lastActiveDate, activeTheme
    };
    localStorage.setItem('apexMindData_Final_V4', JSON.stringify(dataPayload));
  }, [userName, profilePic, syllabusCategories, stagingTopics, studyTopics, masteredTopics, wisdomCategories, wisdomNotes, vaultNotes, vaultCategories, globalDeadlineDays, customMissions, groqKey, lastActiveDate, activeTheme]);

  useEffect(() => {
    if (lastActiveDate !== todayStr) {
      const partsOld = lastActiveDate.split('-');
      const partsNow = todayStr.split('-');
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

  const LongPressItem = ({ item, onDelete, children, duration = 800 }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    
    const longPressEvent = useLongPress(() => {
      setShowConfirm(true);
    }, duration);

    return (
      <div {...longPressEvent} className="relative group cursor-pointer w-full h-full">
        {children}
        {showConfirm && (
          <div className={`absolute inset-0 p-4 flex flex-col items-center justify-center z-10 ${t.alertCard}`}>
            <span className={`text-[10px] sm:text-xs mb-3 text-center ${t.fontHeading}`}>Delete this item?</span>
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); setShowConfirm(false); }} 
                className={`px-4 sm:px-6 py-2 text-xs sm:text-base ${t.btnDanger} ${t.fontHeading}`}
              >
                Yes
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }} 
                className={`px-4 sm:px-6 py-2 text-xs sm:text-base ${t.btnPrimary} ${t.fontHeading}`}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const deleteStagingTopic = (id) => setStagingTopics(prev => prev.filter(t => t.id !== id));
  const deleteWisdomNote = (id) => setWisdomNotes(prev => prev.filter(n => n.id !== id));
  const deleteVaultNote = (id) => setVaultNotes(prev => prev.filter(n => n.id !== id));
  const deleteStudyTopic = (id) => setStudyTopics(prev => prev.filter(t => t.id !== id));

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
        2. EXCEPTION: Look at the "Other unclassified ideas". If the New Idea PLUS at least 2 of list ideas share a strong common theme (meaning 3 or more ideas total), you MUST invent a new category name (1-2 words max) for them.
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
    
    let paceStatus = { text: "ON TRACK", color: t.textMain };
    if (pace < 1 && remainingChapters > 0) paceStatus = { text: "DANGER", color: "text-red-500" };
    else if (pace >= 1 && pace <= 1.5) paceStatus = { text: "WARNING", color: t.textWarning };
    else if (remainingChapters === 0) paceStatus = { text: "STANDBY", color: t.textMuted };

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
      <div className="space-y-6 sm:space-y-8 pb-10">
        
        <div className={`p-4 sm:p-6 ${t.alertCard}`}>
          <h3 className={`text-[10px] sm:text-xs tracking-widest mb-3 sm:mb-4 flex items-center gap-2 border-b-2 border-black/20 pb-2 ${t.fontHeading}`}>
            <Zap size={16} /> PROTOCOL INITIATED
          </h3>
          <p className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug">
            "{quoteOfTheDay}"
          </p>
        </div>

        <div className={`p-4 sm:p-6 relative overflow-hidden ${t.card}`}>
          <h2 className={`text-[9px] sm:text-[10px] tracking-widest mb-4 border-b-2 border-white/20 pb-2 ${t.fontHeading} ${t.textAccent}`}>GLOBAL DEADLINE</h2>
          <div className="flex justify-between items-end">
            
            <div className="flex items-baseline gap-1 sm:gap-2 border-b-4 border-transparent hover:border-white/20 transition-colors focus-within:border-yellow-400">
              <input 
                type="number" 
                value={globalDeadlineDays}
                onChange={(e) => setGlobalDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-16 sm:w-24 text-4xl sm:text-6xl tracking-tighter outline-none p-0 m-0 bg-transparent ${t.textMain} ${t.fontHeading}`}
              />
              <span className={`text-base sm:text-xl ${t.textAccent} ${t.fontHeading}`}>DAYS</span>
            </div>

            <div className="text-right">
              <p className={`text-[8px] sm:text-[10px] tracking-widest mb-1 ${t.textMuted} ${t.fontHeading}`}>PACE DETECTOR</p>
              <p className={`text-lg sm:text-2xl ${t.fontHeading} ${paceStatus.color}`}>
                {pace} <span className="text-[9px] sm:text-xs">CH/DAY</span>
              </p>
              <p className={`text-[8px] sm:text-[10px] tracking-widest mt-1 ${t.fontHeading} ${paceStatus.color}`}>{paceStatus.text}</p>
            </div>
          </div>
          
          {stagingTopics.length > 0 && (
            <div className={`mt-5 sm:mt-8 p-3 sm:p-5 relative ${t.primaryCard}`}>
              <h3 className={`text-[9px] sm:text-[10px] tracking-widest mb-2 ${t.fontHeading}`}>CURRENT STRIKE TARGET</h3>
              <h2 className={`text-base sm:text-xl truncate ${t.fontHeading}`}>{stagingTopics[0].title}</h2>
              <span className={`text-[8px] sm:text-[10px] px-2 py-1 mt-2 inline-block ${t.badge} ${t.fontHeading}`}>
                {stagingTopics[0].category}
              </span>
              <button 
                onClick={() => handleStartRevision(stagingTopics[0].id)}
                className={`w-full mt-4 py-2.5 sm:py-3 text-xs sm:text-sm transition-all active:scale-95 flex justify-center items-center gap-2 ${t.btnWarning} ${t.fontHeading}`}
              >
                TARGET DESTROYED
              </button>
            </div>
          )}
        </div>

        {todaysCustomMissions.length > 0 && (
          <div className="pt-2">
            <h3 className={`text-[9px] sm:text-[10px] tracking-widest mb-3 sm:mb-4 ${t.textAccent} ${t.fontHeading}`}>TODAY'S MISSIONS</h3>
            {todaysCustomMissions.map((mission) => (
              <div key={mission.id} className={`p-3 sm:p-4 mb-2 sm:mb-3 flex items-center justify-between ${t.cardInner}`}>
                <span className={`text-xs sm:text-sm ${t.fontHeading} ${t.textMain}`}>{mission.text}</span>
                <button 
                  onClick={() => setCustomMissions(prev => prev.filter(m => m.id !== mission.id))}
                  className={`${t.textMain} opacity-60 hover:opacity-100 transition-opacity`}
                >
                  <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 ${t.iconActive}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <h3 className={`text-[9px] sm:text-[10px] tracking-widest mb-3 sm:mb-4 ${t.textAccent} ${t.fontHeading}`}>MANDATORY REVISIONS (TODAY)</h3>
          {todaysRevisions.length === 0 ? (
            <div className={`p-6 sm:p-8 text-center border-dashed text-xs sm:text-sm ${t.card} ${t.textMuted} ${t.fontHeading}`}>
              SYSTEM CLEAR
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todaysRevisions.map((rev, idx) => (
                <div key={idx} className={`p-3 sm:p-4 flex items-center justify-between transition-all hover:-translate-y-1 ${t.cardInner} ${rev.isOverdue ? t.borderDanger : ''}`}>
                  <div>
                    <h4 className={`text-xs sm:text-sm flex items-center gap-2 ${t.fontHeading} ${t.textMain}`}>
                      {rev.title} 
                      {rev.isOverdue && <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 tracking-widest ${t.btnDanger}`}>OVERDUE</span>}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 ${t.badge} ${t.fontHeading}`}>{rev.category}</span>
                      <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 ${t.badge} ${t.fontHeading}`}>DAY {rev.dayOffset}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => markRevisionComplete(rev.topicId, rev.targetDate, rev.dayOffset)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all active:scale-90 shrink-0 ${t.btnPrimary}`}
                  >
                    <Check className={`w-5 h-5 sm:w-6 sm:h-6 ${t.iconActive}`} />
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
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className={`p-4 sm:p-6 ${t.card}`}>
        <div className="flex justify-between items-center mb-4 sm:mb-6 border-b-2 border-white/10 pb-2">
           <h3 className={`${t.textAccent} ${t.fontHeading} flex items-center gap-2 text-xs sm:text-base`}>
             <Activity size={20} className="w-4 h-4 sm:w-5 sm:h-5" /> LIQUID STRIKE QUEUE
           </h3>
           <span className={`text-[8px] sm:text-[10px] ${t.textMuted} ${t.fontHeading}`}>Hold to drag</span>
        </div>
        
        <div className="flex gap-2 mb-4 sm:mb-6">
          <input 
            type="text" 
            value={newSyllabusCat}
            onChange={(e) => setNewSyllabusCat(e.target.value)}
            placeholder="NEW TAG..."
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
          />
          <button 
            onClick={handleAddSyllabusCategory}
            className={`px-3 sm:px-5 transition-all flex items-center justify-center active:scale-95 ${t.btnPrimary}`}
          >
            <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />
          </button>
        </div>

        {syllabusCategories.length > 1 && (
           <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
             {syllabusCategories.map(cat => (
               <div key={cat} className={`group flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs cursor-pointer transition-all ${t.cardInner} ${t.fontHeading} ${t.textMain}`}>
                 {cat}
                 {cat !== "Raw Backlog" && (
                   <button onClick={() => handleDeleteSyllabusCategory(cat)} className={`${t.textMuted} hover:text-red-500 transition-colors`}>
                     <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                   </button>
                 )}
               </div>
             ))}
           </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select 
            value={selectedSyllabusCat}
            onChange={(e) => setSelectedSyllabusCat(e.target.value)}
            className={`w-full sm:w-1/3 px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-sm focus:outline-none cursor-pointer transition-all ${t.input} ${t.textAccent} ${t.fontHeading}`}
          >
            {syllabusCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="flex gap-2 w-full flex-1">
            <input 
              type="text" 
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStagingTopic()}
              placeholder="CHAPTER NAME..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={handleAddStagingTopic}
              className={`px-4 sm:px-5 transition-all flex items-center justify-center active:scale-95 ${t.btnWarning}`}
            >
              <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
          {stagingTopics.length === 0 && (
            <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>
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
                className={`p-3 sm:p-4 flex items-center justify-between cursor-move transition-all select-none
                  ${t.cardInner}
                  ${index === 0 ? t.borderAccent : ''}
                  ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <GripVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${index === 0 ? t.textAccent : t.textMuted}`} />
                  <div>
                    <h4 className={`text-xs sm:text-base flex items-center gap-2 ${t.fontHeading} ${t.textMain}`}>
                      {topic.title}
                      {index === 0 && <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 tracking-widest ${t.badge} ${t.textAccent} ${t.fontHeading}`}>NEXT</span>}
                    </h4>
                    <span className={`text-[8px] sm:text-[10px] tracking-widest mt-1 block ${t.textMuted} ${t.fontHeading}`}>{topic.category}</span>
                  </div>
                </div>
              </div>
            </LongPressItem>
          ))}
        </div>
        <p className={`text-[8px] sm:text-[10px] mt-4 sm:mt-6 text-center ${t.textMuted} ${t.fontHeading}`}>Hold item to execute delete</p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className={`p-4 sm:p-6 ${t.card}`}>
        <h3 className={`${t.textAccent} ${t.fontHeading} mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-base border-b-2 border-white/10 pb-2`}>
          <History className="w-4 h-4 sm:w-5 sm:h-5" /> ONGOING 30-DAY CYCLES
        </h3>
        {studyTopics.length === 0 ? (
          <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>
            NO ACTIVE CYCLES
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <p className={`text-[8px] sm:text-[10px] text-center mb-2 ${t.textMuted} ${t.fontHeading}`}>Hold item for 5 seconds to delete</p>
            {studyTopics.map(topic => (
              <LongPressItem key={topic.id} item={topic} onDelete={(id) => deleteStudyTopic(id)} duration={5000}>
                <div className={`p-4 sm:p-5 ${t.cardInner}`}>
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div>
                      <h4 className={`text-sm sm:text-lg ${t.fontHeading} ${t.textMain}`}>{topic.title}</h4>
                      <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-1 mt-2 inline-block ${t.badge} ${t.fontHeading}`}>{topic.category}</span>
                    </div>
                    <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-1 ${t.badge} ${t.fontHeading}`}>INIT: {topic.startDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {topic.schedule.map((rev, i) => {
                      const isPending = !rev.completed && rev.targetDate <= todayStr;
                      return (
                        <div key={i} className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-2 sm:px-3 transition-all ${t.badge} ${
                          rev.completed 
                            ? t.btnPrimary.split('hover')[0]
                            : isPending 
                              ? t.borderDanger + ' text-red-500'
                              : 'opacity-70'
                        }`}>
                          <span className={`text-[8px] sm:text-[10px] ${t.fontHeading}`}>D{rev.dayOffset}</span>
                          {rev.completed ? (
                            <Check className={`w-3 h-3 sm:w-4 sm:h-4 mt-1 ${t.iconActive}`} />
                          ) : (
                            <Circle className={`w-3 h-3 sm:w-4 sm:h-4 mt-1 ${t.iconBase} ${isPending ? 'animate-pulse' : ''}`} />
                          )}
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
        <h3 className={`${t.textMain} ${t.fontHeading} mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-base border-b-2 border-white/10 pb-2`}>
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" /> HALL OF FAME (MASTERED)
        </h3>
        {masteredTopics.length === 0 ? (
          <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>
            EMPTY VAULT
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {masteredTopics.map(topic => (
              <div key={topic.id} className={`p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-colors ${t.cardInner}`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 ${t.badge}`}>
                   <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textAccent}`} />
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm ${t.fontHeading} ${t.textMain}`}>{topic.title}</h4>
                  <p className={`text-[8px] sm:text-[10px] mt-1 ${t.textMuted} ${t.fontHeading}`}>{topic.category} • {topic.masteredDate}</p>
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
        <div className="space-y-4 sm:space-y-6 pb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedWisdomCategory(null)} className={`p-2 sm:p-3 transition-colors active:scale-95 ${t.cardInner} ${t.textMain}`}>
              <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${t.iconActive}`}/>
            </button>
            <h2 className={`text-base sm:text-xl flex items-center gap-2 ${t.fontHeading} ${t.textMain}`}>
              <FolderOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> {expandedWisdomCategory}
            </h2>
          </div>
          <div className="flex gap-2 mb-4 sm:mb-8">
            <input 
              type="text" 
              value={newWisdom}
              onChange={(e) => setNewWisdom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWisdom()}
              placeholder="DUMP KNOWLEDGE..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-4 text-xs sm:text-base focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={handleAddWisdom}
              className={`px-4 sm:px-6 transition-all active:scale-95 flex items-center justify-center ${t.btnPrimary}`}
            >
              <Plus className={`w-5 h-5 sm:w-6 sm:h-6 ${t.iconActive}`} />
            </button>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {filteredNotes.length === 0 && <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>EMPTY FOLDER</div>}
            {filteredNotes.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => deleteWisdomNote(id)}>
                <div className={`p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 transition-colors cursor-pointer ${t.cardInner}`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                     <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted} mt-0.5 sm:mt-1 flex-shrink-0`} />
                     <p className={`text-xs sm:text-base leading-relaxed ${t.textMain}`}>{note.text}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-4 border-t border-white/10">
                    <span className={`text-[8px] sm:text-[10px] ${t.textMuted} ${t.fontHeading}`}>{note.date}</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                       <MoveRight className={`w-3 h-3 sm:w-4 sm:h-4 ${t.textMuted}`} />
                       <select 
                         onChange={(e) => handleMoveWisdomNote(note.id, e.target.value)}
                         value={note.category}
                         className={`px-1 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] outline-none cursor-pointer ${t.input} ${t.fontHeading}`}
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
      <div className="space-y-6 sm:space-y-8 pb-10">
        
        <div className={`p-4 sm:p-6 relative overflow-hidden ${t.card}`}>
          <h3 className={`${t.textAccent} ${t.fontHeading} mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-base border-b-2 border-white/10 pb-2`}>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> ASK THE ORACLE
          </h3>
          <p className={`text-[9px] sm:text-[10px] mb-3 sm:mb-4 ${t.textMuted} ${t.fontHeading}`}>Chat with your Second Brain. Uses your saved Wisdom.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('wisdom')}
              placeholder="QUERY..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={() => handleAskOracle('wisdom')}
              disabled={isOracleThinking}
              className={`px-4 sm:px-6 transition-all active:scale-95 flex items-center justify-center ${t.btnPrimary}`}
            >
              {isOracleThinking ? <Circle className={`w-4 h-4 sm:w-5 sm:h-5 animate-pulse`} /> : <Send className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />}
            </button>
          </div>
          {oracleResponse && (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-5 border-l-4 ${t.cardInner} ${t.borderAccent}`}>
              <p className={`text-xs sm:text-base leading-relaxed ${t.textMain}`}>{oracleResponse}</p>
            </div>
          )}
        </div>

        <div className={`p-4 sm:p-6 ${t.card}`}>
          <h3 className={`${t.textMain} ${t.fontHeading} mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-base border-b-2 border-white/10 pb-2`}>
            <Folder className="w-4 h-4 sm:w-5 sm:h-5" /> WISDOM FOLDERS
          </h3>
          <div className="flex gap-2 mb-4 sm:mb-8">
            <input 
              type="text" 
              value={newWisdomCat}
              onChange={(e) => setNewWisdomCat(e.target.value)}
              placeholder="NEW FOLDER..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={handleAddWisdomCategory}
              className={`px-3 sm:px-5 transition-all active:scale-95 flex items-center justify-center ${t.btnWarning}`}
            >
              <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {wisdomCategories.map(cat => {
              const count = wisdomNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button 
                    onClick={() => setExpandedWisdomCategory(cat)}
                    className={`w-full p-3 sm:p-5 flex flex-col items-center sm:items-start gap-2 sm:gap-4 transition-all text-center sm:text-left h-full active:scale-95 ${t.cardInner}`}
                  >
                    <FolderOpen className={`w-6 h-6 sm:w-8 sm:h-8 ${t.textMuted}`} />
                    <div className="w-full mt-1 sm:mt-0">
                      <h4 className={`text-[10px] sm:text-sm truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Quick Thoughts" && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteWisdomCategory(cat); }}
                      className={`absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 transition-colors hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ${t.textMuted}`}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
        <div className="space-y-4 sm:space-y-6 pb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={() => setExpandedVaultCategory(null)} className={`p-2 sm:p-3 transition-colors active:scale-95 ${t.cardInner} ${t.textMain}`}>
              <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${t.iconActive}`}/>
            </button>
            <h2 className={`text-base sm:text-xl flex items-center gap-2 ${t.fontHeading} ${t.textMain}`}>
               <FolderOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${t.textMuted}`} /> {expandedVaultCategory}
            </h2>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {notesInCat.length === 0 && <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>EMPTY FOLDER</div>}
            {notesInCat.map(note => (
              <LongPressItem key={note.id} item={note} onDelete={(id) => deleteVaultNote(id)}>
                <div className={`p-3 sm:p-5 flex items-start gap-2 sm:gap-4 transition-colors cursor-pointer ${t.cardInner}`}>
                  <BrainCircuit className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted} mt-0.5 sm:mt-1 shrink-0`} />
                  <div>
                    <p className={`text-xs sm:text-base leading-relaxed ${t.textMain}`}>{note.text}</p>
                    <span className={`text-[8px] sm:text-[10px] mt-1 sm:mt-2 block ${t.textMuted} ${t.fontHeading}`}>{note.date}</span>
                  </div>
                </div>
              </LongPressItem>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8 pb-10">
        
        <div className={`p-4 sm:p-6 relative overflow-hidden ${t.card}`}>
          <h3 className={`${t.textAccent} ${t.fontHeading} mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-base border-b-2 border-white/10 pb-2`}>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> ASK THE ORACLE
          </h3>
          <p className={`text-[9px] sm:text-[10px] mb-3 sm:mb-4 ${t.textMuted} ${t.fontHeading}`}>Chat with your Second Brain. Uses your saved Dump notes.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskOracle('vault')}
              placeholder="QUERY..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={() => handleAskOracle('vault')}
              disabled={isOracleThinking}
              className={`px-4 sm:px-6 transition-all active:scale-95 flex items-center justify-center ${t.btnPrimary}`}
            >
              {isOracleThinking ? <Circle className={`w-4 h-4 sm:w-5 sm:h-5 animate-pulse`} /> : <Send className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />}
            </button>
          </div>
          {oracleResponse && (
            <div className={`mt-4 sm:mt-6 p-3 sm:p-5 border-l-4 ${t.cardInner} ${t.borderAccent}`}>
              <p className={`text-xs sm:text-base leading-relaxed ${t.textMain}`}>{oracleResponse}</p>
            </div>
          )}
        </div>

        <div className={`p-4 sm:p-6 ${t.card}`}>
          <div className="flex justify-between items-center mb-3 sm:mb-4 border-b-2 border-white/10 pb-2">
            <h3 className={`${t.textMain} ${t.fontHeading} text-xs sm:text-base flex items-center gap-2`}>
               <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5" /> BRAIN DUMP (INBOX)
            </h3>
            {isVaultSorting && (
              <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 animate-pulse ${t.badge} ${t.textAccent} ${t.fontHeading}`}>
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3" /> AI SORTING
              </span>
            )}
          </div>
          <p className={`text-[8px] sm:text-[10px] mb-4 sm:mb-5 leading-relaxed ${t.textMuted} ${t.fontHeading}`}>
             Fast-capture raw ideas. Add 3 similar thoughts, and AI will automatically build a new folder for them below.
          </p>
          
          <div className="flex gap-2 relative">
            <button 
              onClick={() => {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SpeechRecognition) {
                  alert("Voice typing is not supported in this browser.");
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
              className={`p-2 sm:p-3 transition-all flex items-center justify-center shrink-0 ${isListening ? t.btnDanger + ' animate-pulse' : t.cardInner + ' ' + t.textMuted}`}
            >
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <input 
              type="text" 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder={isListening ? "SPEAKING..." : "RAW THOUGHT..."}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none transition-all ${t.input} ${t.fontHeading}`}
            />
            <button 
              onClick={handleAddNote}
              disabled={isVaultSorting}
              className={`px-4 sm:px-5 transition-all active:scale-95 flex items-center justify-center shrink-0 ${t.btnWarning}`}
            >
              <Send className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className={`${t.textMain} ${t.fontHeading} text-xs sm:text-base flex items-center gap-2 px-1`}>
             <Folder className="w-4 h-4 sm:w-5 sm:h-5" /> VAULT FOLDERS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {vaultCategories.map(cat => {
              const count = vaultNotes.filter(n => n.category === cat).length;
              return (
                <div key={cat} className="group relative">
                  <button 
                    onClick={() => setExpandedVaultCategory(cat)}
                    className={`w-full p-3 sm:p-5 flex flex-col items-center sm:items-start gap-2 sm:gap-4 transition-all text-center sm:text-left h-full active:scale-95 ${t.cardInner}`}
                  >
                    <FolderOpen className={`w-6 h-6 sm:w-8 sm:h-8 ${t.textMuted}`} />
                    <div className="w-full mt-1 sm:mt-0">
                      <h4 className={`text-[10px] sm:text-sm truncate w-full ${t.textMain} ${t.fontHeading}`}>{cat}</h4>
                      <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 block ${t.textMuted} ${t.fontHeading}`}>{count} NOTES</span>
                    </div>
                  </button>
                  {cat !== "Others" && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteVaultCategory(cat); }}
                      className={`absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 transition-colors hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ${t.textMuted}`}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {vaultNotes.length === 0 && (
            <div className={`text-center py-8 sm:py-10 border-dashed text-xs sm:text-sm ${t.cardInner} ${t.textMuted} ${t.fontHeading}`}>
              INBOX ZERO
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUrgeKiller = () => (
    <div className="space-y-6 sm:space-y-8 pb-10 pt-4 text-center max-w-md mx-auto">
      <h2 className={`text-lg sm:text-2xl flex justify-center items-center gap-2 sm:gap-3 ${t.textMain} ${t.fontHeading}`}>
        <ShieldAlert className={`w-6 h-6 sm:w-8 sm:h-8 ${t.textWarning}`} /> INTERCEPTOR
      </h2>
      <p className={`text-[8px] sm:text-[10px] px-4 sm:px-8 ${t.textMuted} ${t.fontHeading}`}>Trigger this protocol if you are about to break discipline.</p>

      {!isUrgeActive ? (
        <button 
          onClick={triggerUrgeInterceptor}
          className={`w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6 group transition-all mt-6 sm:mt-8 ${t.urgeBtn}`}
        >
          <Skull className="w-16 h-16 sm:w-20 sm:h-20 group-hover:scale-110 transition-transform" />
          <span className={`text-lg sm:text-2xl text-center px-4 ${t.fontHeading}`}>I HAVE AN URGE</span>
        </button>
      ) : (
        <div className={`p-5 sm:p-8 relative mt-6 sm:mt-8 ${t.card}`}>
          <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-white/10">
            <div 
              className="bg-red-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(urgeTimer / 90) * 100}%` }}
            ></div>
          </div>
          <h3 className={`mt-3 sm:mt-4 mb-3 sm:mb-6 text-[9px] sm:text-xs ${t.textWarning} ${t.fontHeading}`}>FRICTION ZONE ACTIVE</h3>
          <div className={`text-5xl sm:text-8xl mb-5 sm:mb-8 tabular-nums tracking-tighter ${t.textMain} ${t.fontHeading}`}>
            {urgeTimer}s
          </div>
          <div className="min-h-[70px] sm:min-h-[100px] flex items-center justify-center border-t border-white/10 pt-4 sm:pt-6">
            <p className={`text-xs sm:text-lg leading-relaxed px-2 ${t.textMain} ${t.fontHeading}`} key={currentQuoteIndex}>
              "{urgeQuotes[currentQuoteIndex] || 'STAY STRONG. DO NOT GIVE IN.'}"
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      <div className={`p-4 sm:p-6 mb-4 sm:mb-6 ${t.card}`}>
        <h3 className={`${t.textAccent} ${t.fontHeading} mb-3 sm:mb-5 flex items-center gap-2 text-xs sm:text-sm border-b-2 border-white/10 pb-2`}>
          <Palette className="w-4 h-4 sm:w-5 sm:h-5" /> APP THEME ENGINE
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {Object.values(THEMES).map(themeOption => (
            <button
              key={themeOption.id}
              onClick={() => setActiveTheme(themeOption.id)}
              className={`p-3 sm:p-4 transition-all flex flex-col items-center gap-2 sm:gap-3 cursor-pointer 
                ${t.cardInner} 
                ${activeTheme === themeOption.id ? t.borderAccent + ' opacity-100 scale-105' : 'opacity-70 hover:opacity-100 border-transparent'}
              `}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center border border-white/20 ${themeOption.appBg.split(' ')[0]}`}>
                 {activeTheme === themeOption.id && <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${themeOption.textAccent}`} />}
              </div>
              <span className={`text-[8px] sm:text-[10px] text-center ${t.textMain} ${t.fontHeading}`}>{themeOption.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 sm:p-6 ${t.card}`}>
        <h3 className={`${t.textMain} ${t.fontHeading} mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm border-b-2 border-white/10 pb-2`}>
           <User className="w-4 h-4 sm:w-5 sm:h-5" /> PROFILE COMMAND
        </h3>
        <div className="flex flex-col items-center gap-3 sm:gap-5 mb-5 sm:mb-8">
          <div className={`w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden relative ${t.cardInner} border-2 ${t.borderAccent}`}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl sm:text-5xl">🦊</span>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              onChange={handleImageUpload} 
            />
          </div>
          <p className={`text-[8px] sm:text-[10px] ${t.textMuted} ${t.fontHeading}`}>TAP AVATAR TO UPLOAD</p>
        </div>
        <div>
          <label className={`text-[8px] sm:text-[10px] mb-1.5 sm:mb-2 block ${t.textMuted} ${t.fontHeading}`}>DISPLAY NAME</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="e.g., APEX HUNTER" 
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-center focus:outline-none transition-all text-xs sm:text-sm ${t.input} ${t.fontHeading}`} 
          />
        </div>
      </div>

      <div className={`p-4 sm:p-6 ${t.card}`}>
        <h3 className={`${t.textAccent} ${t.fontHeading} mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm border-b-2 border-white/10 pb-2`}>
           <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> AI ENGINE CORE
        </h3>
        <p className={`text-[8px] sm:text-[10px] leading-relaxed mb-4 sm:mb-5 ${t.textMuted} ${t.fontHeading}`}>
          Paste Groq API Key. Required for Oracle, Sorter, and dynamic Urges. Stored locally.
        </p>
        <input 
          type="password" 
          value={groqKey} 
          onChange={(e) => setGroqKey(e.target.value)} 
          placeholder="GSK_XXXX..." 
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 tracking-widest focus:outline-none transition-all text-xs sm:text-sm ${t.input} ${t.fontHeading}`} 
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-24 sm:pb-28 relative overflow-x-hidden transition-colors duration-500 ${t.appBg}`}>
      
      <div className="max-w-2xl mx-auto p-3 sm:p-6 relative z-10 pt-4 sm:pt-8">
        
        <div className={`flex justify-between items-center mb-6 sm:mb-8 p-3 sm:p-5 relative overflow-hidden transition-colors duration-500 ${t.header}`}>
          <div>
            <h1 className={`text-lg sm:text-3xl flex items-center gap-1.5 sm:gap-3 ${t.fontHeading}`}>
              Apex Mind <span className={`text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 align-middle ${t.badge} ${t.fontHeading}`}>V5.0</span>
            </h1>
            <p className={`text-[8px] sm:text-[10px] mt-1 sm:mt-2 opacity-80 ${t.fontHeading}`}>SECOND BRAIN OS</p>
          </div>
          <div 
            className="flex items-center gap-2 sm:gap-4 cursor-pointer group" 
            onClick={() => setActiveTab('settings')}
          >
            {userName && (
              <span className={`text-[9px] sm:text-xs hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity ${t.fontHeading}`}>
                {userName}
              </span>
            )}
            <div className={`w-9 h-9 sm:w-14 sm:h-14 flex items-center justify-center overflow-hidden transition-all shrink-0 ${t.cardInner}`}>
              {profilePic ? (
                <img src={profilePic} alt="DP" className="w-full h-full object-cover" />
              ) : (
                <span className={`text-sm sm:text-xl ${t.fontHeading}`}>🦊</span>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'study' && renderStudyEngine()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'wisdom' && renderWisdom()}
        {activeTab === 'vault' && renderVault()}
        {activeTab === 'urge' && renderUrgeKiller()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {isNightTime && (
        <div className="fixed bottom-20 sm:bottom-28 right-3 sm:right-6 z-40 flex flex-col items-end">
          {!isNightShiftOpen ? (
            <button 
              onClick={() => setIsNightShiftOpen(true)}
              className={`px-4 sm:px-6 py-2.5 sm:py-4 flex items-center gap-2 sm:gap-3 hover:-translate-y-1 transition-all ${t.btnPrimary} ${t.fontHeading} text-[9px] sm:text-xs`}
            >
              <Moon className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`} /> PLAN TOMORROW
            </button>
          ) : (
            <div className={`p-4 sm:p-6 w-[260px] sm:w-[320px] transition-all duration-500 ${t.card}`}>
               <div className="flex justify-between items-center mb-4 sm:mb-6 border-b-2 border-white/10 pb-2 sm:pb-3">
                 <h3 className={`text-[9px] sm:text-xs flex items-center gap-2 ${t.textAccent} ${t.fontHeading}`}>
                   <Moon className={`w-3 h-3 sm:w-4 sm:h-4 ${t.iconActive}`}/> NIGHT SHIFT INBOX
                 </h3>
                 <button onClick={() => setIsNightShiftOpen(false)} className={`${t.textMain} hover:text-red-500 transition-colors`}>
                   <X className={`w-4 h-4 sm:w-5 sm:h-5 ${t.iconActive}`}/>
                 </button>
               </div>
               
               <p className={`text-[8px] sm:text-[10px] mb-3 sm:mb-4 ${t.textMuted} ${t.fontHeading}`}>Add tasks for tomorrow, or pin a queue target.</p>

               <div className="flex gap-2 mb-4 sm:mb-6">
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
                   className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2.5 text-[9px] sm:text-xs focus:outline-none ${t.input} ${t.fontHeading}`}
                 />
                 <button 
                   onClick={() => {
                      if(newCustomMission.trim()) {
                         setCustomMissions(prev => [...prev, { id: Date.now().toString(), text: newCustomMission.trim(), targetDate: addDays(todayStr, 1), completed: false }]);
                         setNewCustomMission("");
                      }
                   }}
                   className={`px-2.5 sm:px-4 flex items-center justify-center transition-colors active:scale-95 ${t.btnWarning}`}
                 >
                   <Send className={`w-3 h-3 sm:w-4 sm:h-4 ${t.iconActive}`} />
                 </button>
               </div>

               {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).length > 0 && (
                  <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
                    {customMissions.filter(m => m.targetDate === addDays(todayStr, 1)).map(m => (
                       <div key={m.id} className={`px-2 sm:px-3 py-1.5 sm:py-2 flex justify-between items-center ${t.cardInner}`}>
                         <span className={`text-[8px] sm:text-[10px] truncate pr-2 ${t.textMain} ${t.fontHeading}`}>• {m.text}</span>
                         <button onClick={() => setCustomMissions(prev => prev.filter(task => task.id !== m.id))} className={`${t.textMuted} hover:text-red-500 transition-colors shrink-0`}>
                           <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                         </button>
                       </div>
                    ))}
                  </div>
               )}

               {stagingTopics.length > 0 && (
                 <>
                   <div className={`text-[8px] sm:text-[10px] mb-2 sm:mb-3 border-t border-white/10 pt-2 sm:pt-4 ${t.textAccent} ${t.fontHeading}`}>PIN SYLLABUS TARGET</div>
                   <div className="space-y-1.5 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto hide-scrollbar pr-1">
                     {stagingTopics.slice(0, 3).map((topic, idx) => (
                       <button 
                         key={topic.id}
                         onClick={() => {
                           const items = [...stagingTopics];
                           const clickedItem = items.splice(idx, 1)[0];
                           items.unshift(clickedItem);
                           setStagingTopics(items);
                         }}
                         className={`w-full text-left p-2 sm:p-3 flex items-center justify-between group ${t.cardInner}`}
                       >
                         <span className={`text-[8px] sm:text-[10px] truncate pr-2 ${t.textMain} ${t.fontHeading}`}>{topic.title}</span>
                         <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${t.badge} ${t.textAccent} ${t.fontHeading}`}>PIN</span>
                       </button>
                     ))}
                   </div>
                 </>
               )}
            </div>
          )}
        </div>
      )}

      <div className={`fixed bottom-0 sm:bottom-4 left-0 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-[95%] max-w-2xl z-50 overflow-x-auto hide-scrollbar transition-colors duration-500 ${t.navBg}`}>
        <div className="flex justify-between px-1 sm:px-2 py-1.5 sm:py-3 min-w-[320px] sm:min-w-[360px]">
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
              className={`flex-1 flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-2 transition-all duration-300 ${activeTab === tab.id ? t.navItemActive : t.navItemInactive}`}
            >
              <tab.icon className={`w-5 h-5 sm:w-[22px] sm:h-[22px] ${activeTab === tab.id ? t.iconActive : t.iconBase}`} />
              <span className={`text-[7px] sm:text-[9px] ${t.fontHeading}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
