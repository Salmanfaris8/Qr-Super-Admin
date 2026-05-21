import { Save, Upload } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Platform Settings</h1>
        <p className="text-sm text-[#6B7280] mt-1">Configure global platform settings and preferences</p>
      </div>

      {/* Platform Information */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Platform Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="QR Hotels" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="platformUrl">Platform URL</Label>
              <Input id="platformUrl" defaultValue="https://qrhotels.com" className="mt-2" />
            </div>
          </div>
          <div>
            <Label htmlFor="platformLogo">Platform Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1E88E5] to-[#00C853] rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl">QR</span>
              </div>
              <Button variant="outline" className="border-[#E5E7EB]">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Logo
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input id="supportEmail" type="email" defaultValue="support@qrhotels.com" className="mt-2" />
          </div>
        </div>
      </Card>

      {/* Email Configuration */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Email Configuration (SMTP)</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" placeholder="smtp.gmail.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" placeholder="587" className="mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input id="smtpUser" type="email" placeholder="email@example.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input id="smtpPassword" type="password" placeholder="••••••••" className="mt-2" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smtpEnabled">Enable SMTP</Label>
              <p className="text-sm text-[#6B7280] mt-1">Use SMTP for sending emails</p>
            </div>
            <Switch id="smtpEnabled" />
          </div>
        </div>
      </Card>

      {/* Payment Gateway */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Payment Gateway</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentGateway">Payment Provider</Label>
            <Select defaultValue="stripe">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="sk_live_••••••••" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input id="secretKey" type="password" placeholder="••••••••" className="mt-2" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="testMode">Test Mode</Label>
              <p className="text-sm text-[#6B7280] mt-1">Use sandbox environment for testing</p>
            </div>
            <Switch id="testMode" />
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Localization</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST (Eastern)</SelectItem>
                  <SelectItem value="pst">PST (Pacific)</SelectItem>
                  <SelectItem value="cst">CST (Central)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Features & Permissions */}
      <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Features & Permissions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
            <div>
              <Label htmlFor="autoApprove">Auto-approve Restaurants</Label>
              <p className="text-sm text-[#6B7280] mt-1">Automatically approve new restaurant registrations</p>
            </div>
            <Switch id="autoApprove" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-[#6B7280] mt-1">Send email alerts for important events</p>
            </div>
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
            <div>
              <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              <p className="text-sm text-[#6B7280] mt-1">Require 2FA for admin users</p>
            </div>
            <Switch id="twoFactor" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-[#6B7280] mt-1">Temporarily disable platform access</p>
            </div>
            <Switch id="maintenanceMode" />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-[#E5E7EB]">
          Cancel
        </Button>
        <Button className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
