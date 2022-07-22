import TableHead from '@components/TableHead';
import TableBody from '@components/TableBody';
import TableTr from '@components/TableTr';

import styles from './Table.module.scss';

const Table = ({ children, className, columns, ...rest }) => {

  let tableClassName = styles.table;

  if ( className ) {
    tableClassName = `${tableClassName} ${className}`;
  }

  columns = columns.map(column => {
    const label = typeof column === 'string' ? column : column.label;
    return {
      label
    }
  })

  return (
    <table className={tableClassName} cellSpacing="0" cellPadding="0" {...rest}>
      <TableHead>
        <TableTr>
          {columns.map(({ label }) => {
            return <td key={label}>{ label }</td>
          })}
        </TableTr>
      </TableHead>
      <TableBody>
        { children }
      </TableBody>
    </table>
  )
}

export default Table;