'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // サーバーが空のレスポンス（403など）を返した場合はここを通る
        console.warn('JSONの解析をスキップしました');
      }

      if (response.ok) {
        // ログイン成功時、ユーザー情報をlocalStorageに保存
        localStorage.setItem('user', JSON.stringify(data));

        // トップページへ遷移
        router.push('/');
      } else {
        // ログイン失敗時
       if (data?.message) {
          setMessage(`❌ ${data.message}`);
        } else {
          setMessage('❌ ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ サーバーとの通信に失敗しました。')
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center">ログイン</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              id="email"
              required
              className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              id="password"
              required
              className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8ecbf5] text-white font-bold py-2 rounded text-sm hover:bg-blue-400 transition"
          >
            ログイン
          </button>
        </form>

        {message && <p className="mt-4 text-sm font-bold text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
}