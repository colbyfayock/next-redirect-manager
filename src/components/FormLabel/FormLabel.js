import styles from './FormLabel.module.scss';

const FormLabel = ({ children, className, ...rest }) => {

  let formLabelClassName = styles.formLabel;

  if ( className ) {
    formLabelClassName = `${formLabelClassName} ${className}`;
  }

  return (
    <label className={formLabelClassName} {...rest}>
      { children }
    </label>
  )
}

export default FormLabel;