// ConditionalField.jsx
import { useEffect, useRef, useState } from 'react';
import './ConditionalField.css';

function ConditionalField({ show, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (show && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [show, children]);

  return (
    <div
      className="conditional-field"
      style={{ maxHeight: height, opacity: show ? 1 : 0 }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export default ConditionalField;