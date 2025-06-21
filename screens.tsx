
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  AudioContent,
  User,
  SubscriptionPlan,
  Playlist,
  ChatMessage,
  Reminder,
  SubscriptionTier,
  GroundingMetadata,
  GroundingChunk
} from './types';
import {
  MOCK_USER, MOCK_AUDIO_FILES, MOCK_CATEGORIES, MOCK_SUBSCRIPTION_PLANS,
  MOCK_ONBOARDING_SCREENS, MOCK_AI_ASSISTANT_WELCOME, APP_NAME,
  PlayIcon, PauseIcon, HeartIconOutline, HeartIconSolid, PlusIcon, BellIcon, TvIcon, SpeakerWaveIcon, SpeakerXMarkIcon,
  MagnifyingGlassIcon, UserCircleIcon, ChevronRightIcon, ArrowLeftIcon, ShareIcon, SparklesIcon, CheckCircleIcon, // Added CheckCircleIcon
  COUNTRY_CODES, ALERT_OPTIONS, DAYS_OF_WEEK, PROBLEM_DIAGNOSIS_QUESTIONS, MOCK_PLAYLISTS, MOCK_REMINDERS, KIDS_AREA_CATEGORIES, MOCK_KIDS_AUDIO
} from './constants';
import {
  Button, Input, Checkbox, OtpInput, Card, Modal, PageIndicator, ScreenHeader, ListItem, CountryCodeSelector, DayChip, Logo, LoadingSpinner, Tag, Alert
} from './components';
import * as GeminiService from './geminiService'; // Mocked service

// Screen: Splash
export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500); // Splash screen duration
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 animate-fade-in">
      <Logo size="lg" className="text-white animate-subtle-pulse mb-4" />
      <p className="text-white text-lg font-light">Your daily dose of calm.</p>
    </div>
  );
};

// Screen: Onboarding Carousel
export const OnboardingCarouselScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < MOCK_ONBOARDING_SCREENS.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      navigate('/auth?flow=register'); // Go to registration
    }
  };

  const currentScreen = MOCK_ONBOARDING_SCREENS[activeIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="relative flex-grow">
        <img src={currentScreen.image} alt={currentScreen.headline} className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
          <h2 className="text-3xl font-bold mb-2 animate-slide-in-left">{currentScreen.headline}</h2>
          <p className="text-lg mb-8 animate-slide-in-left animation-delay-200">{currentScreen.description}</p>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-slate-800">
        <PageIndicator count={MOCK_ONBOARDING_SCREENS.length} activeIndex={activeIndex} onDotClick={setActiveIndex}/>
        <Button onClick={handleNext} variant="primary" size="lg" className="w-full mb-3">
          {activeIndex === MOCK_ONBOARDING_SCREENS.length - 1 ? 'Get Started' : 'Next'}
        </Button>
        {activeIndex === MOCK_ONBOARDING_SCREENS.length - 1 && (
          <Button onClick={() => navigate('/auth?flow=login')} variant="link" size="md" className="w-full">
            Already have an account? Log In
          </Button>
        )}
      </div>
    </div>
  );
};


