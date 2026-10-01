export const FONT_PAIRS = [
  {
    id: 'playfair-source',
    name: 'Playfair Display + Source Sans 3',
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Source+Sans+3:wght@400;500;600&display=swap',
    category: 'Zarif & Editoryal'
  },
  {
    id: 'montserrat-merriweather',
    name: 'Montserrat + Merriweather',
    heading: "'Montserrat', sans-serif",
    body: "'Merriweather', serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Montserrat:wght@600;700;800&display=swap',
    category: 'Dengeli & Güvenilir'
  },
  {
    id: 'poppins-inter',
    name: 'Poppins + Inter',
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap',
    category: 'Modern & Geometrik'
  },
  {
    id: 'lora-roboto',
    name: 'Lora + Roboto',
    heading: "'Lora', serif",
    body: "'Roboto', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,400&family=Roboto:wght@400;500&display=swap',
    category: 'Klasik & Okunaklı'
  },
  {
    id: 'dm-serif-dm-sans',
    name: 'DM Serif Display + DM Sans',
    heading: "'DM Serif Display', serif",
    body: "'DM Sans', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap',
    category: 'Şık & Çağdaş'
  },
  {
    id: 'space-grotesk-inter',
    name: 'Space Grotesk + Inter',
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap',
    category: 'Teknoloji & Girişim'
  },
  {
    id: 'oswald-open-sans',
    name: 'Oswald + Open Sans',
    heading: "'Oswald', sans-serif",
    body: "'Open Sans', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald:wght@600;700&display=swap',
    category: 'Çarpıcı & Dinamik'
  },
  {
    id: 'cormorant-nunito',
    name: 'Cormorant Garamond + Nunito Sans',
    heading: "'Cormorant Garamond', serif",
    body: "'Nunito Sans', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Nunito+Sans:wght@400;600&display=swap',
    category: 'Lüks & Butik'
  }
];

export function getFontSnippet(fontPair) {
  return `<!-- HTML Head -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontPair.googleUrl}" rel="stylesheet">

/* CSS */
h1, h2, h3, h4, h5, h6 {
  font-family: ${fontPair.heading};
}

body, p, input, button {
  font-family: ${fontPair.body};
}`;
}
