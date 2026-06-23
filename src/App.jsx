import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { lazy, Suspense } from 'react'

const About = lazy(() => import('./components/About'))
const Education = lazy(() => import('./components/Education'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  return (
    <div style={{ backgroundColor: '#0a0f1e' }} className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <Suspense
          fallback={<div className="py-20 text-center text-[#6366f1]">Loading...</div>}
        >
          <section id="about" className="py-20 px-6 max-w-6xl mx-auto"><About /></section>
          <section id="education" className="py-20 px-6 max-w-6xl mx-auto"><Education /></section>
          <section id="projects" className="py-20 px-6 max-w-6xl mx-auto"><Projects /></section>
          <section id="skills" className="py-20 px-6 max-w-6xl mx-auto"><Skills /></section>
          <section id="contact" className="py-20 px-6 max-w-6xl mx-auto"><Contact /></section>
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}
