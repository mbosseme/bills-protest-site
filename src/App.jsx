
import React from 'react';
import './zubaz.css';

function alternatingRedBlue(text) {
  const colors = ['#C60C30', '#00338D'];
  return (
    <span>
      {Array.from(text).map((char, i) => (
        <span key={i} style={{ color: colors[i % 2], fontFamily: 'Impact, Arial Black, Arial, sans-serif', fontWeight: 'bold' }}>{char}</span>
      ))}
    </span>
  );
}

function App() {
  const [page, setPage] = React.useState('main');
  const contractText =
    `Buffalo Retake Game Petition\n\nHey NFL,\n\nWe, the undersigned Bills fans, watched that game and, well, we all saw what happened. Brandin Cooks caught it. The refs? Not so much.\n\nWe’re not lawyers, but we know a catch when we see one. So here’s our ask: Give us a retake game. No drama, just football.\n\nSign below if you want another shot for the Bills.\n\nGo Bills!`;

  // Petition form state
  const [signing, setSigning] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Helper to get location (city, country) via ipinfo.io
  async function getLocation() {
    try {
      const res = await fetch('https://ipinfo.io/json?token=demo');
      if (!res.ok) return null;
      const data = await res.json();
      return data.city && data.country ? `${data.city}, ${data.country}` : data.country || null;
    } catch {
      return null;
    }
  }

  async function handleSign(e) {
    e.preventDefault();
    setSigning(true);
    setError(null);
    const name = e.target.name.value;
    const userAgent = navigator.userAgent;
    const location = await getLocation();
    try {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userAgent, location }),
      });
      if (!res.ok) throw new Error('Failed to sign');
      setSigned(true);
    } catch (err) {
      setError('Could not sign petition. Try again.');
    } finally {
      setSigning(false);
    }
  }

  if (page === 'main') {
    return (
      <div className="zubaz-bg" style={{ minHeight: '100vh', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          padding: '2.5rem 2rem',
          maxWidth: 700,
          width: '100%',
          textAlign: 'left',
        }}>
          <h1 style={{ fontFamily: 'Impact, sans-serif', fontSize: '2.5rem', marginBottom: 12 }}>
            {alternatingRedBlue('Bills Fans Demand a Retake!')}
          </h1>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 32, lineHeight: 1.5, color: '#00338D' }}>
            In overtime, Brandin Cooks made a catch so clean it could've been used in a detergent commercial, but the refs must've had their Zubaz pulled over their eyes. The call left Bills fans stunned, Broncos fans confused, and Billy Buffalo looking for the rulebook. If you think the Bills deserve a fair shot (and maybe a ref who knows a catch from a magic trick), sign our digital petition for a retake game. Let's show the league that Buffalo stands together for fairness, fun, and a little bit of football justice. Add your name and let your voice be heard: we want a retake!
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              style={{ background: '#00338D', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.8rem 2.2rem', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              onClick={() => setPage('petition')}
            >
              Go to Petition
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Petition page
  return (
    <div className="zubaz-bg" style={{ minHeight: '100vh', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        padding: '2rem',
        maxWidth: 600,
        width: '100%',
        textAlign: 'left',
      }}>
        <h2 style={{
          fontFamily: 'Impact, Arial Black, Arial, sans-serif',
          color: '#00338D',
          fontSize: '1.3rem',
          marginBottom: 16,
          textAlign: 'center',
          letterSpacing: 1
        }}>Petition</h2>
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          background: 'none',
          border: 'none',
          color: '#222',
          margin: 0,
          marginBottom: 24
        }}>{contractText}</pre>
        {signed ? (
          <div style={{ color: '#00338D', fontWeight: 'bold', textAlign: 'center', marginTop: 24 }}>
            Thanks for signing! Go Bills!
          </div>
        ) : (
          <form style={{ marginTop: 12, textAlign: 'center' }} onSubmit={handleSign}>
            <input type="text" name="name" placeholder="Your Name (Signature)" required style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: 6, border: '1px solid #00338D', marginRight: 12, width: '60%' }} disabled={signing} />
            <button type="submit" style={{ background: '#C60C30', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontSize: '1rem', cursor: 'pointer' }} disabled={signing}>
              {signing ? 'Signing...' : 'Sign'}
            </button>
          </form>
        )}
        {error && <div style={{ color: '#C60C30', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            style={{ background: '#00338D', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '0.6rem 1.6rem', fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}
            onClick={() => setPage('main')}
          >
            Back to Main
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
