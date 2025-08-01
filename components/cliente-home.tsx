import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import ViewAllProductsButton from '@/components/view-all-products-button'
import DealCountdown from '@/components/deal-countdown'
import IconBoxes from '@/components/icon-boxes'

import type { Product } from '@/types'

interface ClientHomeProps {
    latestProducts: Product[]
    featuredProducts: Product[]
}

export default function ClientHome({ latestProducts, featuredProducts }: ClientHomeProps) {
    return (
        <>
            {featuredProducts.length > 0 && (
                <ProductCarousel data={featuredProducts} />
            )}
            <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
            <ViewAllProductsButton />
            <DealCountdown />
            <IconBoxes />
        </>
    )
}