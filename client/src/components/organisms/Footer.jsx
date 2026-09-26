import logoLight from '../../assets/logo-light.svg';

export default function Footer() {
  return <footer className="footer">
  <div className="footer-inner">
  <div className="footer-brand">
      <img src={logoLight} alt=""/>
      <div>
    <strong>Pick &amp; Sip</strong>
    <span>“Pick your place. Sip your way.”</span>
      </div>
  </div>
  <div className="footer-right">
      <strong>est. 2026</strong>
      <a href="#top">Back to top</a>
  </div>
  </div>
</footer>;
}
