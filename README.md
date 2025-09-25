# Weather Application 🌤️

A beautiful, responsive weather application built with **Next.js** and **Tailwind CSS**. Get real-time weather data, 7-day forecasts, and hourly updates with a stunning glassmorphism UI design.

## ✨ Features

- **🔍 City Search**: Search for any city worldwide
- **🌡️ Current Weather**: Temperature, weather conditions, and location
- **📊 Weather Stats**: Feels like, humidity, wind speed, and pressure
- **📅 7-Day Forecast**: Daily high/low temperatures with weather icons
- **⏰ Hourly Forecast**: 8-hour detailed forecast
- **📱 Responsive Design**: Works perfectly on mobile and desktop
- **🎨 Modern UI**: Beautiful glassmorphism design with smooth animations
- **🚫 Error Handling**: Graceful error states for invalid cities
- **⚡ Loading States**: Smooth loading indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React,React Icon
- **API**: OpenWeatherMap API
- **Language**: JavaScript

## 🚀 Getting Started



### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shahariarshadhin/weather_application.git
cd weather-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
```

> **Note**: Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. **Update API configuration** (if using environment variables)

If you want to use environment variables instead of the hardcoded API key, update the API_KEY constant in your component:

```javascript
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
weather-application/
├── app/
│   └── components               # Main weather component
│   │        └── Landing.jsx
│   └── page.js 
│   │ 
│   └── layout.js            
│                  
├── public/
│   └── ...                     # Static assets
├── styles/
│   └── globals.css             # Global styles
├── .env.local                  # Environment variables (create this)
├── .gitignore                  # Git ignore file
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # Project documentation
```

## 🔧 Configuration

### Tailwind CSS Setup

Install and configure Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to `styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Required Dependencies

```json
{
  "name": "weather_application",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "lucide-react": "^0.544.0",
    "next": "15.5.4",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-icons": "^5.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}

```
