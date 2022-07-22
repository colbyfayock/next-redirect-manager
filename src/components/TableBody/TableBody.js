import styles from './TableBody.module.scss';

const TableBody = ({ children, className, ...rest }) => {

  let tableBodyClassName = styles.tableBody;

  if ( className ) {
    tableBodyClassName = `${tableBodyClassName} ${className}`;
  }

  return (
    <tbody className={tableBodyClassName} {...rest}>
      { children }
    </tbody>
  )
}

export default TableBody;