export default function AddAddressPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Address</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" className="w-full border rounded-md p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input type="text" className="w-full border rounded-md p-2" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input type="text" className="w-full border rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input type="text" className="w-full border rounded-md p-2" required />
          </div>
        </div>
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Save Address
        </button>
      </form>
    </div>
  );
}
