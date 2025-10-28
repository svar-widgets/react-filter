import { Willow as CoreWillow } from '@svar-ui/react-core';
import './Willow.css';

function Willow({ fonts = true, children }) {
  return children ? (
    <CoreWillow fonts={fonts}>{children}</CoreWillow>
  ) : (
    <CoreWillow fonts={fonts} />
  );
}

export default Willow;
