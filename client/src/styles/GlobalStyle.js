import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #0F172A; /* Deep Navy */
    --secondary-color: #334155; /* Slate */
    --accent-color: #6366F1; /* Indigo */
    --background-color: #F8FAFC; /* Light Gray/White */
    --text-color: #1E293B; /* Dark Slate */
    --light-text: #64748B;
    --white: #FFFFFF;
    --border-color: #E2E8F0;
    --success: #10B981;
    --danger: #EF4444;
    --warning: #F59E0B;
    --font-heading: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--primary-color);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
  }

  button {
    cursor: pointer;
    font-family: var(--font-body);
  }

  img {
    max-width: 100%;
    display: block;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }
`;
