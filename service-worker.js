if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,a)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let r={};const n=e=>i(e,d),f={module:{uri:d},exports:r,require:n};s[d]=Promise.all(c.map((e=>f[e]||n(e)))).then((e=>(a(...e),r)))}}define(["./workbox-afb8f5db"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"404.html",revision:"2e95362d6057058076c6ef4a72840203"},{url:"api/config.html",revision:"01f05ac32dc58319c82a601a69777849"},{url:"api/index.html",revision:"45570712c8e57082c5592f0bf86872cc"},{url:"api/indexing.html",revision:"486a81009bde022f7e9bbe260c8a1920"},{url:"api/methods.html",revision:"e32b7f6bc52c46cdb93c857ffeb78669"},{url:"api/options.html",revision:"44a7719ea834d727f78036a9f8283fc2"},{url:"api/query.html",revision:"03ccb5130596792623b983c95fee2f68"},{url:"assets/404.html-60b35caa.js",revision:"7465db92eeb25f209fcf2c19f59c07e9"},{url:"assets/404.html-ca825db8.js",revision:"20fa5db69f03c411bf3d663537116a22"},{url:"assets/app-315d3ec7.js",revision:"5e85cf7a8139c2a52497ec348e7c1675"},{url:"assets/back-to-top-8efcbe56.svg",revision:"cbe7b14b16686bbafd5f42b528a5360e"},{url:"assets/config.html-1dbabc7c.js",revision:"a7ecb6e87c35777fadbe2b55f067dd7f"},{url:"assets/config.html-ca090c3f.js",revision:"4ca1090ee68c71dcda003effd9cbe8f2"},{url:"assets/Demo-486a98f9.js",revision:"72a3c4694c7efc6ac577cfc40f143528"},{url:"assets/demo.html-15ba09ad.js",revision:"954b4998d1ee7cd3e30462f7575b8569"},{url:"assets/demo.html-3b2ce3ae.js",revision:"56edf35b60e18bae58cd32b673d9980a"},{url:"assets/different-builds.html-a4b318ad.js",revision:"edc0c5d2f60b5e4fdbf87bc2e2ff2459"},{url:"assets/different-builds.html-f156cd9e.js",revision:"bf4be64c58ecc255df0ea775277f9ad5"},{url:"assets/Donate-7bb4ae97.js",revision:"453b1b98ecc810f586efab542a61e441"},{url:"assets/donate.html-09e014fc.js",revision:"5bc942b6a63a76d5f1d73532cdcee472"},{url:"assets/donate.html-c93efc24.js",revision:"80cd67127707bd083d56c924e58271ad"},{url:"assets/editor.worker-f4a1eafc.js",revision:"5a4e0ff474554f782544aefcf1301c56"},{url:"assets/examples.html-90a340b1.js",revision:"df60fd88011f33ff3c7ddde5d58c3128"},{url:"assets/examples.html-bdade32c.js",revision:"b9a1638d9163525afc995f980cd3b2bf"},{url:"assets/framework-a05dfeeb.js",revision:"122094b22c7df7e187a2655e6923eea7"},{url:"assets/fuse-11af6271.js",revision:"e421da75a91b9131e86dafaa04632db5"},{url:"assets/img/email.png",revision:"e47fc082110b6fb6c421e97c20155766"},{url:"assets/img/github-black.svg",revision:"37c372f381832ccbb7b62b3015708ded"},{url:"assets/img/github-white.svg",revision:"9e3bf2fcb47732fd3c43dd214fbc157b"},{url:"assets/img/logo.png",revision:"8ec97318977650c1ce978556d63bf5ea"},{url:"assets/img/paypal.png",revision:"067bd556ce9e4c76538a8057adb6d596"},{url:"assets/img/products/notebag@2x.png",revision:"02e363a741870d75e849c92e80558e8c"},{url:"assets/img/products/notejoy@2x.png",revision:"c443e709a3650796c77876bc45814d03"},{url:"assets/img/sponsors/bairesdev.png",revision:"f2ad62c2ba6e6774522f3f913a14e8f2"},{url:"assets/img/sponsors/litslink.svg",revision:"ef4853babd7ecbdb4d63f3f0a82de0fe"},{url:"assets/img/sponsors/quadratica.png",revision:"4908c90cd6614488574f309ec0573964"},{url:"assets/img/sponsors/worksome.svg",revision:"b095008396a2360b0aca2a8d19f7b396"},{url:"assets/img/twitter-black.svg",revision:"43ccb688ed492a81250e1d4036eb7994"},{url:"assets/img/twitter-white.svg",revision:"c40e33118e2c985b3239830c8e09ab50"},{url:"assets/index-70769223.js",revision:"097390f0c66585e8b9e39361bf5f05d1"},{url:"assets/index.html-091ac784.js",revision:"4814ac2e043cc7d464597d341d8c9426"},{url:"assets/index.html-136ca0a4.js",revision:"a7d8a6c1c04ba89b0803ddba85d8f143"},{url:"assets/index.html-ef55746a.js",revision:"b5bad47bf73eb20bcdeb9bc0e7e3ba80"},{url:"assets/index.html-f81cc564.js",revision:"94246134e15d8ca33397952aece5062f"},{url:"assets/indexing.html-c81f22b7.js",revision:"730dac0004f5d525bd678c78e04f5bb9"},{url:"assets/indexing.html-ee65c503.js",revision:"583fa2e6d3ca50501dc377a1c004cc7d"},{url:"assets/installation.html-16e0da1a.js",revision:"170661db77f46d77d74e4e969967c79d"},{url:"assets/installation.html-aba432ff.js",revision:"12936e1516b8c3178ff250683fad8b17"},{url:"assets/Jobs-76bfe6af.js",revision:"d9fb9986558e735b9253990f83f21fff"},{url:"assets/jobs.html-6c2497f3.js",revision:"49ad1edf13e37a35e411f1c01828b1b6"},{url:"assets/jobs.html-8e2d900d.js",revision:"b00e7f9e47051d10b495999a017979d1"},{url:"assets/json.worker-147d83a4.js",revision:"efe15ccd4a3481c354cb1f0ca5b53b77"},{url:"assets/methods.html-196f6817.js",revision:"ab31401629a246ab1007ac887e31a682"},{url:"assets/methods.html-3845476a.js",revision:"412d9e86064e1aaae378f5cc5292fd17"},{url:"assets/options.html-1dadc2a8.js",revision:"3c0e943649e58a7357ae54897db69320"},{url:"assets/options.html-39b89c9c.js",revision:"05db665d74339033641c2c2d75a1831c"},{url:"assets/query.html-1b6269f5.js",revision:"165ccdf55969c6afeb90a6587f31da38"},{url:"assets/query.html-210d417e.js",revision:"eb3121f1b77e5c1d202a10e8087cb2ee"},{url:"assets/scoring-theory.html-33dc6dbd.js",revision:"d7ed3ce98cbbd18c6bee3da10205dcb4"},{url:"assets/scoring-theory.html-5724200c.js",revision:"28c3dddcbabcb24f332f18456fe6aef8"},{url:"assets/search-0782d0d1.svg",revision:"83621669651b9a3d4bf64d1a670ad856"},{url:"assets/Sponsors-57da3461.js",revision:"69daf374fa809be2b842ec641f9bc36d"},{url:"assets/Stories-100b6ef7.js",revision:"1b129bc12f3d43b227d75f7ba433dec7"},{url:"assets/stories.html-03c65f6a.js",revision:"c67b2e5d3e5f8173b3a5c16f28bd5484"},{url:"assets/stories.html-c695743e.js",revision:"4997274175ea6f403b8418db3b626040"},{url:"assets/style-afd8e69f.css",revision:"b66d9260ef4fa7a8dccca72b58c74b32"},{url:"assets/SuspensefulDemo-daee6225.js",revision:"d5e21148fc2bbc29992102764ff23a63"},{url:"assets/Team-096cc16c.js",revision:"18e9f726d119c62e2234b4a2bd8bfd5a"},{url:"assets/team.html-15b57719.js",revision:"4f122090b7c4be81bed8ee2bf007cd38"},{url:"assets/team.html-76d162a9.js",revision:"b90523b10da221e9c0e84460a70d421c"},{url:"assets/test.html-27962ca0.js",revision:"56f71ddf5a6c46dd1c13a12120aa30e8"},{url:"assets/test.html-3574f54b.js",revision:"d2f1b3990dcee02c6d70a3fc19b0713f"},{url:"assets/TwitterFollow-2e5ed823.js",revision:"d13ee7e443ab16d18ab3811e8afd0ced"},{url:"assets/Version-77a7d85a.js",revision:"5d609c08af82ab8ee568fff403dcac5b"},{url:"concepts/scoring-theory.html",revision:"e52be1c1244222bde0b5947ce018d610"},{url:"demo.html",revision:"0d0f7c3bff66667850d265ec6105bcb1"},{url:"donate.html",revision:"00c6a2cfb9b90ecdfec48883542484b3"},{url:"examples.html",revision:"f8a1a5e71e260ffd9c795ed63416e173"},{url:"getting-started/different-builds.html",revision:"c27e13deb65feb46a9cd93ff01ebac35"},{url:"getting-started/installation.html",revision:"b196f6f3fbf8dd317f5fe4ed4345af87"},{url:"icons/android-icon-144x144.png",revision:"adcd139c085ee74adde5315b96d3ceec"},{url:"icons/android-icon-192x192.png",revision:"28c9c193b5d353702377ec9055b9eb48"},{url:"icons/android-icon-36x36.png",revision:"d5f8f5d7131893cf9c7becb2814a5185"},{url:"icons/android-icon-48x48.png",revision:"ad390513528b8ef142ecd31a226e7188"},{url:"icons/android-icon-72x72.png",revision:"50daa3831bc1be2990081f2edfdc7031"},{url:"icons/android-icon-96x96.png",revision:"91a78d653d480fa20418008d7fecc206"},{url:"icons/apple-icon-114x114.png",revision:"92a5a4536204d1f5e5ca02f8a1cad345"},{url:"icons/apple-icon-120x120.png",revision:"94807fde9feac41450b17d8d3fc7a26e"},{url:"icons/apple-icon-144x144.png",revision:"adcd139c085ee74adde5315b96d3ceec"},{url:"icons/apple-icon-152x152.png",revision:"7b293dd4247888dec8bbf90e7b5f4632"},{url:"icons/apple-icon-180x180.png",revision:"37fbf874b787712c387f22b086c35e54"},{url:"icons/apple-icon-57x57.png",revision:"f42c2f73fe259e31feaef3257c5ba8d4"},{url:"icons/apple-icon-60x60.png",revision:"1854c44b068075ed15111f43266bba15"},{url:"icons/apple-icon-72x72.png",revision:"50daa3831bc1be2990081f2edfdc7031"},{url:"icons/apple-icon-76x76.png",revision:"4b26b309b42382e4d5962d10d484497f"},{url:"icons/apple-icon-precomposed.png",revision:"d7b627774c90809d9ac6eb4c48f98e35"},{url:"icons/apple-icon.png",revision:"d7b627774c90809d9ac6eb4c48f98e35"},{url:"icons/favicon-16x16.png",revision:"ba27c05a45cc23cfac36917924dab710"},{url:"icons/favicon-32x32.png",revision:"83eb0c88efae9c95fe6b4756637085c4"},{url:"icons/favicon-96x96.png",revision:"91a78d653d480fa20418008d7fecc206"},{url:"icons/favicon.png",revision:"8ec97318977650c1ce978556d63bf5ea"},{url:"icons/ms-icon-144x144.png",revision:"adcd139c085ee74adde5315b96d3ceec"},{url:"icons/ms-icon-150x150.png",revision:"bdfc1f47b0d89987047c64913dce0b68"},{url:"icons/ms-icon-310x310.png",revision:"5273781ced7590454d0218835afb6a67"},{url:"icons/ms-icon-70x70.png",revision:"b6dba4c3d4d2f61f86431ee41fd34571"},{url:"index.html",revision:"6a850ff802068e0d6d30d7fe97f88465"},{url:"jobs.html",revision:"a188b5717d0c8e7c6772826892f26e1b"},{url:"stories.html",revision:"9761f46c37c52a456b142d46aec09570"},{url:"team.html",revision:"46b67bc637bc4f806f675a6c2bd4c4ba"},{url:"test.html",revision:"81fb74e77272117ccb311d41f26b2320"}],{})}));
