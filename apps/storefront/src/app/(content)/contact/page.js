export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
      <form className="max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}