import styles from './TableHead.module.scss';

const TableHead = ({ children, className, ...rest }) => {

  let tableHeadClassName = styles.tableHead;

  if ( className ) {
    tableHeadClassName = `${tableHeadClassName} ${className}`;
  }

  return (
    <thead className={tableHeadClassName} {...rest}>
      { children }
    </thead>
  )
}

export default TableHead;