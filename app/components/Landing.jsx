"use client"
import { Cloud, Search, Settings } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { BiSolidDownArrow } from "react-icons/bi";

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);


    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';


    // Fetching Weather Data

    const fetchWeatherData = async (city) => {
        setLoading(true);
        setError('');

        try {
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`),
                fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`)
            ]);

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();
            console.log(forecastData)

            setWeatherData(currentData);
            setForecastData(forecastData);
            setHasSearched(true);
            setSearchQuery('');
        } catch (err) {
            setError('City not found. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetching Weather Icon URL
    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    // Component for displaying weather icons
    const WeatherIcon = ({ iconCode, size = "w-12 h-12", className = "" }) => {
        return (
            <img
                src={getWeatherIconUrl(iconCode)}
                alt="Weather icon"
                className={`${size} ${className}`}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                }}
            />
        );
    };

    // Fallback icon component
    const FallbackIcon = ({ className = "w-12 h-12 text-white" }) => {
        return <Cloud className={className} style={{ display: 'none' }} />;
    };

    const formatFullDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const formatWeekday = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            weekday: "long",
        });
    };


    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Daily Forecast

    const getDailyForecast = () => {
        if (!forecastData) return [];

        const daily = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            console.log(date)
            if (!daily[date]) {
                daily[date] = {
                    date: item.dt,
                    temps: [item.main.temp],
                    weather: item.weather[0],
                    day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
                };
            } else {
                daily[date].temps.push(item.main.temp);
            }
        });

        return Object.values(daily).slice(0, 7).map(day => ({
            ...day,
            minTemp: Math.round(Math.min(...day.temps)),
            maxTemp: Math.round(Math.max(...day.temps))
        }));
    };

    const getHourlyForecast = () => {
        if (!forecastData) return [];
        return forecastData.list.slice(0, 8);
    };

    if (!hasSearched) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#581C87] to-[#1E1B4B] flex items-center justify-center p-4">
                <div className="text-center max-w-7xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center  space-x-2">
                            <Image width={32} height={32} src="/assets/logo-icon.png" alt="cloud" className="" />
                            <span className="text-white text-lg md:text-[24px] font-semibold">Weather Today</span>
                        </div>
                        <div className="text-blue-100 bg-[#374151] rounded-[8px] w-[120px] flex items-center gap-2 py-[5px] pl-[13px]">
                            <Settings />
                            <p>Units</p>
                            <BiSolidDownArrow />
                        </div>
                    </div>

                    {/* -----------Landing Page-------------- */}

                    <h1 className="text-white text-3xl md:text-[36px] font-light mb-12">
                        How's the sky looking today?
                    </h1>

                    <div className="flex items-center max-w-2xl mx-auto gap-6">
                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a place..."
                                className="w-full bg-[#1F293780] border border-white/20 rounded-[8px] pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        fetchWeatherData(searchQuery.trim());
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (searchQuery.trim()) {
                                    fetchWeatherData(searchQuery.trim());
                                }
                            }}
                            disabled={loading}
                            className="bg-[#2563EB] hover:bg-blue-600 text-white px-6 py-3 rounded-[8px] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 mt-4">{error}</p>
                    )}

                    <div className="mt-12 flex flex-col justify-center">
                        <div className=" text-white/20 mx-auto" >
                            <Image width={96} height={96} src="/assets/Frame.png" alt="cloud" className="" />
                        </div>
                        <p className="text-white/60 mt-4">Search for a city to see weather information</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#581C87] to-[#1E1B4B] flex items-center justify-center">
                <div className="text-white text-xl">Loading weather data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#581C87] to-[#1E1B4B] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">{error}</div>
                    <button
                        onClick={() => setHasSearched(false)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!weatherData) return null;

    const dailyForecast = getDailyForecast();
    const hourlyForecast = getHourlyForecast();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#581C87] to-[#1E1B4B] p-4">
            <div className="max-w-7xl mx-auto">
                {/* ---------------Header------------ */}

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Image width={32} height={32} src="/assets/logo-icon.png" alt="cloud" className="" />
                        <span className="text-white text-xl font-semibold">Weather Now</span>
                    </div>
                    <div className="text-blue-100 bg-[#374151] rounded-[8px] w-[120px] flex items-center gap-2 py-[5px] pl-[13px]">
                        <Settings />
                        <p>Units</p>
                        <BiSolidDownArrow />
                    </div>
                </div>

                {/* ---------------Weather Page------------ */}

                <div className="text-center mb-8">
                    <h1 className="text-white text-2xl md:text-3xl font-light mb-6">
                        How's the sky looking today?
                    </h1>

                    <div className="flex items-center max-w-xl mx-auto gap-6">
                        <div className="relative flex-1 ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a place..."
                                className="w-full bg-[#1F293780] border border-white/20 rounded-[8px] pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        fetchWeatherData(searchQuery.trim());
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (searchQuery.trim()) {
                                    fetchWeatherData(searchQuery.trim());
                                }
                            }}
                            disabled={loading}
                            className="bg-[#2563EB] hover:bg-blue-600 text-white px-6 py-3 rounded-[8px] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/*---------- Main Weather Card--------- */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-[#2563EB] to-purple-[#9333EA] rounded-2xl p-6 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold">{weatherData.name}, {weatherData.sys.country}</h2>
                                    <p className="text-blue-100">{formatFullDate(weatherData.dt)}</p>
                                </div>

                            </div>

                            <div className="flex justify-between mb-6">
                                <div className="text-right">
                                    <WeatherIcon iconCode={weatherData.weather[0].icon} />
                                    <FallbackIcon />
                                </div>
                                <div>
                                    <p className="text-6xl md:text-7xl font-thin">{Math.round(weatherData.main.temp)}°</p>
                                </div>
                                {/* <span className="text-xl text-blue-100 ml-2 mb-2">
                                    {weatherData.weather[0].description}
                                </span> */}
                            </div>
                        </div>

                        {/* --------------Weather Stats-------------- */}



                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="text-left bg-[#1F293780] rounded-[12px] py-4 px-4">
                                <div className="text-[#9CA3AF] text-[14px]">Feels like</div>
                                <div className="text-[24px] text-[#FFFFFF]">{Math.round(weatherData.main.feels_like)}°</div>
                            </div>
                            <div className="text-left bg-[#1F293780] rounded-[12px] py-4 px-4">
                                <div className="text-[#9CA3AF] text-[14px]">Humidity</div>
                                <div className="text-[24px] text-[#FFFFFF]">{weatherData.main.humidity}%</div>
                            </div>
                            <div className="text-left bg-[#1F293780] rounded-[12px] py-4 px-4">
                                <div className="text-[#9CA3AF] text-[14px]">Wind</div>
                                <div className="text-[24px] text-[#FFFFFF]">{weatherData.wind.speed} km/h</div>
                            </div>
                            <div className="text-left bg-[#1F293780] rounded-[12px] py-4 px-4">
                                <div className="text-[#9CA3AF] text-[14px]">Pressure</div>
                                <div className="text-[24px] text-[#FFFFFF]">{weatherData.main.pressure} mb</div>
                            </div>
                        </div>

                        {/* --------------Daily Forecast--------------- */}


                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-3 text-white">Daily forecast</h3>
                            <div className="flex justify-center items-center gap-4 overflow-x-auto pb-2">
                                {dailyForecast.map((day, index) => (
                                    <div key={index} className="flex flex-col justify-center items-center bg-[#1F293780] rounded-lg p-3 w-full">
                                        <div className="text-[#9CA3AF] text-[14px]">{day.day}</div>
                                        <div className="flex justify-center w-[48px] h-[48px]">
                                            <WeatherIcon iconCode={day.weather.icon} size="w-12 h-12" />
                                            <FallbackIcon className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="">
                                            <div className="text-white text-sm">{day.maxTemp}°</div>
                                            <div className="text-[#9CA3AF] text-[12px]">{day.minTemp}°</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* -----------Hourly Forecast-------------- */}

                    <div className="space-y-6">

                        <div className="bg-[#1F293780] rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-white text-lg font-bold">Hourly forecast</h3>
                                </div>
                                <div className="text-blue-100 bg-[#374151] rounded-[8px] w-[120px] flex items-center py-[5px] pl-[13px]">
                                    <p>{formatWeekday(weatherData.dt)}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {hourlyForecast.map((hour, index) => (
                                    <div key={index} className="flex items-center justify-between text-white border-b border-[#4B55634D] py-2">
                                        <div className="flex items-center gap-3">

                                            <WeatherIcon iconCode={hour.weather[0].icon} size="w-6 h-6" />
                                            <FallbackIcon className="w-6 h-6 text-white" />
                                            <span className="text-sm text-white/70">{formatTime(hour.dt)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">

                                            <span className="text-sm">{Math.round(hour.main.temp)}°</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;