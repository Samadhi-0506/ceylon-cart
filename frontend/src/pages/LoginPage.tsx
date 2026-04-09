import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

const LoginPage = () => {
  const [tab, setTab]         = useState<'signin' | 'register'>('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const err = params.get('error');
    if (err === 'google_failed')   setError('Google sign-in failed. Please try again.');
    if (err === 'facebook_failed') setError('Facebook sign-in failed. Please try again.');
    if (err === 'oauth_failed')    setError('Social sign-in failed. Please try again.');
  }, [params]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogle = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  const handleFacebook = () => {
    window.location.href = `${BASE_URL}/api/auth/facebook`;
  };

  const handlePasskeyLogin = async () => {
    setError(''); setPasskeyLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        setError('Your browser does not support Passkeys. Please use Chrome, Edge, or Safari.');
        return;
      }
      const startRes = await api.post('/auth/passkey/login/start');
      const { sessionId, challenge, rpId, timeout, allowCredentials } = startRes.data;
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: _base64urlToBuffer(challenge),
          rpId,
          timeout,
          userVerification: 'preferred',
          allowCredentials: allowCredentials.map((c: { id: string; type: string }) => ({
            id: _base64urlToBuffer(c.id),
            type: c.type
          }))
        }
      }) as PublicKeyCredential;
      if (!credential) { setError('Passkey sign-in was cancelled.'); return; }
      const assertionResponse = credential.response as AuthenticatorAssertionResponse;
      const finishRes = await api.post('/auth/passkey/login/finish', {
        sessionId,
        credentialId: credential.id,
        userId: _bufferToBase64url(assertionResponse.userHandle || new ArrayBuffer(0))
      });
      const { token, user } = finishRes.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      window.location.reload();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; name?: string };
      if (e.name === 'NotAllowedError') {
        setError('Passkey sign-in was cancelled or timed out.');
      } else {
        setError(e.response?.data?.message || 'Passkey sign-in failed. Try registering a passkey first in your profile settings.');
      }
    } finally { setPasskeyLoading(false); }
  };

  const _base64urlToBuffer = (base64url: string): ArrayBuffer => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, c => c.charCodeAt(0)).buffer;
  };

  const _bufferToBase64url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const pwStrength = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'strong'
    : password.length >= 6 ? 'medium' : password ? 'weak' : '';

  return (
    // ── ONLY CHANGE: background image wrapper ──────────────────────────────
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 page-enter relative"
      style={{
        backgroundImage: 'url(/images/hero-products/Sign-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay so the form stays readable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Everything below is 100% unchanged — just wrapped in relative z-10 */}
      <div className="relative z-10 w-full flex items-center justify-center">

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="fixed top-4 right-4 p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors z-10">
          {dark ? '☀️' : '🌙'}
        </button>

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform ring-2 ring-ceylon-400/30 bg-white/10">
                <img src="images/hero-products/ceylon-cart-logo.png" alt="CeylonCart logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">Ceylon</span>
                <span className="font-display text-2xl font-bold text-ceylon-400">Cart</span>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/5">

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {(['signin', 'register'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); }}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                    tab === t ? 'text-ceylon-400' : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  {t === 'signin' ? 'Sign In' : 'Create Account'}
                  {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ceylon-400 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="p-7">
              {/* Error / Success */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* ── SIGN IN FORM ── */}
              {tab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" required autoFocus
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" required
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-lg transition-colors">
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-ceylon-500 to-amber-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
                  </button>
                </form>
              )}

              {/* ── REGISTER FORM ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Amara Perera" required autoFocus
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 6 characters" required
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-lg">
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {pwStrength && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex gap-1 flex-1">
                          {['weak','medium','strong'].map((s, i) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= ['weak','medium','strong'].indexOf(pwStrength)
                                ? pwStrength === 'strong' ? 'bg-green-500' : pwStrength === 'medium' ? 'bg-amber-400' : 'bg-red-500'
                                : 'bg-white/10'
                            }`} />
                          ))}
                        </div>
                        <span className={`text-xs font-medium capitalize ${pwStrength === 'strong' ? 'text-green-400' : pwStrength === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>{pwStrength}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
                    <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password" required
                      className={`w-full bg-[#2a2a2a] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-ceylon-400 focus:border-transparent transition-all ${confirm && confirm !== password ? 'border-red-500/50' : 'border-white/10'}`} />
                    {confirm && confirm !== password && <p className="text-xs text-red-400 mt-1">Passwords don't match</p>}
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-ceylon-500 to-amber-500 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : '🚀 Create Account'}
                  </button>
                </form>
              )}

              {/* ── DIVIDER ── */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-600 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* ── SOCIAL BUTTONS ── */}
              <div className="space-y-3">

                {/* Google */}
                <button onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333] border border-white/10 hover:border-white/20 text-white font-medium py-3.5 rounded-2xl transition-all active:scale-95">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Facebook */}
                {tab === 'signin' && (
                  <button onClick={handleFacebook}
                    className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333] border border-white/10 hover:border-white/20 text-white font-medium py-3.5 rounded-2xl transition-all active:scale-95">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </button>
                )}

                {/* Passkey */}
                {tab === 'signin' && (
                  <button onClick={handlePasskeyLogin} disabled={passkeyLoading}
                    className="w-full flex items-center justify-center gap-3 bg-[#2a2a2a] hover:bg-[#333] border border-white/10 hover:border-white/20 text-white font-medium py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50">
                    {passkeyLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg">🔑</span>
                    )}
                    {passkeyLoading ? 'Waiting for passkey...' : 'Sign In with Passkey'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;