import './section-background.css';

export default function SectionBackground({ variant = 'a', emphasis = false }) {
  return (
    <div
      className={`section-background section-background--${variant}${emphasis ? ' section-background--emphasis' : ''}`}
      aria-hidden="true"
    >
      <div className="section-background__base" />
      <div className="section-background__grid" />
      <div className="section-background__glow section-background__glow--cyan" />
      <div className="section-background__glow section-background__glow--teal" />
      <div className="section-background__fade section-background__fade--top" />
      <div className="section-background__fade section-background__fade--bottom" />
    </div>
  );
}
