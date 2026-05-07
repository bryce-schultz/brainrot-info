const GOOGLE_ADS_ID = 'AW-474474131';

const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

export const trackAdsEvent = (eventName, params = {}) => {
  if (!hasGtag() || !eventName) return;
  window.gtag('event', eventName, params);
};

export const trackAdsConversion = ({
  label,
  value,
  currency = 'USD',
  transactionId,
  callback
} = {}) => {
  if (!hasGtag()) {
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

  window.gtag('event', 'conversion', eventParams);
};
