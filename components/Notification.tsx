export function Notification({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4
                    border-yellow-400 dark:border-yellow-600 rounded">
      <span className="mr-2">⚠️</span>
      {children}
    </div>
  )
}
