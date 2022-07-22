import styles from './TableTr.module.scss';

const TableTr = ({ children, className, ...rest }) => {

  let tableTrClassName = styles.tableTr;

  if ( className ) {
    tableTrClassName = `${tableTrClassName} ${className}`;
  }

  return (
    <tr className={tableTrClassName} {...rest}>
      { children }
    </tr>
  )
}

export default TableTr;