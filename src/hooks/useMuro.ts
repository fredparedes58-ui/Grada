import { useState, useEffect, useCallback, useRef } from 'react'
import {
  obtenerPublicaciones, obtenerAutores, obtenerMisLikes,
  publicar, darLike, quitarLike, comentar, obtenerComentarios,
} from '../lib/muro'
import { subirImagenPublicacion } from '../lib/almacenamiento'

const PAG_SIZE = 20

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

function fecha(v: unknown): Date | null {
  const ts = v as { toDate?: () => Date } | null | undefined
  return ts && typeof ts.toDate === 'function' ? ts.toDate() : null
}

function nombreAutor(a: AutorData): string {
  return a?.apodo || a?.nombre || 'Jugador'
}

function mapPost(p: RawPost, autores: Record<string, AutorData>, misLikes: Set<string>): MuroPost {
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

async function fetchPagina(cursor: unknown) {
  const { posts: rawPosts, ultimo } = await obtenerPublicaciones(cursor)
  const raw = rawPosts as RawPost[]
  const [autoresRes, misLikes] = await Promise.all([
    obtenerAutores(raw.map(p => p.autorUid)),
    obtenerMisLikes(raw.map(p => p.id)),
  ])
  const autores = autoresRes as Record<string, AutorData>
  return {
    posts: raw.map(p => mapPost(p, autores, misLikes)),
    ultimo,
    hayMas: raw.length === PAG_SIZE,
  }
}

export function useMuro() {
  const [posts, setPosts] = useState<MuroPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hayMas, setHayMas] = useState(false)
  const [cargandoMas, setCargandoMas] = useState(false)
  const ultimoRef = useRef<unknown>(null)
  const likeEnVuelo = useRef<Set<string>>(new Set())

  const recargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const pagina = await fetchPagina(null)
      setPosts(pagina.posts)
      ultimoRef.current = pagina.ultimo
      setHayMas(pagina.hayMas)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el muro')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { recargar() }, [recargar])

  const cargarMas = useCallback(async () => {
    if (cargandoMas || !hayMas || !ultimoRef.current) return
    setCargandoMas(true)
    try {
      const pagina = await fetchPagina(ultimoRef.current)
      setPosts(s => [...s, ...pagina.posts])
      ultimoRef.current = pagina.ultimo
      setHayMas(pagina.hayMas)
    } catch {
      /* silencioso: el usuario puede reintentar */
    } finally {
      setCargandoMas(false)
    }
  }, [cargandoMas, hayMas])

  const crear = useCallback(async ({ texto, imagen }: { texto: string; imagen: File | null }) => {
    let imagenUrl: string | null = null
    if (imagen) imagenUrl = await subirImagenPublicacion(imagen)
    await publicar({ texto, imagenUrl })
    await recargar()
  }, [recargar])

  const alternarLike = useCallback(async (post: MuroPost) => {
    if (likeEnVuelo.current.has(post.id)) return
    likeEnVuelo.current.add(post.id)
    const nuevoLiked = !post.liked
    setPosts(s => s.map(x =>
      x.id === post.id
        ? { ...x, liked: nuevoLiked, numLikes: Math.max(0, x.numLikes + (nuevoLiked ? 1 : -1)) }
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
    } finally {
      likeEnVuelo.current.delete(post.id)
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

  return {
    posts, loading, error, hayMas, cargandoMas,
    recargar, cargarMas, crear, alternarLike, cargarComentarios, agregarComentario,
  }
}
