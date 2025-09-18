import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
