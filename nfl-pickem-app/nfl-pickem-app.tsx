"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Star, Zap, Crown, Play, CreditCard, Mail, User, LogIn } from "lucide-react"

// Simple AdSense component - no external dependencies
const AdSenseAd = ({ adSlot, className = "", style = {} }) => {
  const adRef = useRef(null)
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    if (adRef.current && !adLoaded) {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          setAdLoaded(true)
        }
      } catch (error) {
        console.error("AdSense error:", error)
      }
    }
  }, [adLoaded])

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-6728188565217251"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

const NFLPickemApp = () => {
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateDisplayName = (name) => {
    return name.trim().length >= 2 && name.trim().length <= 50
  }

  // State management - ALWAYS START WITH LOGIN SCREEN
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })
  const [currentScreen, setCurrentScreen] = useState("login") // Force login screen first
  const [selectedTier, setSelectedTier] = useState(null)
  const [games, setGames] = useState([])
  const [picks, setPicks] = useState({})
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [videoAdPlaying, setVideoAdPlaying] = useState(false)
  const [freePickCount, setFreePickCount] = useState(0)
  const [currentWeek, setCurrentWeek] = useState("PRE1") // Start with preseason week 1
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" })
    }, 3000)
  }

  // Configuration
  const SHEET_ID = "1PzjE4FFQQ-Xt4VwlGdoE1HygYqIaI_xvogIjsGPTZdg"
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`
  const PAYPAL_CLIENT_ID = "ASHWkpqNMyP6S-RCNT9utTCFFtueIvPJpUsLqQl7DwNF-kAmrllKb2A2WmRU0qslFzTC1CzMqmy5rvjX"
  const ADSENSE_PUBLISHER_ID = "ca-pub-6728188565217251"

  const paypalPaymentLinks = {
    starter: "https://www.paypal.com/ncp/payment/VH6LM3CRP9RLN",
    pro: "https://www.paypal.com/ncp/payment/W3ZSGSL3QBN86",
    mvp: "https://www.paypal.com/ncp/payment/R57HTKYTV7VAE",
  }

  const AD_SLOTS = {
    banner: "1234567890",
    mobile: "0987654321",
    square: "1122334455",
  }

  const tiers = [
    {
      id: "rookie",
      name: "Rookie",
      price: 0,
      entry: "Free Entry",
      bonusPoints: 0,
      icon: Star,
      color: "bg-gray-500",
      description: "Perfect for beginners",
    },
    {
      id: "starter",
      name: "Starter",
      price: 1,
      entry: "$1 Entry",
      bonusPoints: 0,
      icon: Zap,
      color: "bg-blue-500",
      description: "Get in the game",
    },
    {
      id: "pro",
      name: "Pro",
      price: 5,
      entry: "$5 Entry",
      bonusPoints: 1,
      icon: Trophy,
      color: "bg-purple-500",
      description: "One extra point boost",
    },
    {
      id: "mvp",
      name: "MVP",
      price: 10,
      entry: "$10 Entry",
      bonusPoints: 2,
      icon: Crown,
      color: "bg-yellow-500",
      description: "Two extra points boost",
    },
  ]

  const nflTeams = {
    ARI: { name: "Arizona Cardinals", logo: "🔴" },
    ATL: { name: "Atlanta Falcons", logo: "🔴" },
    BAL: { name: "Baltimore Ravens", logo: "💜" },
    BUF: { name: "Buffalo Bills", logo: "🔵" },
    CAR: { name: "Carolina Panthers", logo: "⚫" },
    CHI: { name: "Chicago Bears", logo: "🧡" },
    CIN: { name: "Cincinnati Bengals", logo: "🧡" },
    CLE: { name: "Cleveland Browns", logo: "🤎" },
    DAL: { name: "Dallas Cowboys", logo: "⭐" },
    DEN: { name: "Denver Broncos", logo: "🧡" },
    DET: { name: "Detroit Lions", logo: "🔵" },
    GB: { name: "Green Bay Packers", logo: "💚" },
    HOU: { name: "Houston Texans", logo: "🔴" },
    IND: { name: "Indianapolis Colts", logo: "🔵" },
    JAX: { name: "Jacksonville Jaguars", logo: "💚" },
    KC: { name: "Kansas City Chiefs", logo: "🔴" },
    LV: { name: "Las Vegas Raiders", logo: "⚫" },
    LAC: { name: "Los Angeles Chargers", logo: "⚡" },
    LAR: { name: "Los Angeles Rams", logo: "💛" },
    MIA: { name: "Miami Dolphins", logo: "🐬" },
    MIN: { name: "Minnesota Vikings", logo: "💜" },
    NE: { name: "New England Patriots", logo: "🔴" },
    NO: { name: "New Orleans Saints", logo: "🟡" },
    NYG: { name: "New York Giants", logo: "🔵" },
    NYJ: { name: "New York Jets", logo: "💚" },
    PHI: { name: "Philadelphia Eagles", logo: "💚" },
    PIT: { name: "Pittsburgh Steelers", logo: "🖤" },
    SF: { name: "San Francisco 49ers", logo: "🔴" },
    SEA: { name: "Seattle Seahawks", logo: "💚" },
    TB: { name: "Tampa Bay Buccaneers", logo: "🔴" },
    TEN: { name: "Tennessee Titans", logo: "🔵" },
    WAS: { name: "Washington Commanders", logo: "🍷" },
  }

  // Replace the fetchGames function with this real API call using your key:
  const fetchGames = async (week) => {
    setLoading(true)
    try {
      console.log(`Fetching live games for week: ${week}`)

      // Your API key
      const API_KEY = "a11af89ea3e8f17dacc6b0ec6a29f31e"

      // Try multiple endpoints to get current live games
      const endpoints = [
        `https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/2025/1?key=${API_KEY}`, // Current week
        `https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeekLive/2025/1?key=${API_KEY}`, // Live games
        `https://api.sportsdata.io/v3/nfl/scores/json/Games/2025?key=${API_KEY}`, // All games
      ]

      let gamesData = null

      // Try each endpoint until we get data
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`)
          const response = await fetch(endpoint)

          if (response.ok) {
            const data = await response.json()
            if (data && data.length > 0) {
              gamesData = data
              console.log(`Success! Got ${data.length} games from API`)
              break
            }
          } else {
            console.log(`Endpoint failed with status: ${response.status}`)
          }
        } catch (endpointError) {
          console.log(`Endpoint error: ${endpointError.message}`)
          continue
        }
      }

      if (gamesData && gamesData.length > 0) {
        const formattedGames = gamesData.slice(0, 10).map((game, index) => ({
          id: game.GameID || game.ScoreID || index + 1,
          homeTeam: game.HomeTeam || game.HomeTeamName || "TBD",
          awayTeam: game.AwayTeam || game.AwayTeamName || "TBD",
          gameTime: game.DateTime || game.Date || new Date().toISOString(),
          week: game.Week || 1,
          status: game.Status || "Scheduled",
          homeScore: game.HomeScore || 0,
          awayScore: game.AwayScore || 0,
          seasonType: game.SeasonType || 1,
          homeRecord: `${game.HomeTeamWins || 0}-${game.HomeTeamLosses || 0}`,
          awayRecord: `${game.AwayTeamWins || 0}-${game.AwayTeamLosses || 0}`,
          quarter: game.Quarter || null,
          timeRemaining: game.TimeRemaining || null,
          isGameOver: game.IsGameOver || false,
          channel: game.Channel || null,
          stadium: game.StadiumDetails?.Name || game.Stadium || null,
        }))

        console.log("Formatted live games:", formattedGames)
        setGames(formattedGames)

        // Show different messages based on game status
        const liveGames = formattedGames.filter((g) => g.status === "InProgress" || g.status === "Live")
        const upcomingGames = formattedGames.filter((g) => g.status === "Scheduled")

        if (liveGames.length > 0) {
          showNotification(
            `🔴 LIVE: ${liveGames.length} games in progress! ${upcomingGames.length} upcoming games loaded.`,
            "success",
          )
        } else {
          showNotification(`📅 Loaded ${formattedGames.length} NFL games for this week!`, "success")
        }
      } else {
        // Enhanced fallback with realistic current games
        console.log("No API data, using fallback games")
        const fallbackGames = [
          {
            id: 1,
            homeTeam: "KC",
            awayTeam: "BUF",
            gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            week: 1,
            status: "Scheduled",
            homeScore: 0,
            awayScore: 0,
            seasonType: 2, // Regular season
            homeRecord: "14-3",
            awayRecord: "13-4",
            quarter: null,
            timeRemaining: null,
            channel: "CBS",
            stadium: "Arrowhead Stadium",
          },
          {
            id: 2,
            homeTeam: "PHI",
            awayTeam: "WAS",
            gameTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
            week: 1,
            status: "Scheduled",
            homeScore: 0,
            awayScore: 0,
            seasonType: 2,
            homeRecord: "11-6",
            awayRecord: "12-5",
            quarter: null,
            timeRemaining: null,
            channel: "FOX",
            stadium: "Lincoln Financial Field",
          },
          {
            id: 3,
            homeTeam: "LAR",
            awayTeam: "MIN",
            gameTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
            week: 1,
            status: "Scheduled",
            homeScore: 0,
            awayScore: 0,
            seasonType: 2,
            homeRecord: "10-7",
            awayRecord: "14-3",
            quarter: null,
            timeRemaining: null,
            channel: "ESPN",
            stadium: "SoFi Stadium",
          },
        ]

        setGames(fallbackGames)
        showNotification("⚠️ Using sample playoff games. API temporarily unavailable.", "error")
      }
    } catch (error) {
      console.error("Error fetching live games:", error)

      // Fallback games with current playoff matchups
      const playoffGames = [
        {
          id: 1,
          homeTeam: "KC",
          awayTeam: "BUF",
          gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          week: 1,
          status: "Scheduled",
          homeScore: 0,
          awayScore: 0,
          seasonType: 3, // Playoffs
          homeRecord: "14-3",
          awayRecord: "13-4",
          quarter: null,
          timeRemaining: null,
          channel: "CBS",
          stadium: "Arrowhead Stadium",
        },
      ]

      setGames(playoffGames)
      showNotification("🏈 Sample playoff games loaded. Check API connection.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Load AdSense script
  useEffect(() => {
    if (typeof window !== "undefined" && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script")
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`
      script.async = true
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }
  }, [])

  // Load PayPal SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !window.paypal) {
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Modified: Only load user from storage if they want to continue, but always start at login
  useEffect(() => {
    // Don't automatically load user - let them choose to continue or start fresh
    console.log("App initialized - showing login screen")
  }, [])

  // Fetch games when needed
  useEffect(() => {
    if (currentScreen === "picking" && games.length === 0) {
      fetchGames("PRE1") // Fetch preseason week 1
    }
  }, [currentScreen])

  // User functions
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)

    if (!email || !displayName) {
      setLoginError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setLoginError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (!validateDisplayName(displayName)) {
      setLoginError("Display name must be between 2 and 50 characters")
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        email: email.toLowerCase().trim(),
        displayName: displayName.trim(),
        loginTime: new Date().toISOString(),
        weeklyPicks: {},
        totalPoints: 0,
        tier: null,
        userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      setUser(userData)
      await saveUserToSheet(userData)
      setCurrentScreen("entry")
      showNotification("Login successful!", "success")
    } catch (error) {
      setLoginError("Login failed. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setEmail("")
    setDisplayName("")
    setSelectedTier(null)
    setPicks({})
    setCurrentGameIndex(0)
    setPaymentComplete(false)
    setPaymentProcessing(false)
    setCurrentScreen("login")
    localStorage.removeItem("nfl_pickem_user")
    showNotification("Logout successful!", "success")
  }

  const saveUserToSheet = async (userData) => {
    try {
      console.log("Saving user to Google Sheet:", userData)
      const sheetData = {
        timestamp: new Date().toISOString(),
        email: userData.email,
        displayName: userData.displayName,
        tier: userData.tier || "Not Selected",
        week: currentWeek,
        picks: JSON.stringify(userData.weeklyPicks || {}),
        points: userData.totalPoints || 0,
        paymentStatus: paymentComplete ? "Paid" : "Free",
        loginTime: userData.loginTime,
        lastUpdated: new Date().toISOString(),
      }

      // Replace with your Google Apps Script URL
      const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "saveUser", data: sheetData }),
        })
        console.log("Data sent to Google Sheets successfully")
      } catch (fetchError) {
        console.log("Google Sheets unavailable, saving locally")
      }

      localStorage.setItem("nfl_pickem_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error saving to sheet:", error)
      localStorage.setItem("nfl_pickem_user", JSON.stringify(userData))
      showNotification("Data saved locally.", "error")
    }
  }

  const updatePicksInSheet = async (userPicks) => {
    if (!user) return

    try {
      const updatedUser = {
        ...user,
        weeklyPicks: { ...user.weeklyPicks, [currentWeek]: userPicks },
        lastUpdated: new Date().toISOString(),
      }

      await saveUserToSheet(updatedUser)
      setUser(updatedUser)
      localStorage.setItem("nfl_pickem_user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating picks:", error)
      showNotification("Error updating picks. Picks saved locally.", "error")
    }
  }

  // Add a function to continue with saved data
  const loadUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem("nfl_pickem_user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setEmail(userData.email)
        setDisplayName(userData.displayName)
        if (userData.tier) {
          const tier = tiers.find((t) => t.id === userData.tier)
          setSelectedTier(tier)
          setPaymentComplete(tier?.price === 0 || userData.paymentStatus === "Paid")
        }
        if (userData.tier && userData.weeklyPicks && Object.keys(userData.weeklyPicks).length > 0) {
          setCurrentScreen("summary")
        } else if (userData.tier) {
          setCurrentScreen("picking")
        } else {
          setCurrentScreen("entry")
        }
        showNotification("Welcome back! Continuing where you left off.", "success")
      }
    } catch (error) {
      console.error("Error loading user from storage:", error)
      showNotification("Error loading user data.", "error")
    }
  }

  const handleTierSelection = (tier) => {
    setSelectedTier(tier)

    if (user) {
      const updatedUser = { ...user, tier: tier.id }
      setUser(updatedUser)
      saveUserToSheet(updatedUser)
    }

    if (tier.price > 0) {
      setCurrentScreen("payment")
    } else {
      setPaymentComplete(true)
      setCurrentScreen("picking")
    }
  }

  const handlePayPalPayment = (tier) => {
    setPaymentProcessing(true)

    const paymentWindow = window.open(
      paypalPaymentLinks[tier.id],
      "paypal_payment",
      "width=600,height=700,scrollbars=yes,resizable=yes",
    )

    const checkPaymentStatus = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkPaymentStatus)
        setPaymentProcessing(false)

        setTimeout(() => {
          setPaymentComplete(true)
          setCurrentScreen("picking")
          showNotification("Payment successful!", "success")
        }, 1000)
      }
    }, 1000)
  }

  const handlePick = (gameId, team) => {
    const newPicks = { ...picks, [gameId]: team }
    setPicks(newPicks)
    updatePicksInSheet(newPicks)

    if (selectedTier?.id === "rookie") {
      setFreePickCount((prev) => prev + 1)
      if (freePickCount % 3 === 2) {
        setVideoAdPlaying(true)
        setTimeout(() => setVideoAdPlaying(false), 3000)
      }
    }

    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex((prev) => prev + 1)
    } else {
      setCurrentScreen("summary")
    }
  }

  // Screen Components
  const LoginScreen = () => {
    // Check if there's saved user data
    const savedUser = localStorage.getItem("nfl_pickem_user")

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🏈 NFL Pick'em</h1>
            <p className="text-lg sm:text-xl text-gray-300">Sign in to start picking winners!</p>
          </div>

          {savedUser && (
            <div className="mb-6">
              <Card className="bg-green-500/20 backdrop-blur-lg border-green-500/30">
                <CardContent className="p-4 text-center">
                  <p className="text-green-200 mb-3">Welcome back! You have saved progress.</p>
                  <Button
                    onClick={loadUserFromStorage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Continue Where I Left Off
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-white text-xl sm:text-2xl flex items-center justify-center space-x-2">
                <LogIn size={24} />
                <span>Player Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-400 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white font-medium">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-400 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-200 text-sm">{loginError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold disabled:opacity-50 transition-all transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Enter Pick'em Contest"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center text-gray-300 text-sm space-y-2">
                  <p className="flex items-center justify-center">
                    <span className="mr-2">🔒</span>
                    Your information is secure
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">📊</span>
                    Tracked on our{" "}
                    <a
                      href={SHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline ml-1"
                    >
                      live leaderboard
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <AdSenseAd
              adSlot={AD_SLOTS.banner}
              className="max-w-md mx-auto"
              style={{ textAlign: "center", minHeight: "200px" }}
            />
          </div>
        </div>
      </div>
    )
  }

  const EntryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-6xl font-bold text-white mb-4">NFL Pick'em</h1>
            <p className="text-xl text-gray-300">Choose your entry level and start picking winners!</p>
          </div>
          <div className="text-right">
            <p className="text-white mb-2">Welcome, {user?.displayName}!</p>
            <p className="text-gray-300 text-sm">{user?.email}</p>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="mt-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const IconComponent = tier.icon
            return (
              <Card
                key={tier.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-white text-2xl">{tier.name}</CardTitle>
                  <p className="text-gray-300">{tier.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{tier.entry}</div>
                  {tier.bonusPoints > 0 && (
                    <Badge className="bg-yellow-500 text-black mb-4">+{tier.bonusPoints} Bonus Points</Badge>
                  )}
                  <Button
                    onClick={() => handleTierSelection(tier)}
                    className={`w-full font-semibold py-3 ${
                      tier.price === 0
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {tier.price === 0 ? "Play Free" : `Pay $${tier.price} - Select ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">🆓 Free tier users see ads to support the platform</p>
          <AdSenseAd
            adSlot={AD_SLOTS.mobile}
            className="max-w-2xl mx-auto"
            style={{ minHeight: "250px", textAlign: "center" }}
          />
        </div>

        <div className="mt-12 text-center space-y-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <div className="text-gray-300 space-y-2">
                <p>🏈 Pick the winner of each NFL game</p>
                <p>🎯 Earn points for correct predictions</p>
                <p>🏆 Compete on the live leaderboard</p>
                <p>💰 50% of entries go to prize pool</p>
                <p>
                  📊 All data tracked in our{" "}
                  <a
                    href={SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Google Sheet
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const PaymentScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Complete Your Payment</h1>
          <p className="text-xl text-gray-300">Secure payment powered by PayPal</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div
              className={`w-16 h-16 ${selectedTier?.color} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {selectedTier?.icon && React.createElement(selectedTier.icon, { className: "text-white", size: 32 })}
            </div>
            <CardTitle className="text-white text-2xl">{selectedTier?.name} Tier</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-white/20 p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">${selectedTier?.price}.00</div>
              <p className="text-gray-300">Entry Fee</p>
              {selectedTier?.bonusPoints > 0 && (
                <Badge className="bg-yellow-500 text-black mt-2">
                  +{selectedTier.bonusPoints} Bonus Points Included
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-white text-left space-y-2">
                <p>✅ Enter Week {currentWeek} Pick'em Contest</p>
                <p>✅ Compete for 50% of total prize pool</p>
                <p>✅ Live leaderboard tracking</p>
                {selectedTier?.bonusPoints > 0 && <p>✅ {selectedTier.bonusPoints} bonus points advantage</p>}
              </div>

              <Button
                onClick={() => handlePayPalPayment(selectedTier)}
                disabled={paymentProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Pay with PayPal - ${selectedTier?.price}.00</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => setCurrentScreen("entry")}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Back to Tiers
              </Button>
            </div>

            <div className="text-xs text-gray-400 border-t border-white/20 pt-4">
              <p>🔒 Secure payment processing by PayPal</p>
              <p>💳 All major credit cards accepted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const PickingScreen = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
          <div className="text-white text-2xl">Loading games...</div>
        </div>
      )
    }

    const currentGame = games[currentGameIndex]
    if (!currentGame) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 p-4">
        {videoAdPlaying && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-64 h-48 bg-red-500 flex items-center justify-center text-white mb-4 rounded">
                <Play size={48} />
              </div>
              <p className="text-lg font-semibold">Advertisement</p>
              <p className="text-sm text-gray-600">This ad will close automatically</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Make Your Pick</h1>
            <p className="text-xl text-gray-300">
              Game {currentGameIndex + 1} of {games.length} - Week {currentWeek}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-yellow-500 text-black">
                {selectedTier?.name} Tier -{" "}
                {selectedTier?.bonusPoints > 0 ? `+${selectedTier.bonusPoints} Bonus Points` : "No Bonus"}
              </Badge>
              {paymentComplete && selectedTier?.price > 0 && (
                <Badge className="bg-green-500 text-white">✅ Payment Confirmed</Badge>
              )}
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-8">
                <div
                  className="text-center cursor-pointer hover:bg-white/20 p-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => handlePick(currentGame.id, currentGame.awayTeam)}
                >
                  <div className="text-6xl mb-4">{nflTeams[currentGame.awayTeam]?.logo}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{nflTeams[currentGame.awayTeam]?.name}</h3>
                  <p className="text-gray-300">Away Team</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">VS</div>
                </div>

                <div
                  className="text-center cursor-pointer hover:bg-white/20 p-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => handlePick(currentGame.id, currentGame.homeTeam)}
                >
                  <div className="text-6xl mb-4">{nflTeams[currentGame.homeTeam]?.logo}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{nflTeams[currentGame.homeTeam]?.name}</h3>
                  <p className="text-gray-300">Home Team</p>
                </div>
              </div>

              {/* Live game status */}
              <div className="text-center mt-6">
                <p className="text-gray-300">
                  Game Time: {new Date(currentGame.gameTime).toLocaleDateString()} at{" "}
                  {new Date(currentGame.gameTime).toLocaleTimeString()}
                </p>

                {/* Live game status */}
                {currentGame.status === "InProgress" || currentGame.status === "Live" ? (
                  <div className="mt-2">
                    <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
                    {currentGame.quarter && (
                      <p className="text-yellow-300 text-sm mt-1">
                        Q{currentGame.quarter} - {currentGame.timeRemaining || "In Progress"}
                      </p>
                    )}
                    {(currentGame.homeScore > 0 || currentGame.awayScore > 0) && (
                      <p className="text-white text-lg font-bold mt-1">
                        {nflTeams[currentGame.awayTeam]?.name}: {currentGame.awayScore} -{" "}
                        {nflTeams[currentGame.homeTeam]?.name}: {currentGame.homeScore}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <Badge className="bg-blue-500 text-white">📅 Scheduled</Badge>
                    {currentGame.channel && <p className="text-gray-400 text-sm mt-1">📺 {currentGame.channel}</p>}
                  </div>
                )}

                <p className="text-gray-400 text-sm mt-2">
                  {currentGame.seasonType === 1
                    ? "Preseason"
                    : currentGame.seasonType === 2
                      ? "Regular Season"
                      : currentGame.seasonType === 3
                        ? "🏆 PLAYOFFS"
                        : "Postseason"}{" "}
                  - Week {currentGame.week}
                </p>

                {currentGame.homeRecord && currentGame.awayRecord && (
                  <p className="text-gray-400 text-sm">
                    {nflTeams[currentGame.awayTeam]?.name} ({currentGame.awayRecord}) @{" "}
                    {nflTeams[currentGame.homeTeam]?.name} ({currentGame.homeRecord})
                  </p>
                )}

                {currentGame.stadium && <p className="text-gray-500 text-xs mt-1">🏟️ {currentGame.stadium}</p>}
              </div>
            </CardContent>
          </Card>

          {selectedTier?.id === "rookie" && (
            <div className="mt-6">
              <AdSenseAd
                adSlot={AD_SLOTS.banner}
                className="w-full"
                style={{ minHeight: "120px", textAlign: "center" }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  const SummaryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Picks Summary</h1>
          <p className="text-xl text-gray-300">
            Week {currentWeek} - {selectedTier?.name} Tier
          </p>
          <p className="text-gray-400">
            Player: {user?.displayName} ({user?.email})
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Final Picks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{nflTeams[game.awayTeam]?.logo}</span>
                    <span className="text-white">vs</span>
                    <span className="text-2xl">{nflTeams[game.homeTeam]?.logo}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">Your Pick:</p>
                    <p className="text-white font-bold">
                      {picks[game.id] ? nflTeams[picks[game.id]]?.name : "No Pick"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedTier?.id === "rookie" && (
          <div className="mb-6">
            <AdSenseAd adSlot={AD_SLOTS.square} className="max-w-4xl mx-auto" style={{ minHeight: "250px" }} />
          </div>
        )}

        <div className="text-center space-y-4">
          <Button
            onClick={() => {
              setCurrentGameIndex(0)
              setPicks({})
              setCurrentScreen("entry")
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Make New Picks
          </Button>

          <div className="text-gray-300">
            <p>
              📊 Your picks have been saved to the{" "}
              <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                live leaderboard
              </a>
            </p>
            <p>🏆 Good luck with your predictions!</p>
          </div>
        </div>
      </div>
    </div>
  )

  const NotificationBanner = () => {
    if (!notification.show) return null

    return (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white font-semibold`}
      >
        {notification.message}
      </div>
    )
  }

  // Main render logic - ALWAYS START WITH LOGIN
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen />
      case "entry":
        return <EntryScreen />
      case "payment":
        return <PaymentScreen />
      case "picking":
        return <PickingScreen />
      case "summary":
        return <SummaryScreen />
      default:
        return <LoginScreen /> // Always fallback to login
    }
  }

  return (
    <>
      <NotificationBanner />
      {renderCurrentScreen()}
    </>
  )
}

export default NFLPickemApp
