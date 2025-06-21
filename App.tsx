
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Theme } from './types';
import { DEFAULT_THEME } from './constants';
import { ThemeContext, BottomNavigationBar, ThemeToggle } from './components';
import { 
  SplashScreen, OnboardingCarouselScreen, AuthScreen, SubscriptionSelectionScreen,
  HomeScreen, ExploreScreen, AudioPlayerScreen, SearchScreen, MyLibraryScreen,
  SetReminderScreen, ProblemDiagnosisFormScreen, PrescriptionScreen,
  ProfileScreen, ManageProfileScreen, MySubscriptionPlanScreen, ReferFriendScreen, LinkedDevicesScreen,
  KidsAreaScreen, AIAssistantScreen
} from './screens';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedThemeValue = localStorage.getItem('blissful-theme');
    if (storedThemeValue === Theme.Light) {
      return Theme.Light;
    }
    if (storedThemeValue === Theme.Dark) {
      return Theme.Dark;
    }
    // DEFAULT_THEME is the string 'dark'. Theme.Dark is the enum member (also 'dark').
    // We must return an actual enum member for type safety with useState<Theme>.
    return DEFAULT_THEME === Theme.Dark.valueOf() ? Theme.Dark : Theme.Light;
  });

  useEffect(() => {
    localStorage.setItem('blissful-theme', theme.valueOf()); // Store the string value of the enum
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);


  return (
    <ThemeContext.Provider value={themeValue}>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </ThemeContext.Provider>
  );
};

const MainLayout: React.FC = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found"); // Should not happen if App wraps MainLayout
  }
  const { theme } = context;
  const location = useLocation();

  const noNavPaths = ['/', '/onboarding', '/auth', '/subscription'];
  // Also hide for full-screen player or other immersive views if desired
  const isAudioPlayer = location.pathname.startsWith('/player');
  // Kids area might have its own navigation or none at bottom
  const isKidsArea = location.pathname.startsWith('/kids');


  const showBottomNav = !noNavPaths.includes(location.pathname) && !isAudioPlayer && !isKidsArea;

  return (
    // Updated app-shell className: removed max-w-md, mx-auto, min-h-screen, shadow-2xl. Added w-full, h-full.
    <div className={`app-shell w-full h-full flex flex-col overflow-hidden ${theme === Theme.Dark ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-900'}`}>
      <div className="flex-grow overflow-y-auto overflow-x-hidden relative"> {/* Added relative for potential absolute positioned elements within screens */}
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingCarouselScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/subscription" element={<SubscriptionSelectionScreen />} />
          
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/explore" element={<ExploreScreen />} /> {/* Default explore, shows all */}
          <Route path="/explore/:categoryId" element={<ExploreScreen />} />
          <Route path="/player/:audioId" element={<AudioPlayerScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/library" element={<MyLibraryScreen />} />
          
          <Route path="/reminder/:audioId" element={<SetReminderScreen />} />
          <Route path="/diagnose" element={<ProblemDiagnosisFormScreen />} />
          <Route path="/prescription" element={<PrescriptionScreen />} />
          
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/profile/manage" element={<ManageProfileScreen />} />
          <Route path="/profile/subscription" element={<MySubscriptionPlanScreen />} />
          <Route path="/profile/refer" element={<ReferFriendScreen />} />
          <Route path="/profile/devices" element={<LinkedDevicesScreen />} />
          
          <Route path="/kids" element={<KidsAreaScreen />} />
          <Route path="/assistant" element={<AIAssistantScreen />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNavigationBar />}
      {/* Global Theme Toggle for easy access during development/demo */}
      {/* <div className="fixed bottom-20 right-4 z-50"> <ThemeToggle /> </div> */}
    </div>
  );
};

export default App;
