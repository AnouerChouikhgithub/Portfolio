export default function ModalWordReveal({ text }) {
  let wordIndex = 0;
  return text.split(/(\s+)/).map((part, index) => (
    /\s+/.test(part)
      ? part
      : (
        <span
          key={`${index}-${part}`}
          className="modal-word"
          style={{ transitionDelay: `${wordIndex++ * 40}ms` }}
          aria-hidden="true"
        >
          {part}
        </span>
      )
  ));
}
