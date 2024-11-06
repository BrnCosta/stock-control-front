import type { ReactElement } from 'react'

export default function HomeCard({
  children,
  icon,
  color,
}: { children: ReactElement[]; icon: ReactElement; color: string }) {
  return (
    <div className="flex items-center justify-evenly bg-white p-6 rounded-lg border border-gray-200">
      <div className="gap-4">
        <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
