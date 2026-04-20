// auth.jsx — Signup + Login with REALISTIC stadium photography
// Clean, photo-forward design with subtle green accents — no tech/circuit imagery.

// ═════════════════════════════════════════════════════════════
// AUTH BACKGROUND — real stadium photo + dark overlay
// ═════════════════════════════════════════════════════════════
function AuthScaffold({ children, bgImage, initial = 0, emojis }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0F0D0A',
      overflow: 'hidden',
    }}>
      {/* Rotating epic stadium backgrounds */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <EpicStadiumBackground interval={6000} initial={initial}/>
      </div>
      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(180deg, rgba(15,13,10,0.55) 0%, rgba(15,13,10,0.72) 45%, rgba(15,13,10,0.95) 100%)',
      }}/>
      {/* Floating colored orbs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <FloatingOrbs orbs={[
          { x: 20, y: 30, size: 180, color: '#CCFF00', opacity: 0.22, dur: 16 },
          { x: 80, y: 70, size: 200, color: '#FFB800', opacity: 0.18, dur: 20 },
          { x: 50, y: 90, size: 160, color: '#CCFF00', opacity: 0.15, dur: 14 },
        ]}/>
      </div>
      {/* Rising emojis */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <FloatingEmojis emojis={emojis || ['⚽', '🔥', '⭐', '⚡']} count={7} duration={15}/>
      </div>
      {/* Speed line sweep */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden' }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            position: 'absolute',
            top: `${35 + i * 30}%`, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(204, 255, 0,0.5), transparent)',
            animation: `speed-line ${4 + i * 0.8}s linear ${i * 2}s infinite`,
          }}/>
        ))}
      </div>

      {children}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// CLEAN INPUT — dark translucent fill + subtle border, green on focus
