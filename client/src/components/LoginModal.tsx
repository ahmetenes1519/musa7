import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: ''
  });

  // Test account configurations
  const testAccounts = {
    user: {
      email: 'ahmet@example.com',
      password: '123456',
      name: 'Ahmet Yılmaz',
      username: 'ahmetyilmaz'
    },
    admin: {
      email: 'admin@islamic.com',
      password: '123456',
      name: 'Platform Yöneticisi',
      username: 'adminuser'
    }
  };

  // Quick login with mock authentication for demo
  const quickLogin = async (accountType: 'user' | 'admin') => {
    const account = testAccounts[accountType];
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Always use demo mode for quick login
      const mockUser = {
        id: `demo-${accountType}-${Date.now()}`,
        email: account.email,
        name: account.name,
        username: account.username,
        avatar_url: null,
        bio: accountType === 'admin' ? 'Platform yöneticisi' : 'İslami değerlere bağlı bir kardeşiniz',
        location: 'İstanbul',
        website: null,
        verified: true,
        role: accountType === 'admin' ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate realistic login delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Store mock user in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Trigger a custom event to update auth context immediately
      window.dispatchEvent(new CustomEvent('mockLogin', { detail: mockUser }));
      
      setSuccess(`${accountType === 'admin' ? 'Admin' : 'Kullanıcı'} girişi başarılı! Hoş geldiniz.`);
      
      // Close modal after success message
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
      
    } catch (error: any) {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Create new demo account
  const createDemoAccount = async () => {
    if (!formData.email || !formData.password || !formData.fullName || !formData.username) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const userExists = existingUsers.find((u: any) => 
        u.email === formData.email || u.username === formData.username
      );

      if (userExists) {
        setError('Bu e-posta veya kullanıcı adı zaten kullanılıyor.');
        return;
      }

      // Create new demo user
      const newUser = {
        id: `demo-user-${Date.now()}`,
        email: formData.email,
        name: formData.fullName,
        username: formData.username,
        password: formData.password, // In real app, this would be hashed
        avatar_url: null,
        bio: 'Yeni üye',
        location: null,
        website: null,
        verified: false,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to demo users list
      existingUsers.push(newUser);
      localStorage.setItem('demoUsers', JSON.stringify(existingUsers));

      // Simulate account creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Hesap başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
      
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
        setFormData({ email: formData.email, password: formData.password, fullName: '', username: '' });
        setSuccess('');
      }, 2000);

    } catch (error: any) {
      setError('Hesap oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Login with demo account
  const loginWithDemo = async () => {
    if (!formData.email || !formData.password) {
      setError('E-posta ve şifre gerekli.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check demo users first
      const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const demoUser = demoUsers.find((u: any) => 
        u.email === formData.email && u.password === formData.password
      );

      if (demoUser) {
        // Login with demo user
        const { password, ...userWithoutPassword } = demoUser;
        
        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 800));

        localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
        window.dispatchEvent(new CustomEvent('mockLogin', { detail: userWithoutPassword }));
        
        setSuccess('Giriş başarılı! Hoş geldiniz.');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1000);
        return;
      }

      // Try Supabase if configured
      if (isSupabaseConfigured) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        setSuccess('Giriş başarılı! Hoş geldiniz.');
        setTimeout(() => onClose(), 1000);
      } else {
        setError('E-posta veya şifre hatalı. Demo hesapları için yukarıdaki butonları kullanın.');
      }

    } catch (error: any) {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await loginWithDemo();
    } else {
      await createDemoAccount();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      username: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`
        w-full max-w-sm sm:max-w-md rounded-2xl p-4 sm:p-8 relative animate-slide-up 
        max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
        ${theme === 'islamic' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900' :
          theme === 'ramadan' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900' :
          'bg-white dark:bg-gray-800'
        }
      `}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Hoş Geldin!' : 'Aramıza Katıl!'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {isLogin ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
          </p>
        </div>

        {/* Quick Login Buttons for Testing */}
        {isLogin && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-2 sm:mb-3 font-medium">
              Hızlı Demo Girişi:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('user')}
                disabled={loading}
                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                👤 Kullanıcı Girişi (Ahmet Yılmaz)
              </button>
              <button
                onClick={() => quickLogin('admin')}
                disabled={loading}
                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white border border-green-600 rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                👑 Admin Girişi (Platform Yöneticisi)
              </button>
            </div>
            
            <div className="mt-2 sm:mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded text-xs text-blue-700 dark:text-blue-300">
              💡 Demo modunda çalışıyor - Hemen giriş yapabilirsiniz!
            </div>
          </div>
        )}

        {error && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm flex items-start gap-2 sm:gap-3">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Hata</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p>{success}</p>
          </div>
        )}

        {/* Manual Login/Register Form */}
        <div className="mb-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {isLogin ? 'veya manuel giriş' : 'veya yeni hesap oluştur'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Ad Soyad"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                      theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                      'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }
                    text-gray-900 dark:text-white placeholder-gray-500
                  `}
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="Kullanıcı Adı"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                      theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                      'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }
                    text-gray-900 dark:text-white placeholder-gray-500
                  `}
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleInputChange}
              className={`
                w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                  theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                  'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }
                text-gray-900 dark:text-white placeholder-gray-500
              `}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleInputChange}
              className={`
                w-full pl-10 pr-12 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 text-sm sm:text-base
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${theme === 'islamic' ? 'bg-white dark:bg-emerald-800 border-emerald-300 dark:border-emerald-600' :
                  theme === 'ramadan' ? 'bg-white dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600' :
                  'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                }
                text-gray-900 dark:text-white placeholder-gray-500
              `}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Şifre en az 6 karakter olmalıdır
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-lg hover:scale-105
              ${theme === 'islamic' ? 'bg-emerald-600 hover:bg-emerald-700' :
                theme === 'ramadan' ? 'bg-yellow-600 hover:bg-yellow-700' :
                'bg-emerald-600 hover:bg-emerald-700'
              }
              text-white
            `}
          >
            {loading ? 'Yükleniyor...' : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
            <button
              onClick={switchMode}
              className="ml-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-medium mb-1">Demo Modu</p>
              <p>
                {isLogin 
                  ? 'Hızlı giriş için yukarıdaki demo butonlarını kullanın veya kendi hesabınızla giriş yapın.'
                  : 'Yeni hesap oluşturabilir ve hemen kullanmaya başlayabilirsiniz!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;