// Screen: Auth (Handles Registration, OTP, Login)
export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = React.useState(new URLSearchParams(window.location.hash.split('?')[1]));
  const initialFlow = searchParams.get('flow') || 'login';
  
  const [flow, setFlow] = useState<'login' | 'register' | 'otp'>(initialFlow as any);
  const [formData, setFormData] = useState({
    fullName: '', email: '', mobile: '', countryCode: '+1', address: '', password: '', confirmPassword: '', termsAccepted: false,
  });
  const [otp, setOtp] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: number; // Changed NodeJS.Timeout to number
    if (resendTimer > 0) {
      interval = window.setInterval(() => { // use window.setInterval for clarity in browser env
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checkboxTarget = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checkboxTarget.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCountryCodeChange = (value: string) => {
    setFormData(prev => ({ ...prev, countryCode: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    console.log("Registration data:", formData);
    // Simulate API call
    setFlow('otp');
    setResendTimer(59);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6 && otp === "123456") { // Mock OTP
      console.log("OTP verified:", otp);
      setError('');
      navigate('/subscription');
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow any non-empty email and password
    if (loginEmail.trim() !== '' && loginPassword.trim() !== '') {
      console.log("Login successful with email:", loginEmail);
      setError('');
      // You might want to update the MOCK_USER's email if you use it elsewhere post-login
      // For instance: MOCK_USER.email = loginEmail; MOCK_USER.fullName = loginEmail.split('@')[0];
      navigate('/home');
    } else {
      setError("Email and password cannot be empty.");
    }
  };

  const handleResendCode = () => {
    if (resendTimer === 0) {
      console.log("Resending OTP...");
      setResendTimer(59);
      // Simulate API call to resend OTP
    }
  };


  const renderRegisterForm = () => (
    <>
      <h2 className="text-2xl font-bold mb-1 text-center">Create Your Account</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6">Join {APP_NAME} to start your journey.</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
        <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        <div className="flex space-x-2">
            <div className="w-1/3">
                 <label htmlFor="countryCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code</label>
                <CountryCodeSelector value={formData.countryCode} onChange={handleCountryCodeChange} options={COUNTRY_CODES} />
            </div>
            <div className="w-2/3">
                <Input label="Mobile Number" name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} />
            </div>
        </div>
        <Input label="Address (Optional)" name="address" value={formData.address} onChange={handleInputChange} />
        <Input label="Create Password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
        <Checkbox name="termsAccepted" label={<>I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>.</>} checked={formData.termsAccepted} onChange={handleInputChange} />
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        <Button type="submit" variant="primary" size="lg" className="w-full">Register</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account? <Button variant="link" onClick={() => setFlow('login')}>Log In</Button>
      </p>
    </>
  );

  const renderOtpForm = () => (
    <>
      <h2 className="text-2xl font-bold mb-1 text-center">Verify Your Number</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6">Enter the 6-digit code sent to {formData.mobile ? `${formData.countryCode} ${formData.mobile}` : formData.email}.</p>
      <form onSubmit={handleOtpVerify} className="space-y-6">
        <OtpInput length={6} onChange={setOtp} />
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        <Button type="submit" variant="primary" size="lg" className="w-full">Verify</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Didn't receive the code?{' '}
        <Button variant="link" onClick={handleResendCode} disabled={resendTimer > 0}>
            Resend Code {resendTimer > 0 ? `(${resendTimer}s)` : ''}
        </Button>
      </p>
       <Button variant="link" onClick={() => setFlow('register')} className="mt-4 mx-auto block">Back to Registration</Button>
    </>
  );

  const renderLoginForm = () => (
    <>
      <h2 className="text-2xl font-bold mb-1 text-center">Welcome Back!</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6">Log in to continue your journey with {APP_NAME}.</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input label="Email Address" name="loginEmail" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
        <Input label="Password" name="loginPassword" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        <Button type="submit" variant="primary" size="lg" className="w-full">Log In</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        Don't have an account? <Button variant="link" onClick={() => setFlow('register')}>Sign Up</Button>
      </p>
    </>
  );
  
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
            <Logo className="mx-auto"/>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 shadow-xl rounded-lg sm:mx-auto sm:w-full sm:max-w-md">
            {flow === 'register' && renderRegisterForm()}
            {flow === 'otp' && renderOtpForm()}
            {flow === 'login' && renderLoginForm()}
        </div>
    </div>
  );
};


// Screen: Subscription Selection
export const SubscriptionSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(SubscriptionTier.Monthly);
  const [autoRenew, setAutoRenew] = useState(true);

  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSelectedPlan(tier);
  };

  const handleContinue = () => {
    console.log("Selected Plan:", selectedPlan, "Auto Renew:", autoRenew);
    // Navigate to a mock payment screen or home
    navigate('/home'); 
  };

  return (
    <div className="p-4 sm:p-6 min-h-full flex flex-col">
      <ScreenHeader title="Choose Your Plan" />
      <div className="flex-grow space-y-6 py-6">
        {MOCK_SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.tier} 
            className={`p-5 border-2 transition-all ${selectedPlan === plan.tier ? 'border-indigo-500 ring-2 ring-indigo-500 dark:border-indigo-400 dark:ring-indigo-400' : 'border-transparent dark:border-slate-700'}`}
            onClick={() => handleSelectPlan(plan.tier)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{plan.tier}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{plan.price}</p>
                {plan.isPopular && <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">Most Popular</span>}
                {plan.isBestValue && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Best Value</span>}
              </div>
            </div>
          </Card>
        ))}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <label htmlFor="autoRenew" className="text-slate-700 dark:text-slate-200 font-medium">Enable Auto-Renew</label>
          <input 
            type="checkbox" 
            id="autoRenew"
            checked={autoRenew} 
            onChange={(e) => setAutoRenew(e.target.checked)} 
            className="h-5 w-5 text-indigo-600 border-slate-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:bg-slate-600 dark:checked:bg-indigo-500"
          />
        </div>
      </div>
      <div className="mt-auto space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button onClick={handleContinue} variant="primary" size="lg" className="w-full">Continue to Payment</Button>
        <Button onClick={() => navigate('/home')} variant="link" className="w-full">Skip for now</Button>
      </div>
    </div>
  );
};


const AudioCard: React.FC<{ audio: AudioContent, onPlay: (audioId: string) => void }> = ({ audio, onPlay }) => (
    <Card className="w-40 sm:w-48 flex-shrink-0 snap-start" onClick={() => onPlay(audio.id)}>
      <img src={audio.coverArtUrl} alt={audio.title} className="w-full h-40 sm:h-48 object-cover" />
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate text-slate-800 dark:text-slate-100">{audio.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{audio.artist}</p>
      </div>
    </Card>
  );

