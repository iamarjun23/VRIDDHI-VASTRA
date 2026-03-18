// Native fetch available in Node 20+

async function testRating() {
  const serial = "VV-100"; // Assuming this serial exists, update if needed
  const url = `http://localhost:3000/api/products/${serial}/rate`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5 })
    });
    
    const data = await res.json();
    console.log("Response:", data);
    
    if (res.ok) {
      console.log("SUCCESS: Rating submitted successfully");
    } else {
      console.log("FAILED:", data.message);
    }
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

testRating();