// ═════════════════════════════════════════════════════════════
function CleanInput({ label, icon, placeholder, type = 'text', value, onChange, error }) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error
    ? '#ff5577'
    : focus ? '#CCFF00' : 'rgba(255,255,255,0.18)';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
        marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '0.01em',
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: 54, borderRadius: 12,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1.5px solid ${borderColor}`,
        padding: '0 16px', gap: 12,
        boxShadow: focus ? '0 0 0 3px rgba(204, 255, 0,0.15)' : 'none',
        transition: 'all 0.2s',
      }}>
        {icon && (
          <div style={{
            color: focus ? '#CCFF00' : 'rgba(255,255,255,0.55)',
            flexShrink: 0, transition: 'color 0.2s',
          }}>{icon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 15, fontWeight: 500,
          }}
        />
      </div>
      {error && (
        <div style={{
          marginTop: 6, fontSize: 12, color: '#ff5577',
          fontFamily: 'Space Grotesk, sans-serif',
        }}>{error}</div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SIGNUP SCREEN — clean, photo-forward
// ═════════════════════════════════════════════════════════════
function SignupScreen({ onAuth, onGoToLogin, onBack = () => {} }) {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  function submit() {
    const e = {};
    if (!username.trim()) e.username = 'Escribe un usuario';
    else if (username.trim().length < 3) e.username = 'Mínimo 3 caracteres';
    if (!email.trim()) e.email = 'Ingresa tu correo';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email no válido';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setTimeout(() => onAuth({ name: username.trim(), email }), 700);
  }

  return (
    <AuthScaffold initial={2} emojis={['⚽', '🔥', '⚡']}>
      {/* Back button */}
      <button onClick={onBack} style={{
        position: 'absolute', top: 56, left: 16, zIndex: 10,
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {/* Title block */}
      <div style={{
        position: 'absolute', top: 120, left: 24, right: 24,
        zIndex: 4,
        animation: 'slide-up-fade 0.7s cubic-bezier(.2,.8,.2,1) both',
      }}>
        <div style={{
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 800,
          fontSize: 38, lineHeight: 1.05,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          Crea tu cuenta
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 15, fontWeight: 400,
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.45,
        }}>
          Únete a la comunidad del fútbol base y conecta con clubes, entrenadores y jugadores.
        </div>
      </div>

      {/* Form */}
      <div style={{
        position: 'absolute', top: 265, left: 24, right: 24, zIndex: 4,
        animation: 'slide-up-fade 0.7s cubic-bezier(.2,.8,.2,1) 0.15s both',
      }}>
        <CleanInput
          label="Nombre de usuario"
          icon={<Icon.user size={18}/>}
          placeholder="tu_usuario"
          value={username} onChange={setUsername} error={errors.username}
        />
        <CleanInput
          label="Email"
          icon={<Icon.mail size={18}/>}
          placeholder="tucorreo@ejemplo.com"
          type="email"
          value={email} onChange={setEmail} error={errors.email}
        />

        <div style={{ height: 14 }}/>

        {/* CTA with shimmer */}
        <button onClick={submit} disabled={submitting} style={{
          position: 'relative',
          height: 56, width: '100%', borderRadius: 14,
          background: 'linear-gradient(90deg, #CCFF00, #FFB800, #CCFF00)',
          backgroundSize: '200% 100%',
          border: 'none', cursor: submitting ? 'wait' : 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 15, letterSpacing: '0.02em',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(204, 255, 0,0.35), 0 0 30px rgba(204, 255, 0,0.15), 0 2px 6px rgba(0,0,0,0.3)',
          opacity: submitting ? 0.7 : 1,
          transition: 'transform 0.15s',
          overflow: 'hidden',
          animation: 'gradient-shift 3s ease-in-out infinite',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: 60,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'shimmer 2.5s linear infinite',
            pointerEvents: 'none',
          }}/>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <div style={{
          marginTop: 14, textAlign: 'center',
          fontSize: 11, color: 'rgba(255,255,255,0.5)',
          fontFamily: 'Space Grotesk, sans-serif',
          lineHeight: 1.5,
        }}>
          Al crear una cuenta aceptas nuestros Términos y Política de privacidad.
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 4,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)', fontSize: 14,
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        ¿Ya tienes cuenta?{' '}
        <button onClick={onGoToLogin} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#CCFF00', fontWeight: 700,
          fontFamily: 'inherit', fontSize: 14,
        }}>Inicia sesión</button>
      </div>
    </AuthScaffold>
  );
}

// ═════════════════════════════════════════════════════════════
// LOGIN SCREEN — same clean style
// ═════════════════════════════════════════════════════════════
function LoginScreen({ onAuth, onGoToSignup, onBack = () => {} }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  function submit() {
    const e = {};
    if (!email.trim()) e.email = 'Ingresa tu correo';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email no válido';
    if (!password) e.password = 'Ingresa tu contraseña';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setTimeout(() => onAuth({ email, name: 'Alex Rivera' }), 700);
  }

  return (
    <AuthScaffold initial={5} emojis={['⚽', '🏆', '⭐']}>
      <button onClick={onBack} style={{
        position: 'absolute', top: 56, left: 16, zIndex: 10,
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div style={{
        position: 'absolute', top: 120, left: 24, right: 24,
        zIndex: 4,
        animation: 'slide-up-fade 0.7s cubic-bezier(.2,.8,.2,1) both',
      }}>
        <div style={{
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 800,
          fontSize: 38, lineHeight: 1.05, color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          Bienvenido de vuelta
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 15, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.45,
        }}>
          Inicia sesión para volver a la comunidad.
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 265, left: 24, right: 24, zIndex: 4,
        animation: 'slide-up-fade 0.7s cubic-bezier(.2,.8,.2,1) 0.15s both',
      }}>
        <CleanInput
          label="Email"
          icon={<Icon.mail size={18}/>}
          placeholder="tucorreo@ejemplo.com"
          type="email"
          value={email} onChange={setEmail} error={errors.email}
        />
        <CleanInput
          label="Contraseña"
          icon={<Icon.lock size={18}/>}
          placeholder="Tu contraseña"
          type="password"
          value={password} onChange={setPassword} error={errors.password}
        />
        <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 14 }}>
          <button style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>¿Olvidaste tu contraseña?</button>
        </div>
        <button onClick={submit} disabled={submitting} style={{
          position: 'relative',
          height: 56, width: '100%', borderRadius: 14,
          background: 'linear-gradient(90deg, #CCFF00, #FFB800, #CCFF00)',
          backgroundSize: '200% 100%',
          border: 'none', cursor: submitting ? 'wait' : 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700, fontSize: 15, letterSpacing: '0.02em',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(204, 255, 0,0.35), 0 0 30px rgba(204, 255, 0,0.15), 0 2px 6px rgba(0,0,0,0.3)',
          opacity: submitting ? 0.7 : 1,
          overflow: 'hidden',
          animation: 'gradient-shift 3s ease-in-out infinite',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: 60,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'shimmer 2.5s linear infinite',
            pointerEvents: 'none',
          }}/>
          {submitting ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 4,
        textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14,
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        ¿Nuevo aquí?{' '}
        <button onClick={onGoToSignup} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#CCFF00', fontWeight: 700, fontFamily: 'inherit', fontSize: 14,
        }}>Crear cuenta</button>
      </div>
    </AuthScaffold>
  );
}

Object.assign(window, { SignupScreen, LoginScreen });
