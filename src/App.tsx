import { Outlet, useLocation } from 'react-router-dom'
import SideBar, { SideBarItem } from './components/sidebar-nav.tsx'

import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { LuLayoutDashboard, LuPieChart, LuUser } from 'react-icons/lu'
import { MdAttachMoney } from 'react-icons/md'

export default function App() {
  const currentPath = useLocation().pathname

  const pageTitles: { [key: string]: string } = {
    '/': 'Portfolio Overview',
    '/champions': 'Buy and Sell',
    '/skins': 'Dividend',
    '/owned': 'Portfolio Composition',
  }

  const pageTitle = pageTitles[currentPath] || 'Overview'

  const shouldShowWallet = currentPath !== '/'

  return (
    <main className="flex">
      <SideBar>
        <SideBarItem
          icon={<LuLayoutDashboard size={20} />}
          text="Overview"
          active={currentPath === '/'}
          linkRoute="/"
        />
        <SideBarItem
          icon={<FaMoneyBillTransfer size={20} />}
          text="Buy and Sell"
          linkRoute="champions"
          active={currentPath.startsWith('/champions')}
        />
        <SideBarItem
          icon={<MdAttachMoney size={20} />}
          text="Dividend"
          linkRoute="skins"
          active={currentPath.startsWith('/skins')}
        />
        <SideBarItem
          icon={<LuPieChart size={20} />}
          text="Portfolio Composition"
          linkRoute="owned"
          active={currentPath.startsWith('/owned')}
        />
      </SideBar>
      <div className="w-full px-8 py-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            {shouldShowWallet && <span className="text-lg">R$ 420,00</span>}
            <LuUser size={24} />
          </div>
        </header>
        <div className="my-4">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
