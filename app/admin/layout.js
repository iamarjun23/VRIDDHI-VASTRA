import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({ children }) {

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 bg-[#F9F8F6] min-h-screen overflow-x-hidden">
        {children}
      </div>

    </div>

  )

}