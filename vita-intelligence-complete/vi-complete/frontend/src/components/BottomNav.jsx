import { useNavigate, useLocation } from 'react-router-dom'
import { C, G } from '../constants/colors'

const TABS = [
  { label:'Home',   icon:'🏠', path:'/dashboard' },
  { label:'My Kit', icon:'📦', path:'/my-kit'    },
  { label:'Videos', icon:'🎥', path:'/videos'    },
  { label:'You',    icon:'👤', path:'/profile'   },
]

export default function BottomNav() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0,
      background:'rgba(255,255,255,.97)', borderTop:`1px solid ${C.border}`,
      backdropFilter:'blur(16px)', display:'flex', zIndex:200 }}>
      {TABS.map(tab => {
        const active = pathname === tab.path || (tab.path !== '/dashboard' && pathname.startsWith(tab.path))
        return (
          <div key={tab.path} onClick={()=>navigate(tab.path)}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 0 12px', cursor:'pointer', position:'relative' }}>
            {active && <div style={{ position:'absolute', top:0, left:'30%', right:'30%', height:2, background:G.gold, borderRadius:'0 0 4px 4px' }} />}
            <div style={{ fontSize: active?24:22, marginBottom:3, transform: active?'scale(1.1)':'scale(1)', transition:'all .2s' }}>{tab.icon}</div>
            <div style={{ color: active?C.gold:C.subtle, fontSize:10, fontWeight: active?700:400 }}>{tab.label}</div>
          </div>
        )
      })}
    </div>
  )
}
