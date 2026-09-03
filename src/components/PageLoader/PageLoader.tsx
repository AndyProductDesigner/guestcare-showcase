import { useEffect, useState } from 'react';
import { Lottie } from 'lottie-react';
import './PageLoader.css';

type PageLoaderProps = {
  loading: boolean;
  message: string;
  delay?: number;
  mask?: boolean;
};

function PageLoader({
  loading,
  message,
  delay = 250,
  mask = false,
}: PageLoaderProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShouldShow(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldShow(true);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [loading, delay]);

  if (!loading || !shouldShow) return null;

  return (
    <div
      className={`page-loader${mask ? ' page-loader--mask' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="page-loader-animation-frame">
        <Lottie
          className="page-loader-animation"
          src="/loading.json"
          loop
          autoplay
        />
      </div>
      <span className="page-loader-message">{message}</span>
    </div>
  );
}

export default PageLoader;
