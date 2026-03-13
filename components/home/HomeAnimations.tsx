'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Draggable } from 'gsap/Draggable'

export function HomeAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable)

    const sm = window.matchMedia('(min-width: 640px)')
    const md = window.matchMedia('(min-width: 768px)')
    const lg = window.matchMedia('(min-width: 1024px)')

    function init(size: string) {
      if (size !== 'mobile') {
        // Teaser BG parallax effect
        const teaser = gsap.utils.selector('#teaser')
        const teaserBg = teaser('.teaser-bg')
        if (teaserBg && teaserBg.length) {
          (teaserBg[0] as HTMLElement).style.backgroundPosition = '50% 0'
          gsap.to(teaserBg, {
            backgroundPosition: '50% -450px',
            ease: 'none',
            scrollTrigger: { scrub: true },
          })
        }

        // Title animations
        function animateTitle(name: string) {
          const containerId = `#${name}-title-container`
          const contentId = `#${name}-content`
          const titleContainer = document.querySelector(containerId) as HTMLElement | null
          if (titleContainer) {
            const content = document.querySelector(contentId) as HTMLElement | null
            const title = titleContainer.firstElementChild as HTMLElement | null
            if (title) title.style.top = '200px'
            gsap.to(`#${name}-title`, {
              top: 0,
              scrollTrigger: { trigger: containerId, start: '180px bottom' },
              onComplete: () => {
                titleContainer.style.height = 'auto'
                if (title) title.style.position = 'relative'
                if (content) content.style.marginTop = '0px'
              },
            })
          }
        }
        ;['about', 'features', 'compare'].forEach((name) => animateTitle(name))

        // Icon Box animation
        function animateIconBox(
          container: string,
          start?: (index: number) => number,
          delay?: (index: number) => number,
        ) {
          const itemContainers = document.querySelectorAll(`.${container}-item-container`)
          itemContainers.forEach((c, index) => {
            const item = c.firstElementChild as HTMLElement | null
            if (item) item.style.top = '500px'
            gsap.to(item, {
              top: 0,
              duration: 0.8,
              ease: 'power3',
              delay: delay ? delay(index) : 0,
              scrollTrigger: {
                trigger: c,
                start: `${start ? start(index) : 100 + 80 * (index % 3)}px bottom`,
              },
            })
          })
        }
        animateIconBox('about')
        animateIconBox('compare', () => 100, (i) => 0.15 * i)
        animateIconBox('feature', () => 100, (i) => 0.15 * i)

        // Feature direction button animation
        const featureDirections = document.querySelectorAll('.feature-direction')
        featureDirections.forEach((container, index) => {
          const item = container.firstElementChild as HTMLElement | null
          const toObj: gsap.TweenVars = {
            scrollTrigger: {
              trigger: container,
              start: `${100 + 80 * (index % (size === 'lg' ? 3 : 2))}px bottom`,
            },
          }
          if (index === 0) {
            if (item) item.style.right = '100px'
            toObj['right'] = 0
          } else {
            if (item) item.style.left = '100px'
            toObj['left'] = 0
          }
          gsap.to(item, toObj)
        })

        // Content opacity animation
        function opacityPartsAnimation(name: string) {
          const el = document.querySelector('#' + name) as HTMLElement | null
          if (el && el.style) el.style.opacity = '0.0'
          gsap.to(el, {
            opacity: 1.0,
            duration: 5.0,
            ease: 'expo',
            scrollTrigger: { trigger: el, start: '50% bottom' },
          })
        }
        ;['feature-carussel', 'compare-content'].forEach((id) => opacityPartsAnimation(id))

        // Feature carousel scroll action
        const carussel = document.querySelector('#feature-carussel')
        gsap.to(carussel, {
          duration: 5.0,
          ease: 'power2',
          scrollTrigger: { trigger: carussel, start: '50% bottom' },
          scrollTo: { x: 400, autoKill: true },
        })

        // Animated opacity for text parts
        function animateOpacity(el: Element | null, additionalProps?: gsap.TweenVars) {
          const props: gsap.TweenVars = Object.assign(
            {
              duration: 4,
              opacity: 1.0,
              ease: 'power3',
              scrollTrigger: { trigger: el, start: '40px bottom' },
            },
            additionalProps,
          )
          if (el && (el as HTMLElement).style) (el as HTMLElement).style.opacity = '0'
          gsap.to(el, props)
        }
        const textParts = document.querySelectorAll('.animText')
        textParts.forEach((textPart, index) => {
          animateOpacity(textPart, { delay: index * 0.08 })
        })

        const feder = document.querySelector('#feder')
        animateOpacity(feder)
        const communityTitle = document.querySelector('#community-title')
        animateOpacity(communityTitle)

        const footerItems = document.querySelectorAll('.footer-item')
        footerItems.forEach((footerItem, index) => {
          const icon = footerItem.firstChild as HTMLElement | null
          if (icon) icon.style.top = '200px'
          gsap.to(icon, {
            top: '0px',
            delay: 0.2 * index,
            scrollTrigger: { trigger: footerItem, start: '100px bottom' },
          })
        })
      } else {
        // Mobile adjustments
        const featureItems = document.querySelectorAll('.feature-item-container')
        featureItems.forEach(
          (e) => ((e as HTMLElement).style.minWidth = `${window.innerWidth - 144}px`),
        )

        const aboutText = document.querySelectorAll('.about-item')
        const compareText = document.querySelectorAll('.compare-item')
        const forEachText = (e: Element) => {
          const p = e.querySelector('.item-text') as HTMLElement | null
          if (p) p.style.display = 'none'
          e.addEventListener('click', () => {
            if (p) p.style.display = p.style.display === 'none' ? 'flex' : 'none'
          })
        }
        aboutText.forEach(forEachText)
        compareText.forEach(forEachText)
      }
    }

    function mediaChanged() {
      const size = lg.matches ? 'lg' : md.matches ? 'md' : sm.matches ? 'sm' : 'mobile'
      init(size)
    }
    mediaChanged()

    sm.addEventListener('change', mediaChanged)
    md.addEventListener('change', mediaChanged)
    lg.addEventListener('change', mediaChanged)

    // Scroll-down button
    const scrollDown = document.querySelector('#scroll-down')
    scrollDown?.addEventListener('click', () => {
      gsap.to(window, {
        duration: 1.5,
        ease: 'power3',
        scrollTo: { y: '#about', autoKill: true },
      })
    })

    // Feature carousel draggable loop
    const wrapper = document.querySelector('.feature-carussel')
    const boxes = gsap.utils.toArray('.feature-item-container') as HTMLElement[]

    if (Array.isArray(boxes) && boxes.length && boxes.every((b) => b && 'offsetLeft' in b)) {
      const loop = horizontalLoop(boxes, { paused: true, draggable: true })
      boxes.forEach((box, i) =>
        box.addEventListener('click', () => loop.toIndex(i, { duration: 0.8, ease: 'power1.inOut' })),
      )
      document
        .querySelector('#features-right')
        ?.addEventListener('click', () => loop.next({ duration: 0.4, ease: 'power1.inOut' }))
      document
        .querySelector('#features-left')
        ?.addEventListener('click', () => loop.previous({ duration: 0.4, ease: 'power1.inOut' }))
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      sm.removeEventListener('change', mediaChanged)
      md.removeEventListener('change', mediaChanged)
      lg.removeEventListener('change', mediaChanged)
    }
  }, [])

  return null
}

