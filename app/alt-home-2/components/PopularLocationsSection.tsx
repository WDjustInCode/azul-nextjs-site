export default function PopularLocationsSection() {
  return (
    <section className="azul-locations-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .azul-locations-section {
          font-family: "Poppins", sans-serif;
          padding: 100px 50px 100px;
          background: #f2f2f2;
        }

        .azul-locations-inner {
          max-width: 1100px;
          margin: 0 auto;
          text-align: left;
        }

        .azul-contact-header {
          font-family: "Roboto Condensed", sans-serif;
          font-size: clamp(3.25rem, 5.85vw, 4.55rem);
          font-weight: 400;
          color: #002147;
          text-align: left;
          margin: 0 0 50px 0;
          max-width: 800px;
        }

        .azul-locations-title {
          font-family: "Roboto Condensed", sans-serif;
          font-size: clamp(2.6rem, 4.55vw, 3.25rem);
          font-weight: 400;
          color: #002147;
          margin-top: 0px;
          margin-bottom: 30px;
          letter-spacing: 0.5px;
          text-align: left;
        }

        .azul-location-tabs {
          margin-bottom: 35px;
        }

        .azul-location-tab {
          display: inline-block;
          padding: 10px 26px;
          border-radius: 999px;
          border: 2px solid #66B2FF;
          font-size: 1rem;
          font-weight: 500;
          color: #0052cc;
          background: #ffffff;
          transition: 0.15s ease;
        }

        .azul-location-tab.active {
          background: #66B2FF;
          color: #ffffff;
          border-color: #66B2FF;
        }

        .azul-locations-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px 24px;
          justify-items: start;
          text-align: left;
        }

        .azul-location-item {
          font-size: 16px;
          color: #2d3440;
          line-height: 1.5;
        }

        .azul-contact-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 50px;
        }

        .azul-contact-card {
          flex: 1;
          min-width: 240px;
          background: #ffffff;
          border-radius: 18px;
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .azul-card-top {
          margin-bottom: 16px;
        }

        .azul-card-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #002147;
          margin-bottom: 8px;
        }

        .azul-card-icon {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #66b2ff22;
          border: 1px solid #66B2FF;
          font-size: 1.1rem;
        }

        .azul-card-title {
          font-family: "Roboto Condensed", sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #002147;
          margin-bottom: 6px;
        }

        .azul-card-text {
          font-size: 16px;
          line-height: 1.5;
          color: #4a4f57;
          margin-bottom: 4px;
        }

        .azul-card-hours {
          font-size: 0.8rem;
          color: #6f7680;
          margin-bottom: 14px;
        }

        .azul-btn-primary,
        .azul-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: 0.12s ease;
          white-space: nowrap;
          font-family: "Poppins", sans-serif;
        }

        .azul-btn-primary {
          background: #0052cc;
          color: #ffffff;
          border: none;
        }

        .azul-btn-primary:hover {
          background: #003f9a;
          transform: translateY(-1px);
        }

        .azul-btn-outline {
          background: #ffffff;
          color: #0052cc;
          border: 1px solid #0052cc;
        }

        .azul-btn-outline:hover {
          background: #0052cc;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .azul-locations-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            justify-items: start;
          }
        }

        @media (max-width: 768px) {
          .azul-locations-section {
            padding: 60px 0;
          }
          
          .azul-locations-inner {
            padding: 0 20px;
          }
          
          .azul-contact-header {
            font-size: 42px;
          }

          .azul-locations-title {
            font-size: 28px;
          }

          .azul-contact-options {
            flex-direction: column;
            width: 100%;
            gap: 20px;
          }

          .azul-contact-card {
            flex: 0 0 auto;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box;
          }
        }

        @media (max-width: 550px) {
          .azul-locations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="azul-locations-inner">
        <h2 className="azul-contact-header">
          Trusted across San Antonio & surrounding areas
        </h2>

        <div className="azul-contact-options">
          <div className="azul-contact-card">
            <div className="azul-card-top">
              <div className="azul-card-label">
                <span className="azul-card-icon">📞</span>
                <span>Give us a call.</span>
              </div>
              <div className="azul-card-title">Talk with a pool expert.</div>
              <p className="azul-card-text">
                Get questions answered and a free, no-pressure quote.
              </p>
              <p className="azul-card-hours">Sun – Sat · 8:00 AM – 5:00 PM</p>
            </div>
            <div className="azul-card-cta">
              <a className="azul-btn-primary" href="tel:18887687554">(888) 768-7554</a>
            </div>
          </div>

          <div className="azul-contact-card">
            <div className="azul-card-top">
              <div className="azul-card-label">
                <span className="azul-card-icon">💻</span>
                <span>Get online quote.</span>
              </div>
              <div className="azul-card-title">Fast, free online pricing.</div>
              <p className="azul-card-text">
                Answer a few questions and see your estimated price in minutes.
              </p>
            </div>
            <div className="azul-card-cta">
              <a className="azul-btn-outline" href="#get-a-quote">See My Price</a>
            </div>
          </div>

          <div className="azul-contact-card">
            <div className="azul-card-top">
              <div className="azul-card-label">
                <span className="azul-card-icon">💬</span>
                <span>Need support?</span>
              </div>
              <div className="azul-card-title">Talk with our team.</div>
              <p className="azul-card-text">
                Get help with your service plan or billing in just a few clicks.
              </p>
            </div>
            <div className="azul-card-cta">
              <a className="azul-btn-outline" href="/contact">Get In Touch</a>
            </div>
          </div>
        </div>

        <h2 className="azul-locations-title">Popular locations</h2>

        {/* <div className="azul-location-tabs">
          <span className="azul-location-tab active">San Antonio</span>
        </div> */}

        <div className="azul-locations-grid">
          <div className="azul-location-item">San Antonio, TX</div>
          <div className="azul-location-item">Boerne, TX</div>
          <div className="azul-location-item">Helotes, TX</div>
          <div className="azul-location-item">Bulverde, TX</div>

          <div className="azul-location-item">Fair Oaks Ranch, TX</div>
          <div className="azul-location-item">Converse, TX</div>
          <div className="azul-location-item">Schertz, TX</div>
          <div className="azul-location-item">Cibolo, TX</div>

          <div className="azul-location-item">Alamo Heights, TX</div>
          <div className="azul-location-item">Stone Oak, TX</div>
          <div className="azul-location-item">Universal City, TX</div>
          <div className="azul-location-item">Leon Springs, TX</div>

          <div className="azul-location-item">Castle Hills, TX</div>
          <div className="azul-location-item">Live Oak, TX</div>
          <div className="azul-location-item">Timberwood Park, TX</div>
          <div className="azul-location-item">Shavano Park, TX</div>
        </div>
      </div>
    </section>
  );
}

