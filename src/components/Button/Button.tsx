import React, { FC } from "react";
import styles from "./Button.module.css";
import PhantomIcon from "../../assets/Rectangle.svg";

export interface ButtonProps {
  title: string;
  onClick: React.MouseEventHandler<HTMLInputElement>;
  isIconVisible?: boolean;
  disable?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  onClick,
  isIconVisible = true,
  disable = false,
}) => {
  return (
    <div
      aria-disabled={disable}
      onClick={onClick}
      className={
        disable ? styles.button_disable_container : styles.button_container
      }
    >
      {isIconVisible && (
        <img alt={"icon"} src={PhantomIcon} className={styles.icon} />
      )}
      <p className={styles.button_text}>{title.toUpperCase()}</p>
    </div>
  );
};

export default Button;
