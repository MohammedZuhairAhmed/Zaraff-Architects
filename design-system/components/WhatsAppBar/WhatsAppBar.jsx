import { Button } from '../Button/Button.jsx';

const waHref = (phone, context) =>
  'https://wa.me/' + String(phone || '').replace(/[^0-9]/g, '') +
  '?text=' + encodeURIComponent(context ? 'Hi Zaraff, I am enquiring about ' + context + '.' : 'Hi Zaraff, I would like to discuss a project.');

/**
 * Persistent WhatsApp bar for small screens. Hidden from 760px, where the
 * action sits in the page. Render <WhatsAppBarSpacer /> at the end of the
 * page so the bar never covers the last block; padding accounts for the
 * safe area on notched phones.
 */
export function WhatsAppBar({
  title = 'Talk to us about your plot',
  subtitle = 'Reply within a working day',
  context,
  phone,
  label = 'WhatsApp',
  staticPosition = false,
  className = '',
  ...rest
}) {
  return (
    <div
      className={['zf-wabar', staticPosition ? 'zf-wabar--static' : '', className].filter(Boolean).join(' ')}
      role="region"
      aria-label="Contact Zaraff on WhatsApp"
      {...rest}
    >
      <div className="zf-wabar__copy">
        <div className="zf-wabar__title">{title}</div>
        {subtitle ? <div className="zf-wabar__sub">{subtitle}</div> : null}
      </div>
      <Button variant="whatsapp" href={waHref(phone, context)}>{label}</Button>
    </div>
  );
}

/** Reserves the bar's height, including the safe-area inset. */
export function WhatsAppBarSpacer({ keepOnDesktop = false, className = '' }) {
  return (
    <div
      className={['zf-wabar__spacer', keepOnDesktop ? 'zf-wabar__spacer--keep' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    ></div>
  );
}
