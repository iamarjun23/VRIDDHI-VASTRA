const payload = {
  heroImage: '',
  collectionsCategories: ["NEW ARRIVALS", "TRENDING", "BRIDAL COLLECTION", "MYSORE SILK", "BANARASI SILK", "KANCHIPURAM LUXURY", "FESTIVE VIBE", "VALUE FOR MONEY", "CEREMONY VIBE"],
  featuredBlocks: [
    { title: "KANCHIPURAM LUXURY", image: "" },
    { title: "BANARASI SILK", image: "" },
    { title: "MYSORE SILK", image: "" },
    { title: "BRIDAL COLLECTION", image: "" }
  ],
  lookbookBlocks: [
    { title: "BRIDAL COLLECTION", image: "" },
    { title: "CEREMONY VIBE", image: "" },
    { title: "VALUE FOR MONEY", image: "" },
    { title: "FRESH FROM LOOMS", image: "" },
    { title: "FESTIVE VIBE", image: "" }
  ],
  promoBanner: { image: "", heading: "Unwrap and Unlock Timeless Elegance\\nwith upto 50% Off", subtext: "Celebrate timeless beauty with handcrafted silk sarees at a price that feels good and looks stunning" }
};

fetch('http://localhost:3000/api/settings', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
