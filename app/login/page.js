"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = async () => {

    const res = await signIn("credentials",{
      username,
      password,
      redirect:false
    })

    if(res?.ok){
      router.push("/admin")
    } else {
      alert("Invalid login")
    }

  }

  return (

    <div className="flex items-center justify-center h-screen">

      <div className="border p-8 rounded w-80">

        <h1 className="text-2xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-3"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>

  )
}