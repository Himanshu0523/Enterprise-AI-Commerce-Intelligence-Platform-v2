export default function AccountSettingsPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p className="text-gray-600 mb-6">Manage your profile preferences and notification settings.</p>
      <div className="space-y-4 max-w-lg">
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
          <span>Receive promotional emails and special offers</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
          <span>Receive order updates via SMS</span>
        </label>
      </div>
    </div>
  );
}
