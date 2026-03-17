import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

  :root {
    --primary: #0A0A0A;
    --secondary: #1a1a1a;
    --accent: #0A0A0A;
    --accent-hover: #333333;
    --bg: #FAFAFA;
    --bg-white: #FFFFFF;
    --text: #0A0A0A;
    --text-muted: #6B7280;
    --border: #E5E7EB;
    --border-light: #F3F4F6;
    --success: #059669;
    --danger: #DC2626;
    --warning: #D97706;
    --font-heading: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;
    --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.1);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --max-w: 1280px;
    --side-pad: clamp(1.25rem, 4vw, 3rem);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--text);
    font-weight: 700;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.15s ease;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    cursor: pointer;
    font-family: var(--font-body);
  }

  select, input, textarea {
    font-family: var(--font-body);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
`;
