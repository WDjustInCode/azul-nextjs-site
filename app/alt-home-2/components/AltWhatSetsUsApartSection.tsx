export default function AltWhatSetsUsApartSection() {
  return (
    <section className="azul-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Poppins:wght@300;400;500&display=swap');
        
        .azul-section {
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          padding: 100px 50px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .azul-title {
          font-family: 'Roboto Condensed', sans-serif;
          font-size: clamp(3.25rem, 5.85vw, 4.55rem);
          font-weight: 400;
          text-align: center;
          margin-top: 0px;
          margin-bottom: 50px;
          color: #002147;
          letter-spacing: 0.5px;
        }

        .azul-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          grid-gap: 25px;
          aspect-ratio: 3/2;
          min-height: 400px;
        }

        .azul-card {
          position: relative;
          overflow: hidden;
        }

        .azul-card--shape-1 {
          border-radius: 50px 16px 16px 16px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 15%);
        }

        .azul-card--shape-2 {
          border-radius: 16px 50px 16px 16px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 85% 100%, 0 100%);
        }

        .azul-card--shape-3 {
          border-radius: 16px 16px 16px 50px;
          clip-path: polygon(0 0, 85% 0, 100% 0, 100% 100%, 0 100%);
        }

        .azul-card--shape-4 {
          border-radius: 16px 16px 50px 16px;
          clip-path: polygon(0 0, 100% 0, 100% 85%, 100% 100%, 0 100%);
        }

        .azul-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .azul-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.35) 25%,
            rgba(0, 0, 0, 0.10) 60%,
            rgba(0, 0, 0, 0.00) 100%
          );
          pointer-events: none;
        }

        .azul-card-content {
          position: absolute;
          top: 20px;
          left: 20px;
          color: #ffffff;
          max-width: 100%;
          z-index: 2;
        }

        .azul-card h3 {
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.4;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .azul-card h3.h3-desktop {
          display: block;
        }

        .azul-card h3.h3-mobile {
          display: none;
        }

        .azul-card p {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.4;
          letter-spacing: 0.3px;
          max-width: 60%;
        }

        .azul-card ul {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.6;
          letter-spacing: 0.3px;
          max-width: 90%;
          margin: 0;
          padding-left: 20px;
          list-style: none;
        }

        .azul-card ul li {
          margin-bottom: 6px;
          position: relative;
        }

        .azul-card ul li::before {
          content: "•";
          position: absolute;
          left: -18px;
          color: #ffffff;
          font-weight: 500;
        }

        @media (max-width: 768px) {
            .azul-section {
                padding: 60px 20px 20px;
            }
            
            .azul-title {
                font-size: 42px;
            }

            .azul-grid {
                grid-template-columns: 1fr;
                grid-template-rows: repeat(4, auto);
                aspect-ratio: auto;
                min-height: auto;
            }

            .azul-card--shape-1,
            .azul-card--shape-2,
            .azul-card--shape-3,
            .azul-card--shape-4 {
                height: 200px;
                border-radius: 16px;
                clip-path: none;
            }

            .azul-card-content {
                max-width: 70%;
            }
        }

        @media (max-width: 540px) {
            .azul-card-content {
                max-width: 80%;
            }

            .azul-card h3.h3-desktop {
                display: none;
            }

            .azul-card h3.h3-mobile {
                display: block;
            }

            .azul-card p {
                max-width: 70%;
            }
        }
      `}</style>

      <h2 className="azul-title">Quality you can depend on</h2>

      <div className="azul-grid" id="commercial">
        <div className="azul-card azul-card--shape-1">
          <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/justInception_generate_a_cinematic_image_of_a_.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:2558,m" alt="Pool service" />
          <div className="azul-card-content">
            <h3>Our Commitment to You</h3>
            <p>At Azul Pool Services, we are committed to:</p>
            <ul>
              <li>Providing consistent, high-quality pool maintenance and repair services.</li>
              <li>Maintaining clear, proactive communication before and after every visit.</li>
              <li>Treating your property with the highest level of care and professionalism.</li>
              <li>Offering honest recommendations that prioritize your safety, comfort, and budget.</li>
              <li>Standing behind our work and making things right if something falls short of expectations.</li>
            </ul>
          </div>
        </div>

        <div className="azul-card azul-card--shape-2">
          <img src="/dog.jpg" alt="Safe water" />
          <div className="azul-card-content">
            <h3>Water Your Family <br /> Will Love</h3>
            <p>We keep your pool balanced and swim-ready.</p>
          </div>
        </div>

        <div className="azul-card azul-card--shape-3">
          <img src="/girl.jpg" alt="Guarantee" />
          <div className="azul-card-content">
            <h3 className="h3-desktop">If Anything Goes Wrong, <br /> We've Got You</h3>
            <h3 className="h3-mobile">If Anything Goes Wrong, We've Got You</h3>
            <p>Our work is guaranteed and stress-free.</p>
          </div>
        </div>

        <div className="azul-card azul-card--shape-4">
          <img src="/AdobeStock_223936793_Preview.jpeg" alt="Our Commitment" />
          <div className="azul-card-content">
            <h3 className="h3-desktop">We Don't Just Clean Your Pool<br />We Give You Peace of Mind</h3>
            <h3 className="h3-mobile">We Don't Just Clean Your Pool, We Give You Peace of Mind</h3>
            <p>Every visit includes a photo and update, so you always know what got done.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

