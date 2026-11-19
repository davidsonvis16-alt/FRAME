import { useRoute } from './lib/router'
import { AuthModal, CartDrawer, Footer, Header, Toast } from './components/Shell'
import { Home } from './pages/Home'
import { ArtDetail, NotFound, Pinned, Shop, Studio } from './pages/Shop'
import { Account, Checkout } from './pages/Checkout'
import { Makeover } from './pages/Makeover'

export function App() {
  const route = useRoute()
  const [path, qs = ''] = route.split('?')
  const query = new URLSearchParams(qs)

  let page
  if (path === '/') page = <Home />
  else if (path === '/shop') page = <Shop key={qs} query={query} />
  else if (path.startsWith('/art/')) page = <ArtDetail key={path} id={path.slice(5)} />
  else if (path === '/studio') page = <Studio />
  else if (path === '/makeover') page = <Makeover />
  else if (path === '/pinned') page = <Pinned />
  else if (path === '/checkout') page = <Checkout />
  else if (path === '/account') page = <Account />
  else page = <NotFound />

  return (
    <>
      <Header path={path} />
      <main>{page}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
      <Toast />
    </>
  )
}
