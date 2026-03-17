import { useState } from "react";
import "./Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: connect to backend newsletter endpoint
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <span className="newsletter__icon">📬</span>
        <h2 className="newsletter__heading">Stay in the Loop</h2>
        <p className="newsletter__sub">
          Get notified about new stores, exclusive deals, and latest arrivals.
          No spam — unsubscribe anytime.
        </p>

        {done ? (
          <div className="newsletter__success">
            <span>✅</span>
            <p>You are subscribed! We will be in touch soon.</p>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              className="newsletter__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="newsletter__btn"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
