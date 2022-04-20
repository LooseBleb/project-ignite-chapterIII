import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import { createClient } from '../../src/services/prismic'
import { RichText } from 'prismic-dom';
import styles from '../../src/styles/Post.module.scss';

interface PostProps {
    post: {
        uid: string
        title: string
        content: string
        date: string
    }
}

export default function Post({ post }: PostProps) {
    return (
        <main className={styles.container}>
            <article className={styles.content}>
                <h1>{post.title}</h1>
                <time>{new Date(post.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}</time>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })
    const { uid } = params
    


    if(!session.activeSubscription){
        return {
            redirect: {
                destination: `posts/preview/${uid}`,
                permanent: false,
            },
        }
    }

    const prismic = createClient(req)

    const response = await prismic.getByUID('publication', String(uid), {})

    const post = {
        uid,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        date: response.last_publication_date
    }


    return {
        props: {
            post
        }
    }
}