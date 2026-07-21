'use client';

import { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState(''); // 見本の変数名に合わせました
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage('❌ パスワードが一致しません。');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          passwordConfirmation,
          name,
          profile,
          affiliation,
          position
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // レスポンスがJSONじゃない場合（空の時など）の安全策
      };

      if (response.ok) {
        setMessage('🎉 登録が完了しました！');

        // 登録成功時にフォームの入力欄をすべてリセットする
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setName('');
        setProfile('');
        setAffiliation('');
        setPosition('');
      } else {
        // 🌟 サーバーから返ってきたエラーメッセージを表示
        if (typeof data === 'string') {
          setMessage(`❌ ${data}`);
        } else if (data.message) {
          setMessage(`❌ ${data.message}`);
        } else if (typeof data === 'object') {
          // バリデーションエラー（連想配列）の場合
          const errorMsg = Object.values(data).join(' / ');
          setMessage(`❌ ${errorMsg}`);
        } else {
        setMessage('❌ 登録に失敗しました。');
      }
     }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ サーバーとの通信に失敗しました。');
    }
  };

  return (
    <>
      {/* <div th:insert="~{header :: header}"></div> の代わり */}
      <header className="h-12 bg-gray-800 text-white flex items-center px-4 text-sm">
        Header Placeholder
      </header>

      {/* HTMLの構造をそのままReact + Tailwindに翻訳 */}
      <div className="form-main min-h-[calc(100vh-6rem)] bg-white py-6 flex justify-center text-gray-800 font-sans">
        <div className="inner w-full max-w-5xl px-4 flex flex-col items-start md:items-center">
          
          {/* 横幅を絞り、見本画像のようなレイアウトに */}
          <div className="form-wrapper w-full md:w-[45%]">
            <h2 className="text-xl font-bold mb-4">ユーザー新規登録</h2>
            
            <div className="form">
              <form onSubmit={handleSubmit} className="new_user space-y-2.5">
                
                <div className="field">
                  <label htmlFor="email" className="form-label text-xs">メールアドレス</label><br/>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full sm:w-64 border-2 border-gray-800 rounded-sm p-1 text-sm focus:outline-none focus:border-blue-500" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="password" className="form-label text-xs">パスワード（6文字以上）</label><br/>
                  <input 
                    type="password" 
                    id="password" 
                    required 
                    minLength={6} 
                    className="w-full sm:w-64 border border-gray-400 rounded-sm p-1 text-sm focus:outline-none focus:border-blue-500" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="password_confirmation" className="form-label text-xs">パスワード再入力</label><br/>
                  <input 
                    type="password" 
                    id="password_confirmation" 
                    required 
                    minLength={6} 
                    autoComplete="off" 
                    className="w-full sm:w-64 border border-gray-400 rounded-sm p-1 text-sm focus:outline-none focus:border-blue-500" 
                    value={passwordConfirmation} 
                    onChange={(e) => setPasswordConfirmation(e.target.value)} 
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="name" className="text-xs">ユーザー名</label><br/>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full sm:w-64 border border-gray-400 rounded-sm p-1 text-sm focus:outline-none focus:border-blue-500" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="profile" className="text-xs">プロフィール</label><br/>
                  <textarea 
                    id="profile" 
                    className="form-input w-full border border-gray-400 rounded-sm p-1 text-sm h-12 focus:outline-none focus:border-blue-500 resize-y" 
                    value={profile} 
                    onChange={(e) => setProfile(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="field">
                  <label htmlFor="affiliation" className="text-xs">所属</label><br/>
                  <textarea 
                    id="affiliation" 
                    className="form-input w-full border border-gray-400 rounded-sm p-1 text-sm h-12 focus:outline-none focus:border-blue-500 resize-y" 
                    value={affiliation} 
                    onChange={(e) => setAffiliation(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="field">
                  <label htmlFor="position" className="text-xs">役職</label><br/>
                  <textarea 
                    id="position" 
                    className="form-input w-full border border-gray-400 rounded-sm p-1 text-sm h-12 focus:outline-none focus:border-blue-500 resize-y" 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)}
                  ></textarea>
                </div>
        
                <div className="pt-2">
                  <input 
                    type="submit" 
                    value="新規登録" 
                    className="form-btn bg-[#8ecbf5] text-white font-bold px-8 py-1.5 text-sm rounded-sm shadow-sm hover:bg-blue-400 transition cursor-pointer" 
                  />
                </div>
              </form>

              {message && <p className="mt-4 text-sm font-bold text-gray-700">{message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* <div th:insert="~{footer :: footer}"></div> の代わり */}
      <footer className="h-12 bg-gray-800 text-white flex items-center justify-center text-sm">
        Footer Placeholder
      </footer>
    </>
  );
}