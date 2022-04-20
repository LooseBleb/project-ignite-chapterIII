import { query as q, query } from 'faunadb';
import NextAuth from 'next-auth';
import GitHubProviders from 'next-auth/providers/github'

import { fauna } from '../../../src/services/faunadb';

export default NextAuth({
    providers: [
        GitHubProviders({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET_KEY,
            authorization: {
                params: {
                    scope: 'read:user'
                }
            }
        }),
    ],
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async session(session) {

            try {
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            q.Match(
                                q.Index('subscription_by_user_ref'),
                                q.Select(
                                    "ref",
                                    q.Get(
                                        q.Match(
                                            q.Index('user_by_email'),
                                            q.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('subscription_by_status'),
                                "active"
                            )
                        ])
                    )
                )
    
                return {
                    ...session,
                    activeSubscription : userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription : null
                }  
            }
        },
        async signIn(user) {

            const email = user.user.email;

            try {

                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email))
                        )
                    )
                )
                return true
            }
            catch {
                return false
            }
        },
    }

})