import NavLinks from './NavLinks'

const Navbar = () => {
  return (
    <nav className='sm:hidden'>
        <NavLinks isMobileNav={true} />
    </nav>
  )
}

export default Navbar