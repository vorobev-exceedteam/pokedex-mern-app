class SnackbarService {
  _setState;

  constructor(setState) {
    this._setState = setState;
  }

  showMessage(message, variant, anchor) {
    this._setState({
      message,
      variant,
      anchor: anchor || { vertical: 'bottom', horizontal: 'center' },
      isOpen: true
    })
  }

}

export default SnackbarService;
