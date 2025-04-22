export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-indigo-600">YourSaaS</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-4">
        <NavLink href="/properties" label="Properties" />
        <NavLink href="/checklists" label="Checklists" />
        <NavLink href="/groups" label="Groups" />
        <NavLink href="/jobs" label="Jobs" />
        <NavLink href="/upsells" label="Upsells" />
      </nav>
    </aside>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
    >
      {/* Icon placeholder */}
      <div className="w-5 h-5 mr-3 bg-indigo-200 rounded" />
      {label}
    </a>
  );
}