const CategoryChip: React.FC<{ category: string, isActive: boolean, onClick: () => void }> = ({ category, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 snap-start
        ${isActive 
          ? 'bg-indigo-600 text-white dark:bg-indigo-500' 
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`}
    >
      {category}
    </button>
  );

// Screen: Home / Dashboard
export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<User>(MOCK_USER);
  const [dailyAudios, setDailyAudios] = useState<AudioContent[]>([]);
  const [popularAudios, setPopularAudios] = useState<AudioContent[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<AudioContent[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AudioContent[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(MOCK_CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setIsLoading(true);
      // Daily audios (e.g., first 2, marked as "Today's Dailies")
      setDailyAudios(MOCK_AUDIO_FILES.slice(0, 2).map(a => ({...a, title: `Daily: ${a.title}`})));
      // Popular (e.g., next 3, sorted by some metric)
      setPopularAudios(MOCK_AUDIO_FILES.slice(2, 5));
      // Recently Added (e.g., latest 3)
      setRecentlyAdded(MOCK_AUDIO_FILES.slice(MOCK_AUDIO_FILES.length - 3).reverse());
      
      try {
        const recs = await GeminiService.getAIRecommendations(user.id);
        setAiRecommendations(recs);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user.id]);

  const handlePlayAudio = (audioId: string) => {
    navigate(`/player/${audioId}`);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    // Here you would typically filter content or navigate to an explore page for that category
    navigate(`/explore/${category.toLowerCase().replace(' ', '-')}`);
  };
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your blissful space..." />;
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto pb-20">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{greeting()}, {user.fullName.split(' ')[0]}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Ready for some peace and quiet?</p>
      </header>

      {/* Today's Dailies */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Today's Dailies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dailyAudios.map(audio => (
            <Card key={audio.id} onClick={() => handlePlayAudio(audio.id)} className="flex items-center p-3">
              <img src={audio.coverArtUrl} alt={audio.title} className="w-16 h-16 rounded-lg object-cover mr-4"/>
              <div className="flex-grow">
                <h3 className="font-medium text-slate-800 dark:text-slate-100 truncate">{audio.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{audio.artist}</p>
              </div>
              <PlayIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </Card>
          ))}
        </div>
      </section>

      {/* Explore by Category */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Explore by Category</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {MOCK_CATEGORIES.map(category => (
            <CategoryChip 
              key={category} 
              category={category} 
              isActive={activeCategory === category} 
              onClick={() => handleCategorySelect(category)} 
            />
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"/>
            Just for You
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {aiRecommendations.map(audio => <AudioCard key={audio.id} audio={audio} onPlay={handlePlayAudio} />)}
          </div>
        </section>
      )}

      {/* Popular in the App */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Popular in the App</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {popularAudios.map(audio => <AudioCard key={audio.id} audio={audio} onPlay={handlePlayAudio} />)}
        </div>
      </section>

      {/* Recently Added */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Recently Added</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {recentlyAdded.map(audio => <AudioCard key={audio.id} audio={audio} onPlay={handlePlayAudio} />)}
        </div>
      </section>
      
      {/* Advertisement Section */}
      <section>
         <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Sponsored</h2>
        <Card className="overflow-hidden">
          <img src="https://picsum.photos/seed/ad1/600/200" alt="Advertisement" className="w-full h-32 object-cover"/>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Discover New Horizons</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Explore amazing products that enhance your well-being.</p>
            <Button variant="primary" size="sm" onClick={() => alert('Navigating to sponsor page!')}>Learn More</Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

const AudioListItem: React.FC<{ audio: AudioContent, onPlay: (id: string) => void, onToggleFavorite: (id: string) => void }> = ({ audio, onPlay, onToggleFavorite }) => {
  return (
    <div className="flex items-center p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
      <img src={audio.coverArtUrl} alt={audio.title} className="w-12 h-12 rounded-md object-cover mr-4"/>
      <div className="flex-grow cursor-pointer" onClick={() => onPlay(audio.id)}>
        <h3 className="font-medium text-slate-800 dark:text-slate-100 truncate">{audio.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{audio.artist} &middot; {audio.duration}</p>
      </div>
      <div className="flex items-center space-x-3 ml-auto">
        <Button variant="ghost" size="sm" onClick={() => onToggleFavorite(audio.id)} className="!p-1.5">
          {audio.isFavorite ? <HeartIconSolid className="w-5 h-5" /> : <HeartIconOutline className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onPlay(audio.id)} className="!p-1.5">
          <PlayIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
        </Button>
      </div>
    </div>
  );
};

// Screen: Explore / Category Details
export const ExploreScreen: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [audios, setAudios] = useState<AudioContent[]>(MOCK_AUDIO_FILES); // Initial full list
  const [displayedAudios, setDisplayedAudios] = useState<AudioContent[]>([]);
  const categoryName = categoryId ? MOCK_CATEGORIES.find(c => c.toLowerCase().replace(' ', '-') === categoryId) || "Explore" : "Explore";

  useEffect(() => {
    if (categoryId && categoryId !== 'all') {
      const categoryMatch = MOCK_CATEGORIES.find(c => c.toLowerCase().replace(' ', '-') === categoryId);
      if (categoryMatch) {
          setDisplayedAudios(audios.filter(audio => audio.category === categoryMatch));
      } else {
          setDisplayedAudios(audios); // show all if category not found or is 'all'
      }
    } else {
      setDisplayedAudios(audios);
    }
  }, [categoryId, audios]);

  const handlePlayAudio = (audioId: string) => {
    navigate(`/player/${audioId}`);
  };

  const toggleFavorite = (audioId: string) => {
    setAudios(prevAudios => 
      prevAudios.map(audio => 
        audio.id === audioId ? { ...audio, isFavorite: !audio.isFavorite } : audio
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title={categoryName} showBackButton={true} />
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {displayedAudios.length > 0 ? (
          displayedAudios.map(audio => (
            <AudioListItem 
              key={audio.id} 
              audio={audio} 
              onPlay={handlePlayAudio} 
              onToggleFavorite={toggleFavorite} 
            />
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">No audio found in this category.</p>
        )}
      </div>
    </div>
  );
};


// Screen: Audio Player
export const AudioPlayerScreen: React.FC = () => {
  const { audioId } = useParams<{ audioId: string }>();
  const navigate = useNavigate();
  const audio = MOCK_AUDIO_FILES.find(a => a.id === audioId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isFavorite, setIsFavorite] = useState(audio?.isFavorite || false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [userPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  
  // Mock audio player logic
  useEffect(() => {
    let interval: number; // Changed NodeJS.Timeout to number
    if (isPlaying && audio) {
      const durationParts = audio.duration.split(':').map(Number);
      const totalSeconds = durationParts[0] * 60 + durationParts[1];
      interval = window.setInterval(() => { // use window.setInterval
        setProgress(prev => {
          const newProgress = prev + (100 / totalSeconds);
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audio]);

  if (!audio) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <ScreenHeader title="Error" showBackButton onBackClick={() => navigate('/home')} />
        <p className="text-xl text-slate-600 dark:text-slate-300">Audio not found.</p>
        <Button onClick={() => navigate('/home')} className="mt-4">Go to Home</Button>
      </div>
    );
  }

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
    // In a real player, you'd also seek the audio element
  };
  const toggleFavorite = () => setIsFavorite(!isFavorite); // Update actual data source in real app
  const handleSetReminder = () => navigate(`/reminder/${audio.id}`);
  const handleCast = () => alert("Casting to device... (mocked)");
  const toggleMute = () => setIsMuted(!isMuted);

  const handleAddToPlaylist = () => {
    if(selectedPlaylist) {
        alert(`Added "${audio.title}" to playlist "${userPlaylists.find(p=>p.id === selectedPlaylist)?.name}" (mocked)`);
        setShowAddToPlaylistModal(false);
        setSelectedPlaylist('');
    } else {
        alert("Please select a playlist.");
    }
  };

  const formatTime = (percentage: number) => {
    const durationParts = audio.duration.split(':').map(Number);
    const totalSeconds = durationParts[0] * 60 + durationParts[1];
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900">
      <ScreenHeader title="Now Playing" showBackButton onBackClick={() => navigate('/home')} />
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <Card className="w-full max-w-sm overflow-hidden shadow-2xl">
          <img src={audio.coverArtUrl} alt={audio.title} className="w-full h-64 sm:h-80 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{audio.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{audio.artist}</p>

            {/* Scrubber / Timeline */}
            <div className="mb-6">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={handleSeek}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{audio.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <Button variant="ghost" className="!p-2" onClick={() => setProgress(p => Math.max(0, p - 10))} aria-label="Rewind 10 seconds">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 19.5L0.75 12l7.5-7.5" /></svg>
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePlayPause} 
                className="!p-4 !rounded-full w-16 h-16 flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </Button>
              <Button variant="ghost" className="!p-2" onClick={() => setProgress(p => Math.min(100, p + 10))} aria-label="Forward 10 seconds">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.5l7.5 7.5-7.5 7.5" /></svg>
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex justify-around items-center text-slate-600 dark:text-slate-400">
              <Button variant="ghost" onClick={() => setShowAddToPlaylistModal(true)} className="flex flex-col items-center !p-1">
                <PlusIcon className="w-6 h-6" /> <span className="text-xs">Playlist</span>
              </Button>
              <Button variant="ghost" onClick={toggleFavorite} className="flex flex-col items-center !p-1">
                {isFavorite ? <HeartIconSolid className="w-6 h-6" /> : <HeartIconOutline className="w-6 h-6" />}
                <span className="text-xs">Favorite</span>
              </Button>
              <Button variant="ghost" onClick={handleSetReminder} className="flex flex-col items-center !p-1">
                <BellIcon className="w-6 h-6" /> <span className="text-xs">Reminder</span>
              </Button>
              <Button variant="ghost" onClick={handleCast} className="flex flex-col items-center !p-1">
                <TvIcon className="w-6 h-6" /> <span className="text-xs">Cast</span>
              </Button>
              <Button variant="ghost" onClick={toggleMute} className="flex flex-col items-center !p-1">
                {isMuted ? <SpeakerXMarkIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
                <span className="text-xs">Mute</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Modal isOpen={showAddToPlaylistModal} onClose={() => setShowAddToPlaylistModal(false)} title="Add to Playlist">
          <div className="space-y-4">
              <p>Select a playlist to add "{audio.title}":</p>
              {userPlaylists.length > 0 ? (
                <select 
                    value={selectedPlaylist} 
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="" disabled>Choose playlist...</option>
                    {userPlaylists.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
                </select>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">You have no playlists. <Link to="/library?tab=playlists" className="text-indigo-600 dark:text-indigo-400 hover:underline">Create one?</Link></p>
              )}
              <div className="flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setShowAddToPlaylistModal(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleAddToPlaylist} disabled={!selectedPlaylist}>Add</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};


// Screen: Search
export const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<AudioContent[]>([]);
  const [recentSearches] = useState<string[]>(['Meditation', 'Sleep Sounds', 'Focus Music']); // Mock
  const [trendingTopics] = useState<string[]>(['Mindfulness', 'Stress Relief', 'Nature Sounds']); // Mock

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    // Mock search logic
    const results = MOCK_AUDIO_FILES.filter(audio => 
      audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const navigate = useNavigate();
  const handlePlayAudio = (audioId: string) => navigate(`/player/${audioId}`);
  const toggleFavorite = (audioId: string) => {
    // This is a local toggle for demo; in a real app, update global state/backend
    setSearchResults(prev => prev.map(a => a.id === audioId ? {...a, isFavorite: !a.isFavorite} : a));
  };


  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Search" />
      <div className="p-4">
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
          <Input 
            type="search"
            placeholder="Search by title, topic, or need..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
            Icon={MagnifyingGlassIcon}
            autoFocus
          />
          <Button type="submit" variant="primary">Search</Button>
        </form>

        {searchResults.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Results for "{searchTerm}"</h3>
            <div className="space-y-2">
              {searchResults.map(audio => (
                <AudioListItem key={audio.id} audio={audio} onPlay={handlePlayAudio} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          </section>
        )}

        {searchResults.length === 0 && searchTerm.length > 0 && (
             <p className="text-center text-slate-500 dark:text-slate-400 py-6">No results found for "{searchTerm}".</p>
        )}

        {searchResults.length === 0 && searchTerm.length === 0 && (
          <>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <Tag key={term} onClick={() => { setSearchTerm(term); handleSearch(); }}>{term}</Tag>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map(topic => (
                  <Tag key={topic} color="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200" onClick={() => { setSearchTerm(topic); handleSearch(); }}>{topic}</Tag>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

// Screen: My Library
export const MyLibraryScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = React.useState(new URLSearchParams(window.location.hash.split('?')[1]));
    const initialTab = searchParams.get('tab') || 'playlists';
    const [activeTab, setActiveTab] = useState<'playlists' | 'favourites' | 'downloads'>(initialTab as any);
    
    const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
    // Use MOCK_AUDIO_FILES to derive favorites and downloads for this mock
    const [favorites, setFavorites] = useState<AudioContent[]>(MOCK_AUDIO_FILES.filter(a => a.isFavorite));
    const [downloads] = useState<AudioContent[]>(MOCK_AUDIO_FILES.slice(0,2)); // Mocked downloads

    const handlePlayAudio = (audioId: string) => navigate(`/player/${audioId}`);
    const toggleFavoriteAudio = (audioId: string) => {
        // Update local favorites list; in real app, update global state/backend
        const audioIndex = MOCK_AUDIO_FILES.findIndex(a => a.id === audioId);
        if (audioIndex !== -1) {
             MOCK_AUDIO_FILES[audioIndex].isFavorite = !MOCK_AUDIO_FILES[audioIndex].isFavorite;
            setFavorites(MOCK_AUDIO_FILES.filter(a => a.isFavorite));
        }
    };

    const handleCreatePlaylist = () => {
        const newPlaylistName = prompt("Enter new playlist name:");
        if (newPlaylistName) {
            const newPlaylist: Playlist = {
                id: `pl${Date.now()}`,
                name: newPlaylistName,
                audioIds: [],
                coverArtUrl: 'https://picsum.photos/seed/newplaylist/200/200'
            };
            setPlaylists(prev => [...prev, newPlaylist]);
            alert(`Playlist "${newPlaylistName}" created! (Mock)`);
        }
    };

    const renderPlaylists = () => (
        <div className="space-y-4">
            <Button variant="primary" onClick={handleCreatePlaylist} leftIcon={<PlusIcon />} className="w-full sm:w-auto">
                Create New Playlist
            </Button>
            {playlists.length > 0 ? playlists.map(pl => (
                <Card key={pl.id} className="p-4 flex items-center space-x-4" onClick={() => alert(`Opening playlist: ${pl.name} (mock)`)}>
                    <img src={pl.coverArtUrl || 'https://picsum.photos/seed/playlistdefault/80/80'} alt={pl.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{pl.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{pl.audioIds.length} tracks</p>
                    </div>
                    <ChevronRightIcon className="ml-auto w-5 h-5 text-slate-400 dark:text-slate-500"/>
                </Card>
            )) : <p className="text-center text-slate-500 dark:text-slate-400 py-6">No playlists created yet.</p>}
        </div>
    );

    const renderFavorites = () => (
        <div className="space-y-2">
            {favorites.length > 0 ? favorites.map(audio => (
                <AudioListItem key={audio.id} audio={audio} onPlay={handlePlayAudio} onToggleFavorite={toggleFavoriteAudio} />
            )) : <p className="text-center text-slate-500 dark:text-slate-400 py-6">No favorite audios yet. Tap the ♡ on any audio!</p>}
        </div>
    );

    const renderDownloads = () => (
         <div className="space-y-2">
            {downloads.length > 0 ? downloads.map(audio => (
                <AudioListItem key={audio.id} audio={{...audio, isFavorite: favorites.some(f => f.id === audio.id)}} onPlay={handlePlayAudio} onToggleFavorite={toggleFavoriteAudio} />
            )) : <p className="text-center text-slate-500 dark:text-slate-400 py-6">No downloads available. Download audios for offline listening.</p>}
        </div>
    );

    const tabs = [
        { name: 'Playlists', id: 'playlists' as const, content: renderPlaylists() },
        { name: 'Favourites', id: 'favourites' as const, content: renderFavorites() },
        { name: 'Downloads', id: 'downloads' as const, content: renderDownloads() },
    ];

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="My Library" />
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-1 px-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                                }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};


// Screen: Set Reminder
export const SetReminderScreen: React.FC = () => {
    const { audioId } = useParams<{ audioId: string }>();
    const audio = MOCK_AUDIO_FILES.find(a => a.id === audioId);
    const navigate = useNavigate();

    const [time, setTime] = useState('09:00');
    const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); // Auto-populate
    const [alertBefore, setAlertBefore] = useState(ALERT_OPTIONS[1]); // 10 min before
    const [repetitionType, setRepetitionType] = useState<'daily_for_x_days' | 'every_day_indefinite' | 'selected_days'>('every_day_indefinite');
    const [dailyDays, setDailyDays] = useState(7);
    const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([]); // e.g., ['M', 'W', 'F']
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    if (!audio) {
        return <div className="p-4">Audio not found. <Button onClick={() => navigate(-1)}>Go Back</Button></div>;
    }

    const handleSetReminder = (e: React.FormEvent) => {
        e.preventDefault();
        const newReminder: Partial<Reminder> = {
            audioId: audio.id, time, timeZone, alertBefore, repetitionType,
        };
        if (repetitionType === 'daily_for_x_days') newReminder.repetitionValue = dailyDays;
        if (repetitionType === 'selected_days') newReminder.repetitionValue = selectedWeekDays;
        
        console.log("Setting reminder:", newReminder);
        // Add to MOCK_REMINDERS or send to backend
        setShowSuccessModal(true);
    };
    
    const toggleWeekDay = (dayShort: string) => {
        setSelectedWeekDays(prev => 
            prev.includes(dayShort) ? prev.filter(d => d !== dayShort) : [...prev, dayShort]
        );
    };

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Set Reminder" showBackButton />
            <form onSubmit={handleSetReminder} className="flex-grow overflow-y-auto p-4 space-y-6">
                <Card className="p-4 flex items-center space-x-3">
                    <img src={audio.coverArtUrl} alt={audio.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{audio.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{audio.artist}</p>
                    </div>
                </Card>

                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time to play</label>
                    <Input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required />
                </div>
                
                <div>
                    <label htmlFor="timeZone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time Zone</label>
                    <select id="timeZone" value={timeZone} onChange={e => setTimeZone(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500">
                        {/* Simplified list, a real app would have more comprehensive timezone list */}
                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>{Intl.DateTimeFormat().resolvedOptions().timeZone} (Current)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="alertBefore" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alerts before</label>
                    <select id="alertBefore" value={alertBefore} onChange={e => setAlertBefore(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500">
                        {ALERT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Repetition</legend>
                    {(['every_day_indefinite', 'daily_for_x_days', 'selected_days'] as const).map(type => (
                        <div key={type} className="flex items-center">
                            <input
                                id={`repetition-${type}`}
                                name="repetitionType"
                                type="radio"
                                checked={repetitionType === type}
                                onChange={() => setRepetitionType(type)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-indigo-500"
                            />
                            <label htmlFor={`repetition-${type}`} className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                {type === 'every_day_indefinite' && "Every day at same time till I stop it"}
                                {type === 'daily_for_x_days' && "Daily for"}
                                {type === 'selected_days' && "On selected days of the week"}
                            </label>
                            {type === 'daily_for_x_days' && repetitionType === type && (
                                <Input type="number" value={dailyDays} onChange={e => setDailyDays(parseInt(e.target.value))} min="1" className="w-16 ml-2 !py-1" />
                            )}
                        </div>
                    ))}
                    {repetitionType === 'selected_days' && (
                        <div className="flex space-x-1 sm:space-x-2 pt-2 justify-center">
                            {DAYS_OF_WEEK.map(day => (
                                <DayChip key={day.short} day={day.short} isSelected={selectedWeekDays.includes(day.short)} onToggle={() => toggleWeekDay(day.short)} />
                            ))}
                        </div>
                    )}
                </fieldset>
                
                <Button type="submit" variant="primary" size="lg" className="w-full mt-auto">Set Reminder</Button>
            </form>
            <Modal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); navigate(-1); }} title="Reminder Set!">
                <div className="text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg text-slate-700 dark:text-slate-200">Your reminder for "{audio.title}" has been set successfully.</p>
                    <Button onClick={() => { setShowSuccessModal(false); navigate(-1); }} className="mt-6">Done</Button>
                </div>
            </Modal>
        </div>
    );
};


// Screen: Problem Diagnosis Form
export const ProblemDiagnosisFormScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    const currentQuestion = PROBLEM_DIAGNOSIS_QUESTIONS[currentQuestionIndex];

    const handleAnswer = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < PROBLEM_DIAGNOSIS_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Last question, submit for prescription
            handleSubmitDiagnosis();
        }
    };

    const handleSubmitDiagnosis = async () => {
        setIsLoading(true);
        console.log("Submitting diagnosis:", answers);
        try {
            const prescription = await GeminiService.getPrescriptionBasedOnDiagnosis(answers);
            navigate('/prescription', { state: { prescription, diagnosisAnswers: answers } });
        } catch (error) {
            console.error("Error getting prescription:", error);
            alert("Sorry, we couldn't find a prescription for you at this time. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <LoadingSpinner message="Finding your personalized session..." />;

    if (!currentQuestion) return <div>Error: Question not found.</div>;

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Personalized Session Finder" showBackButton={currentQuestionIndex > 0} actions={currentQuestionIndex > 0 ? <Button variant="link" size="sm" onClick={()=>setCurrentQuestionIndex(prev => prev -1)}>Back</Button> : null}/>
            <div className="flex-grow p-6 flex flex-col justify-center text-center">
                <h2 className="text-2xl font-semibold mb-8 text-slate-800 dark:text-slate-100">{currentQuestion.text}</h2>
                <div className="space-y-4 max-w-md mx-auto w-full">
                    {currentQuestion.type === 'tags' && currentQuestion.options?.map(opt => (
                        <Tag 
                            key={opt}
                            onClick={() => { handleAnswer(currentQuestion.id, opt); handleNextQuestion(); }}
                            selected={answers[currentQuestion.id] === opt}
                            className="inline-block m-1 p-3 text-base cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800"
                        >
                            {opt}
                        </Tag>
                    ))}
                    {currentQuestion.type === 'slider' && (
                        <>
                            <input 
                                type="range" 
                                min={currentQuestion.min} 
                                max={currentQuestion.max} 
                                value={answers[currentQuestion.id] || currentQuestion.defaultValue}
                                onChange={e => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                            />
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{answers[currentQuestion.id] || currentQuestion.defaultValue}</p>
                        </>
                    )}
                    {currentQuestion.type === 'choice' && currentQuestion.options?.map(opt => (
                        <Button 
                            key={opt} 
                            variant={answers[currentQuestion.id] === opt ? "primary" : "secondary"}
                            onClick={() => { handleAnswer(currentQuestion.id, opt); handleNextQuestion(); }}
                            className="w-full text-left justify-start p-4"
                            size="lg"
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            </div>
            {currentQuestion.type !== 'tags' && currentQuestion.type !== 'choice' && (
                 <div className="p-6 mt-auto">
                    <Button onClick={handleNextQuestion} variant="primary" size="lg" className="w-full">
                        {currentQuestionIndex === PROBLEM_DIAGNOSIS_QUESTIONS.length - 1 ? 'Find My Prescription' : 'Next'}
                    </Button>
                </div>
            )}
        </div>
    );
};

// Screen: Prescription / Recommended Audio
export const PrescriptionScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = window.location; // Using window.location for state due to HashRouter limitation with react-router's state.
    // A real app with BrowserRouter would use useLocation() from react-router-dom more effectively.
    // For this mockup, we'll assume state is passed some other way or use a default if not found.
    const mockState = (location as any).state || { prescription: MOCK_AUDIO_FILES[0], diagnosisAnswers: {} };
    const { prescription, diagnosisAnswers } = mockState as { prescription: AudioContent, diagnosisAnswers: Record<string,any> };


    if (!prescription) {
        return <div className="p-4">No prescription found. <Button onClick={() => navigate('/diagnose')}>Try Diagnosis Again</Button></div>;
    }
    
    // Generate a simple explanation (mocked)
    const whyRecommended = () => {
        let reason = "This session is chosen to help you relax and unwind.";
        if (diagnosisAnswers?.q1?.toLowerCase().includes('sleep')) reason = "Based on your need for better sleep, this session is designed to help you drift off peacefully.";
        if (diagnosisAnswers?.q1?.toLowerCase().includes('focus')) reason = "To help with focus, this audio provides an optimal soundscape for concentration.";
        return reason;
    };

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Your Personalized Session" showBackButton />
            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                <SparklesIcon className="w-16 h-16 text-indigo-500 dark:text-indigo-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Here's a session for you:</h2>
                <Card className="max-w-xs w-full my-6">
                    <img src={prescription.coverArtUrl} alt={prescription.title} className="w-full h-56 object-cover" />
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{prescription.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{prescription.artist}</p>
                    </div>
                </Card>
                <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">{whyRecommended()}</p>
                <div className="space-y-3 w-full max-w-xs">
                    <Button variant="primary" size="lg" className="w-full" onClick={() => navigate(`/player/${prescription.id}`)}>
                        Play Now
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full" onClick={() => { alert('Added to library (mocked)'); navigate('/library'); }}>
                        Add to Library
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Screen: Profile
export const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const [user] = useState<User>(MOCK_USER);

    const profileOptions = [
        { label: 'Manage Profile', action: () => navigate('/profile/manage'), icon: <UserCircleIcon className="w-5 h-5"/> },
        { label: 'My Subscription Plan', action: () => navigate('/profile/subscription'), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg> },
        { label: 'Refer a Friend', action: () => navigate('/profile/refer'), icon: <ShareIcon className="w-5 h-5"/> },
        { label: 'Kids Area', action: () => navigate('/kids'), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75S9.75 9.336 9.75 9.75zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" /></svg> },
        { label: 'Linked Devices', action: () => navigate('/profile/devices'), icon: <TvIcon className="w-5 h-5"/> },
        { label: 'Push Notifications', action: () => alert('Manage Push Notifications (mocked)'), icon: <BellIcon className="w-5 h-5"/> },
        { label: 'Help / Support', action: () => alert('Navigate to Help/Support (mocked)'), icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg> },
    ];

    const handleLogout = () => {
        alert('Logging out...');
        navigate('/auth?flow=login'); // Navigate to login
    };

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Profile" />
            <div className="flex-grow overflow-y-auto">
                <div className="p-6 text-center bg-indigo-50 dark:bg-indigo-900/30">
                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=random&size=128`} alt={user.fullName} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-300 dark:border-indigo-600 shadow-lg"/>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{user.fullName}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <nav className="divide-y divide-slate-200 dark:divide-slate-700">
                    {profileOptions.map(opt => (
                        <ListItem 
                            key={opt.label} 
                            title={opt.label} 
                            onClick={opt.action} 
                            icon={opt.icon}
                            trailing={<ChevronRightIcon />} 
                        />
                    ))}
                </nav>
                 <div className="p-4 mt-4">
                    <Button variant="danger" onClick={handleLogout} className="w-full">
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Screen: Manage Profile Details
export const ManageProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(MOCK_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleCountryCodeChange = (value: string) => {
        // Assuming mobile number is stored as full string or you parse it
        // For simplicity, let's just update a part of it or a new field if needed
        const currentMobile = user.mobileNumber?.split(' ')[1] || '';
        setUser(prev => ({...prev, mobileNumber: `${value} ${currentMobile}`}));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Saving profile:", user);
        // Simulate API call
        setTimeout(() => {
            // MOCK_USER = user; // In a real app, update context/global state
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Manage Profile" showBackButton />
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
                <Input label="Full Name" name="fullName" value={user.fullName} onChange={handleChange} />
                <Input label="Email Address" name="email" type="email" value={user.email} onChange={handleChange} />
                <div className="flex space-x-2">
                    <div className="w-1/3">
                        <label htmlFor="countryCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code</label>
                        <CountryCodeSelector 
                            value={user.mobileNumber?.split(' ')[0] || COUNTRY_CODES[0].code} 
                            onChange={handleCountryCodeChange} 
                            options={COUNTRY_CODES} 
                        />
                    </div>
                    <div className="w-2/3">
                        <Input label="Mobile Number" name="mobileNumberValue" type="tel" value={user.mobileNumber?.split(' ')[1] || ''} 
                         onChange={(e) => setUser(prev => ({...prev, mobileNumber: `${prev.mobileNumber?.split(' ')[0] || COUNTRY_CODES[0].code} ${e.target.value}`}))}/>
                    </div>
                </div>
                <Input label="Address" name="address" value={user.address || ''} onChange={handleChange} />
                
                {showSuccess && <Alert type="success" message="Profile updated successfully!" onClose={() => setShowSuccess(false)} />}
                
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                    Save Changes
                </Button>
            </form>
        </div>
    );
};


// Screen: My Subscription Plan
export const MySubscriptionPlanScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentPlan] = useState<SubscriptionPlan | undefined>(MOCK_SUBSCRIPTION_PLANS.find(p => p.isPopular)); // Mock
    const [autoRenew, setAutoRenew] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelSubscription = () => {
        console.log("Cancelling subscription...");
        // API call to cancel
        setShowCancelModal(false);
        alert("Subscription Cancelled (mocked).");
        navigate('/profile'); // Or to a screen showing no active plan
    };

    if (!currentPlan) {
        return (
            <div className="flex flex-col h-full">
                <ScreenHeader title="My Subscription" showBackButton />
                <div className="flex-grow p-6 text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">You do not have an active subscription.</p>
                    <Button onClick={() => navigate('/subscription')} variant="primary">Choose a Plan</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="My Subscription" showBackButton />
            <div className="flex-grow p-4 sm:p-6 space-y-6">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{currentPlan.tier} Plan</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">{currentPlan.description}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Renews on: January 15, 2025 (mock date)</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{currentPlan.price} / {currentPlan.tier.toLowerCase().replace('ly','').replace('dai','day')}</p>
                </Card>
                
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <label htmlFor="autoRenewSub" className="text-slate-700 dark:text-slate-200 font-medium">Auto-Renew</label>
                    <input 
                        type="checkbox" 
                        id="autoRenewSub"
                        checked={autoRenew} 
                        onChange={(e) => setAutoRenew(e.target.checked)} 
                        className="h-5 w-5 text-indigo-600 border-slate-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:bg-slate-600 dark:checked:bg-indigo-500"
                    />
                </div>

                <div className="space-y-3">
                    <Button variant="secondary" onClick={() => navigate('/subscription')} className="w-full">Change Plan</Button>
                    <Button variant="danger" onClick={() => setShowCancelModal(true)} className="w-full">Cancel Subscription</Button>
                </div>
            </div>
            <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Subscription">
                <p className="text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to cancel your {currentPlan.tier} plan? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Keep Plan</Button>
                    <Button variant="danger" onClick={handleCancelSubscription}>Yes, Cancel</Button>
                </div>
            </Modal>
        </div>
    );
};

// Screen: Refer a Friend
export const ReferFriendScreen: React.FC = () => {
    const referralCode = "BLISSFUL25"; // Mock
    const referralLink = `https://blissfulapp.com/join?ref=${referralCode}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on Blissful!',
                text: `Get a month of Blissful Premium free when you sign up with my code: ${referralCode}`,
                url: referralLink,
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`Join me on Blissful! Get a month of Blissful Premium free. Sign up at ${referralLink} or use code ${referralCode}.`);
            alert('Referral link copied to clipboard!');
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Refer a Friend" showBackButton />
            <div className="flex-grow p-6 text-center flex flex-col items-center justify-center">
                <ShareIcon className="w-16 h-16 text-indigo-500 dark:text-indigo-400 mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Share the Bliss!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
                    Invite your friends to Blissful and you both get 1 month of Premium for FREE when they subscribe!
                </p>
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-6 w-full max-w-xs">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your Referral Code:</p>
                    <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">{referralCode}</p>
                </div>
                <Button onClick={handleShare} variant="primary" size="lg" leftIcon={<ShareIcon className="w-5 h-5"/>} className="w-full max-w-xs">
                    Share Your Link
                </Button>
            </div>
        </div>
    );
};

// Screen: Linked Devices
export const LinkedDevicesScreen: React.FC = () => {
    const [devices, setDevices] = useState([
        { id: 'dev1', name: 'Living Room TV', type: 'Smart TV' },
        { id: 'dev2', name: 'Alexa Echo Dot', type: 'Smart Speaker' },
    ]);

    const handleUnlink = (deviceId: string) => {
        if (window.confirm("Are you sure you want to unlink this device?")) {
            setDevices(prev => prev.filter(d => d.id !== deviceId));
            alert('Device unlinked (mocked).');
        }
    };
    
    const handleLinkNewDevice = () => {
        alert('Starting new device linking process... (mocked)');
    };

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="Linked Devices" showBackButton />
            <div className="flex-grow p-4 sm:p-6 space-y-4">
                {devices.length > 0 ? devices.map(device => (
                    <Card key={device.id} className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{device.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{device.type}</p>
                        </div>
                        <Button variant="danger" size="sm" onClick={() => handleUnlink(device.id)}>Unlink</Button>
                    </Card>
                )) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-10">No devices linked yet.</p>
                )}
                <Button variant="primary" onClick={handleLinkNewDevice} leftIcon={<PlusIcon />} className="w-full mt-6">
                    Link a New Device
                </Button>
            </div>
        </div>
    );
};


// Screen: Kids Area
export const KidsAreaScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(KIDS_AREA_CATEGORIES[0]);
    const [isLoading, setIsLoading] = useState(false);
    
    // In a real app, this might require a parental lock to exit
    const handleExitKidsArea = () => {
        if (window.confirm("Are you sure you want to exit Kids Area?")) {
            navigate('/home'); 
        }
    };

    const handlePlayAudio = (audioId: string) => {
      // Kid's player might be different, or same player with kid-safe UI
      navigate(`/player/${audioId}?kidsmode=true`);
    };

    const filteredAudios = MOCK_KIDS_AUDIO.filter(audio => audio.category === activeCategory);

    return (
        // Applying a distinct, more playful UI theme for Kids Area
        <div className="flex flex-col h-full bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
            <ScreenHeader 
                title="Kids Corner" 
                actions={<Button variant="secondary" size="sm" onClick={handleExitKidsArea}>Exit Kids Area</Button>}
            />
             <div className="p-4">
                <div className="flex space-x-3 overflow-x-auto pb-3 mb-4 snap-x snap-mandatory">
                    {KIDS_AREA_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 snap-start
                                ${activeCategory === category 
                                ? 'bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-900 shadow-md' 
                                : 'bg-white text-sky-700 hover:bg-yellow-100 dark:bg-sky-700 dark:text-sky-100 dark:hover:bg-sky-600'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && <LoadingSpinner message="Loading fun content..." />}
            {!isLoading && (
                <div className="flex-grow overflow-y-auto p-4 grid grid-cols-2 gap-4">
                    {filteredAudios.map(audio => (
                        <Card key={audio.id} className="bg-white/80 dark:bg-sky-800/80 shadow-lg" onClick={() => handlePlayAudio(audio.id)}>
                            <img src={audio.coverArtUrl} alt={audio.title} className="w-full h-32 object-cover rounded-t-xl" />
                            <div className="p-3 text-center">
                                <h3 className="font-semibold text-sky-700 dark:text-sky-100 truncate">{audio.title}</h3>
                                <p className="text-xs text-sky-500 dark:text-sky-300">{audio.artist}</p>
                            </div>
                        </Card>
                    ))}
                    {filteredAudios.length === 0 && (
                        <p className="col-span-2 text-center text-sky-600 dark:text-sky-300 py-10">No stories or music here yet. Check back soon!</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Screen: AI Personal Assistant
export const AIAssistantScreen: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([MOCK_AI_ASSISTANT_WELCOME]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [groundingLinks, setGroundingLinks] = useState<GroundingChunk[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputText;
        if (!textToSend.trim()) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: textToSend,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setGroundingLinks([]); // Clear previous links

        try {
            const { aiResponse, groundingMetadata } = await GeminiService.chatWithAIAssistant(messages, textToSend);
            setMessages(prev => [...prev, aiResponse]);
            if (groundingMetadata?.groundingChunks) {
                setGroundingLinks(groundingMetadata.groundingChunks.filter(chunk => chunk.web));
            }
        } catch (error) {
            console.error("Error chatting with AI assistant:", error);
            const errorMessage: ChatMessage = {
                id: `ai-error-${Date.now()}`,
                sender: 'ai',
                text: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const suggestedPrompts = [
        "Find me something for sleep",
        "Set a reminder for my morning meditation",
        "How are you today?",
        "Who won the most medals in Paris Olympics 2024 swimming?"
    ];

    return (
        <div className="flex flex-col h-full">
            <ScreenHeader title="AI Personal Assistant" showBackButton />
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${
                            msg.sender === 'user' 
                                ? 'bg-indigo-500 text-white dark:bg-indigo-600' 
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                        }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-indigo-200 dark:text-indigo-300 text-right' : 'text-slate-500 dark:text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow bg-slate-200 dark:bg-slate-700">
                            <LoadingSpinner size="sm" />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {groundingLinks.length > 0 && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Sources:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {groundingLinks.map((chunk, index) => chunk.web && (
                            <li key={index} className="text-xs">
                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    {chunk.web.title || chunk.web.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {messages.length <= 1 && !isLoading && ( // Show suggested prompts only initially
                 <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Try saying:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map(prompt => (
                            <Tag key={prompt} onClick={() => handleSendMessage(prompt)} color="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 cursor-pointer">
                                {prompt}
                            </Tag>
                        ))}
                    </div>
                </div>
            )}

            <div className="sticky bottom-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                    <Input 
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-grow !py-2.5"
                        disabled={isLoading}
                    />
                    <Button type="submit" variant="primary" className="!p-2.5" disabled={isLoading || !inputText.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </Button>
                </form>
            </div>
        </div>
    );
};
