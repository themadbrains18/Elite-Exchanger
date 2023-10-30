
import FooterHead from './footer-head';
import FooterNav from './footer-nav';
import FooterCopywrite from './footer-copywrite';
// import Context from '../contexts/context';

const Footer = () => {
// let { mode  } = useContext(Context);

  return (
    <footer className='bg-blue dark:bg-omega pt-[70px]'>
        <div className="container">
          <FooterHead />
          <FooterNav />
          <FooterCopywrite />
        </div>
    </footer>
  )
}

export default Footer;