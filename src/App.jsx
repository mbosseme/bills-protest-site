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
  const contractText =
    `Buffalo Retake Game Petition (Draft)\n\nHey NFL,\n\nWe, the undersigned Bills fans, watched that game and, well, we all saw what happened. Brandin Cooks caught it. The refs? Not so much.\n\nWe’re not lawyers, but we know a catch when we see one. So here’s our ask: Give us a retake game. No drama, just football.\n\nSign below if you want another shot for the Bills.\n\nGo Bills!`;

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

  return (
    <div className="zubaz-bg" style={{ minHeight: '100vh', padding: '0', margin: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        padding: '2rem',
        maxWidth: 1000,
        width: '100%',
      }}>
        <div style={{ flex: 1, textAlign: 'left', paddingRight: 32, borderRight: '2px solid #00338D', minWidth: 320 }}>
          <div style={{
            background: '#fff',
            border: '2px dashed #C60C30',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            padding: '2rem 1.5rem',
            fontFamily: 'serif',
            fontSize: '1.1rem',
            marginBottom: 24,
            minHeight: 420,
            position: 'relative',
          }}>
            <h2 style={{
              fontFamily: 'Impact, Arial Black, Arial, sans-serif',
              color: '#00338D',
              fontSize: '1.3rem',
              marginBottom: 16,
              textAlign: 'center',
              letterSpacing: 1
            }}>Petition (Draft)</h2>
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
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'left', paddingLeft: 32, minWidth: 320 }}>
          <h1 style={{ color: '#C60C30', fontFamily: 'Impact, sans-serif', fontSize: '2.5rem', marginBottom: 12 }}>
            Bills Fans Demand a Retake!
          </h1>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24, lineHeight: 1.5 }}>
            {alternatingRedBlue("In overtime, Brandin Cooks made a catch so clean it could've been used in a detergent commercial, but the refs must've had their Zubaz pulled over their eyes. The call left Bills fans stunned, Broncos fans confused, and Billy Buffalo looking for the rulebook. If you think the Bills deserve a fair shot (and maybe a ref who knows a catch from a magic trick), sign our digital petition for a retake game. Let's show the league that Buffalo stands together for fairness, fun, and a little bit of football justice. Add your name and let your voice be heard: we want a retake!")}
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="https://static.clubs.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/bills/ugz40ngpy416xfay4mak"
              alt="Billy Buffalo mascot"
              style={{ width: 180, borderRadius: '50%', border: '6px solid #00338D', marginLeft: 8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
