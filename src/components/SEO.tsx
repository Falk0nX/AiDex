import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
};

export default function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const metaTags = {
      'description': description,
      'og:title': title,
      'og:description': description,
      'og:type': type,
      'og:image': image || 'https://aidex.online/aidex-logo-wide.jpg',
      'og:url': url || 'https://aidex.online/',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || 'https://aidex.online/aidex-logo-wide.jpg',
    };
    
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || 'https://aidex.online/');
    
  }, [title, description, image, url, type]);
  
  return null;
}
