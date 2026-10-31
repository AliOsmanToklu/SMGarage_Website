import { Component, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const timer = useRef();
  const notify = useCallback(text => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(''), 6000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <ToastContext.Provider value={notify}>
    {children}
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
      {message && <div className="toast">{message}</div>}
    </div>
  </ToastContext.Provider>;
}

export function RecoveryPage({ error = false }) {
  return <main id="top" className="recovery-page" tabIndex={-1}>
    <div className="container recovery-page__inner">
      <p className="recovery-page__brand">SM GARAGE / MASLAK</p>
      <p className="recovery-page__number" aria-hidden="true">{error ? '!' : '404'}</p>
      <h1>{error ? 'Bir sorun oluştu.' : 'Sayfa bulunamadı.'}</h1>
      <p>{error ? 'Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.' : 'Adres değişmiş veya yanlış yazılmış olabilir. Ana sayfadan hizmetlerimize ulaşabilirsiniz.'}</p>
      <div className="recovery-page__actions">
        <a className="btn btn--primary" href="/">Ana sayfaya dön</a>
        {error && <button className="btn btn--ghost" onClick={() => window.location.reload()}>Sayfayı yenile</button>}
      </div>
    </div>
  </main>;
}

export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RecoveryPage error /> : this.props.children; }
}

export function PageSkeleton() {
  return <main id="top" className="legal-page page-skeleton" tabIndex={-1} aria-busy="true" aria-label="Sayfa yükleniyor">
    <div className="container legal__inner">
      <p role="status">Sayfa yükleniyor</p>
      <div className="skeleton skeleton--heading" /><div className="skeleton" /><div className="skeleton" /><div className="skeleton skeleton--short" />
    </div>
  </main>;
}
