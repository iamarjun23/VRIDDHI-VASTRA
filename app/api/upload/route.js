import cloudinary from "@/lib/cloudinary"

export async function POST(req) {

  const formData = await req.formData()

  const file = formData.get("file")

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise((resolve, reject) => {

    cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error)
        resolve(result)
      }
    ).end(buffer)

  })

  return Response.json({
    url: result.secure_url
  })
}