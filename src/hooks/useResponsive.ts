import { useState, useEffect } from 'react'

interface BreakpointConfig {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}) => {
  const bp = { ...defaultBreakpoints, ...breakpoints }
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < bp.md
  const isTablet = windowSize.width >= bp.md && windowSize.width < bp.lg
  const isDesktop = windowSize.width >= bp.lg
  
  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: windowSize.width < bp.sm,
    isMediumScreen: windowSize.width >= bp.sm && windowSize.width < bp.md,
    isLargeScreen: windowSize.width >= bp.md && windowSize.width < bp.lg,
    isExtraLargeScreen: windowSize.width >= bp.lg && windowSize.width < bp.xl,
    is2ExtraLargeScreen: windowSize.width >= bp.xl,
    breakpoint: windowSize.width >= bp['2xl'] ? '2xl' :
                windowSize.width >= bp.xl ? 'xl' :
                windowSize.width >= bp.lg ? 'lg' :
                windowSize.width >= bp.md ? 'md' :
                windowSize.width >= bp.sm ? 'sm' : 'xs'
  }
}