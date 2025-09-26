import { Material as CoreMaterial } from '@svar-ui/react-core';
import './Material.css';

export default function Material({ fonts = true, children }) {
  if (children) {
    return <CoreMaterial fonts={fonts}>{children()}</CoreMaterial>;
  } else {
    return <CoreMaterial fonts={fonts} />;
  }
}
