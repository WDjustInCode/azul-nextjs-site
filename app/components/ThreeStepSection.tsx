export default function ThreeStepSection() {
  return (
    <section className="azul-steps-hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .azul-steps-hero {
          background: #ffffff;
          padding: 100px 50px 100px;
          font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .azul-steps-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .azul-steps-header {
          font-size: 42px;
          text-align: left;
          margin-bottom: 32px;
          color: #002147;
        }

        .azul-steps-eyebrow {
          font-family: "Roboto Condensed", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 14px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          color: #0052CC;
          margin-bottom: 10px;
        }

        .azul-steps-heading {
          font-family: "Roboto Condensed", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(3.25rem, 5.85vw, 4.55rem);
          line-height: 1.15;
          font-weight: 400;
          letter-spacing: 0.05rem;
          margin: 0 0 50px 0;
          text-align: left;
        }

        .azul-steps-subcopy {
          max-width: 540px;
          margin: 0 0 50px 0;
          font-size: 16px;
          line-height: 1.6;
          color: #4a4f57;
        }

        .azul-steps-row {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-top: 36px;
          flex-wrap: wrap;
        }

        .azul-steps-image-col {
          flex: 1 1 360px;
          min-width: 280px;
        }

        .azul-steps-image-wrapper {
          border-radius: 20px;
          overflow: hidden;
        }

        .azul-steps-image-wrapper img {
          display: block;
          width: 100%;
          height: auto;
        }

        .azul-steps-content {
          flex: 1 1 360px;
          min-width: 280px;
          color: #002147;
        }

        .azul-step {
          margin-bottom: 18px;
        }

        .azul-step-label {
          font-family: "Roboto Condensed", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #0052CC;
          margin-bottom: 4px;
        }

        .azul-step-title {
          font-family: "poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 22px;
          font-weight: 500;
          margin: 0 0 10px;
        }

        .azul-step-text {
          font-size: 16px;
          line-height: 1.5;
          color: #4a4f57;
          margin: 0;
          margin-bottom: 35px;
          max-width: 420px;
        }

        .azul-steps-cta-wrap {
          margin-top: 26px;
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px 14px;
        }

        .azul-steps-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 20px 40px;
          border-radius: 999px;
          border: none;
          text-decoration: none;
          letter-spacing: 0.1em;
          font-size: 18px;
          font-weight: 600;
          font-family: "Roboto Condensed", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #0052CC;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.12s ease, transform 0.12s ease;
          white-space: nowrap;
        }

        .azul-steps-cta:hover {
          background: #003d99;
          transform: translateY(-1px);
        }

        .azul-steps-cta:active {
          transform: translateY(0);
        }

        .azul-steps-cta-note {
          font-size: 12px;
          color: #6b717a;
        }

        @media (max-width: 992px) {
            .azul-steps-header {
            font-size: 42px;
            text-align: left;
            margin-bottom: 32px;
            color: #002147;
            text-align: center;
            }

            .azul-steps-heading {
            text-align: center;
            }

            .azul-steps-row {
                flex-direction: column;
                justify-content: center;
            }

            .azul-steps-image-wrapper {
                max-width: 400px;
                margin: 0 auto;
            }

            .azul-steps-content {
                justify-content: center;
                text-align: center;
            }

            .azul-steps-cta-wrap {
                margin-top: 26px;
                display: flex;
                flex-direction: column;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px 14px;
                justify-content: center;
            }
        }

        @media (max-width: 768px) {
            .azul-steps-hero {
                padding: 60px 0;
            }

            .azul-steps-inner {
                padding: 0 16px;
            }

            .azul-steps-heading {
                font-size: 32px;
            }

            .azul-steps-cta-wrap {
                flex-direction: column;
                align-items: stretch;
            }

            .azul-steps-cta {
                max-width: 200px;
                padding: 20px 40px;
                margin: 0 auto;
            }
        }

        @media (max-width: 479px) {
            .azul-steps-content {
                justify-content: left;
                text-align: left;
            }

            .azul-steps-heading {
                margin: 0 0 30px 0;
                text-align: left;
            }

            .azul-steps-cta-wrap {
                align-items: left;
                justify-content: left;
            }

            .azul-steps-cta {
                margin: 0 0;
            }
        }
      `}</style>

      <div className="azul-steps-inner">
        <div className="azul-steps-header">
          <div className="azul-steps-eyebrow">HOW AZUL WORKS</div>
          <h2 className="azul-steps-heading">Clear. Simple. Dependable.</h2>
          {/* <p className="azul-steps-subcopy">
            A simple, three-step service that keeps your water clear, your equipment protected,
            and your weekends wide open.
          </p> */}
        </div>

        <div className="azul-steps-row">
          <div className="azul-steps-image-col">
            <div className="azul-steps-image-wrapper">
              <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Image%20Nov%2023%2C%202025%20at%2007_50_59%20PM-934bce4.png/:/rs=w:740,cg:true,m" alt="Azul pool technician servicing a backyard pool" />
            </div>
          </div>

          <div className="azul-steps-content">
            <div className="azul-step">
              <div className="azul-step-label">Step 1</div>
              <h3 className="azul-step-title">Get a clear quote</h3>
              <p className="azul-step-text">
                Tell us about your pool and service needs. We'll share straightforward pricing so you
                know exactly what to expect.
              </p>
            </div>

            <div className="azul-step">
              <div className="azul-step-label">Step 2</div>
              <h3 className="azul-step-title">We handle the weekly work</h3>
              <p className="azul-step-text">
                Your Azul tech shows up on schedule to balance water, skim, brush, and keep your equipment
                running smoothly.
              </p>
            </div>

            <div className="azul-step">
              <div className="azul-step-label">Step 3</div>
              <h3 className="azul-step-title">You just enjoy the pool</h3>
              <p className="azul-step-text">
                Relax into clear, comfortable water all season long. If something's off, we'll make it right.
              </p>
            </div>

            <div className="azul-steps-cta-wrap">
              <a href="#quote" className="azul-steps-cta">GET STARTED</a>
              <span className="azul-steps-cta-note">Takes about a minute. No obligation.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

