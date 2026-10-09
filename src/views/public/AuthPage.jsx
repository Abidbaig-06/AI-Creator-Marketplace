import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Building2,
  Palette,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const AuthPage = ({ defaultTab = 'signin', defaultRole = 'brand' }) => {
  const { switchRole, navigateTo, addToast } = useApp();

  const [authMode, setAuthMode] = useState(defaultTab); // 'signin' | 'signup' | 'forgot'
  const [selectedRole, setSelectedRole] = useState(defaultRole); // 'brand' | 'creator'
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email || !email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (authMode === 'signup') {
      if (!name.trim()) errors.name = 'Please enter your full name';
      if (selectedRole === 'brand' && !companyName.trim()) {
        errors.companyName = 'Please enter your brand or agency name';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setFormErrors({});

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setFormErrors({ email: error.message });
        addToast({
          title: 'Sign In Failed',
          message: error.message,
          type: 'danger'
        });
        setIsLoading(false);
        return;
      }

      const user = data.user;
      const role = (user?.user_metadata?.role) || selectedRole;
      switchRole(role);
      addToast({
        title: 'Welcome Back!',
        message: `Signed in successfully as ${user.email}.`,
        type: 'success'
      });
    } catch (err) {
      setFormErrors({ email: err?.message || 'Authentication service error. Please try again.' });
      addToast({
        title: 'Sign In Failed',
        message: err?.message || 'Could not connect to authentication service.',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setFormErrors({});

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: selectedRole,
            company_name: selectedRole === 'brand' ? companyName : undefined,
          }
        }
      });

      if (error) {
        setFormErrors({ email: error.message });
        addToast({
          title: 'Sign Up Failed',
          message: error.message,
          type: 'danger'
        });
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        if (!data.session) {
          addToast({
            title: 'Account Created — Verify Email',
            message: `Confirmation email dispatched to ${email}. Please check your inbox.`,
            type: 'info'
          });
          setAuthMode('signin');
        } else {
          switchRole(selectedRole);
          addToast({
            title: 'Account Created!',
            message: `Welcome to CreatorProof AI as a ${selectedRole === 'brand' ? 'Brand / Agency' : 'Verified AI Creator'}.`,
            type: 'success'
          });
        }
      }
    } catch (err) {
      setFormErrors({ email: err?.message || 'Registration service error. Please try again.' });
      addToast({
        title: 'Sign Up Failed',
        message: err?.message || 'Could not connect to registration service.',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setFormErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email);
    } catch (err) {
      console.warn('Password reset notice:', err);
    } finally {
      setIsLoading(false);
      addToast({
        title: 'Reset Link Dispatched',
        message: `Password reset instructions sent to ${email}.`,
        type: 'info'
      });
      setAuthMode('signin');
    }
  };

  // Quick 1-Click Demo Logins for Hackathon Judges
  const loginAsJewelleryBrand = () => {
    switchRole('brand');
    addToast({
      title: 'Demo Session Active',
      message: 'Logged in as Aura Luxe Jewels / Acme Brand Workspace',
      type: 'success'
    });
  };

  const loginAsSophiaCreator = () => {
    switchRole('creator');
    addToast({
      title: 'Demo Session Active',
      message: 'Logged in as Sophia Chan (Verified AI Luxury Specialist)',
      type: 'success'
    });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px 80px',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Logo and Intro */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: 'var(--shadow-indigo)'
          }}>
            <Sparkles size={24} color="#FFFFFF" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            {authMode === 'signin' && 'Sign in to CreatorProof AI'}
            {authMode === 'signup' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {authMode === 'signin' && 'Access your campaigns, portfolio, and milestone escrow dashboard.'}
            {authMode === 'signup' && 'Select your role to access specialized brand or creator workflows.'}
            {authMode === 'forgot' && 'Enter your registered email to receive password reset instructions.'}
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box for Judges */}
        <div className="card" style={{
          backgroundColor: '#FFFFFF',
          padding: '18px 20px',
          marginBottom: '24px',
          border: '1.5px solid #C7D2FE',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
            <Sparkles size={14} />
            <span>Hackathon Quick-Demo Login (Instant Access)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={loginAsJewelleryBrand}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <Building2 size={14} />
              <span>Brand Demo</span>
            </button>
            <button
              type="button"
              onClick={loginAsSophiaCreator}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'center', backgroundColor: '#7C3AED', color: '#FFFFFF', borderColor: '#7C3AED' }}
            >
              <Palette size={14} />
              <span>Creator Demo</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="card" style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
          {/* Auth Mode Toggle (Sign In / Sign Up) */}
          {authMode !== 'forgot' && (
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '24px',
              border: '1px solid var(--border-light)'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setFormErrors({}); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: authMode === 'signin' ? '#FFFFFF' : 'transparent',
                  fontWeight: authMode === 'signin' ? 700 : 500,
                  boxShadow: authMode === 'signin' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer',
                  color: authMode === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setFormErrors({}); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: authMode === 'signup' ? '#FFFFFF' : 'transparent',
                  fontWeight: authMode === 'signup' ? 700 : 500,
                  boxShadow: authMode === 'signup' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer',
                  color: authMode === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Role Selection Tabs */}
          {authMode !== 'forgot' && (
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Select Workspace Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('brand')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: selectedRole === 'brand' ? 'var(--primary)' : 'var(--border-light)',
                    backgroundColor: selectedRole === 'brand' ? 'var(--primary-light)' : '#FFFFFF',
                    color: selectedRole === 'brand' ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Building2 size={18} />
                  <span>Brand / Agency</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('creator')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: selectedRole === 'creator' ? '#7C3AED' : 'var(--border-light)',
                    backgroundColor: selectedRole === 'creator' ? 'var(--secondary-light)' : '#FFFFFF',
                    color: selectedRole === 'creator' ? '#7C3AED' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Palette size={18} />
                  <span>AI Creator</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={authMode === 'signin' ? handleSignIn : (authMode === 'signup' ? handleSignUp : handleForgot)}>
            {/* Signup extra fields */}
            {authMode === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formErrors.name && (
                    <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{formErrors.name}</div>
                  )}
                </div>

                {selectedRole === 'brand' && (
                  <div className="form-group">
                    <label className="form-label">Brand / Agency Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aura Luxe Jewels"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    {formErrors.companyName && (
                      <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{formErrors.companyName}</div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{formErrors.email}</div>
              )}
            </div>

            {/* Password Field */}
            {authMode !== 'forgot' && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && (
                  <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{formErrors.password}</div>
                )}
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '10px',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'wait' : 'pointer'
              }}
            >
              {isLoading ? 'Processing...' : (
                <>
                  {authMode === 'signin' && `Sign In as ${selectedRole === 'brand' ? 'Brand' : 'AI Creator'}`}
                  {authMode === 'signup' && `Create ${selectedRole === 'brand' ? 'Brand' : 'Creator'} Account`}
                  {authMode === 'forgot' && 'Send Reset Instructions'}
                </>
              )}
            </button>
          </form>

          {/* Verification disclaimer */}
          {authMode === 'signup' && (
            <div style={{
              marginTop: '18px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px'
            }}>
              <AlertCircle size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Standard registration creates an unverified account. Creator verified badges require submitting reproducible ComfyUI workflows or C2PA provenance proofs.
              </span>
            </div>
          )}

          {authMode === 'forgot' && (
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
