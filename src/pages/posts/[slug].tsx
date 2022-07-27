import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import { Document } from '@prismicio/client/types/documents'

import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic'
import styles from '../../styles/pages/post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session: any = await getSession({ req })
  const { slug } = params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    }
  }

  const primic = getPrismicClient(req)

  const response: Document<IPrismicResponseData> = await primic.getByUID<any>(
    'post',
    String(slug),
    {}
  )

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
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
  }
}
