import { Outlet, useLocation } from 'react-router-dom'
import SideBar, { SideBarItem } from './components/sidebar-nav.tsx'

import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { LuLayoutDashboard, LuPieChart, LuUser } from 'react-icons/lu'
import { MdAttachMoney } from 'react-icons/md'

export default function App() {
  const currentPath = useLocation().pathname

  const pageTitles: { [key: string]: string } = {
    '/': 'Overview',
    '/dividend': 'Dividend',
    '/buyandsell': 'Buy and Sell',
    '/portfolio': 'Portfolio Composition',
  }

  const pageTitle = pageTitles[currentPath] || 'Overview'

  const shouldShowWallet = currentPath !== '/'

  return (
    <main className="flex h-screen overflow-hidden">
      <SideBar>
        <SideBarItem
          icon={<LuLayoutDashboard size={20} />}
          text="Overview"
          active={currentPath === '/'}
          linkRoute="/"
        />
        <SideBarItem
          icon={<MdAttachMoney size={20} />}
          text="Dividend"
          linkRoute="dividend"
          active={currentPath.startsWith('/dividend')}
        />
        <SideBarItem
          icon={<FaMoneyBillTransfer size={20} />}
          text="Buy and Sell"
          linkRoute="buyandsell"
          active={currentPath.startsWith('/buyandsell')}
        />
        <SideBarItem
          icon={<LuPieChart size={20} />}
          text="Portfolio Composition"
          linkRoute="portfolio"
          active={currentPath.startsWith('/portfolio')}
        />
      </SideBar>
      <div className="w-full flex flex-col overflow-hidden">
        <header className="flex justify-between items-center px-8 py-4">
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            {shouldShowWallet && <span className="text-lg">R$ 420,00</span>}
            <LuUser size={24} />
          </div>
        </header>
        <div className="flex-1 overflow-auto px-8 py-4">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
