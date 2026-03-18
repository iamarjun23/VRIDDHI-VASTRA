import Link from "next/link"

export default function Sidebar() {

  return (

    <div className="w-60 h-screen bg-gray-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-6">
        Admin
      </h2>

      <div className="space-y-4">

        <Link href="/admin">
          Dashboard
        </Link>

        <Link href="/admin/products">
          Products
        </Link>

        <Link href="/">
          View Website
        </Link>

      </div>

    </div>

  )
}