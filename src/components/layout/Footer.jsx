function Footer() {
  return <div className="page-container text-center 
                         text-xs md-text-md 
                        flex items-center h-full justify-between gap-4 text-white">
                <div className="text-xs md-text-md">
                  @2026 MyCode Academy. All rights reserved.
                </div>
                <div>
                  <a href="/privacy" className="hover:underline ">
                    Privacy Policy 
                  </a>
                 {' '} | {' '}
                  <a href="/terms" className="hover:underline ">
                    Terms of Service
                  </a>
                  {' '} |{' '}
                  <a href="/contact" className="hover:underline ">
                    Contact Us
                  </a>
                </div>
                <div className="text-xs md-text-md ">
                  Made with ❤️ by MyCode Academy Team
                </div>
         </div>
}
export default Footer;