"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "./user-context";

// 松竹梅に加えて月(黄)・水(青)を追加
const SHOCHIKUBAI_VARIANTS = ["matsu", "take", "ume", "tsuki", "mizu"] as const;
export type VerseVariant = typeof SHOCHIKUBAI_VARIANTS[number];

const LEGACY_VARIANT_MAP: Record<string, VerseVariant> = {
  shoji: "matsu",
  washi: "matsu",
  sakura: "ume",
  momiji: "take",
  kinari: "matsu",
  kusa: "take",
  // mizu: "take", // mizuは正式なバリアントになったのでマッピング削除（または維持して後方互換）
};

const normalizeVariant = (value?: string): VerseVariant => {
  if (value && SHOCHIKUBAI_VARIANTS.includes(value as VerseVariant)) {
    return value as VerseVariant;
  }
  // mizuがレガシーマップにあるとtakeに変換されてしまうため、先にチェック済み
  return LEGACY_VARIANT_MAP[value ?? ""] ?? "matsu";
};

// 歌（上の句）
export interface Verse {
  id: string;
  content: string;
  author: User;
  timestamp: number;
  variant: VerseVariant;
  status: "open" | "matched" | "expired";
}

// 返歌（下の句）
export interface Reply {
  id: string;
  verseId: string;
  content: string;
  author: User;
  timestamp: number;
}

// マッチング（結び）
export interface Match {
  id: string;
  verseId: string;
  replyId: string;
  timestamp: number;
}

// メッセージ（文）
export interface Message {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    timestamp: number;
    isRead: boolean;
}

