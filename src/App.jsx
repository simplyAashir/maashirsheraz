import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { lazy, Suspense } from 'react'

const Admin = lazy(() => import('./Admin'))

const About = lazy(() => import('./components/About'))
const Education = lazy(() => import('./components/Education'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) return <Suspense fallback={<main className="admin-shell">Loading workspace…</main>}><Admin /></Suspense>
  return (
    <div style={{ backgroundColor: '#0a0f1e' }} className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <Suspense
          fallback={<div className="py-20 text-center text-[#6366f1]">Loading...</div>}
        >
          {/* ── About ── */}
          <div className="relative overflow-hidden">
            <div className="bg-orb bg-orb--float w-[400px] h-[400px] -top-32 -right-48 opacity-[0.07]" style={{ background: '#6366f1' }} />
            <div className="bg-orb bg-orb--float-reverse w-[300px] h-[300px] bottom-0 -left-32 opacity-[0.05]" style={{ background: '#818cf8' }} />
            <section id="about" className="relative z-10 py-20 px-6 max-w-6xl mx-auto"><About /></section>
          </div>

          <div className="section-divider max-w-4xl mx-auto" />

          {/* ── Education ── */}
          <div className="relative overflow-hidden">
            <div className="bg-orb bg-orb--float-reverse w-[350px] h-[350px] top-20 -left-40 opacity-[0.06]" style={{ background: '#a78bfa' }} />
            <div className="bg-orb bg-orb--pulse w-[250px] h-[250px] -bottom-20 right-10 opacity-[0.08]" style={{ background: '#6366f1' }} />
            <section id="education" className="relative z-10 py-20 px-6 max-w-6xl mx-auto"><Education /></section>
          </div>

          <div className="section-divider max-w-4xl mx-auto" />

          {/* ── Projects ── */}
          <div className="relative overflow-hidden">
            <div className="bg-orb bg-orb--float w-[450px] h-[450px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.06]" style={{ background: '#22d3ee' }} />
            <div className="bg-orb bg-orb--float-reverse w-[280px] h-[280px] bottom-10 -right-24 opacity-[0.05]" style={{ background: '#6366f1' }} />
            <section id="projects" className="relative z-10 py-20 px-6 max-w-6xl mx-auto"><Projects /></section>
          </div>

          <div className="section-divider max-w-4xl mx-auto" />

          {/* ── Skills ── */}
          <div className="relative overflow-hidden">
            <div className="bg-orb bg-orb--float w-[380px] h-[380px] top-10 -right-32 opacity-[0.06]" style={{ background: '#10b981' }} />
            <div className="bg-orb bg-orb--float-reverse w-[320px] h-[320px] -bottom-24 -left-40 opacity-[0.05]" style={{ background: '#f59e0b' }} />
            <div className="bg-orb bg-orb--pulse w-[200px] h-[200px] top-1/2 left-1/3 opacity-[0.04]" style={{ background: '#6366f1' }} />
            <section id="skills" className="relative z-10 py-20 px-6 max-w-6xl mx-auto"><Skills /></section>
          </div>

          <div className="section-divider max-w-4xl mx-auto" />

          {/* ── Contact ── */}
          <div className="relative overflow-hidden">
            <div className="bg-orb bg-orb--float-reverse w-[300px] h-[300px] -top-20 left-1/4 opacity-[0.06]" style={{ background: '#ec4899' }} />
            <div className="bg-orb bg-orb--float w-[250px] h-[250px] bottom-0 right-1/4 opacity-[0.05]" style={{ background: '#6366f1' }} />
            <section id="contact" className="relative z-10 py-20 px-6 max-w-6xl mx-auto"><Contact /></section>
          </div>

          <Footer />
        </Suspense>
      </main>
    </div>
  )
}

