import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../src/components/SubscribeButton/SubscribeButton'
import { stripe } from '../src/services/stripe'
import styles from '../src/styles/Home.module.scss'

interface HomeProps{
  product:{
    priceId: string,
    amount: number
  }
}

export default function Home({ product } : HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home | IgNews</title>
      </Head>
      <div>
        <span> 👏  Hey, Welcome</span>
        <h1>News about <br /> the <span>React</span> world</h1>
        <p>Get acess to all the publications <br /> <span>for ${product.amount} month</span></p>

        <SubscribeButton priceId={product.priceId} text="Subscribe Now"/>
      </div>
      <img src="/images/Developer.svg" alt="" />
    </div>
  )
}


export const getStaticProps : GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1KjU2dFQGhI471LGOOxP04P0', {
    expand:['product']
  })

  const product = {
    priceId : price.id,
    amount : (price.unit_amount / 100),
  }

  return {
    props: {
      product
    }
  }
}