interface GameContextType {
  verses: Verse[];
  replies: Reply[];
  matches: Match[];
  messages: Message[];
  addVerse: (content: string, author: User, variant: Verse["variant"]) => void;
  addReply: (verseId: string, content: string, author: User) => void;
  createMatch: (verseId: string, replyId: string) => string; // returns matchId
  sendMessage: (matchId: string, senderId: string, content: string) => void;
  getUserVerses: (userId: string) => Verse[];
  getRepliesByVerseId: (verseId: string) => Reply[];
  getMatch: (matchId: string) => Match | undefined;
  getMatchByReplyId: (replyId: string) => Match | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// サンプルデータ（初期表示用）
const SAMPLE_VERSES: Verse[] = [
  {
    id: "v1",
    content: "春過ぎて 夏来にけらし 白妙の",
    author: { id: "u1", name: "持統天皇", gender: "female", createdAt: Date.now() },
    timestamp: Date.now(),
    variant: "matsu",
    status: "open",
  },
  {
    id: "v2",
    content: "久方の 光のどけき 春の日に",
    author: { id: "u2", name: "紀友則", gender: "female", createdAt: Date.now() },
    timestamp: Date.now() - 10000,
    variant: "ume",
    status: "open",
  },
  {
    id: "v3",
    content: "ちはやぶる 神代も聞かず 竜田川",
    author: { id: "u3", name: "在原業平", gender: "female", createdAt: Date.now() },
    timestamp: Date.now() - 20000,
    variant: "take",
    status: "open",
  },
  {
    id: "v4",
    content: "天の原 ふりさけ見れば 春日なる",
    author: { id: "u4", name: "阿倍仲麻呂", gender: "female", createdAt: Date.now() },
    timestamp: Date.now() - 30000,
    variant: "tsuki", // 月（新色）
    status: "open",
  },
  {
    id: "v5",
    content: "瀬を早み 岩にせかるる 滝川の",
    author: { id: "u5", name: "崇徳院", gender: "female", createdAt: Date.now() },
    timestamp: Date.now() - 40000,
    variant: "mizu", // 水（新色）
    status: "open",
  },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // 初期ロード時にlocalStorageから復元
  useEffect(() => {
    const storedVerses = localStorage.getItem("utagaki_verses");
    const storedReplies = localStorage.getItem("utagaki_replies");
    const storedMatches = localStorage.getItem("utagaki_matches");
    const storedMessages = localStorage.getItem("utagaki_messages");

    if (storedVerses) {
      const parsed = JSON.parse(storedVerses);
      setVerses(
        parsed.map((verse: Verse & { variant?: string }) => ({
          ...verse,
          variant: normalizeVariant(verse.variant),
        }))
      );
    } else {
      // 初回のみサンプルデータをセット
      setVerses(SAMPLE_VERSES);
    }

    if (storedReplies) setReplies(JSON.parse(storedReplies));
    if (storedMatches) setMatches(JSON.parse(storedMatches));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  // データ変更時にlocalStorageへ保存
  useEffect(() => {
    if (verses.length > 0) localStorage.setItem("utagaki_verses", JSON.stringify(verses));
  }, [verses]);

  useEffect(() => {
    if (replies.length > 0) localStorage.setItem("utagaki_replies", JSON.stringify(replies));
  }, [replies]);

  useEffect(() => {
    if (matches.length > 0) localStorage.setItem("utagaki_matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
      if (messages.length > 0) localStorage.setItem("utagaki_messages", JSON.stringify(messages));
  }, [messages]);


  const addVerse = (content: string, author: User, variant: Verse["variant"]) => {
    const newVerse: Verse = {
      id: crypto.randomUUID(),
      content,
      author,
      timestamp: Date.now(),
      variant: normalizeVariant(variant),
      status: "open",
    };
    setVerses((prev) => [newVerse, ...prev]);
  };

  const addReply = (verseId: string, content: string, author: User) => {
    const newReply: Reply = {
      id: crypto.randomUUID(),
      verseId,
      content,
      author,
      timestamp: Date.now(),
    };
    setReplies((prev) => [...prev, newReply]);
  };

  const createMatch = (verseId: string, replyId: string) => {
    // 既存のマッチを確認（同じペアでの重複を防ぐ）
    const targetVerse = verses.find(v => v.id === verseId);
    const targetReply = replies.find(r => r.id === replyId);
    
    if (!targetVerse || !targetReply) return "";

    // 既にこのペア（verseIdとreplyId）でマッチしているか確認
    const existingMatch = matches.find(m => m.verseId === verseId && m.replyId === replyId);
    if (existingMatch) return existingMatch.id;

    // ユーザーペアでの重複チェック（一人の相手とは一回しかマッチできないようにする場合）
    const partnerId = targetReply.author.id;
    const myId = targetVerse.author.id;

    const existingPairMatch = matches.find(m => {
        const v = verses.find(v => v.id === m.verseId);
        const r = replies.find(r => r.id === m.replyId);
        if (!v || !r) return false;
        
        // (自分が作者の句 && 相手が返信者) OR (相手が作者の句 && 自分が返信者)
        return (v.author.id === myId && r.author.id === partnerId) || 
               (v.author.id === partnerId && r.author.id === myId);
    });

    if (existingPairMatch) {
        // 既にマッチしている場合はそのIDを返す（新しいマッチは作らない）
        return existingPairMatch.id;
    }

    const matchId = crypto.randomUUID();
    const newMatch: Match = {
      id: matchId,
      verseId,
      replyId,
      timestamp: Date.now(),
    };
    setMatches((prev) => [...prev, newMatch]);
    
    // Verseのステータスを更新
    setVerses((prev) => prev.map(v => v.id === verseId ? { ...v, status: "matched" } : v));

    return matchId;
  };

  const sendMessage = (matchId: string, senderId: string, content: string) => {
      const newMessage: Message = {
          id: crypto.randomUUID(),
          matchId,
          senderId,
          content,
          timestamp: Date.now(),
          isRead: false
      };
      setMessages(prev => [...prev, newMessage]);
  }

  const getUserVerses = (userId: string) => {
    return verses.filter((v) => v.author.id === userId);
  };

  const getRepliesByVerseId = (verseId: string) => {
    return replies.filter((r) => r.verseId === verseId);
  };

  const getMatch = (matchId: string) => {
      return matches.find(m => m.id === matchId);
  }

  const getMatchByReplyId = (replyId: string) => {
      return matches.find(m => m.replyId === replyId);
  }

  return (
    <GameContext.Provider value={{ 
        verses, 
        replies, 
        matches, 
        messages,
        addVerse, 
        addReply, 
        createMatch,
        sendMessage,
        getUserVerses, 
        getRepliesByVerseId,
        getMatch,
        getMatchByReplyId
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
