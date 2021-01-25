const HiddenElement = (props) => {
  return props.hidden? null: props.children
};

export default HiddenElement;

