import { GetStaticPaths, GetStaticProps } from 'next'
import { createClient } from '../../../src/services/prismic'
import { RichText } from 'prismic-dom';
import styles from '../../../src/styles/Post.module.scss';
import { SubscribeButton } from '../../../src/components/SubscribeButton/SubscribeButton';
import { stripe } from '../../../src/services/stripe';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface PostPreviewProps {
    post: {
        uid: string
        title: string
        content: string
        date: string
    },
    product : {
        priceId : string
    }
}

export default function PostPreview({ post, product }: PostPreviewProps) {

    const {data : session }= useSession()
    const router = useRouter()

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`posts/${post.uid}`)
        }
    }, [session])

    return (
        <main className={styles.container}>
            <article className={styles.content}>
                <h1>{post.title}</h1>
                <time>{new Date(post.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}</time>
                <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: post.content }} />
                <SubscribeButton  priceId={product.priceId} text="<span>Wanna continue reading?</span> <span>Subscribe now 🤗</span> "/>
            </article>
        </main>
    )
}

export const getStaticPaths : GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { uid } = params

    const prismic = createClient()

    const response = await prismic.getByUID('publication', String(uid), {})

    const post = {
        uid,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 1)),
        date: response.last_publication_date
    }

    const price = await stripe.prices.retrieve('price_1KjU2dFQGhI471LGOOxP04P0', {
        expand:['product']
      })
    
      const product = {
        priceId : price.id,
        amount : (price.unit_amount / 100),
      }

    return {
        props: {
            post,
            product
        },
        redirect: 60 * 30, // 30 minutes
    }
}