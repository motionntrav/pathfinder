import { useState, useEffect, useRef } from 'react';

// Custom Icons for the Landing Page
const Icon = {
  NorthStar: ({ size = 24, className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="currentColor" opacity="0.9" />
      <path d="M12 5 L12.8 10.8 L18 12 L12.8 13.2 L12 19 L11.2 13.2 L6 12 L11.2 10.8 Z" fill="currentColor" />
    </svg>
  ),
  Compass: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
    </svg>
  ),
  Map: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  Zap: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
};

const landingCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --night: #05060f;
    --night-light: rgba(5,6,15,0.7);
    --gold: #f2c94c;
    --gold-dim: #c9a83c;
    --star: #e8f0ff;
    --muted: #8b92a0;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--night);
    color: var(--star);
    min-height: 100vh;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* Starfield */
  #landing-starfield {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0%, #1a1040 0%, #05060f 70%);
  }
  .landing-star {
    position: absolute; border-radius: 50%; background: white;
    animation: landing-twinkle var(--d, 3s) ease-in-out infinite;
    opacity: var(--o, 0.6);
  }
  @keyframes landing-twinkle {
    0%,100% { opacity: var(--o,.6); transform: scale(1); }
    50% { opacity: 0.1; transform: scale(0.5); }
  }

  /* Content Wrapper */
  .landing-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    margin: 0 auto;
  }

  /* Navigation */
  .landing-nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    background: rgba(5,6,15,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  header.landing-nav {
    width: 100%;
    max-width: 1200px;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fade-down 0.8s ease-out forwards;
  }
  
  .landing-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    letter-spacing: 0.04em;
    cursor: pointer;
  }

  .nav-btn {
    background: transparent;
    border: 1px solid rgba(242,201,76,0.3);
    color: var(--gold);
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }
  .nav-btn:hover {
    background: rgba(242,201,76,0.1);
    border-color: var(--gold);
    transform: translateY(-2px);
  }

  /* Hero Section */
  .hero-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 8rem 2rem 4rem;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(242,201,76,0.08);
    border: 1px solid rgba(242,201,76,0.2);
    padding: 0.4rem 1rem;
    border-radius: 100px;
    color: var(--gold);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 2rem;
    animation: fade-up 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.2s;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(180deg, #ffffff 0%, #b0b8c8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fade-up 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.4s;
  }

  .hero-title span {
    background: linear-gradient(135deg, #f2c94c 0%, #d4a72c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  .hero-subtitle {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    color: var(--muted);
    max-width: 650px;
    line-height: 1.6;
    margin-bottom: 3rem;
    animation: fade-up 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.6s;
  }

  .cta-group {
    display: flex;
    gap: 1.5rem;
    animation: fade-up 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.8s;
  }

  .primary-cta {
    background: var(--gold);
    color: var(--night);
    border: none;
    padding: 1.1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(242, 201, 76, 0.25);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .primary-cta:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 40px rgba(242, 201, 76, 0.4);
    background: #f5d46a;
  }

  /* Features Grid */
  .features-section {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    opacity: 0;
    animation: fade-in 1s ease-out forwards;
    animation-delay: 1.2s;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 2.5rem 2rem;
    border-radius: 20px;
    backdrop-filter: blur(20px);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .feature-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(242, 201, 76, 0.3);
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    background: rgba(242, 201, 76, 0.1);
    border: 1px solid rgba(242, 201, 76, 0.2);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }
  .feature-card:hover .feature-icon {
    background: var(--gold);
    color: var(--night);
    transform: scale(1.1) rotate(5deg);
  }

  .feature-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--star);
  }
  .feature-card p {
    color: var(--muted);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  /* Personas Section */
  .personas-section {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 2rem 6rem;
    text-align: center;
  }
  .personas-header {
    margin-bottom: 3rem;
  }
  .personas-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--star);
  }
  .personas-header p {
    color: var(--muted);
    font-size: 1.1rem;
  }
  .personas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  .persona-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
  }
  .persona-card:hover {
    background: rgba(242, 201, 76, 0.05);
    border-color: rgba(242, 201, 76, 0.2);
    transform: translateY(-4px);
  }
  .persona-card h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--star);
  }
  .persona-card p {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.5;
  }

  /* Bottom CTA */
  .bottom-cta-section {
    padding: 4rem 2rem 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .bottom-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: var(--star);
  }

  /* Auth Modals */
  .auth-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(5,6,15,0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fade-in 0.3s ease-out forwards;
  }
  
  .auth-modal {
    background: rgba(13, 15, 34, 0.95);
    border: 1px solid rgba(242, 201, 76, 0.2);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    width: 90%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(242, 201, 76, 0.05);
    animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    position: relative;
  }

  .auth-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s;
  }
  .auth-close:hover {
    color: var(--star);
  }

  .auth-modal h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--star);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .auth-modal p {
    text-align: center;
    color: var(--muted);
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .auth-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }

  .auth-input-group label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .auth-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.9rem 1rem;
    border-radius: 10px;
    color: var(--star);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    transition: all 0.2s;
    outline: none;
  }
  
  .auth-input:focus {
    border-color: rgba(242, 201, 76, 0.5);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 2px rgba(242, 201, 76, 0.1);
  }

  .auth-submit {
    background: var(--gold);
    color: var(--night);
    border: none;
    padding: 1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  
  .auth-submit:hover {
    background: var(--gold-dim);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(242, 201, 76, 0.2);
  }

  .auth-toggle {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
  }

  .auth-toggle button {
    background: none;
    border: none;
    color: var(--gold);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-left: 0.3rem;
  }
  .auth-toggle button:hover {
    text-decoration: underline;
  }

  /* Animations */
  @keyframes pop-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fade-down {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes spin-slow { 
    to { transform: rotate(360deg); } 
  }

  @media (max-width: 768px) {
    header.landing-nav { padding: 1rem 1.5rem; }
    .hero-section { padding: 6rem 1.5rem 2rem; }
    .features-section { padding: 4rem 1.5rem; gap: 1.5rem; }
    .cta-group { flex-direction: column; width: 100%; }
    .primary-cta { width: 100%; justify-content: center; }
  }
`;

function LandingStarfield() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 150; i++) {
      const s = document.createElement("div");
      s.className = "landing-star";
      const size = Math.random() * 2.5 + 0.5;
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--o:${(Math.random() * .6 + .2).toFixed(2)};--d:${(Math.random() * 5 + 2).toFixed(1)}s;animation-delay:${(Math.random() * 7).toFixed(1)}s;`;
      frag.appendChild(s);
    }
    ref.current.appendChild(frag);
  }, []);
  return <div id="landing-starfield" ref={ref} />;
}

