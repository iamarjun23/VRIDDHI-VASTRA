"use client"

import { useState,useEffect } from "react"
import { useParams,useRouter } from "next/navigation"

export default function EditProduct(){

  const { serial } = useParams()
  const router = useRouter()

  const [product,setProduct] = useState({})

  useEffect(()=>{

    fetch("/api/products")
      .then(res=>res.json())
      .then(data=>{
        const found = data.find(p => p.serial === serial)
        setProduct(found)
      })

  },[])

  const updateProduct = async () => {

    await fetch("/api/products",{

      method:"PUT",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(product)

    })

    router.push("/admin/products")

  }

  return(

    <div className="max-w-xl">

      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <input
        value={product.name || ""}
        className="border p-2 w-full mb-3"
        onChange={e=>setProduct({...product,name:e.target.value})}
      />

      <textarea
        value={product.description || ""}
        className="border p-2 w-full mb-3"
        onChange={e=>setProduct({...product,description:e.target.value})}
      />

      <input
        value={product.price || ""}
        className="border p-2 w-full mb-6"
        onChange={e=>setProduct({...product,price:e.target.value})}
      />

      <button
        onClick={updateProduct}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Update Product
      </button>

    </div>

  )

}