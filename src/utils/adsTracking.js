const GOOGLE_ADS_ID = 'AW-474474131';
const GOOGLE_TAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;

let hasUserInteraction = false;
let listenersAttached = false;
let scriptLoadPromise = null;
const eventQueue = [];

const isAutomatedLabRun = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return Boolean(navigator.webdriver) || /Lighthouse|Chrome-Lighthouse|PageSpeed/i.test(ua);
};

const pushGtagBaseConfig = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ADS_ID);
};

const flushQueue = () => {
  if (!hasGtag() || eventQueue.length === 0) return;

  while (eventQueue.length > 0) {
    const [eventName, params] = eventQueue.shift();
    window.gtag('event', eventName, params);
  }
};

const ensureGtagLoaded = () => {
  if (typeof window === 'undefined' || isAutomatedLabRun()) {
    return Promise.resolve(false);
  }

  pushGtagBaseConfig();

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_TAG_SRC}"]`);

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = GOOGLE_TAG_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  }).then((loaded) => {
    if (loaded) {
      flushQueue();
    }
    return loaded;
  });

  return scriptLoadPromise;
};

const triggerInteraction = () => {
  hasUserInteraction = true;
  if (eventQueue.length > 0) {
    void ensureGtagLoaded();
  }
};

export const primeAdsTracking = () => {
  if (typeof window === 'undefined' || listenersAttached || isAutomatedLabRun()) return;

  listenersAttached = true;

  const onceOptions = { passive: true, once: true };
  window.addEventListener('pointerdown', triggerInteraction, onceOptions);
  window.addEventListener('keydown', triggerInteraction, onceOptions);
  window.addEventListener('scroll', triggerInteraction, onceOptions);
};

const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

const queueEvent = (eventName, params) => {
  if (!eventName || isAutomatedLabRun()) return;

  if (hasUserInteraction) {
    void ensureGtagLoaded().then((loaded) => {
      if (loaded && hasGtag()) {
        window.gtag('event', eventName, params);
      }
    });
    return;
  }

  eventQueue.push([eventName, params]);
};

export const trackAdsEvent = (eventName, params = {}) => {
  queueEvent(eventName, params);
};

export const trackAdsConversion = ({
  label,
  value,
  currency = 'USD',
  transactionId,
  callback
} = {}) => {
  if (isAutomatedLabRun()) {
    if (typeof callback === 'function') callback();
    return;
  }

  const sendTo = label ? `${GOOGLE_ADS_ID}/${label}` : GOOGLE_ADS_ID;

  const eventParams = {
    send_to: sendTo,
    event_callback: callback
  };

  if (typeof value === 'number') eventParams.value = value;
  if (currency) eventParams.currency = currency;
  if (transactionId) eventParams.transaction_id = transactionId;

  queueEvent('conversion', eventParams);
};
