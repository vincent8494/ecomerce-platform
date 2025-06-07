interface FallbackImageOptions {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  tilePattern?: boolean;
}

// Utility function to generate a fallback image as an SVG data URL with tile pattern and hover effects
export const getFallbackImage = ({
  width = 200,
  height = 200,
  text = 'No Image',
  bgColor = '#f8f9fa',
  textColor = '#6c757d',
  tilePattern = true
}: FallbackImageOptions = {}) => {
  const encodedText = encodeURIComponent(text);
  const encodedBgColor = encodeURIComponent(bgColor);
  const encodedTextColor = encodeURIComponent(textColor);
  
  // Create a subtle diagonal pattern for the tile
  const pattern = tilePattern ? 
    `%3Cpattern id='diagonalHatch' width='10' height='10' patternTransform='rotate(45 0 0)' patternUnits='userSpaceOnUse'%3E
      <line x1='0' y1='0' x2='0' y2='10' style='stroke:%23e9ecef; stroke-width:1' /%3E
    </pattern>` : '';
  
  // Create a gradient for hover effect
  const gradient = `%3Cdefs%3E
    <linearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E
      <stop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.8' /%3E
      <stop offset='100%25' style='stop-color:${encodedBgColor};stop-opacity:1' />
    </linearGradient>
  </defs>`;
  
  return `data:image/svg+xml;charset=UTF-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E
    %3Crect width='100%25' height='100%25' fill='%23f8f9fa' /%3E
    ${pattern}
    ${gradient}
    <rect width='100%25' height='100%25' fill='${tilePattern ? 'url(%23diagonalHatch)' : `%23${encodedBgColor}`}' /%3E
    <rect width='100%25' height='100%25' fill='url(%23grad1)' style='transition: opacity 0.3s ease;' class='hover-overlay' /%3E
    <text x='50%25' y='50%25' font-family='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
          font-size='14' text-anchor='middle' dy='.3em' fill='%23${encodedTextColor}' font-weight='500'%3E${encodedText}%3C/text%3E
    <style%3E
      .hover-overlay { opacity: 0; }
      svg:hover .hover-overlay { opacity: 1; }
      @media (prefers-reduced-motion: reduce) {
        .hover-overlay { transition: none; }
      }
    </style%3E
  </svg>`;
};


