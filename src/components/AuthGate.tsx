import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface UserAccount {
  email: string;
  name: string;
  registeredAt: string;
}

interface AuthGateProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Por favor introduce un correo electrónico válido.');
      audioEngine.playBeep(900, 0.08);
      return;
    }

    if (cleanPass.length < 5) {
      setErrorMsg('La contraseña debe tener al menos 5 caracteres.');
      audioEngine.playBeep(900, 0.08);
      return;
    }

    // "verificar contraseña" requirement
    if (cleanPass !== cleanConfirm) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifica tu contraseña.');
      audioEngine.playBeep(900, 0.08);
      return;
    }

    try {
      const usersRaw = localStorage.getItem('musicologos_registered_users');
      const usersMap: Record<string, { pass: string; name: string }> = usersRaw
        ? JSON.parse(usersRaw)
        : {};

      if (mode === 'register') {
        if (usersMap[cleanEmail]) {
          setErrorMsg('Este correo ya está registrado. Puedes iniciar sesión.');
          audioEngine.playBeep(900, 0.08);
          return;
        }

        const userName = cleanEmail.split('@')[0];
        usersMap[cleanEmail] = { pass: cleanPass, name: userName };
        localStorage.setItem('musicologos_registered_users', JSON.stringify(usersMap));

        const userObj: UserAccount = {
          email: cleanEmail,
          name: userName,
          registeredAt: new Date().toISOString(),
        };

        localStorage.setItem('musicologos_auth_user', JSON.stringify(userObj));
        audioEngine.playBeep(2200, 0.05);
        setSuccessMsg('¡Cuenta creada y verificada con éxito!');
        setTimeout(() => onLoginSuccess(userObj), 600);
      } else {
        // Login mode
        const existing = usersMap[cleanEmail];
        if (existing && existing.pass !== cleanPass) {
          setErrorMsg('Contraseña incorrecta. Por favor verifica tus credenciales.');
          audioEngine.playBeep(900, 0.08);
          return;
        }

        // If not found in local db, register automatically with verified password
        if (!existing) {
          usersMap[cleanEmail] = { pass: cleanPass, name: cleanEmail.split('@')[0] };
          localStorage.setItem('musicologos_registered_users', JSON.stringify(usersMap));
        }

        const userObj: UserAccount = {
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
          registeredAt: new Date().toISOString(),
        };

        localStorage.setItem('musicologos_auth_user', JSON.stringify(userObj));
        audioEngine.playBeep(2100, 0.04);
        setSuccessMsg('¡Bienvenido a Radio Musicólogos!');
        setTimeout(() => onLoginSuccess(userObj), 400);
      }
    } catch {
      const userObj: UserAccount = {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem('musicologos_auth_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
    }
  };

  const handleQuickDemo = () => {
    audioEngine.playBeep(2100, 0.04);
    setEmail('luismiguel@musicologos.rd');
    setPassword('musicologo123');
    setConfirmPassword('musicologo123');
  };

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3">
      <div className="w-full max-w-md bg-gradient-to-b from-[#13151b] to-[#0a0b0e] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Title */}
        <div className="text-center mb-6 relative">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-black border-2 border-cyan-400 p-1 shadow-xl shadow-cyan-900/50 flex items-center justify-center">
            <img
              src="/assets/img/logo-luis-miguel.png"
              alt="Luis Miguel Musicólogo"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider">
            Luis Miguel Musicólogo
          </h1>
          <p className="text-xs text-cyan-300 font-bold uppercase tracking-widest mt-0.5">
            Acceso al Sistema Car Audio Pro
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Ingresa tu correo y contraseña con verificación para acceder al estéreo y chucheros.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-950/80 p-1 rounded-2xl border border-neutral-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Registrarme
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-black uppercase text-neutral-300 mb-1 tracking-wider">
              Correo Electrónico:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black uppercase text-neutral-300 tracking-wider">
                Contraseña:
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Verify Password (Requisito Explícito) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black uppercase text-neutral-300 tracking-wider">
                Verificar Contraseña:
              </label>
              {confirmPassword.length > 0 && (
                <span
                  className={`text-[10px] font-bold ${
                    passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {passwordsMatch ? '✓ Coinciden' : '✗ No coinciden'}
                </span>
              )}
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña exactamente"
              className={`w-full bg-neutral-950/90 border rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all ${
                confirmPassword.length === 0
                  ? 'border-neutral-800 focus:border-cyan-400'
                  : passwordsMatch
                  ? 'border-emerald-500 focus:border-emerald-400'
                  : 'border-red-500 focus:border-red-400'
              }`}
            />
          </div>

          {/* Error / Success Feedback */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 text-[11px] text-red-200 font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-200 font-bold text-center">
              ✓ {successMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:brightness-110 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-900/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'login' ? '🔓 Iniciar Sesión y Entrar' : '✨ Crear Cuenta y Entrar'}</span>
          </button>
        </form>

        {/* Quick Autofill Helper for convenience */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <span>¿Probar rápido?</span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-amber-400 hover:underline font-bold cursor-pointer"
          >
            ⚡ Llenar Datos Demo
          </button>
        </div>
      </div>
    </div>
  );
};
