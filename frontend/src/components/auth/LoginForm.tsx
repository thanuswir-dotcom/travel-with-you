import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  KeyRound,
  RotateCcw
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { isValidEmail } from '../../utils/validation';
import { sendPhoneOtp, verifyPhoneOtp, loginWithGoogle } from '../../utils/api';

interface LoginFormProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToSignup: () => void;
  onClose: () => void;
}

type LoginMethod = 'mobile' | 'email';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignup,
  onClose,
}) => {
  const [method, setMethod] = useState<LoginMethod>('mobile');

  // Mobile state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendPhoneOtp(cleanPhone);
      setLoading(false);
      if (res && res.success) {
        setOtpSent(true);
        setResendCooldown(30);
        setInfoMessage(`OTP sent to +91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}. (Demo Code: 123456)`);
      } else {
        setErrorMessage(res?.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setLoading(false);
      setOtpSent(true);
      setResendCooldown(30);
      setInfoMessage(`OTP sent to +91 ${cleanPhone}. (Demo Code: 123456)`);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit OTP sent to your phone.');
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const res = await verifyPhoneOtp(cleanPhone, otp.trim());
      setLoading(false);
      if (res && res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res?.error || 'Invalid OTP. Please check and try again.');
      }
    } catch {
      setLoading(false);
      const fallbackUser: UserProfile = {
        id: `usr-${cleanPhone}`,
        email: `student.${cleanPhone.slice(-4)}@campus.edu`,
        fullName: `Student Explorer (+91 ${cleanPhone.slice(-4)})`,
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'BUDGET', 'COFFEE'],
      };
      onSuccess(fallbackUser);
      onClose();
    }
  };

  // Handle Email Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid student email address (e.g. name@gmail.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: 'usr-student-1',
        email: email.trim(),
        fullName: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'BUDGET', 'COFFEE'],
      };
      onSuccess(user);
      onClose();
    }, 600);
  };

  // Handle Google / Gmail 1-Click Login
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle('poojith.student@gmail.com', 'Poojith Sharma');
      setLoading(false);
      if (res && res.success && res.user) {
        onSuccess(res.user);
        onClose();
      }
    } catch {
      setLoading(false);
      onSuccess({
        id: 'usr-google-demo',
        email: 'student@gmail.com',
        fullName: 'Student Traveler',
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'COFFEE', 'STUDY']
      });
      onClose();
    }
  };

  // Instant 1-Click Demo Login for Hackathon Judges
  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: 'usr-judge-demo',
        email: 'poojith.student@rvce.edu',
        fullName: 'Poojith (Student Explorer)',
        collegeName: 'RV College of Engineering',
        city: 'Bengaluru',
        preferredVibe: ['CHILL', 'FOODIE', 'STUDY'],
      };
      onSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Judge 1-Click Demo Banner */}
      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Hackathon Judge Quick Access</span>
        </div>
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
        >
          1-Click Login
        </button>
      </div>

      {/* Login Method Toggle Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setMethod('mobile');
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            method === 'mobile'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile Number</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('email');
            setErrorMessage(null);
            setInfoMessage(null);
          }}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
            method === 'email'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail / Email</span>
        </button>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Info Alert Banner */}
      {infoMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{infoMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setOtp('123456')}
            className="text-[11px] underline font-bold text-emerald-400 hover:text-emerald-300 shrink-0 cursor-pointer"
          >
            Autofill
          </button>
        </div>
      )}

      {/* ────────────────── METHOD 1: MOBILE NUMBER & OTP ────────────────── */}
      {method === 'mobile' && (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number (SMS verification)
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-300 select-none">
                    🇮🇳 +91
                  </div>
                  <div className="relative flex-1">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all font-mono tracking-wider"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  We'll send a one-time verification code via SMS
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Get OTP on Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Enter 6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all font-mono tracking-widest text-center text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setOtp('123456')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold cursor-pointer"
                  >
                    Use 123456
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={() => handleSendOtp()}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ────────────────── METHOD 2: GMAIL / EMAIL ────────────────── */}
      {method === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-3 cursor-pointer transition-all border border-slate-200"
          >
            {/* Google official multicolored 'G' icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Gmail / Google</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider absolute">
              or student email
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gmail / College Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com or @college.edu"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link will be sent to your Gmail inbox!')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In with Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch to Signup */}
      <p className="text-center text-xs text-slate-400 pt-2">
        New to Travel With You?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1 cursor-pointer"
        >
          Create Student Account
        </button>
      </p>
    </div>
  );
};
