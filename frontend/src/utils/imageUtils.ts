// Utility function to generate a fallback image as an SVG data URL
export const getFallbackImage = (width = 200, height = 200, text = 'No Image') => {
  const encodedText = encodeURIComponent(text);
  return `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22${width}%22%20height%3D%22${height}%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22${width}%22%20height%3D%22${height}%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20fill%3D%22%23999%22%3E${encodedText}%3C%2Ftext%3E%3C%2Fsvg%3E`;
};

// Helper function to handle image loading errors
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  target.src = getFallbackImage(200, 200, 'No Image');
};
