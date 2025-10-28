import { WillowDark as CoreWillowDark } from '@svar-ui/react-core';
import './WillowDark.css';

export default function WillowDark(props) {
  const { fonts = true, children } = props;

  if (children) {
    return <CoreWillowDark fonts={fonts}>{children}</CoreWillowDark>;
  } else {
    return <CoreWillowDark fonts={fonts} />;
  }
}
