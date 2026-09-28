import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  ArrowRight 
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { checkPasswordStrength, isValidEmail } from '../../utils/validation';

interface SignupFormProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onClose,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pwdCriteria = checkPasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter your full first and last name.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid student email address.');
      return;
    }

    if (!pwdCriteria.isValid) {
      setErrorMessage('Password does not meet all security criteria (8+ chars, upper, lower, number, special char).');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the student community terms to continue.');
      return;
    }

    setLoading(true);

    // Simulated registration - will connect to Supabase Auth in Step 9
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        collegeName: collegeName.trim() || 'College Explorer',
        city,
        preferredVibe: ['BUDGET', 'CHILL'],
      };
      onSuccess(user);
      onClose();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            First Name
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Poojith"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Kumar"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* College & City Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            College / Campus
          </label>
          <div className="relative">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. RVCE, PES, Christ"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            City Hub
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500/60"
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
          Student Email
        </label>
        <div className="relative">
          <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu or personal email"
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Password (e.g. Student@123)
          </label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type password"
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </div>

      {/* Password Security Criteria Live Badges */}
      {password.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[10px] space-y-1">
          <span className="text-slate-400 block font-semibold mb-1">Password Requirements:</span>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span className={`flex items-center gap-1 ${pwdCriteria.minLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {pwdCriteria.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} 8+ Characters
            </span>
            <span className={`flex items-center gap-1 ${pwdCriteria.hasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {pwdCriteria.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Uppercase Letter
            </span>
            <span className={`flex items-center gap-1 ${pwdCriteria.hasLower ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {pwdCriteria.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Lowercase Letter
            </span>
            <span className={`flex items-center gap-1 ${pwdCriteria.hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {pwdCriteria.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Number (0-9)
            </span>
            <span className={`flex items-center gap-1 ${pwdCriteria.hasSpecial ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {pwdCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Special Char (!@#$)
            </span>
            {confirmPassword.length > 0 && (
              <span className={`flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400 font-medium' : 'text-rose-400'}`}>
                {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Passwords Match
              </span>
            )}
          </div>
        </div>
      )}

      {/* Terms Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="terms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
        />
        <label htmlFor="terms" className="text-[11px] text-slate-400">
          I agree to the student travel community guidelines and respect student spots.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Student Account...</span>
          </>
        ) : (
          <>
            <span>Create Student Account</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-400 pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-emerald-400 hover:text-emerald-300 font-semibold underline ml-1 cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};
