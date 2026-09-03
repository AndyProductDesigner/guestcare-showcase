import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

import './AppHeader.css';

import { useNavigate } from 'react-router-dom';

import { supabase } from '../../lib/supabase';

type AppHeaderProps = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  showBorder?: boolean;
};

function AppHeader({
  left,
  center,
  right,
  showBorder = false,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * --------------------------------------------------
   * CURRENT USER
   * --------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error('Unable to load current user:', error);

        return;
      }

      setUserEmail(data.session?.user.email ?? null);
    }

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * --------------------------------------------------
   * USER MENU
   * --------------------------------------------------
   */

  function handleRightSideClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const userMenuButton = target.closest(
      'button[aria-label="Open user menu"]',
    );

    if (!userMenuButton) {
      return;
    }

    setIsUserMenuOpen((current) => !current);
  }

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    function handleOutsideClick(event: globalThis.MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (userMenuRef.current?.contains(target)) {
        return;
      }

      setIsUserMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setIsUserMenuOpen(false);

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      console.error('Unable to log out:', error);

      setLoggingOut(false);
    }
  }

  return (
    <header className={`app-header${showBorder ? ' app-header-bordered' : ''}`}>
      <div className="app-header-side">{left}</div>

      <div className="app-header-center">{center}</div>

      <div
        ref={userMenuRef}
        className="app-header-side app-header-right"
        onClick={handleRightSideClick}
      >
        {right}

        {isUserMenuOpen && (
          <div
            className="app-header-user-menu"
            role="menu"
            aria-label="User menu"
          >
            {userEmail && (
              <div className="app-header-user-email">{userEmail}</div>
            )}

            <button
              type="button"
              role="menuitem"
              className="app-header-user-menu-item"
              disabled={loggingOut}
              onClick={() => void handleLogout()}
            >
              {loggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
