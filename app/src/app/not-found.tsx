import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="wrap">
        <h1 className="zf-display-mega">Not here</h1>
        <p className="page-head__lead zf-body">
          That page does not exist. The work is probably what you were after.
        </p>
        <div className="film__cta">
          <Link className="zf-btn zf-btn--secondary" href="/work">See the work</Link>
          <Link className="zf-btn zf-btn--secondary" href="/">Back to the start</Link>
        </div>
      </div>
    </section>
  );
}
