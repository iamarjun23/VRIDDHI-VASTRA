"use client"

import { useEffect, useState } from "react"

export default function ProductList(){

  const [products,setProducts] = useState([])

  useEffect(()=>{

    fetch("/api/products")
      .then(res=>res.json())
      .then(data=>setProducts(data))

  },[])

  return(

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>

      <table className="w-full border">

        <thead>
          <tr className="border-b">
            <th>Serial</th>
            <th>Name</th>
            <th>Price</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>

          {products.map(product => (

            <tr key={product.serial} className="border-b">

              <td>{product.serial}</td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>

              <td>
                <button className="text-blue-600">
                  Edit
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}