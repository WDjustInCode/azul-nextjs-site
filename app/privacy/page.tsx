import DataDeletionForm from './components/DataDeletionForm';
import DataAccessForm from './components/DataAccessForm';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

      <section style={{ marginTop: '2rem' }}>
        <h2>1. Information We Collect</h2>
        <p>
          When you request a quote for our pool services, we collect the following information:
        </p>
        <ul>
          <li>Email address</li>
          <li>Physical address (street, city, state, zip code)</li>
          <li>Service preferences and pool details</li>
          <li>Company information (for commercial requests)</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information you provide to:</p>
        <ul>
          <li>Generate and provide quotes for our pool services</li>
          <li>Contact you regarding your quote request</li>
          <li>Improve our services</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>3. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information:
        </p>
        <ul>
          <li>Data is encrypted in transit (HTTPS)</li>
          <li>Data is stored securely in private, encrypted storage</li>
          <li>Access to your data is restricted to authorized personnel only</li>
          <li>We use secure authentication methods</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>4. Your Rights Under Texas Data Privacy and Security Act (TDPSA)</h2>
        <p>
          As a Texas resident, you have the following rights regarding your personal data:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You can request access to your personal data using 
            the form below, or by contacting us at{' '}
            <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>
          </li>
          <li>
            <strong>Right to Delete:</strong> You can request deletion of your personal data 
            using the form below, or by contacting us at{' '}
            <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>
          </li>
          <li>
            <strong>Right to Correct:</strong> You can request correction of inaccurate data
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> You can opt-out of certain data processing activities
          </li>
        </ul>
        <p>
          We will respond to your requests within 30 days as required by TDPSA.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <DataAccessForm />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <DataDeletionForm />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>5. Data Retention</h2>
        <p>
          We retain your quote data for up to 7 years for business record-keeping purposes, 
          unless you request deletion. After this period, data is automatically deleted.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>6. Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information only:
        </p>
        <ul>
          <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
          <li>When required by law or legal process</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this privacy policy or wish to exercise your rights, 
          please contact us:
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a>
          <br />
          <strong>Address:</strong> [Your Company Address, San Antonio, TX]
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any 
          material changes by posting the new policy on this page and updating the "Last Updated" date.
        </p>
      </section>
    </div>
  );
}

