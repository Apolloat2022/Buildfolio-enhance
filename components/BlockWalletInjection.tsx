// components/BlockWalletInjection.tsx
"use client"

import { useEffect } from 'react'

export default function BlockWalletInjection() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return
    
    console.log('🛡️ Blocking wallet injection...')
    
    // Store original values
    const originalEthereum = (window as any).ethereum
    const originalWeb3 = (window as any).web3
    const originalDefineProperty = Object.defineProperty
    
    // COMPLETELY BLOCK wallet detection during hydration
    Object.defineProperty(window, 'ethereum', {
      configurable: false,
      writable: false,
      value: undefined
    })
    
    Object.defineProperty(window, 'web3', {
      configurable: false,
      writable: false,
      value: undefined
    })
    
    // Block attempts to add ethereum via Object.defineProperty
    Object.defineProperty = function(obj, prop, descriptor) {
      if (prop === 'ethereum' || prop === 'web3') {
        console.log('🚫 Blocked attempt to define', prop)
        return obj
      }
      return originalDefineProperty.call(this, obj, prop, descriptor)
    }
    
    // Block MetaMask event listeners
    const originalAddEventListener = window.addEventListener
    window.addEventListener = function(type: string, listener: any, options?: any) {
      if (typeof type === 'string' && (
        type.includes('ethereum') || 
        type.includes('web3') ||
        (listener && listener.toString().includes('ethereum'))
      )) {
        console.log('🚫 Blocked wallet event:', type)
        return
      }
      return originalAddEventListener.call(this, type, listener, options)
    }
    
    // Cleanup on unmount
    return () => {
      Object.defineProperty = originalDefineProperty
      window.addEventListener = originalAddEventListener
      
      // Restore original values if they existed
      if (originalEthereum) {
        try {
          Object.defineProperty(window, 'ethereum', {
            configurable: true,
            writable: true,
            value: originalEthereum
          })
        } catch (e) {
          console.log('Could not restore ethereum')
        }
      }
    }
  }, [])
  
  return null // No rendering
}
