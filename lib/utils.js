export const formatWhatsAppMessage = (items, total) => {
  let message = "Hello! I am interested in buying:\n\n";
  
  items.forEach((item, index) => {
    const lineTotal = (item.price * item.quantity).toLocaleString();
    message += `Product ID: ${item.serial || 'N/A'}\nName: ${item.name || 'Unknown Item'}\nQuantity: ${item.quantity} - ₹${lineTotal}\n\n`;
  });

  const grandTotal = total || items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `Total: ₹${grandTotal.toLocaleString()}`;
  
  return message;
};

export const getWhatsAppUrl = (message, phoneNumber = "919000000000") => {
  // Sanitize number: remove all non-digits
  const cleanNumber = String(phoneNumber).replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const trackProductClick = (serial, name, source = "buy_now_button") => {
  fetch("/api/analytics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productSerial: serial, productName: name, source })
  }).catch(err => console.error("Analytics error:", err));
};

export const sanitizeMongoose = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(sanitizeMongoose);
  
  const sanitized = { ...doc };
  if (sanitized._id) sanitized._id = sanitized._id.toString();
  if (sanitized.createdAt) sanitized.createdAt = new Date(sanitized.createdAt).toISOString();
  if (sanitized.updatedAt) sanitized.updatedAt = new Date(sanitized.updatedAt).toISOString();
  
  return sanitized;
};
