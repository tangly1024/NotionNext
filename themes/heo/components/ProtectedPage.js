// ProtectedPage.js

import { useEffect, useState } from 'react';

// 密码输入组件
const PasswordProtection = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="password-protection">
      <h2>Enter Password to Access</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const ProtectedPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查localStorage中是否已验证过密码
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (inputPassword) => {
    const correctPassword = 'your-password'; // 设置的正确密码

    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // 存储验证状态到localStorage
    } else {
      alert('Incorrect password, please try again.');
    }
  };

  if (!isAuthenticated) {
    return <PasswordProtection onPasswordSubmit={handlePasswordSubmit} />;
  }

  // 已通过验证后显示网页内容
  return (
    <div>
      <h1>Welcome to the protected page!</h1>
      {/* 这里是你需要保护的内容 */}
    </div>
  );
};

export default ProtectedPage;
