'use client';

export default function ReviewsSection() {
  return (
    <section className="azul-reviews-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Roboto+Condensed:wght@400;700&display=swap');

        .azul-reviews-section {
          background: #0052cc;
          padding: 75px 25px 75px;
          font-family: "Poppins", sans-serif;
        }

        .azul-reviews-inner {
          max-width: 1150px;
          margin: 0 auto;
          color: #ffffff;
          padding: 0 25px;
        }

        .azul-reviews-section,
        .azul-reviews-inner {
          overflow-x: hidden;
        }

        .azul-reviews-header-row {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .azul-reviews-heading {
          font-family: "Roboto Condensed", sans-serif;
          font-size: clamp(3.25rem, 5.85vw, 4.55rem);
          font-weight: 400;
          letter-spacing: 0.8px;
          text-align: left;
          max-width: 520px;
        }

        .azul-reviews-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 0.9rem;
          text-align: right;
          padding: 12px 0 0 0;
        }

        .azul-reviews-avatars {
          display: flex;
        }

        .azul-reviews-avatar {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 2px solid #ffffff;
          background: #003f9a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          margin-left: -8px;
        }

        .azul-reviews-avatar:first-child {
          margin-left: 0;
        }

        .azul-meta-strong {
          font-weight: 600;
        }

        .azul-meta-sub {
          opacity: 0.9;
        }

        .azul-review-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
          padding: 16px 0;
        }

        .azul-review-card {
          flex: 1 1 0;
          min-width: 280px;
          max-width: 350px;
          background: rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 24px 26px 26px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
          backdrop-filter: blur(3px);
          box-sizing: border-box;
        }

        .azul-review-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .azul-review-avatar {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: #ffffff22;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .azul-review-name {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .azul-review-role {
          font-size: 0.78rem;
          opacity: 0.85;
        }

        .azul-review-stars {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 10px;
          letter-spacing: 1.5px;
        }

        .azul-review-title {
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .azul-review-text {
          font-size: 0.92rem;
          line-height: 1.55;
          opacity: 0.95;
        }

        .azul-review-footer-note {
          margin-top: 16px;
          font-size: 0.82rem;
          opacity: 0.85;
        }

        .azul-reviews-coming-soon {
          margin-top: 28px;
          font-size: 0.9rem;
          opacity: 0.9;
          text-align: center;
        }

        @media (max-width: 900px) {
          .azul-reviews-header-row {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .azul-reviews-meta {
            text-align: left;
          }
        }

        @media (max-width: 768px) {
          .azul-reviews-section {
            padding: 60px 0;
          }
          
          .azul-reviews-inner {
            padding: 0 20px;
          }
          
          .azul-reviews-heading {
            font-size: 42px;
          }

          .azul-review-cards {
            flex-direction: column;
            gap: 20px;
          }

          .azul-review-card {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .azul-review-card {
            flex: 0 0 100% !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="azul-reviews-inner">
        <div className="azul-reviews-header-row">
          <h2 className="azul-reviews-heading">Your Neighbors Will Say It Best</h2>

          <div className="azul-reviews-meta">
            <div className="azul-reviews-avatars">
              <div className="azul-reviews-avatar">A</div>
              <div className="azul-reviews-avatar">B</div>
              <div className="azul-reviews-avatar">C</div>
            </div>
            <div>
              <div className="azul-meta-strong">New to your area.</div>
              <div className="azul-meta-sub">Real customer reviews coming soon.</div>
            </div>
          </div>
        </div>

        <div className="azul-review-cards">
          <div className="azul-review-card">
            <div className="azul-review-card-header">
              <div className="azul-review-avatar">🏡</div>
              <div>
                <div className="azul-review-name">First-time customers</div>
                <div className="azul-review-role">Residential pool owners</div>
              </div>
            </div>

            <div className="azul-review-stars">★★★★★</div>
            <div className="azul-review-title">"They always show up on time."</div>

            <div className="azul-review-text">
              Clear communication, consistent scheduling, and service visits that match what we promised.
            </div>
          </div>

          <div className="azul-review-card">
            <div className="azul-review-card-header">
              <div className="azul-review-avatar">⚙️</div>
              <div>
                <div className="azul-review-name">Equipment &amp; chemistry</div>
                <div className="azul-review-role">What you can expect</div>
              </div>
            </div>

            <div className="azul-review-stars">★★★★★</div>
            <div className="azul-review-title">"The water always looks perfect."</div>

            <div className="azul-review-text">
              Our goal is that your pool looks and feels ready-to-swim every single visit.
            </div>
          </div>

          <div className="azul-review-card">
            <div className="azul-review-card-header">
              <div className="azul-review-avatar">🤝</div>
              <div>
                <div className="azul-review-name">Service &amp; support</div>
                <div className="azul-review-role">How we treat people</div>
              </div>
            </div>

            <div className="azul-review-stars">★★★★★</div>
            <div className="azul-review-title">"They made everything easy."</div>

            <div className="azul-review-text">
              Honest recommendations, simple communication, and pricing without surprises.
            </div>

            <div className="azul-review-footer-note">
              Real customer quotes coming soon — this is the standard we're aiming to earn from day one.
            </div>
          </div>
        </div>

        <div className="azul-reviews-coming-soon">
          <strong>Honesty note:</strong> Reviews are coming soon — these describe the experience we aim to deliver.
        </div>
      </div>
    </section>
  );
}

