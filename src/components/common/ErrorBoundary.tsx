import { Component, type ErrorInfo, type ReactNode } from 'react'
import PixelButton from '@/components/ui/PixelButton'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Gentle pixel-flavored error boundary.
 * Instead of a white screen, the chef drops the spoon — but it's cute.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PIXEL ERROR]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
          {/* Dropped spoon */}
          <svg
            viewBox="0 0 48 64"
            className="h-20 w-16"
            shapeRendering="crispEdges"
            aria-hidden
          >
            <rect x="22" y="0" width="4" height="12" fill="#fdf6e3" />
            <rect x="20" y="12" width="8" height="6" fill="#fdf6e3" />
            <rect x="18" y="18" width="12" height="6" fill="#c0c0c0" />
            <rect x="14" y="24" width="20" height="10" fill="#c0c0c0" rx="0" />
            <rect x="14" y="34" width="20" height="4" fill="#999" rx="0" />
            {/* Pixel stars (chaos) */}
            <rect x="2" y="40" width="3" height="3" fill="#ffcb3b" />
            <rect x="44" y="44" width="3" height="3" fill="#ff5277" />
            <rect x="40" y="14" width="2" height="2" fill="#b388ff" />
          </svg>

          <h1 className="font-pixel text-lg text-cheese">
            Oops! Chef dropped the spoon.
          </h1>

          <p className="max-w-md font-sans text-sm leading-relaxed text-cream/60">
            Something went sideways in the kitchen. No worries — pixel chefs
            are resilient. Let&apos;s reset and try again.
          </p>

          {this.state.error && (
            <span className="block max-w-md break-all border-2 border-ink-line px-3 py-1.5 font-terminal text-sm text-cream/30">
              {this.state.error.message}
            </span>
          )}

          <PixelButton variant="tomato" onClick={this.handleReset}>
            🔄 Try Again
          </PixelButton>
        </div>
      )
    }

    return this.props.children
  }
}
