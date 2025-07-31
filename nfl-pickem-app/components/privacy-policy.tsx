"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-3xl text-center">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, make picks, or
                contact us. This includes your email address, display name, and game predictions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our NFL Pick'em service</li>
                <li>To track your game predictions and calculate scores</li>
                <li>To display leaderboards and contest results</li>
                <li>To process payments for premium tiers</li>
                <li>To send you important updates about the contest</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Google AdSense</h3>
              <p>
                This website uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads
                based on your prior visits to this website or other websites. You may opt out of personalized
                advertising by visiting Google's Ads Settings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Data Storage</h3>
              <p>
                Your data is stored securely in Google Sheets and your browser's local storage. We implement appropriate
                security measures to protect your personal information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@nflpickem.com</p>
            </div>

            <div className="text-sm text-gray-400 pt-4 border-t border-white/20">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPolicy
