import { MotionConfig } from 'motion/react'
import { lazy, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Intro, shouldShowIntro } from './components/layout/Intro'
import { Layout } from './components/layout/Layout'
import { I18nProvider } from './i18n/I18nProvider'
import Home from './pages/Home'

const Works = lazy(() => import('./pages/Works'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Decided once per page load (not per render, which React may repeat). */
const SHOW_INTRO = shouldShowIntro()

export default function App() {
  // 'intro': page not mounted yet · 'reveal': page mounts under the lifting panels · 'done': intro removed.
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'done'>(SHOW_INTRO ? 'intro' : 'done')
  return (
    <BrowserRouter>
      <I18nProvider>
        <MotionConfig reducedMotion="user">
          {phase !== 'intro' && (
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="works" element={<Works />} />
                <Route path="works/:slug" element={<ProjectDetail />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          )}
          {phase !== 'done' && <Intro onReveal={() => setPhase('reveal')} onDone={() => setPhase('done')} />}
        </MotionConfig>
      </I18nProvider>
    </BrowserRouter>
  )
}
