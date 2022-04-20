import { GetStaticProps } from 'next';
import Head from 'next/head'
import { type } from 'os';
import { createClient } from '../../src/services/prismic';
import styles from './styles.module.scss';
import Link from 'next/link';

interface postsProps {
    posts: [
    ]
}

type Post = {
    id: string,
    uid: string,
    data: {
        content: [
            id: {
                text: string
            }
        ],
        title: [
            id: {
                text: string
            }
        ],
        sumarry: [
            id: {
                text: string
            }
        ]
    },
    first_publication_date: string,
    last_publication_date: string
}

export default function Posts({posts}) {

    return (
        <>
            <Head>
                <title>Posts | IgNews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map((post: Post) =>
                        <Link href={`/posts/${post.uid}`}>
                            <a>
                                <time>{new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}</time>
                                <h2>{post.data.title[0].text}</h2>
                                <span>{post.data.sumarry[0].text}</span>
                            </a>
                        </Link>
                    )}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = createClient()

    const posts = await prismic.getAllByType('publication', { pageSize: 100 })

    return {
        props: { posts }
    }

}