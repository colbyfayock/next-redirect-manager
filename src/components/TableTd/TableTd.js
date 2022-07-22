import styles from './TableTd.module.scss';

const TableTd = ({ children, className, valign = 'top', align = 'left', ...rest }) => {

  let tableTdClassName = styles.tableTd;

  if ( className ) {
    tableTdClassName = `${tableTdClassName} ${className}`;
  }

  return (
    <td className={tableTdClassName} valign={valign} data-align={align} {...rest}>
      { children }
    </td>
  )
}

export default TableTd;