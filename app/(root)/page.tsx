import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions'
import ClientHome from '@/components/cliente-home'

const Homepage = async () => {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return (
    <ClientHome
      latestProducts={latestProducts}
      featuredProducts={featuredProducts}
    />
  )
}

export default Homepage