import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NumericalIntegrationCalculator from './NumericalIntegrationCalculator'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NumericalIntegrationCalculator />
  </StrictMode>,
)
