import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCheck, FaCopy } from 'react-icons/fa';

import styles from './CopyText.module.scss';

const NOTIFICATION_TIMEOUT = 5000;

const CopyText = ({ children, className, text, ...rest }) => {
  const [copied, updateCopied] = useState(false);

  let copyTextClassName = styles.copyText;

  if ( className ) {
    copyTextClassName = `${copyTextClassName} ${className}`;
  }

  useEffect(() => {
    setTimeout(() => updateCopied(false), NOTIFICATION_TIMEOUT)
  }, [copied]);

  /**
   * handleOnCopy
   */

  function handleOnCopy() {
    updateCopied(true);
  }

  return (
    <CopyToClipboard text={text} onCopy={handleOnCopy} {...rest}>
      <span className={copyTextClassName} data-text-copied={copied}>
        { children }
        { !copied && (
          <span className={styles.copyTextCopied}>
            <FaCopy />
          </span>
        )}
        { copied && (
          <span className={styles.copyTextCopied}>
            <FaCheck />
          </span>
        )}
      </span>
    </CopyToClipboard>
  )
}

export default CopyText;