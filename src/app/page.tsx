export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-serif text-charcoal-900 mb-4">TryVerse</h1>
        <p className="text-xl text-charcoal-600 mb-8">Your AI Fashion Stylist</p>
        <a href="/dashboard" className="btn-primary">
          Get Started
        </a>
      </div>
    </main>
  )
}
