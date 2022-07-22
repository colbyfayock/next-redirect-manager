import styles from './Note.module.scss';

const Note = ({ children, className, ...rest }) => {

  let noteClassName = styles.note;

  if ( className ) {
    noteClassName = `${noteClassName} ${className}`;
  }

  return (
    <p className={noteClassName} {...rest}>
      { children }
    </p>
  )
}

export default Note;