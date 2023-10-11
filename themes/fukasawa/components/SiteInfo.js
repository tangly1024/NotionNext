import BLOG from '@/blog.config'
import axios from 'axios';


function SiteInfo ({ title }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function() {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })()
    const getCDNinfo = () => {
        axios.get("/cdn-cgi/trace")
        .then(res => {
            let areas = "Antananarivo, Madagascar ".split(";");
            let area = res.data.split("colo=")[1].split("\n")[0];
            for (var i = 0; i < areas.length; i++) {
                if (areas[i].indexOf(area) != -1) {
                    document.getElementById("cdn").innerHTML = areas[i];
                    break;
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

  return (
        <footer
            className='relative leading-6 justify-start w-full text-gray-600 dark:text-gray-300 text-xs font-sans'
        >
            <span> © {`${copyrightDate}`} <span> <a href={BLOG.LINK}> <i className='mx-1 animate-pulse fas fa-heart'/> {BLOG.AUTHOR}</a>. <br /></span>

            {BLOG.BEI_AN && <><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br/></>}

            <span className='hidden busuanzi_container_site_pv'> <i className='fas fa-eye' /><span className='px-1 busuanzi_value_site_pv'> </span>  </span>
            <span className='pl-2 hidden busuanzi_container_site_uv'> <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
            <br />
           <span className='text-xs font-serif'> Powered by NotionNext {BLOG.VERSION}</span><br /></span>          
            <h1>{title}</h1>
             <span id="cdn">unknown</span>
        </footer>
  )
}
export default SiteInfo
