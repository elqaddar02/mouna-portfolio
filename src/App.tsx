import { MotionConfig } from 'motion/react'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { I18nProvider } from './i18n/I18nProvider'
import Home from './pages/Home'

const Works = lazy(() => import('./pages/Works'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Concepts = lazy(() => import('./pages/Concepts'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <MotionConfig reducedMotion="user">
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="works" element={<Works />} />
              <Route path="works/:slug" element={<ProjectDetail />} />
              <Route path="concepts" element={<Concepts />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </MotionConfig>
      </I18nProvider>
    </BrowserRouter>
  )
}
