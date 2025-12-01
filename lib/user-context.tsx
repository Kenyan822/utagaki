"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type Gender = "male" | "female";

export interface User {
  id: string;
  name: string;
  gender: Gender;
  avatar?: string; // 将来的にアイコンも
  createdAt: number;
}

interface UserContextType {
  user: User | null; // 現在ログイン中のユーザー
  users: User[];     // 登録済みユーザーリスト
  register: (name: string, gender: Gender) => void;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  // 初期ロード
  useEffect(() => {
    // 全ユーザーリストの復元
    const storedUsers = localStorage.getItem("utagaki_users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) { console.error("Failed to parse users data"); }
    }

    // ログインセッションの復元
    const storedSession = localStorage.getItem("utagaki_current_user_id");
    if (storedSession && storedUsers) {
      const allUsers = JSON.parse(storedUsers) as User[];
      const found = allUsers.find(u => u.id === storedSession);
      if (found) setUser(found);
    }
  }, []);

  // ユーザーリスト更新時の永続化
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("utagaki_users", JSON.stringify(users));
    }
  }, [users]);

  // ログイン状態更新時の永続化
  useEffect(() => {
    if (user) {
      localStorage.setItem("utagaki_current_user_id", user.id);
    } else {
      localStorage.removeItem("utagaki_current_user_id");
    }
  }, [user]);

  const register = (name: string, gender: Gender) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      gender,
      createdAt: Date.now(),
    };
    
    // リストに追加
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    
    // そのままログイン
    setUser(newUser);
    
    router.push("/");
  };

  const login = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setUser(found);
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, users, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
