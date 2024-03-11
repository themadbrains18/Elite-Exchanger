/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './admin/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'primary'    : '#5367FF',
      'primary-800': '#005FD2',
      'primary-700': '#0083F8',
      'primary-600': '#0091FF',
      'primary-500': '#25A1FF',
      'primary-400': '#56B2FF',
      'primary-300': '#8AC8FF',
      'primary-200': '#B9DDFF',
      'primary-100': '#E2F2FF',
      'admin-primary':"#3699FF",
      'admin-primary-100':"#90CAF9",
      

      "orange":"#FEE2E2",
      "green":"#D1FAE5",
      "dark-green":"#008000",
      "red-light":"#FECACA",
      "red-dark" :"#FF0000",

      // NavBar colors For Dark Mode
      'd-nav-primary': '#fff',
      'd-nav-secondary': '#6C7080',

      // NavBar colors For Light Mode
      'nav-primary': '#2B3144',
      'nav-secondary': '#6C7080',

      // Banner colors For Dark Mode
      'd-banner-heading': '#fff',
      'd-banner-text': '#fff',

      // Banner colors For Light Mode
      'banner-heading': '#2B3144',
      'banner-text': '#545766',

      // Heading colors For Dark Mode
      'd-h-primary': '#fff',
      'd-h-secondary': '',

      // Heading colors For Light Mode
      'h-primary': '#2B3144',
      'h-secondary': '',

      // Text colors For Dark Mode
      'd-body-primary': '#9295A6',
      'd-body-secondary': '#AEB1BF',

      // Text colors For Light Mode
      'body-primary': '#6C7080',
      'body-secondary': '#AEB1BF',

      // Footer Text colors For Dark Mode
      'd-footer-heading': '#000',
      'd-footer-text': '#9295A6',

      // Footer Text colors For Dark Mode
      'footer-heading': '#000',
      'footer-text': '#CCCED9',

      // Link colors For Dark Mode
      'link-color': '',

      // Link colors For Light Mode
      'd-link-color': '',

      // Background colors for Dark Mode
      'd-bg-primary': '#121318',

      // Background colors for Light Mode
      'bg-primary': '#F4F9FC',
      'bg-secondary': '#F1F2F4',
      'light-v-1':'#E6E9F1',
      'light-v-2':'#f1f2f6',
      

      'beta': '#9295A6',
      'gamma': '#6C7080',
      'delta': '#AEB1BF',
      'omega': '#121318',
      'white': '#fff',
      'black': '#000',
      'black-v-1':"#080808",
      'grey':'#F0F1F5',
      'grey-v-1':'#CCCED9',
      'grey-v-2':'#E9EAF0',
      'grey-v-3':'#EFEFEF',
      'grey-v-4':'#1e1e1e', // admin all components background color
      'grey-v-5':'#252525', // body admin background color 
      'off-white':"#F9F8F9",
      'blue':"#0D0D2B",
      'sell':'#EF4444',
      "buy":"#03A66D",
      "cancel":'#DC2626',
      "table-heading":"#B5B5C3",
      "table-data":"#464E5F"

    },
    fontFamily: {
      inter: ['inter', 'sans-serif'],
      'public-sans': ['Public Sans', 'sans-serif'],
    },
    extend: {
      keyframes: {
        loader:{  
          '0%': { transform: 'rotate(0deg)',
          '100%': {transform: 'rotate(359deg)'}
        }
      }},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'darkLaptop': 'url("../public/assets/darkLaptop.png")',
        'lightLaptop': 'url("../public/assets/lightLaptop.png")',
        'calenderIcon': "url('../public/assets/payment/calender.svg')",
        'lineGradient':'linear-gradient(90deg,rgba(233, 234, 240, 0.15) 0%,rgba(233, 234, 240, 0) 186.74%)'
      },
      boxShadow: {
        'card': '0px 13px 37px 0px rgba(0, 0, 0, 0.21)'
      },
      spacing: {
        '10':'10px',
        '20':'20px',
        '30':'30px',
        '40':'40px',
        '50':'50px',
        '60':'60px',
        '80':'80px',
        "100":'100px',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '5': '5px',
        '8': '8px',
        '10': '10px',
        '16': '16px',
        '20': '20px',
        '25': '25px',
        '32': '32px',
      },
      lineHeight: {
        '17': '17px',
        '18': '18px',
        '20': '20px',
        '22': '22px',
        '23': '23px',
        '24': '24px',
        '28': '28px',
        '40': '40px',
        '47': '47px',
        '56': '56px',
        '60': '60px',
        '72': '72px',
      },
      letterSpacing: {
        tight: '-.02em',
        normal: '0',
        wide: '.02em',
      },

    }    
  },
  plugins: [],
}
