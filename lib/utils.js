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
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
