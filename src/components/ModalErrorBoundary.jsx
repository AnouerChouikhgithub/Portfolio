import { Component } from 'react';

export default class ModalErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Modal or subscreen rendering error:', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children, onClose, message, closeLabel } = this.props;
    if (!hasError) return children;

    return (
      <div className="modal-error-boundary" role="alertdialog" aria-modal="true">
        <div className="modal-error-boundary__panel">
          <p>{message}</p>
          <button type="button" onClick={onClose}>{closeLabel}</button>
        </div>
      </div>
    );
  }
}
