import style from './style.less';

const TagIcon: React.FC<any> = (props: any) => {
  const { isActive, num } = props;
  const classN = isActive ? style['tag-icon-active'] : style['tag-icon'];
  if (num <= 0) {
    return null;
  }
  return (
    <span className={classN} style={{ marginLeft: '8px' }}>
      {num}
    </span>
  );
};

export default TagIcon;
