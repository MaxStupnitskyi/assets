import styles from './Item.module.scss';

const Item = ({ ...props }) => {
  return (
    <tr>
      {props.map(i => {
        return <td>{i}</td>;
      })}
    </tr>
  );
};

export default Item;
