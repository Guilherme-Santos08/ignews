import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { RichText } from 'prismic-dom'
import { Document } from '@prismicio/client/types/documents'
import { getPrismicClient } from '../../../services/prismic'

import styles from '../../../styles/pages/post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session]: any = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

interface IPrismicData {
  type: string
  text: string
  spans: Array<any>
}

interface IPrismicResponseData {
  title: Array<IPrismicData>
  content: Array<IPrismicData>
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const primic = getPrismicClient()

  const response: Document<IPrismicResponseData> = await primic.getByUID<any>(
    'post',
    String(slug),
    {}
  )

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  }
}
