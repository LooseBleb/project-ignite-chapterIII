import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'


export const repositoryName = prismic.getRepositoryName(process.env.PRISMIC_ENDPOINT)

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/${doc.uid}`
    default:
      return null
  }
}

// This factory function allows smooth preview setup
export function createClient(req?: unknown) {
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })

  enableAutoPreviews({
    client,
    req: req,
  })

  return client
}