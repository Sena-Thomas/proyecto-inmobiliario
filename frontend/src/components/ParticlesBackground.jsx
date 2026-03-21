import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 60,
        background: { color: { value: 'transparent' } },
        particles: {
          number: {
            value: 60,
            density: { enable: true, area: 900 },
          },
          color: { value: ['#0078d4', '#56a4ea', '#2b8be0', '#90c3f2'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
          },
          size: {
            value: { min: 1, max: 4 },
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
          },
          links: {
            enable: true,
            color: '#0078d4',
            opacity: 0.15,
            distance: 130,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            outModes: { default: 'bounce' },
            random: true,
            straight: false,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.4 } },
            push: { quantity: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}
