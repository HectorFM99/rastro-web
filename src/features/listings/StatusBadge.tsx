import { STATUS_LABELS } from "../../app/labels";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  status: string; // AVAILABLE, RESERVED, SOLD... (también los de las ofertas)
};

export function StatusBadge({ status }: StatusBadgeProps) {
  // styles.AVAILABLE es lo mismo que styles["AVAILABLE"]. Y "AVAILABLE" es justo el valor de status
  return <span className={`${styles.badge} ${styles[status]}`}>{STATUS_LABELS[status]}</span>;
}
