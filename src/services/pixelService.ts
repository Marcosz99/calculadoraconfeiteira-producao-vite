// Serviço para gerenciar Meta Pixel e TikTok Pixel
declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

export class PixelService {
  private static metaPixelId = '24319925394345055'
  private static tiktokPixelId = 'YOUR_TIKTOK_PIXEL_ID' // Adicione o pixel ID do TikTok

  // Inicializar pixels
  static initializePixels() {
    this.initMetaPixel()
    this.initTikTokPixel()
  }

  // Inicializar Meta Pixel
  private static initMetaPixel() {
    if (typeof window === 'undefined') return

    // Carregar script do Meta Pixel
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.metaPixelId}');
    `
    document.head.appendChild(script)

    // Noscript fallback
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${this.metaPixelId}&ev=PageView&noscript=1" />`
    document.head.appendChild(noscript)
  }

  // Inicializar TikTok Pixel
  private static initTikTokPixel() {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${this.tiktokPixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `
    document.head.appendChild(script)
  }

  // Eventos do Meta Pixel
  static trackMetaEvent(eventName: string, parameters: any = {}) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters)
      // Only log in development mode, never log sensitive data in production
      if (import.meta.env.DEV) {
        console.log('Meta Pixel Event:', eventName)
      }
    }
  }

  // Eventos do TikTok Pixel
  static trackTikTokEvent(eventName: string, parameters: any = {}) {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track(eventName, parameters)
      // Only log in development mode, never log sensitive data in production
      if (import.meta.env.DEV) {
        console.log('TikTok Pixel Event:', eventName)
      }
    }
  }

  // Eventos combinados (Meta + TikTok)
  static trackEvent(eventName: string, parameters: any = {}) {
    this.trackMetaEvent(eventName, parameters)
    this.trackTikTokEvent(eventName, parameters)
  }

  // ViewContent - Landing Page
  static trackViewContent() {
    const parameters = {
      content_type: 'product',
      content_name: 'DoceCalc Landing Page',
      content_category: 'SaaS',
      currency: 'BRL'
    }
    this.trackEvent('ViewContent', parameters)
  }

  // Lead - Clique em Teste Grátis
  static trackLead() {
    const parameters = {
      content_name: 'DoceCalc Free Trial',
      content_category: 'Lead Generation',
      currency: 'BRL'
    }
    this.trackEvent('Lead', parameters)
  }

  // CompleteRegistration - Cadastro
  static trackCompleteRegistration(userData: { email: string; name?: string }) {
    // Never send PII (email, name) to tracking pixels
    const parameters = {
      content_name: 'DoceCalc Registration',
      currency: 'BRL'
    }
    this.trackEvent('CompleteRegistration', parameters)
  }

  // Purchase - Pagamento confirmado
  static trackPurchase(purchaseData: {
    value: number;
    currency: string;
    transaction_id: string;
    customer_email?: string;
    customer_name?: string;
  }) {
    // Never send PII (email, name) to tracking pixels
    const parameters = {
      value: purchaseData.value,
      currency: purchaseData.currency,
      content_name: 'DoceCalc Professional Subscription',
      content_type: 'product',
      transaction_id: purchaseData.transaction_id
    }
    this.trackEvent('Purchase', parameters)
  }

  // Inicializar Page View automático
  static trackPageView() {
    if (typeof window !== 'undefined') {
      // Meta Pixel PageView
      if (window.fbq) {
        window.fbq('track', 'PageView')
      }
      
      // TikTok Pixel PageView (já chamado automaticamente no init)
      if (window.ttq) {
        window.ttq.page()
      }
    }
  }
}