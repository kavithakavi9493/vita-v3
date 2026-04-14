import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import BottomNav from './components/BottomNav'
import SplashScreen       from './screens/SplashScreen'
import OnboardingScreen   from './screens/OnboardingScreen'
import SignupScreen        from './screens/SignupScreen'
import OTPScreen           from './screens/OTPScreen'
import AgeGroupScreen      from './screens/AgeGroupScreen'
import QuizScreen          from './screens/QuizScreen'
import AnalyzingScreen     from './screens/AnalyzingScreen'
import FinalLoadingScreen  from './screens/FinalLoadingScreen'
import ResultScreen        from './screens/ResultScreen'
import RootCauseScreen     from './screens/RootCauseScreen'
import PlanScreen          from './screens/PlanScreen'
import SocialProofScreen   from './screens/SocialProofScreen'
import CheckoutScreen      from './screens/CheckoutScreen'
import { SuccessScreen, FailureScreen } from './screens/PaymentScreens'
import DashboardScreen     from './screens/DashboardScreen'
import MyKitScreen         from './screens/MyKitScreen'
import VideosScreen        from './screens/VideosScreen'
import ProfileScreen       from './screens/ProfileScreen'

const DASH_PATHS = ['/dashboard','/my-kit','/videos','/profile']

function ProtectedRoute({ children }) {
  const { state } = useApp()
  if (!state.isLoggedIn) return <Navigate to="/onboarding" replace/>
  return children
}
function QuizRoute({ children }) {
  const { state } = useApp()
  if (!state.isLoggedIn)      return <Navigate to="/onboarding" replace/>
  if (state.hasCompletedQuiz) return <Navigate to="/dashboard"  replace/>
  return children
}

function Shell({ children }) {
  const { pathname } = useLocation()
  const showNav = DASH_PATHS.some(p => pathname.startsWith(p))
  return (
    <div style={{ position:'relative', height:'100%', overflow:'hidden' }}>
      <div style={{ height: showNav ? 'calc(100% - 64px)' : '100%', overflowY:'auto', overflowX:'hidden' }}>
        {children}
      </div>
      {showNav && <BottomNav/>}
    </div>
  )
}

function AppRoutes() {
  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#D6CCB8' }}>
      <div style={{ width:'100%', maxWidth:430, height:'100%', maxHeight:932, position:'relative', overflow:'hidden', background:'#F0EAE0', boxShadow:'0 0 60px rgba(0,0,0,.25)' }}>
        <Shell>
          <Routes>
            <Route path="/"           element={<SplashScreen/>}/>
            <Route path="/onboarding" element={<OnboardingScreen/>}/>
            <Route path="/signup"     element={<SignupScreen/>}/>
            <Route path="/otp"        element={<OTPScreen/>}/>
            <Route path="/age-group"     element={<QuizRoute><AgeGroupScreen/></QuizRoute>}/>
            <Route path="/quiz/:catId"   element={<QuizRoute><QuizScreen/></QuizRoute>}/>
            <Route path="/analyzing"     element={<QuizRoute><AnalyzingScreen/></QuizRoute>}/>
            <Route path="/final-loading" element={<QuizRoute><FinalLoadingScreen/></QuizRoute>}/>
            <Route path="/result"       element={<ProtectedRoute><ResultScreen/></ProtectedRoute>}/>
            <Route path="/root-cause"   element={<ProtectedRoute><RootCauseScreen/></ProtectedRoute>}/>
            <Route path="/plan"         element={<ProtectedRoute><PlanScreen/></ProtectedRoute>}/>
            <Route path="/social-proof" element={<ProtectedRoute><SocialProofScreen/></ProtectedRoute>}/>
            <Route path="/checkout"     element={<ProtectedRoute><CheckoutScreen/></ProtectedRoute>}/>
            <Route path="/success"      element={<ProtectedRoute><SuccessScreen/></ProtectedRoute>}/>
            <Route path="/failure"      element={<ProtectedRoute><FailureScreen/></ProtectedRoute>}/>
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen/></ProtectedRoute>}/>
            <Route path="/my-kit"    element={<ProtectedRoute><MyKitScreen/></ProtectedRoute>}/>
            <Route path="/videos"    element={<ProtectedRoute><VideosScreen/></ProtectedRoute>}/>
            <Route path="/profile"   element={<ProtectedRoute><ProfileScreen/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Shell>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><BrowserRouter><AppRoutes/></BrowserRouter></AppProvider>
}