// Horizontal loop helper — ported from old-website/hugo/static/index.js
// https://greensock.com/docs/v3/HelperFunctions
function horizontalLoop(items: HTMLElement[], config: {
  paused?: boolean
  draggable?: boolean
  speed?: number
  repeat?: number
  reversed?: boolean
  snap?: number | false
  paddingRight?: number
}) {
  config = config || {}
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100) },
  })
  const length = items.length
  const startX = items[0].offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const xPercents: number[] = []
  let curIndex = 0
  const pixelsPerSecond = (config.speed || 1) * 100
  const snap =
    config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1)

  const populateWidths = () =>
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px') as string)
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px') as string) / widths[i]) * 100 +
          (gsap.getProperty(el, 'xPercent') as number),
      )
    })
  const getTotalWidth = () =>
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], 'scaleX') as number) +
    (parseFloat(String(config.paddingRight)) || 0)

  populateWidths()
  gsap.set(items, { xPercent: (i) => xPercents[i] })
  gsap.set(items, { x: 0 })

  const totalWidth = getTotalWidth()

  for (let i = 0; i < length; i++) {
    const item = items[i]
    const curX = (xPercents[i] / 100) * widths[i]
    const distanceToStart = item.offsetLeft + curX - startX
    const distanceToLoop =
      distanceToStart + widths[i] * (gsap.getProperty(item, 'scaleX') as number)
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    ).fromTo(
      item,
      {
        xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
      },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond,
    ).add('label' + i, distanceToStart / pixelsPerSecond)
    times[i] = distanceToStart / pixelsPerSecond
  }

  function toIndex(index: number, vars?: gsap.TweenVars) {
    vars = vars || {}
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length
    }
    const newIndex = gsap.utils.wrap(0, length, index)
    let time = times[newIndex]
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }

  const loop = Object.assign(tl, {
    next: (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars),
    previous: (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars),
    current: () => curIndex,
    toIndex,
    updateIndex: () => {
      curIndex = Math.round(tl.progress() * (items.length - 1))
    },
    times,
  })

  tl.progress(1, true).progress(0, true)

  if (config.reversed) {
    tl.vars.onReverseComplete?.()
    tl.reverse()
  }

  if (config.draggable && typeof Draggable === 'function') {
    const proxy = document.createElement('div')
    let startProgress: number
    let ratio: number
    let dragSnap: number
    let roundFactor: number
    const wrapFn = gsap.utils.wrap(0, 1)
    const align = (): void => { loop.progress(wrapFn(startProgress + (draggable.startX - draggable.x) * ratio)) }
    const syncIndex = () => loop.updateIndex()

    const draggable = Draggable.create(proxy, {
      trigger: '#feature-carussel',
      type: 'x',
      onPress() {
        startProgress = loop.progress()
        loop.progress(0)
        populateWidths()
        const tw = getTotalWidth()
        ratio = 1 / tw
        dragSnap = tw / items.length
        roundFactor = Math.pow(10, ((dragSnap + '').split('.')[1] || '').length)
        loop.progress(startProgress)
      },
      onDrag: align,
      onThrowUpdate: align,
      snap: (value: number) => {
        const n = Math.round(parseFloat(String(value)) / dragSnap) * dragSnap * roundFactor
        return (n - (n % 1)) / roundFactor
      },
      onRelease: syncIndex,
      onThrowComplete: () => {
        gsap.set(proxy, { x: 0 })
        syncIndex()
      },
    })[0]
  }

  return loop
}
