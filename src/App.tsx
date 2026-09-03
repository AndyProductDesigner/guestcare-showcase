import { useEffect, useState } from 'react';

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import type { Session } from '@supabase/supabase-js';

import {
  HostelSetupProvider,
  useHostelSetup,
} from './context/HostelSetupContext';

import Snackbar from './components/Snackbar/Snackbar';

import Dashboard from './pages/Dashboard/Dashboard';
import HostelSetup from './pages/HostelSetup/HostelSetup';
import BlockSetup from './pages/BlockSetup/BlockSetup';
import FloorSetup from './pages/FloorSetup/FloorSetup';

import CheckIn from './pages/CheckIn/CheckIn';

import Tenants from './pages/Tenants/Tenants';
import TenantDetails from './pages/TenantDetails/TenantDetails';

import OccupancySummary from './pages/OccupancySummary/OccupancySummary';
import BlockOccupancy from './pages/BlockOccupancy/BlockOccupancy';
import FloorOccupancy from './pages/FloorOccupancy/FloorOccupancy';
import RoomOccupancy from './pages/RoomOccupancy/RoomOccupancy';

import NavMenu from './pages/NavMenu/NavMenu';
import Login from './pages/Login/Login';
import AssignBed from './pages/AssignBed/AssignBed';
import BedFilter from './pages/BedFilter/BedFilter';
import TenantFilter from './pages/TenantFilter/TenantFilter';
import EditTenant from './pages/EditTenant/EditTenant';
import ChangeBed from './pages/ChangeBed/ChangeBed';
import Tariff from './pages/Tariff/Tariff';
import BlockTariff from './pages/BlockTariff/BlockTariff';
import YourHostels from './pages/YourHostels/YourHostels';

import { supabase } from './lib/supabase';

function AppContent() {
  const { snackbarMessage } = useHostelSetup();
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error('Unable to load auth session:', error);
      }

      setSession(data.session);
      setCheckingSession(false);
    }

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) {
          return;
        }

        setSession(nextSession);
        setCheckingSession(false);
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleMenuClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const menuButton = target.closest('button[aria-label="Open menu"]');

      if (!menuButton || location.pathname === '/menu') {
        return;
      }

      event.preventDefault();

      navigate('/menu', {
        state: {
          returnTo: location.pathname,
        },
      });
    }

    document.addEventListener('click', handleMenuClick);

    return () => {
      document.removeEventListener('click', handleMenuClick);
    };
  }, [location.pathname, navigate]);

  if (checkingSession) {
    return (
      <main
        style={{
          width: '100%',
          maxWidth: 'var(--app-max-width)',
          minHeight: '100dvh',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Loading GuestCare...
      </main>
    );
  }

  if (!session) {
    if (location.pathname !== '/login') {
      return <Navigate to="/login" replace />;
    }

    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<NavMenu />} />
        <Route path="/hostel-setup" element={<HostelSetup />} />
        <Route path="/hostel-setup/new" element={<HostelSetup />} />
        <Route path="/hostel-setup/:hostelId" element={<HostelSetup />} />
        <Route path="/hostel-setup/block/:blockIndex" element={<BlockSetup />} />
        <Route path="/hostel-setup/block/:blockIndex/floor/:floorIndex" element={<FloorSetup />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/check-in/filters" element={<BedFilter />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/tenants/:tenantId" element={<TenantDetails />} />
        <Route path="/occupancy-summary" element={<OccupancySummary />} />
        <Route path="/occupancy-summary/block/:blockId" element={<BlockOccupancy />} />
        <Route path="/occupancy-summary/block/:blockId/floor/:floorId" element={<FloorOccupancy />} />
        <Route path="/occupancy-summary/block/:blockId/floor/:floorId/room/:roomId" element={<RoomOccupancy />} />
        <Route path="/assign-bed/:bedId" element={<AssignBed />} />
        <Route path="/tenants/filters" element={<TenantFilter />} />
        <Route path="/tenants/:tenantId/edit" element={<EditTenant />} />
        <Route path="/tenants/:tenantId/change-bed" element={<ChangeBed />} />
        <Route path="/tenants/:tenantId/change-bed/filters" element={<BedFilter />} />
        <Route path="/tariff" element={<Tariff />} />
        <Route path="/tariff/block/:blockId" element={<BlockTariff />} />
        <Route path="/hostels" element={<YourHostels />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Snackbar message={snackbarMessage} />
    </>
  );
}

function App() {
  return (
    <HostelSetupProvider>
      <AppContent />
    </HostelSetupProvider>
  );
}

export default App;
