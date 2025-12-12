'use client';

export default function FAQSection() {
  const toggleFAQ = (button: HTMLButtonElement) => {
    const answer = button.nextElementSibling as HTMLElement;
    const isExpanded = button.classList.contains('collapsed');
    
    if (isExpanded) {
      button.classList.remove('collapsed');
      answer.classList.add('expanded');
    } else {
      button.classList.add('collapsed');
      answer.classList.remove('expanded');
    }
  };

  return (
    <section className="azul-faq-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .azul-faq-section {
          background: #ffffff;
          padding: 100px 0 100px;
          font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .azul-faq-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 50px;
        }

        .azul-faq-container {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 60px;
          align-items: start;
        }

        .azul-faq-header {
          text-align: left;
        }

        .azul-faq-heading {
          font-family: "Roboto Condensed", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(3.25rem, 5.85vw, 4.55rem);
          line-height: 1.15;
          font-weight: 400;
          letter-spacing: 0.05rem;
          color: #002147;
          margin: 0;
          text-align: left;
        }

        .azul-faq-list {
          width: 100%;
        }

        .azul-faq-item {
          border-bottom: 1px solid #E0E0E0;
          margin-bottom: 0;
        }

        .azul-faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 24px 50px 24px 0;
          text-align: left;
          font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 22px;
          font-weight: 500;
          color: #0052CC;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .azul-faq-question:hover {
          color: #003d99;
        }

        .azul-faq-question::after {
          content: "▲";
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%) rotate(180deg);
          font-size: 14px;
          color: #0052CC;
          transition: transform 0.3s ease;
        }

        .azul-faq-question.collapsed::after {
          transform: translateY(-50%) rotate(0deg);
        }

        .azul-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          padding: 0 0 0 0;
        }

        .azul-faq-answer.expanded {
          max-height: 1000px;
          padding: 0 0 24px 0;
        }

        .azul-faq-answer-content {
          font-size: 16px;
          line-height: 1.7;
          color: #4a4f57;
        }

        .azul-faq-answer-content p {
          margin: 0 0 12px 0;
        }

        .azul-faq-answer-content p:last-child {
          margin-bottom: 0;
        }

        .azul-faq-answer-content ul {
          margin: 12px 0;
          padding-left: 20px;
        }

        .azul-faq-answer-content li {
          margin-bottom: 8px;
        }

        .azul-faq-answer-content strong {
          color: #002147;
          font-weight: 600;
        }

        @media (max-width: 968px) {
          .azul-faq-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .azul-faq-section {
            padding: 60px 0;
          }

          .azul-faq-inner {
            padding: 0 20px;
          }

          .azul-faq-heading {
            font-size: 42px;
          }

          .azul-faq-question {
            font-size: 16px;
            padding-right: 40px;
          }

          .azul-faq-answer-content {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="azul-faq-inner">
        <div className="azul-faq-container">
          <div className="azul-faq-header">
            <h2 className="azul-faq-heading">Frequent questions</h2>
          </div>

          <div className="azul-faq-list">
          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              How often should my pool be serviced?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p>Most pools need <strong>weekly service</strong> to keep the water balanced, equipment running right, and algae away. High-use or heavily shaded pools may need a little more attention.</p>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              What's included in a standard weekly service?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p>Typically:</p>
                <ul>
                  <li>Skimming and brushing</li>
                  <li>Vacuuming as needed</li>
                  <li>Testing & balancing chemicals</li>
                  <li>Emptying baskets</li>
                  <li>Checking equipment (pump, filter, heater, etc.)</li>
                  <li>Visual inspection for leaks or early issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              How much does weekly pool service cost?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p>It depends on pool size, equipment, and condition, but most homeowners pay <strong>$120–$180/mo</strong> for standard weekly maintenance. Repairs and chemicals beyond the basics are usually extra.</p>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              Why does my pool get cloudy or green?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p>Common causes:</p>
                <ul>
                  <li>Chemical imbalance</li>
                  <li>Insufficient circulation or filtration</li>
                  <li>High debris load</li>
                  <li>Algae growth</li>
                </ul>
                <p>Even well-maintained pools can turn quickly after heavy rain or heat.</p>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              Do you provide chemicals, or do I need to buy my own?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p><strong>Yes — we provide all the standard chemicals your pool needs.</strong> You don't have to buy or store anything. Specialty treatments are only used when necessary, and we'll let you know before applying them.</p>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              How long does it take to clear up a green or neglected pool?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p>A green-to-clean treatment typically takes <strong>24–72 hours</strong> depending on:</p>
                <ul>
                  <li>Severity of algae</li>
                  <li>Filter type</li>
                  <li>Weather</li>
                  <li>Water chemistry</li>
                </ul>
                <p>Very severe cases can take longer.</p>
              </div>
            </div>
          </div>

          <div className="azul-faq-item">
            <button className="azul-faq-question collapsed" onClick={(e) => toggleFAQ(e.currentTarget)}>
              Can you notify me if something needs repair?
            </button>
            <div className="azul-faq-answer">
              <div className="azul-faq-answer-content">
                <p><strong>Yes — we always notify you right away if we spot anything that needs attention.</strong> If we see leaks, equipment issues, or anything starting to fail, we'll let you know immediately and provide repair options before it becomes a bigger problem.</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

