export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  "sk7ZjM7O6y1KeDPNpnJBGBtcBpwNbKhbVXEtZ7btDO6YLrHOoq2CWZ0tvmLa3CiJaEvvx6pwiihJ4LU2zwVBicie7SK40oje3o2uqDAjz0BQ4JHEw1kLB1MTj6rE65HZbgtJQ3jVGYa7NFigpEmq9WTd1BoVkTu28wLqXnj3HYqDw1WdbIvx",
  'Missing environment variable: NEXT_API-TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
