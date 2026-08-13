import {
  ExternalLink,
  Mail
} from "lucide-react";

export function DeveloperCard() {
  return (
    <section className="developer-card">
      <div>
        <span className="section-kicker">
          BUILT BY
        </span>

        <h2>
          Soumen Karmakar
        </h2>

        <h3>
          Mechanical Engineering Student
          & Technology Builder
        </h3>

        <p>
          I am a Mechanical Engineering
          student exploring the intersection
          of mechanical systems, software
          engineering, artificial intelligence,
          and intelligent industrial technology.
          ForgeTwin AI represents my approach
          to combining engineering fundamentals
          with modern computing to build
          practical, data-driven systems.
        </p>
      </div>

      <div className="developer-actions">
        <a
          href="https://soumenkarmakar.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="primary-button"
        >
          <ExternalLink size={16} />
          View Portfolio
        </a>

        <a
          href="mailto:techwithsizzii@gmail.com"
          className="secondary-button"
        >
          <Mail size={16} />
          Contact Me
        </a>
      </div>
    </section>
  );
}
