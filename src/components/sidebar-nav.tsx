import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react'
import { FaCircleInfo, FaChartColumn } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

type SideBarContextType = {
  expanded: boolean
}

const SideBarContext = createContext<SideBarContextType | undefined>(undefined)

export default function SideBar({ children }: { children: ReactElement[] }) {
  const [expanded, setExpanded] = useState(true)

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
      })
    }

    window.addEventListener('resize', handleResize)

    if (screenSize.width < 768 && expanded) {
      setExpanded(false)
    }

    if (screenSize.width > 768 && !expanded) {
      setExpanded(true)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [screenSize.width, expanded])

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-6 flex items-center gap-2">
          <FaChartColumn size={32} className="text-emerald-500" />
          <h2
            className={`text-2xl overflow-hidden ${expanded ? 'w-auto' : 'w-0'} transition-all`}
          >
            Stock Control
          </h2>
        </div>

        <SideBarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SideBarContext.Provider>

        <div className="border-t flex">
          <SideBarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              <SideBarContent
                icon={<FaCircleInfo size={20} />}
                text="Last price update: 10/30/2024 - 01:34"
              />
            </ul>
          </SideBarContext.Provider>
        </div>
      </nav>
    </aside>
  )
}

type SideBarContentProps = {
  icon: ReactElement
  text: string
  active?: boolean
}

type SideBarItemProps = SideBarContentProps & {
  linkRoute: string
}

type SideBarContext = {
  expanded: boolean | undefined
}

function SideBarContent({ icon, text, active = false }: SideBarContentProps) {
  const context = useContext(SideBarContext)

  if (!context) {
    throw new Error('SideBarItem must be used within a SideBarProvider')
  }

  const { expanded } = context

  return (
    <li
      className={`
        relative flex items-center py-4 px-3 my-2 font-medium 
        rounded-md cursor-pointer transition-colors group
        ${
          active
            ? 'bg-gradient-to-tr from-emerald-200 to-emerald-100 text-emerald-800'
            : 'hover:bg-emerald-50 text-gray-600'
        }
      `}
    >
      {icon}
      <span
        className={`
          overflow-hidden transition-all 
          ${expanded ? 'w-52 ml-3' : 'hidden'}`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
          absolute flex text-nowrap left-full rounded-md px-2 py-1 ml-6
          bg-emerald-100 text-emerald-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  )
}

export function SideBarItem({
  icon,
  text,
  active = false,
  linkRoute,
}: SideBarItemProps) {
  return (
    <Link to={linkRoute}>
      <SideBarContent icon={icon} text={text} active={active} />
    </Link>
  )
}
