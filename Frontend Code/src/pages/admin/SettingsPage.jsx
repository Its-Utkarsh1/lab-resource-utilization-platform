import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    institutionName: 'MIT',
    maxBookingDuration: 4,
    advanceBookingDays: 14,
    maintenanceReminderDays: 7,
    enableWaitlist: true,
    enableSharing: true,
    notificationEmail: true,
    notificationSMS: false,
    notificationPush: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600">Configure platform-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Institution Name</label>
              <input type="text" name="institutionName" value={settings.institutionName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Booking Duration (hours)</label>
              <input type="number" name="maxBookingDuration" value={settings.maxBookingDuration} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Advance Booking (days)</label>
              <input type="number" name="advanceBookingDays" value={settings.advanceBookingDays} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Maintenance Reminder (days)</label>
              <input type="number" name="maintenanceReminderDays" value={settings.maintenanceReminderDays} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            {[
              { name: 'enableWaitlist', label: 'Enable Waitlist', desc: 'Allow users to join waitlists for booked equipment' },
              { name: 'enableSharing', label: 'Enable Inter-Institution Sharing', desc: 'Allow sharing equipment with other institutions' },
              { name: 'notificationEmail', label: 'Email Notifications', desc: 'Send booking and maintenance alerts via email' },
              { name: 'notificationSMS', label: 'SMS Notifications', desc: 'Send urgent alerts via SMS' },
              { name: 'notificationPush', label: 'Push Notifications', desc: 'Send browser push notifications' },
            ].map((toggle) => (
              <div key={toggle.name} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-slate-900">{toggle.label}</p>
                  <p className="text-xs text-slate-500">{toggle.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name={toggle.name} checked={settings[toggle.name]} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <button className="px-6 py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors">Reset</button>
        <button onClick={handleSave} className="btn-primary">Save Changes</button>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
