import React, { useState } from 'react';

export default function ProductImage({ category, name, image, className = "" }) {
  const [hasError, setHasError] = useState(false);

  // Exact, verified direct upload URLs and local public assets
  const getImageUrl = () => {
    if (image) {
      // If it's already a full URL or starts with /, return it
      if (image.startsWith('http') || image.startsWith('/')) return image;
      // Otherwise, assume it's in the /images/ folder
      return `/images/${image}`;
    }
    return "/home-image.jpg"; // Default placeholder if no image
  };

  // Premium CSS fallback gradients if loading is blocked
  const getFallbackStyle = () => {
    return {
      gradient: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
      label: category ? category.split(' ')[0] : "VALAM Foods",
      icon: "🌱"
    };
  };

  const imageUrl = getImageUrl();
  const fallback = getFallbackStyle();

  if (hasError) {
    return (
      <div
        className={className}
        style={{
          background: fallback.gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          padding: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          filter: 'blur(15px)'
        }}></div>
        <span style={{ fontSize: '42px', zIndex: 2, marginBottom: '8px' }}>
          {fallback.icon}
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: '800',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          zIndex: 2,
          opacity: 0.95
        }}>
          {fallback.label}
        </span>
        <span style={{
          fontSize: '11px',
          zIndex: 2,
          opacity: 0.7,
          marginTop: '4px'
        }}>
          100% Pure & Organic
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={className}
      style={{
        objectFit: 'cover',
        display: 'block'
      }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
