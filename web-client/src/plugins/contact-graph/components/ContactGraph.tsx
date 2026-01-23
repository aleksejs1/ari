import { useEffect, useRef, useState } from 'react'
import { DataSet } from 'vis-data'
import { type Edge, Network, type Node } from 'vis-network'

import type { GraphData } from '../api/useContactGraph'

interface ContactGraphProps {
  data: GraphData
}

export const ContactGraph = ({ data }: ContactGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!containerRef.current || !data) {
      return
    }

    // Prepare data
    const nodes = new DataSet<Node>(
      data.nodes.map((node) => ({
        id: node.id,
        label: node.user || node.id,
        title: node.user || node.id, // Tooltip
        shape: 'dot',
      })),
    )

    const edges = new DataSet<Edge>(
      data.links.map((link) => ({
        from: typeof link.source === 'object' ? (link.source as any).id : link.source,
        to: typeof link.target === 'object' ? (link.target as any).id : link.target,
      })),
    )

    // Options
    const options = {
      nodes: {
        shadow: true,
      },
      layout: {
        improvedLayout: true,
      },
    }

    // Initialize Network
    if (networkRef.current) {
      networkRef.current.destroy()
    }

    networkRef.current = new Network(containerRef.current, { nodes, edges }, options)

    // Events
    networkRef.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        window.open(`/contacts/${nodeId}`, '_blank')
      }
    })

    // Cleanup
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [data, isDark])

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      style={{ height: '100%', width: '100%' }}
    />
  )
}
