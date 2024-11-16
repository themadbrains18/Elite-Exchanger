
import FooterHead from './footer-head';
import FooterNav from './footer-nav';
import FooterCopywrite from './footer-copywrite';

/**
 * Footer Component
 * 
 * This component represents the footer section of the page. It includes:
 * 1. FooterHead: The heading or title section of the footer.
 * 2. FooterNav: The navigation links or menu within the footer.
 * 3. FooterCopywrite: The copyright information displayed at the bottom.
 * 
 * The footer is responsive, with different padding applied based on the screen size.
 */
const Footer = () => {
  return (
    <footer className='bg-blue dark:bg-omega pt-[30px] md:pt-[70px]'>
        <div className="container">
          <FooterHead />
          <FooterNav />
          <FooterCopywrite />
        </div>
    </footer>
  )
}

export default Footer;