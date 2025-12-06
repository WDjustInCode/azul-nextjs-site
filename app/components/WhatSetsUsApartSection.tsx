export default function WhatSetsUsApartSection() {
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
          text-align: left;
          margin-top: 0px;
          margin-bottom: 50px;
          color: #002147;
          letter-spacing: 0.5px;
        }

        .azul-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-gap: 25px;
        }

        .azul-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }

        .azul-card--wide {
          grid-column: 1 / -1;
          height: 420px;
        }

        .azul-card--standard {
          height: 320px;
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
          max-width: 70%;
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

        .azul-card p {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.4;
          letter-spacing: 0.3px;
          max-width: 50%;
        }

        @media (max-width: 768px) {
          .azul-section {
            padding: 60px 20px 20px;
          }
          
          .azul-title {
            font-size: 32px;
          }

          .azul-grid {
            grid-template-columns: 1fr;
          }

          .azul-card--wide,
          .azul-card--standard {
            height: 300px;
          }

          .azul-card-content {
            max-width: 70%;
          }
        }
      `}</style>

      <h2 className="azul-title">Quality you can depend on</h2>

      <div className="azul-grid">
        <div className="azul-card azul-card--wide">
          <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/justInception_generate_a_cinematic_image_of_a_.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:2558,m" alt="Pool service" />
          <div className="azul-card-content">
            <h3>We Don't Just Clean Your Pool<br />We Give You Peace of Mind</h3>
            <p>Every visit includes a photo and update, so you always know what got done.</p>
          </div>
        </div>

        <div className="azul-card azul-card--standard">
          <img src="//img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Untitled-13.jpg/:/rs=w:2000,cg:true" alt="Safe water" />
          <div className="azul-card-content">
            <h3>Water Your Family <br /> Will Love</h3>
            <p>Clean, comfortable water without irritation. We keep your pool balanced and swim-ready.</p>
          </div>
        </div>

        <div className="azul-card azul-card--standard">
          <img src="//img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Untitled-10.jpg/:/rs=w:2000,cg:true" alt="Guarantee" />
          <div className="azul-card-content">
            <h3>If Anything Goes Wrong, <br /> We've Got You</h3>
            <p>If your pool turns cloudy or green, we fix it for free. No stress, no hassle.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

