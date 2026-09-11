import { useState, useEffect, useCallback } from 'react'
import {
  obtenerPublicaciones, obtenerAutores, obtenerMisLikes,
  publicar, darLike, quitarLike, comentar, obtenerComentarios,
} from '../lib/muro'
import { subirImagenPublicacion } from '../lib/almacenamiento'

export interface MuroPost {
  id: string
  autorUid: string
  autorNombre: string
  autorAvatar: string
  texto: string
  imagenUrl: string | null
  creadoEn: Date | null
  numLikes: number
  numComentarios: number
  liked: boolean
}

export interface MuroComentario {
  id: string
  autorNombre: string
  autorAvatar: string
  texto: string
  creadoEn: Date | null
}

function fecha(v: unknown): Date | null {
  const ts = v as { toDate?: () => Date } | null | undefined
  return ts && typeof ts.toDate === 'function' ? ts.toDate() : null
}

type AutorData = { nombre?: string; apodo?: string; avatarUrl?: string } | null

interface RawPost {
  id: string
  autorUid: string
  texto?: string
  imagenUrl?: string | null
  creadoEn?: unknown
  numLikes?: number
  numComentarios?: number
}

interface RawComentario {
  id: string
  autorUid: string
  texto?: string
  creadoEn?: unknown
}

function nombreAutor(a: AutorData): string {
  return a?.apodo || a?.nombre || 'Jugador'
}

export function iniciales(nombre: string): string {
  return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function tiempoRelativo(d: Date | null): string {
  if (!d) return 'ahora'
  const s = (Date.now() - d.getTime()) / 1000
  if (s < 60) return 'ahora'
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`
  return `hace ${Math.floor(s / 86400)} d`
}

export function useMuro() {
  const [posts, setPosts] = useState<MuroPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { posts: rawPosts } = await obtenerPublicaciones()
      const raw = rawPosts as RawPost[]
      const [autoresRes, misLikes] = await Promise.all([
        obtenerAutores(raw.map(p => p.autorUid)),
        obtenerMisLikes(raw.map(p => p.id)),
      ])
      const autores = autoresRes as Record<string, AutorData>
      setPosts(raw.map(p => {
        const autor = autores[p.autorUid]
        return {
          id: p.id,
          autorUid: p.autorUid,
          autorNombre: nombreAutor(autor),
          autorAvatar: autor?.avatarUrl || '',
          texto: p.texto ?? '',
          imagenUrl: p.imagenUrl ?? null,
          creadoEn: fecha(p.creadoEn),
          numLikes: p.numLikes ?? 0,
          numComentarios: p.numComentarios ?? 0,
          liked: misLikes.has(p.id),
        }
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el muro')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { recargar() }, [recargar])

  const crear = useCallback(async ({ texto, imagen }: { texto: string; imagen: File | null }) => {
    let imagenUrl: string | null = null
    if (imagen) imagenUrl = await subirImagenPublicacion(imagen)
    await publicar({ texto, imagenUrl })
    await recargar()
  }, [recargar])

  const alternarLike = useCallback(async (post: MuroPost) => {
    const nuevoLiked = !post.liked
    setPosts(s => s.map(x =>
      x.id === post.id
        ? { ...x, liked: nuevoLiked, numLikes: x.numLikes + (nuevoLiked ? 1 : -1) }
        : x,
    ))
    try {
      if (nuevoLiked) await darLike(post.id)
      else await quitarLike(post.id)
    } catch (e) {
      setPosts(s => s.map(x =>
        x.id === post.id ? { ...x, liked: post.liked, numLikes: post.numLikes } : x,
      ))
      throw e
    }
  }, [])

  const cargarComentarios = useCallback(async (postId: string): Promise<MuroComentario[]> => {
    const raw = (await obtenerComentarios(postId)) as RawComentario[]
    const autores = (await obtenerAutores(raw.map(c => c.autorUid))) as Record<string, AutorData>
    return raw.map(c => ({
      id: c.id,
      autorNombre: nombreAutor(autores[c.autorUid]),
      autorAvatar: autores[c.autorUid]?.avatarUrl || '',
      texto: c.texto ?? '',
      creadoEn: fecha(c.creadoEn),
    }))
  }, [])

  const agregarComentario = useCallback(async (postId: string, texto: string) => {
    await comentar(postId, texto)
    setPosts(s => s.map(x =>
      x.id === postId ? { ...x, numComentarios: x.numComentarios + 1 } : x,
    ))
  }, [])

  return { posts, loading, error, recargar, crear, alternarLike, cargarComentarios, agregarComentario }
}
