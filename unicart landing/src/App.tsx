import Hero from './components/Hero';
import Categories from './components/Categories';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <main className="min-h-screen bg-cream selection:bg-olive-light selection:text-ink">
      <Hero />
      <Categories />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}

export default App;