export default function LandingPage({ onStart }) {
  const [authMode, setAuthMode] = useState(null); // 'login' or 'signup' or null

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // Mock successful authentication
    setAuthMode(null);
    onStart();
  };

  return (
    <>
      <style>{landingCss}</style>
      <LandingStarfield />

      <div className="landing-wrapper">
        <div className="landing-nav-wrapper">
          <header className="landing-nav">
            <div className="landing-logo">
              <span style={{ animation: 'spin-slow 20s linear infinite', display: 'flex' }}>
                <Icon.NorthStar size={26} />
              </span>
              PathFinder
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="nav-btn" onClick={() => setAuthMode('login')} style={{ border: 'none', background: 'transparent' }}>
                Log In
              </button>
              <button className="nav-btn" onClick={() => setAuthMode('signup')} style={{ background: 'var(--gold)', color: 'var(--night)' }}>
                Sign Up
              </button>
            </div>
          </header>
        </div>

        <main className="hero-section">
          <h1 className="hero-title">
            Find Your <span>True North.</span>
          </h1>

          <p className="hero-subtitle">
            Your AI-powered life mentor. Set your North Star, get a personalized roadmap, and start showing up as who you're meant to be.
          </p>

          <div className="cta-group">
            <button className="primary-cta" onClick={() => setAuthMode('signup')}>
              Begin Your Journey
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </main>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon"><Icon.Compass /></div>
            <h3>Personalized Mentorship</h3>
            <p>Engage in deep, meaningful conversations. Our AI understands your context, asks the right questions, and refuses to give generic advice.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Icon.Map /></div>
            <h3>Actionable Roadmaps</h3>
            <p>From vague ambitions to concrete steps. After a few exchanges, watch as PathFinder dynamically generates a step-by-step master plan.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Icon.Zap /></div>
            <h3>Dynamic Adaptation</h3>
            <p>Your life isn't static, and neither is your plan. As you learn, pivot, and grow, your roadmap evolves to match your exact coordinates.</p>
          </div>
        </section>

        <section className="personas-section">
          <div className="personas-header">
            <h2>Who is PathFinder for?</h2>
            <p>Designed for anyone standing at a crossroads.</p>
          </div>
          <div className="personas-grid">
            <div className="persona-card">
              <h4>High School Grads</h4>
              <p>Exploring alternative paths beyond the default college route.</p>
            </div>
            <div className="persona-card">
              <h4>Small Business Owners</h4>
              <p>Scaling operations, generating leads, and building systems.</p>
            </div>
            <div className="persona-card">
              <h4>World Travelers</h4>
              <p>Architecting remote income to fund a life of adventure.</p>
            </div>
            <div className="persona-card">
              <h4>Career Pivoters</h4>
              <p>Navigating the transition into a completely new field.</p>
            </div>
          </div>
        </section>

        <section className="bottom-cta-section">
          <h2 className="bottom-cta-title">Ready to find your way?</h2>
          <button className="primary-cta" onClick={() => setAuthMode('signup')}>
            Create an Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </section>
      </div>

      {/* Auth Modals */}
      {authMode && (
        <div className="auth-modal-overlay" onClick={() => setAuthMode(null)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <button className="auth-close" onClick={() => setAuthMode(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div className="feature-icon" style={{ marginBottom: 0 }}>
                <Icon.NorthStar size={24} />
              </div>
            </div>

            <h2>{authMode === 'login' ? 'Welcome Back' : 'Join PathFinder'}</h2>
            <p>{authMode === 'login' ? 'Find your compass and continue your journey.' : 'Create an account to build your personalized roadmap.'}</p>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="auth-input-group">
                  <label>FULL NAME</label>
                  <input type="text" className="auth-input" placeholder="e.g. Amelia Earhart" required />
                </div>
              )}

              <div className="auth-input-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" className="auth-input" placeholder="you@domain.com" required />
              </div>

              <div className="auth-input-group">
                <label>PASSWORD</label>
                <input type="password" className="auth-input" placeholder="••••••••" required />
              </div>

              <button type="submit" className="auth-submit">
                {authMode === 'login' ? 'Log In to PathFinder' : 'Create My Account'}
                <Icon.NorthStar size={14} style={{ marginLeft: 4 }} />
              </button>
            </form>

            <div className="auth-toggle">
              {authMode === 'login' ? (
                <>
                  Don't have an account?
                  <button onClick={() => setAuthMode('signup')}>Sign up</button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button onClick={() => setAuthMode('login')}>Log in</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
