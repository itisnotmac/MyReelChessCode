import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/themeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Tutorial from './pages/Tutorial';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GameHistory from './pages/GameHistory';
const Dashboard = lazy(() => import('./pages/Dashboard'));
import OnlineGame from './pages/OnlineGame';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PremiumSuccess from './pages/PremiumSuccess';
import Info from './pages/Info';
import FAQ from './pages/FAQ';
import Chat from './pages/Chat';
import Online2v2Game from './pages/Online2v2Game';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import OnboardingProfile from './components/OnboardingProfile';
import { getLocalProfile, setLocalProfile } from './lib/profileUtils';
import LandingPage from './pages/LandingPage';
import Store from './pages/Store';
import DailyChallenges from './pages/DailyChallenges';
import Tournament from './pages/Tournament';
import { SkinProvider } from '@/lib/skinContext';


const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // Require login to enter the app. Public marketing pages (landing, about, faq,
  // tutorial, contact, info, privacy) are rendered in AppRoutes before this
  // component, so everything that reaches here is the app proper and needs a
  // session. Anonymous visitors are redirected to the login page.
  const AUTH_FREE_PATHS = ['/login', '/register', '/premium-success', '/forgot-password', '/reset-password'];
  if (!isAuthenticated && !AUTH_FREE_PATHS.includes(location.pathname)) {
    navigateToLogin();
    return null;
  }

  // Gate: require profile creation on first app open.
  // Authenticated users who already saved a username to their account are
  // considered onboarded — onboarding never repeats across logins, cleared
  // storage, or new devices.
  const localProfile = getLocalProfile();
  const accountOnboarded = isAuthenticated && !!user?.username;
  if (!localProfile?.username && !accountOnboarded) {
    return <OnboardingProfile onComplete={() => window.location.reload()} isAuthenticated={isAuthenticated} />;
  }
  // Hydrate the local profile cache from the account when missing so
  // username/avatar display correctly app-wide without re-onboarding.
  if (!localProfile?.username && accountOnboarded) {
    setLocalProfile({ username: user.username, avatar_url: user.avatar_url || 'preset:♔' });
  }

  // Render the main app
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ minHeight: '100%' }}
      >
        <Routes location={location}>
          <Route path="/" element={
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          } />
          {Object.entries(Pages).map(([path, Page]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              }
            />
          ))}
          <Route path="/Tutorial" element={<LayoutWrapper currentPageName="Tutorial"><Tutorial /></LayoutWrapper>} />
          <Route path="/About" element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
          <Route path="/Contact" element={<LayoutWrapper currentPageName="Contact"><Contact /></LayoutWrapper>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/GameHistory" element={<LayoutWrapper currentPageName="GameHistory"><GameHistory /></LayoutWrapper>} />
          <Route path="/Dashboard" element={<Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" /></div>}><LayoutWrapper currentPageName="Dashboard"><Dashboard /></LayoutWrapper></Suspense>} />
          <Route path="/OnlineGame" element={<LayoutWrapper currentPageName="OnlineGame"><OnlineGame /></LayoutWrapper>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/delete-account" element={<LayoutWrapper currentPageName="Info"><Info /></LayoutWrapper>} />
          <Route path="/delete-data" element={<LayoutWrapper currentPageName="Info"><Info /></LayoutWrapper>} />
          <Route path="/premium-success" element={<LayoutWrapper currentPageName="PremiumSuccess"><PremiumSuccess /></LayoutWrapper>} />
          <Route path="/Online2v2Game" element={<LayoutWrapper currentPageName="Online2v2Game"><Online2v2Game /></LayoutWrapper>} />
          <Route path="/Profile" element={<LayoutWrapper currentPageName="Profile"><Profile /></LayoutWrapper>} />
          <Route path="/Achievements" element={<LayoutWrapper currentPageName="Achievements"><Achievements /></LayoutWrapper>} />
          <Route path="/Store" element={<LayoutWrapper currentPageName="Store"><Store /></LayoutWrapper>} />
          <Route path="/DailyChallenges" element={<LayoutWrapper currentPageName="DailyChallenges"><DailyChallenges /></LayoutWrapper>} />
          <Route path="/Tournament" element={<LayoutWrapper currentPageName="Tournament"><Tournament /></LayoutWrapper>} />
          <Route path="/Chat" element={<LayoutWrapper currentPageName="Chat"><Chat /></LayoutWrapper>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};


// Pages accessible without login — gives search engines crawlable content
const PUBLIC_PAGES = {
  'privacypolicy': PrivacyPolicy,
  'termsofservice': TermsOfService,
  'about': About,
  'tutorial': Tutorial,
  'contact': Contact,
  'faq': FAQ,
  'info': Info,
};

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const normalizedPath = location.pathname.toLowerCase().replace(/-/g, '').replace(/\//g, '');
  const PublicPage = PUBLIC_PAGES[normalizedPath];
  if (PublicPage) {
    return (
      <LayoutWrapper currentPageName={normalizedPath}>
        <PublicPage />
      </LayoutWrapper>
    );
  }
  // Public landing page for unauthenticated visitors at root — gives search engines rich crawlable content
  if (normalizedPath === '' && !isAuthenticated && !isLoadingAuth) {
    return <LandingPage />;
  }
  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ThemeProvider>
          <SkinProvider>
            <AuthProvider>
            <AppRoutes />
            <Toaster />
            </AuthProvider>
          </SkinProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App